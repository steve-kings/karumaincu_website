import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

// PUT - Update reading plan
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const user = await verifyAuth(request)
    
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ 
        success: false,
        message: 'Unauthorized' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { month, year, day, book, chapter_start, chapter_end, verse_start, verse_end, devotional_note } = body

    await executeQuery(
      `UPDATE bible_reading_calendar 
       SET month = ?, year = ?, day = ?, book = ?, chapter_start = ?, 
           chapter_end = ?, verse_start = ?, verse_end = ?, devotional_note = ?
       WHERE id = ?`,
      [month, year, day, book, chapter_start, chapter_end || null, verse_start || null, verse_end || null, devotional_note || null, id]
    )

    const [updated] = await executeQuery('SELECT * FROM bible_reading_calendar WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Reading plan updated successfully',
      data: updated
    })
  } catch (error) {
    console.error('Error updating reading:', error)
    return NextResponse.json({ 
      success: false,
      message: error.message || 'Failed to update reading plan' 
    }, { status: 500 })
  }
}

// DELETE - Delete reading plan
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const user = await verifyAuth(request)
    
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ 
        success: false,
        message: 'Unauthorized' 
      }, { status: 401 })
    }

    await executeQuery('DELETE FROM bible_reading_calendar WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Reading plan deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting reading:', error)
    return NextResponse.json({ 
      success: false,
      message: 'Failed to delete reading plan' 
    }, { status: 500 })
  }
}
