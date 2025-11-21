import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import BibleStudyService from '@/services/BibleStudyService'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      console.log('[Registrations API] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      session_id: searchParams.get('session_id'),
      location_id: searchParams.get('location_id'),
      status: searchParams.get('status'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    }

    console.log('[Registrations API] Fetching with filters:', filters)

    const registrations = await BibleStudyService.getAllRegistrations(filters)

    console.log('[Registrations API] Found', registrations ? registrations.length : 0, 'registrations')

    return NextResponse.json({ success: true, data: registrations || [] })
  } catch (error) {
    console.error('[Registrations API] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}