import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, content, priority, expires_at, status } = body

    await executeQuery(
      `UPDATE announcements SET title = ?, content = ?, priority = ?, expires_at = ?, 
       status = ?, updated_at = NOW() WHERE id = ?`,
      [title, content, priority, expires_at, status, id]
    )

    const [updatedAnnouncement] = await executeQuery('SELECT * FROM announcements WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      data: updatedAnnouncement
    })
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await executeQuery('DELETE FROM announcements WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 })
  }
}
