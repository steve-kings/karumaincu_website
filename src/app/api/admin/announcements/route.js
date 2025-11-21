import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import AnnouncementService from '@/services/AnnouncementService'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      search: searchParams.get('search'),
      status: searchParams.get('status'),
      active_only: searchParams.get('active_only'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    }

    const announcements = await AnnouncementService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: announcements
    })
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch announcements',
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
    const newAnnouncement = await AnnouncementService.create(body, user.id)

    return NextResponse.json({
      success: true,
      data: newAnnouncement
    })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json({ 
      error: 'Failed to create announcement',
      message: error.message 
    }, { status: 500 })
  }
}
