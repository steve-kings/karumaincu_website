import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const query = `
      SELECT r.*, 
             l.name as location_name, 
             s.title as session_title,
             s.start_date,
             s.end_date,
             s.registration_deadline
      FROM bible_study_registrations r
      LEFT JOIN study_locations l ON r.location_id = l.id
      LEFT JOIN bible_study_sessions s ON r.session_id = s.id
      WHERE r.user_id = ?
      ORDER BY r.registered_at DESC
    `
    
    const registrations = await executeQuery(query, [user.id])
    
    return NextResponse.json({ 
      success: true, 
      data: registrations || [] 
    })
  } catch (error) {
    console.error('Error fetching user registrations:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch registrations',
      message: error.message 
    }, { status: 500 })
  }
}
