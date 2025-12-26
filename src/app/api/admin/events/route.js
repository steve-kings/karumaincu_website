import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import EventService from '@/services/EventService'
import { revalidatePath } from 'next/cache'

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
      category: searchParams.get('category'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    }

    const events = await EventService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: events
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch events',
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
    const newEvent = await EventService.create(body, user.id)

    // Revalidate the events page to show new event
    revalidatePath('/events')

    return NextResponse.json({
      success: true,
      data: newEvent
    })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ 
      error: 'Failed to create event',
      message: error.message 
    }, { status: 500 })
  }
}
