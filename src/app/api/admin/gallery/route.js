import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import GalleryService from '@/services/GalleryService'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    
    // Allow both admin and editor
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      search: searchParams.get('search'),
      category: searchParams.get('category'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    }

    const galleries = await GalleryService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: galleries
    })
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch galleries',
      message: error.message 
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    
    // Allow both admin and editor
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const newGallery = await GalleryService.create(body, user.id)

    return NextResponse.json({
      success: true,
      data: newGallery
    })
  } catch (error) {
    console.error('Error creating gallery:', error)
    return NextResponse.json({ 
      error: 'Failed to create gallery',
      message: error.message 
    }, { status: 500 })
  }
}
