import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import BibleStudyService from '@/services/BibleStudyService'

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { session_id, location_id } = await request.json()

    if (!session_id || !location_id) {
      return NextResponse.json({ error: 'Session and location required' }, { status: 400 })
    }

    const result = await BibleStudyService.autoAssignGroups(session_id, location_id)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}