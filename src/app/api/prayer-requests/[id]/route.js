import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

// PUT - Update prayer request (mark as answered)
export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { status, testimony } = await request.json()

    // Check if prayer belongs to user
    const existing = await query(
      'SELECT * FROM prayer_requests WHERE id = ? AND requester_id = ?',
      [id, user.id]
    )

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Prayer not found or unauthorized' }, { status: 404 })
    }

    await query(
      `UPDATE prayer_requests SET status = ?, testimony = ?, answered_at = NOW(), updated_at = NOW() WHERE id = ?`,
      [status, testimony, id]
    )

    const updated = await query('SELECT * FROM prayer_requests WHERE id = ?', [id])

    return NextResponse.json({ prayer: updated[0] })
  } catch (error) {
    console.error('Error updating prayer:', error)
    return NextResponse.json({ error: 'Failed to update prayer' }, { status: 500 })
  }
}

// DELETE - Delete prayer request
export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const result = await query(
      'DELETE FROM prayer_requests WHERE id = ? AND requester_id = ?',
      [id, user.id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Prayer not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Prayer deleted successfully' })
  } catch (error) {
    console.error('Error deleting prayer:', error)
    return NextResponse.json({ error: 'Failed to delete prayer' }, { status: 500 })
  }
}
