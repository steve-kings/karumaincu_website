import { NextResponse } from 'next/server'
import AnnouncementService from '@/services/AnnouncementService'

// GET /api/announcements/[id] - Get single announcement (public)
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const announcement = await AnnouncementService.getById(id)

    if (!announcement) {
      return NextResponse.json(
        { success: false, message: 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: announcement
    })
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcement', error: error.message },
      { status: 500 }
    )
  }
}
