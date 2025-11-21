import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

// GET - Fetch all notes for the user
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notes = await query(
      `SELECT * FROM user_bookmarks 
       WHERE user_id = ? AND bookmark_type = 'verse'
       ORDER BY created_at DESC`,
      [user.id]
    )

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

// POST - Create or update a note
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, notes } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    await query(
      `INSERT INTO user_bookmarks (user_id, bookmark_type, title, content, notes) 
       VALUES (?, 'verse', ?, ?, ?)`,
      [user.id, title, content, notes || '']
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving note:', error)
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 })
  }
}

// DELETE - Delete a note
export async function DELETE(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    await query(
      `DELETE FROM user_bookmarks 
       WHERE user_id = ? AND id = ? AND bookmark_type = 'verse'`,
      [user.id, id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}
