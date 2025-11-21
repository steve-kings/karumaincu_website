import { NextResponse } from 'next/server'
import EventService from '@/services/EventService'
import AnnouncementService from '@/services/AnnouncementService'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status') || 'published',
      category: searchParams.get('category'),
      upcoming: 'true', // Only upcoming events
      limit: searchParams.get('limit') || '50'
    }

    const events = await EventService.getAll(filters)

    // Fetch active announcements for hero slider
    const announcements = await AnnouncementService.getAll({
      active_only: 'true',
      limit: '5'
    })

    return NextResponse.json({
      success: true,
      data: {
        events,
        announcements
      },
      count: events.length
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events', message: error.message },
      { status: 500 }
    )
  }
}
