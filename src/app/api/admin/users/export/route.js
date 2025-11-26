import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import ExcelJS from 'exceljs'

export async function GET(request) {
  try {
    console.log('Export API called')
    
    // Verify admin authentication
    const user = await verifyAuth(request)
    console.log('User verified:', user ? user.email : 'none', 'Role:', user?.role)
    
    if (!user || user.role !== 'admin') {
      console.log('Authorization failed - not admin')
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    console.log('Admin user export initiated by:', user.email)

    // Get all users
    console.log('Fetching users from database...')
    const users = await query(`
      SELECT 
        id,
        registration_number,
        email,
        full_name,
        phone,
        member_type,
        role,
        course,
        year_of_study,
        staff_id,
        alumni_year,
        doctrinal_agreement,
        created_at,
        updated_at,
        last_login,
        TIMESTAMPDIFF(YEAR, created_at, NOW()) as years_registered
      FROM users
      ORDER BY created_at DESC
    `)

    console.log('Users fetched:', users.length)

    if (users.length === 0) {
      console.log('No users found')
      return NextResponse.json(
        { success: false, message: 'No users found to export' },
        { status: 404 }
      )
    }

    // Create Excel workbook
    console.log('Creating Excel workbook...')
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Users')
    console.log('Worksheet created')

    // Set column headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Registration Number', key: 'registration_number', width: 20 },
      { header: 'Full Name', key: 'full_name', width: 30 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Member Type', key: 'member_type', width: 15 },
      { header: 'Role', key: 'role', width: 12 },
      { header: 'Course', key: 'course', width: 40 },
      { header: 'Year of Study', key: 'year_of_study', width: 15 },
      { header: 'Staff ID', key: 'staff_id', width: 15 },
      { header: 'Alumni Year', key: 'alumni_year', width: 15 },
      { header: 'Doctrinal Agreement', key: 'doctrinal_agreement', width: 20 },
      { header: 'Years Registered', key: 'years_registered', width: 18 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'Last Login', key: 'last_login', width: 20 }
    ]

    // Style header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' }
    }
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }

    // Add data rows
    users.forEach(user => {
      worksheet.addRow({
        id: user.id,
        registration_number: user.registration_number,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone || 'N/A',
        member_type: user.member_type,
        role: user.role,
        course: user.course || 'N/A',
        year_of_study: user.year_of_study || 'N/A',
        staff_id: user.staff_id || 'N/A',
        alumni_year: user.alumni_year || 'N/A',
        doctrinal_agreement: user.doctrinal_agreement ? 'Yes' : 'No',
        years_registered: user.years_registered,
        created_at: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'N/A',
        last_login: user.last_login ? new Date(user.last_login).toISOString().split('T')[0] : 'Never'
      })
    })

    // Add summary at the bottom
    worksheet.addRow([])
    worksheet.addRow(['SUMMARY'])
    worksheet.addRow(['Total Users:', users.length])
    worksheet.addRow(['Students:', users.filter(u => u.member_type === 'student').length])
    worksheet.addRow(['Associates:', users.filter(u => u.member_type === 'associate').length])
    worksheet.addRow(['Members:', users.filter(u => u.role === 'member').length])
    worksheet.addRow(['Editors:', users.filter(u => u.role === 'editor').length])
    worksheet.addRow(['Admins:', users.filter(u => u.role === 'admin').length])
    worksheet.addRow(['Export Date:', new Date().toISOString().split('T')[0]])
    worksheet.addRow(['Exported By:', user.email])

    // Generate Excel file buffer
    console.log('Generating Excel buffer...')
    const buffer = await workbook.xlsx.writeBuffer()
    console.log('Buffer generated, size:', buffer.length, 'bytes')

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `users_export_${timestamp}.xlsx`
    console.log('Sending file:', filename)

    // Return file as download
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString()
      }
    })

  } catch (error) {
    console.error('User export error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { success: false, message: 'Failed to export users', error: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}
