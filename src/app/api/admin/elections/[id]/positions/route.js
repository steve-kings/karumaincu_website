import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Get positions for an election
export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const positions = await query(
      'SELECT * FROM election_positions WHERE election_id = ? ORDER BY display_order ASC',
      [id]
    )

    return NextResponse.json(positions)
  } catch (error) {
    console.error('Error fetching positions:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch positions',
      message: error.message 
    }, { status: 500 })
  }
}

// POST - Create new position
export async function POST(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { title, description, display_order } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const result = await query(
      'INSERT INTO election_positions (election_id, title, description, display_order) VALUES (?, ?, ?, ?)',
      [id, title, description, display_order || 0]
    )

    const newPosition = await query(
      'SELECT * FROM election_positions WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json(newPosition[0], { status: 201 })
  } catch (error) {
    console.error('Error creating position:', error)
    return NextResponse.json({ 
      error: 'Failed to create position',
      message: error.message 
    }, { status: 500 })
  }
}

// PUT - Update position
export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { position_id, title, description, display_order } = body

    if (!position_id) {
      return NextResponse.json({ error: 'Position ID is required' }, { status: 400 })
    }

    await query(
      'UPDATE election_positions SET title = ?, description = ?, display_order = ? WHERE id = ?',
      [title, description, display_order, position_id]
    )

    const updated = await query(
      'SELECT * FROM election_positions WHERE id = ?',
      [position_id]
    )

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating position:', error)
    return NextResponse.json({ 
      error: 'Failed to update position',
      message: error.message 
    }, { status: 500 })
  }
}

// DELETE - Delete position
export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const positionId = searchParams.get('position_id')

    if (!positionId) {
      return NextResponse.json({ error: 'Position ID is required' }, { status: 400 })
    }

    await query('DELETE FROM election_positions WHERE id = ?', [positionId])

    return NextResponse.json({ message: 'Position deleted successfully' })
  } catch (error) {
    console.error('Error deleting position:', error)
    return NextResponse.json({ 
      error: 'Failed to delete position',
      message: error.message 
    }, { status: 500 })
  }
}
