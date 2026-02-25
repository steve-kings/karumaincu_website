import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import GalleryService from '@/services/GalleryService'
import { revalidatePath } from 'next/cache'

export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    // Allow both admin and editor
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updatedGallery = await GalleryService.update(id, body)

    // Revalidate the media page to show updated gallery
    revalidatePath('/media')

    return NextResponse.json({
      success: true,
      data: updatedGallery
    })
  } catch (error) {
    console.error('Error updating gallery:', error)
    return NextResponse.json({ 
      error: 'Failed to update gallery',
      message: error.message 
    }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    // Allow both admin and editor
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await GalleryService.delete(id)

    // Revalidate the media page
    revalidatePath('/media')

    return NextResponse.json({
      success: true,
      message: 'Gallery deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting gallery:', error)
    return NextResponse.json({ 
      error: 'Failed to delete gallery',
      message: error.message 
    }, { status: 500 })
  }
}
