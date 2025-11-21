import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Fetch all elections
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const elections = await query(
      `SELECT * FROM leader_elections ORDER BY created_at DESC`
    )

    return NextResponse.json(elections)
  } catch (error) {
    console.error('Error fetching elections:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch elections',
      message: error.message 
    }, { status: 500 })
  }
}

// POST - Create new election
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, start_date, end_date, max_nominations_per_member } = body

    if (!title || !start_date || !end_date) {
      return NextResponse.json({ 
        error: 'Title, start date, and end date are required' 
      }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO leader_elections 
       (title, description, start_date, end_date, max_nominations_per_member, status, created_by) 
       VALUES (?, ?, ?, ?, ?, 'draft', ?)`,
      [title, description, start_date, end_date, max_nominations_per_member || 5, user.id]
    )

    const newElection = await query(
      'SELECT * FROM leader_elections WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json(newElection[0], { status: 201 })
  } catch (error) {
    console.error('Error creating election:', error)
    return NextResponse.json({ 
      error: 'Failed to create election',
      message: error.message 
    }, { status: 500 })
  }
}
