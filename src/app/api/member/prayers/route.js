import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Fetch all prayers for the logged-in user
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prayers = await query(
      `SELECT * FROM user_prayer_requests 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user.id]
    )

    return NextResponse.json(prayers)
  } catch (error) {
    console.error('Error fetching prayers:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch prayers',
      message: error.message 
    }, { status: 500 })
  }
}

// POST - Create a new prayer
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category, priority, is_private } = body

    if (!title || !content) {
      return NextResponse.json({ 
        error: 'Title and content are required' 
      }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO user_prayer_requests 
       (user_id, title, content, category, priority, is_private, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [
        user.id,
        title,
        content,
        category || 'personal',
        priority || 'medium',
        is_private !== undefined ? (is_private ? 1 : 0) : 1
      ]
    )

    const newPrayer = await query(
      'SELECT * FROM user_prayer_requests WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json(newPrayer[0], { status: 201 })
  } catch (error) {
    console.error('Error creating prayer:', error)
    return NextResponse.json({ 
      error: 'Failed to create prayer',
      message: error.message 
    }, { status: 500 })
  }
}
