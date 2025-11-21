import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import BibleStudyService from '@/services/BibleStudyService'
import * as XLSX from 'xlsx'

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

    const excelData = registrations.map(r => ({
      'ID': r.id,
      'Full Name': r.full_name,
      'Email': r.email,
      'Phone': r.phone || '',
      'Location': r.location_name,
      'Year of Study': r.year_of_study,
      'School': r.school,
      'Registration Number': r.registration_number || '',
      'Group Number': r.group_number || 'Not Assigned',
      'Status': r.status,
      'Registered At': new Date(r.registered_at).toLocaleString()
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(excelData)
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations')

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

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