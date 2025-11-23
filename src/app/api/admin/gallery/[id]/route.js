import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import GalleryService from '@/services/GalleryService'

export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const gallery = await GalleryService.getById(id)

    return NextResponse.json({
      success: true,
      data: gallery
    })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch gallery',
      message: error.message 
    }, { status: error.message === 'Gallery item not found' ? 404 : 500 })
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
    const updatedGallery = await GalleryService.update(id, body)

    return NextResponse.json({
      success: true,
      data: updatedGallery
    })
  } catch (error) {
    console.error('Error updating gallery:', error)
    return NextResponse.json({ 
      error: 'Failed to update gallery',
      message: error.message 
    }, { status: error.message === 'Gallery item not found' ? 404 : 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await GalleryService.delete(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting gallery:', error)
    return NextResponse.json({ 
      error: 'Failed to delete gallery',
      message: error.message 
    }, { status: error.message === 'Gallery item not found' ? 404 : 500 })
  }
}
