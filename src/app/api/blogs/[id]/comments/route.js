import { NextResponse } from 'next/server'
import getPool from '@/lib/db'

// GET - Fetch all approved comments for a blog post
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const pool = getPool()

    const [comments] = await pool.query(
      `SELECT 
        c.*,
        u.full_name as author_name,
        u.profile_image as author_image
      FROM blog_comments c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.post_id = ? AND c.status = 'approved'
      ORDER BY c.created_at DESC`,
      [id]
    )

    return NextResponse.json({ success: true, data: comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - Create a new comment
export async function POST(request, { params }) {
  try {
    const { id } = await params
    const pool = getPool()
    const body = await request.json()
    const { content, author_id, author_name, author_email, parent_id } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment content is required' },
        { status: 400 }
      )
    }

    // Insert comment (status: approved - no moderation)
    const [result] = await pool.query(
      `INSERT INTO blog_comments 
        (post_id, author_id, author_name, author_email, content, parent_id, status) 
      VALUES (?, ?, ?, ?, ?, ?, 'approved')`,
      [id, author_id || null, author_name || null, author_email || null, content, parent_id || null]
    )

    return NextResponse.json({
      success: true,
      message: 'Comment posted successfully',
      data: { id: result.insertId }
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
