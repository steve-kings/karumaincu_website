import { NextResponse } from 'next/server'
import getPool from '@/lib/db'

// GET - Fetch a single blog post
export async function GET(request, { params }) {
  try {
    const { id } = await params
    console.log('Fetching blog with ID:', id)

    const pool = getPool()
    if (!pool) {
      console.error('Database pool is not initialized')
      return NextResponse.json(
        { success: false, error: 'Database connection error' },
        { status: 500 }
      )
    }

    const [blogs] = await pool.query(
      `SELECT 
        b.*,
        u.full_name as author_name,
        u.profile_image as author_image
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.id = ?`,
      [id]
    )

    console.log('Query result:', blogs?.length || 0, 'blogs found')

    if (!blogs || blogs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }

    const blog = blogs[0]

    // Parse tags if they're stored as JSON
    if (blog.tags && typeof blog.tags === 'string') {
      try {
        blog.tags = JSON.parse(blog.tags)
      } catch (e) {
        console.error('Error parsing tags:', e)
        blog.tags = []
      }
    }

    // Increment view count (don't fail if this errors)
    try {
      await pool.query(
        `UPDATE blogs SET view_count = view_count + 1 WHERE id = ?`,
        [id]
      )
    } catch (updateError) {
      console.error('Error updating view count:', updateError)
      // Continue anyway
    }

    console.log('Returning blog:', blog.id, blog.title)
    return NextResponse.json({ success: true, data: blog })
  } catch (error) {
    console.error('Error fetching blog - Full error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}
