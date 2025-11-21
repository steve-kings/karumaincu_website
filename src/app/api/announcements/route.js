import { NextResponse } from 'next/server'
import AnnouncementService from '@/services/AnnouncementService'

// GET /api/announcements - Get all announcements (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      active_only: searchParams.get('active_only') || 'true',
      priority: searchParams.get('priority'),
      limit: searchParams.get('limit') || '20',
      offset: searchParams.get('offset') || '0'
    }

    const announcements = await AnnouncementService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: announcements,
      count: announcements.length
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements', error: error.message },
      { status: 500 }
    )
  }
}
