import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import BibleStudyService from '@/services/BibleStudyService'
import ExcelJS from 'exceljs'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      session_id: searchParams.get('session_id'),
      location_id: searchParams.get('location_id'),
      status: searchParams.get('status') || 'approved'
    }

    const registrations = await BibleStudyService.getAllRegistrations(filters)

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Registrations')

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Full Name', key: 'full_name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Location', key: 'location_name', width: 20 },
      { header: 'Year of Study', key: 'year_of_study', width: 15 },
      { header: 'School', key: 'school', width: 30 },
      { header: 'Registration Number', key: 'registration_number', width: 20 },
      { header: 'Group Number', key: 'group_number', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Registered At', key: 'registered_at', width: 20 }
    ]

    // Style header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }

    // Add data rows
    registrations.forEach(r => {
      worksheet.addRow({
        id: r.id,
        full_name: r.full_name,
        email: r.email,
        phone: r.phone || '',
        location_name: r.location_name,
        year_of_study: r.year_of_study,
        school: r.school,
        registration_number: r.registration_number || '',
        group_number: r.group_number || 'Not Assigned',
        status: r.status,
        registered_at: new Date(r.registered_at).toLocaleString()
      })
    })

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="bible-study-registrations-${Date.now()}.xlsx"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}