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
    const { title, speaker, sermon_date, video_url, audio_url, description, series, featured, status } = body

    await executeQuery(
      `UPDATE sermons SET title = ?, speaker = ?, sermon_date = ?, youtube_url = ?, 
       description = ?, series_name = ?, featured = ?, status = ?, updated_at = NOW() 
       WHERE id = ?`,
      [title, speaker, sermon_date, video_url, description, series, featured ? 1 : 0, status, id]
    )

    const [updatedSermon] = await executeQuery('SELECT * FROM sermons WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      data: updatedSermon
    })
  } catch (error) {
    console.error('Error updating sermon:', error)
    return NextResponse.json({ error: 'Failed to update sermon' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await executeQuery('DELETE FROM sermons WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Sermon deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting sermon:', error)
    return NextResponse.json({ error: 'Failed to delete sermon' }, { status: 500 })
  }
}
