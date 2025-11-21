import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import BlogService from '@/services/BlogService'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status') !== 'all' ? searchParams.get('status') : null,
      search: searchParams.get('search'),
      author_id: searchParams.get('author_id'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    }

    const blogs = await BlogService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: blogs
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch blogs',
      message: error.message 
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const newBlog = await BlogService.create(body, user.id)

    return NextResponse.json({
      success: true,
      data: newBlog
    })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ 
      error: 'Failed to create blog',
      message: error.message 
    }, { status: 500 })
  }
}
