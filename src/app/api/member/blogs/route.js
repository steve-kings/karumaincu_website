import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import BlogService from '@/services/BlogService'

// GET - Get user's blogs
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      author_id: user.id,
      status: searchParams.get('status') !== 'all' ? searchParams.get('status') : null,
      search: searchParams.get('search'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    }

    const blogs = await BlogService.getAll(filters)

    return NextResponse.json({
      success: true,
      blogs: blogs
    })

  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new blog
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please login again' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const newBlog = await BlogService.create(body, user.id)

    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      blog: newBlog
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
