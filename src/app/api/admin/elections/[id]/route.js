import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'

// PUT - Update election (open/close/archive)
export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { title, description, start_date, end_date, status, max_nominations_per_member } = body

    const updates = []
    const values = []

    if (title !== undefined) {
      updates.push('title = ?')
      values.push(title)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      values.push(description)
    }
    if (start_date !== undefined) {
      updates.push('start_date = ?')
      values.push(start_date)
    }
    if (end_date !== undefined) {
      updates.push('end_date = ?')
      values.push(end_date)
    }
    if (status !== undefined) {
      updates.push('status = ?')
      values.push(status)
    }
    if (max_nominations_per_member !== undefined) {
      updates.push('max_nominations_per_member = ?')
      values.push(max_nominations_per_member)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    values.push(id)

    await query(
      `UPDATE leader_elections SET ${updates.join(', ')} WHERE id = ?`,
      values
    )

    const updated = await query('SELECT * FROM leader_elections WHERE id = ?', [id])

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating election:', error)
    return NextResponse.json({ 
      error: 'Failed to update election',
      message: error.message 
    }, { status: 500 })
  }
}

// DELETE - Delete election and all nominations
export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    await query('DELETE FROM leader_elections WHERE id = ?', [id])

    return NextResponse.json({ message: 'Election deleted successfully' })
  } catch (error) {
    console.error('Error deleting election:', error)
    return NextResponse.json({ 
      error: 'Failed to delete election',
      message: error.message 
    }, { status: 500 })
  }
}
