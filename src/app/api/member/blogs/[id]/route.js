import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// Helper to extract token from request and verify
function verifyRequest(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return verifyToken(token)
}

// GET - Get single blog
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = decoded.id || decoded.userId
    const blogId = params.id

    const blogs = await query(
      `SELECT 
        b.*,
        bc.name as category_name,
        bc.color as category_color,
        u.full_name as author_name
      FROM blogs b
      LEFT JOIN blog_categories bc ON b.category_id = bc.id
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.id = ? AND b.author_id = ?`,
      [blogId, userId]
    )

    if (blogs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      )
    }

    const blog = {
      ...blogs[0],
      tags: blogs[0].tags ? JSON.parse(blogs[0].tags) : []
    }

    return NextResponse.json({
      success: true,
      blog
    })

  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// PUT - Update blog
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const decoded = verifyRequest(request)
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = decoded.id || decoded.userId
    const blogId = params.id
    const body = await request.json()
    const { title, content, excerpt, featured_image, category, tags, status } = body

    // Verify ownership
    const blogs = await query(
      'SELECT id FROM blogs WHERE id = ? AND author_id = ?',
      [blogId, userId]
    )

    if (blogs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Blog not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update blog
    await query(
      `UPDATE blogs SET
        title = ?,
        content = ?,
        excerpt = ?,
        featured_image = ?,
        category = ?,
        tags = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ? AND author_id = ?`,
      [
        title,
        content,
        excerpt,
        featured_image || null,
        category || null,
        tags ? JSON.stringify(tags) : null,
        status || 'draft',
        blogId,
        userId
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully'
    })

  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const decoded = verifyRequest(request)
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = decoded.id || decoded.userId
    const blogId = params.id

    // Verify ownership
    const blogs = await query(
      'SELECT id FROM blogs WHERE id = ? AND author_id = ?',
      [blogId, userId]
    )

    if (blogs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Blog not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete blog
    await query('DELETE FROM blogs WHERE id = ? AND author_id = ?', [blogId, userId])

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
