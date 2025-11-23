import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import pool from '@/lib/db'

export async function POST(request, { params }) {
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

    const { id } = await params

    await pool.query(
      `UPDATE blog_comments SET status = 'approved' WHERE id = ?`,
      [id]
    )

    return NextResponse.json({
      success: true,
      message: 'Comment approved successfully'
    })
  } catch (error) {
    console.error('Error approving comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to approve comment' },
      { status: 500 }
    )
  }
}
