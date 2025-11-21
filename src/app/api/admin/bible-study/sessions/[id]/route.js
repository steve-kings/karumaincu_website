import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

// GET single session
export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const [session] = await executeQuery(
      'SELECT * FROM bible_study_sessions WHERE id = ?',
      [id]
    )

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: session })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}

// PUT update session
export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { title, description, registration_deadline, start_date, end_date, is_open } = body

    if (!title || !registration_deadline || !start_date) {
      return NextResponse.json({ error: 'Title, registration deadline, and start date are required' }, { status: 400 })
    }

    // Check if session exists
    const [existing] = await executeQuery(
      'SELECT id FROM bible_study_sessions WHERE id = ?',
      [id]
    )

    if (!existing) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Update session
    await executeQuery(
      `UPDATE bible_study_sessions 
       SET title = ?, description = ?, registration_deadline = ?, start_date = ?, end_date = ?, is_open = ?
       WHERE id = ?`,
      [title, description, registration_deadline, start_date, end_date, is_open ? 1 : 0, id]
    )

    // Get updated session
    const [session] = await executeQuery(
      'SELECT * FROM bible_study_sessions WHERE id = ?',
      [id]
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Session updated successfully',
      data: session 
    })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: error.message || 'Failed to update session' }, { status: 500 })
  }
}

// DELETE session
export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if session exists
    const [existing] = await executeQuery(
      'SELECT id FROM bible_study_sessions WHERE id = ?',
      [id]
    )

    if (!existing) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Delete session
    await executeQuery('DELETE FROM bible_study_sessions WHERE id = ?', [id])

    return NextResponse.json({ 
      success: true, 
      message: 'Session deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete session' }, { status: 500 })
  }
}
