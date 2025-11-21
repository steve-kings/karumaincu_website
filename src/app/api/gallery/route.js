import { NextResponse } from 'next/server'
import GalleryService from '@/services/GalleryService'

// GET /api/gallery - Get all galleries (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      category: searchParams.get('category'),
      limit: searchParams.get('limit') || '50',
      offset: searchParams.get('offset') || '0'
    }

    const galleries = await GalleryService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: galleries
    })
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch galleries', error: error.message },
      { status: 500 }
    )
  }
}
