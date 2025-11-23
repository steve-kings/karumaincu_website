import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'

// GET - Fetch all pending comments (admin/editor only)
export async function GET(request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET)
    const userRole = decoded.role?.trim().toLowerCase()

    if (!['admin', 'editor'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [comments] = await pool.query(
      `SELECT 
        c.*,
        u.full_name as author_name,
        u.email as author_email,
        b.title as blog_title
      FROM blog_comments c
      LEFT JOIN users u ON c.author_id = u.id
      LEFT JOIN blogs b ON c.post_id = b.id
      WHERE c.status = 'pending'
      ORDER BY c.created_at DESC`
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
