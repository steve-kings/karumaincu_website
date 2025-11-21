import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const is_open = searchParams.get('is_open')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    console.log('[API] Fetching sessions with filters:', { is_open, limit, offset })
    
    // Direct query to avoid service layer issues
    let query = 'SELECT * FROM bible_study_sessions WHERE 1=1'
    const params = []

    if (is_open !== null && is_open !== undefined) {
      query += ' AND is_open = ?'
      params.push(is_open === 'true' ? 1 : 0)
    }

    query += ' ORDER BY registration_deadline DESC'

    if (limit) {
      query += ' LIMIT ?'
      params.push(parseInt(limit))
      
      if (offset) {
        query += ' OFFSET ?'
        params.push(parseInt(offset))
      }
    }

    console.log('[API] Executing query:', query)
    console.log('[API] With params:', params)
    
    const sessions = await executeQuery(query, params)
    
    console.log('[API] Sessions retrieved:', sessions)
    console.log('[API] Number of sessions:', sessions ? sessions.length : 0)

    return NextResponse.json({ success: true, data: sessions || [] })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions', message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, registration_deadline, start_date, end_date, is_open } = body

    if (!title || !registration_deadline || !start_date) {
      return NextResponse.json({ error: 'Title, registration deadline, and start date are required' }, { status: 400 })
    }

    const result = await executeQuery(
      `INSERT INTO bible_study_sessions (title, description, registration_deadline, start_date, end_date, is_open, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, registration_deadline, start_date, end_date, is_open ? 1 : 0, user.id]
    )

    const [session] = await executeQuery(
      'SELECT * FROM bible_study_sessions WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json({ success: true, data: session }, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Failed to create session', message: error.message }, { status: 500 })
  }
}
