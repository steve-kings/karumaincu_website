'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

export default function ElectionResultsPage() {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/elections/${params.id}/results`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToExcel = async () => {
    if (!data || !data.results) return

    try {
      const XLSX = await import('xlsx')
      
      // Create position breakdown map for each nominee
      const nomineePositionVotes = {}
      if (data.positionBreakdown) {
        data.positionBreakdown.forEach(item => {
          if (!nomineePositionVotes[item.nominee_id]) {
            nomineePositionVotes[item.nominee_id] = {}
          }
          nomineePositionVotes[item.nominee_id][item.position] = item.votes
        })
      }

      // Prepare main results data with position columns
      const positionColumns = data.positions || []
      const headerRow = ['Rank', 'Full Name', 'Email Address', 'Registration Number', 'Course', 'Year of Study', 'Phone Number', 'Total Votes']
      
      // Add position columns
      positionColumns.forEach(pos => {
        headerRow.push(`${pos} Votes`)
      })
      
      headerRow.push('All Positions', 'Nominated By')

      const worksheetData = [
        ['ELECTION RESULTS REPORT'],
        [],
        ['Election Title:', data.election.title],
        ['Description:', data.election.description || 'N/A'],
        ['Start Date:', new Date(data.election.start_date).toLocaleString()],
        ['End Date:', new Date(data.election.end_date).toLocaleString()],
        ['Status:', data.election.status.toUpperCase()],
        ['Report Generated:', new Date().toLocaleString()],
        [],
        ['SUMMARY STATISTICS'],
        ['Total Nominations Received:', data.stats.total_nominations],
        ['Total Members Who Voted:', data.stats.unique_nominators],
        ['Total Unique Nominees:', data.stats.unique_nominees],
        ['Max Nominations Per Member:', data.election.max_nominations_per_member],
        ['Available Positions:', positionColumns.join(', ')],
        [],
        [],
        ['NOMINATION RESULTS (Ranked by Total Vote Count)'],
        headerRow
      ]

      // Add nominee data with position breakdown
      data.results.forEach((r, index) => {
        const row = [
          index + 1,
          r.nominee_name,
          r.nominee_email,
          r.registration_number,
          r.course,
          `Year ${r.year_of_study}`,
          r.phone || 'N/A',
          r.nomination_count
        ]
        
        // Add votes for each position
        positionColumns.forEach(pos => {
          const votes = nomineePositionVotes[r.nominee_id]?.[pos] || 0
          row.push(votes)
        })
        
        // Add all positions and nominators
        row.push(r.suggested_positions || 'N/A')
        row.push(r.nominators ? r.nominators.substring(0, 200) + (r.nominators.length > 200 ? '...' : '') : 'N/A')
        
        worksheetData.push(row)
      })

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
      const workbook = XLSX.utils.book_new()
      
      // Set column widths for better readability
      const totalColumns = 8 + positionColumns.length + 2 // base + position columns + all positions + nominators
      const colWidths = [
        { wch: 6 },   // Rank
        { wch: 25 },  // Full Name
        { wch: 30 },  // Email
        { wch: 18 },  // Reg Number
        { wch: 30 },  // Course
        { wch: 12 },  // Year
        { wch: 15 },  // Phone
        { wch: 12 }   // Total Votes
      ]
      
      // Add width for each position column
      positionColumns.forEach(() => {
        colWidths.push({ wch: 15 })
      })
      
      // Add width for all positions and nominators
      colWidths.push({ wch: 30 })  // All Positions
      colWidths.push({ wch: 40 })  // Nominated By
      
      worksheet['!cols'] = colWidths

      // Merge cells for title
      worksheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: totalColumns - 1 } }, // Title row
        { s: { r: 9, c: 0 }, e: { r: 9, c: 1 } }, // Summary Statistics header
        { s: { r: 17, c: 0 }, e: { r: 17, c: totalColumns - 1 } } // Results header
      ]

      // Style the header cells (title, headers)
      const headerStyle = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: 'center', vertical: 'center' }
      }

      const subHeaderStyle = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: 'E0E0E0' } }
      }

      // Apply styles to title
      if (worksheet['A1']) {
        worksheet['A1'].s = headerStyle
      }

      // Apply styles to column headers (row 18)
      const headerRowIndex = 18
      for (let col = 0; col < totalColumns; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: col })
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = subHeaderStyle
        }
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Overall Results')

      // Create position-specific sheets with detailed nominee info
      if (data.positionBreakdown && data.positions) {
        data.positions.forEach(position => {
          const positionData = data.positionBreakdown.filter(p => p.position === position)
          
          if (positionData.length > 0) {
            const positionSheet = [
              [`RESULTS FOR: ${position.toUpperCase()}`],
              [],
              ['Position:', position],
              ['Total Votes Cast:', positionData.reduce((sum, p) => sum + p.votes, 0)],
              ['Total Nominees:', positionData.length],
              [],
              ['Rank', 'Nominee Name', 'Email', 'Registration Number', 'Course', 'Year', 'Votes', 'Percentage']
            ]

            const totalVotes = positionData.reduce((sum, p) => sum + p.votes, 0)

            positionData.forEach((nominee, index) => {
              // Find full nominee details from results
              const fullDetails = data.results.find(r => r.nominee_id === nominee.nominee_id)
              const percentage = totalVotes > 0 ? ((nominee.votes / totalVotes) * 100).toFixed(1) : '0.0'
              
              positionSheet.push([
                index + 1,
                nominee.nominee_name,
                fullDetails?.nominee_email || 'N/A',
                fullDetails?.registration_number || 'N/A',
                fullDetails?.course || 'N/A',
                fullDetails ? `Year ${fullDetails.year_of_study}` : 'N/A',
                nominee.votes,
                `${percentage}%`
              ])
            })

            const ws = XLSX.utils.aoa_to_sheet(positionSheet)
            
            // Set column widths
            ws['!cols'] = [
              { wch: 6 },   // Rank
              { wch: 25 },  // Name
              { wch: 30 },  // Email
              { wch: 18 },  // Reg Number
              { wch: 30 },  // Course
              { wch: 10 },  // Year
              { wch: 10 },  // Votes
              { wch: 12 }   // Percentage
            ]

            // Merge title cell
            ws['!merges'] = [
              { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }
            ]

            // Sanitize sheet name (Excel has 31 char limit and special char restrictions)
            const sheetName = position.substring(0, 31).replace(/[:\\/?*\[\]]/g, '-')
            XLSX.utils.book_append_sheet(workbook, ws, sheetName)
          }
        })
      }

      // Generate filename
      const filename = `Election-Results-${data.election.title.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`
      
      XLSX.writeFile(workbook, filename)
      
      alert('Excel file exported successfully!')
    } catch (error) {
      console.error('Error exporting:', error)
      alert('Failed to export. Please try again.')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load results</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-purple-600 dark:text-purple-400 hover:underline mb-4"
          >
            ← Back to Elections
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                {data.election.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Election Results & Statistics
              </p>
            </div>
            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
            >
              📥 Export to Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Nominations</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {data.stats.total_nominations}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Members Voted</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {data.stats.unique_nominators}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nominees</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {data.stats.unique_nominees}
            </p>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Reg Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nominations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {data.results.map((result, index) => (
                  <tr key={result.nominee_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                        index === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300' :
                        index === 2 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                        'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-black dark:text-white">{result.nominee_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">{result.nominee_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {result.registration_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {result.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      Year {result.year_of_study}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        {result.nomination_count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
