import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import BlogService from '@/services/BlogService'

export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const blog = await BlogService.getById(id)

    return NextResponse.json({
      success: true,
      data: blog
    })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch blog',
      message: error.message 
    }, { status: error.message === 'Blog not found' ? 404 : 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    console.log('Updating blog:', id, 'with data:', body)
    
    const updatedBlog = await BlogService.update(id, body)

    return NextResponse.json({
      success: true,
      data: updatedBlog
    })
  } catch (error) {
    console.error('Error updating blog:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json({ 
      error: 'Failed to update blog',
      message: error.message 
    }, { status: error.message === 'Blog not found' ? 404 : 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await BlogService.delete(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json({ 
      error: 'Failed to delete blog',
      message: error.message 
    }, { status: error.message === 'Blog not found' ? 404 : 500 })
  }
}
