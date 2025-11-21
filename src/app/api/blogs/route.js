import { NextResponse } from 'next/server'
import BlogService from '@/services/BlogService'

// GET /api/blogs - Get all blogs (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = (page - 1) * limit

    const filters = {
      status: searchParams.get('status') || 'published',
      search: searchParams.get('search'),
      limit: limit.toString(),
      offset: offset.toString()
    }

    const blogs = await BlogService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total: blogs.length
      }
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs', error: error.message },
      { status: 500 }
    )
  }
}
