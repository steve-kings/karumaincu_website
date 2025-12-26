import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import EventService from '@/services/EventService'

export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const event = await EventService.getById(id)

    return NextResponse.json({
      success: true,
      data: event
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch event',
      message: error.message 
    }, { status: error.message === 'Event not found' ? 404 : 500 })
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
    
    console.log('Updating event:', id, 'with data:', JSON.stringify(body, null, 2))
    
    const updatedEvent = await EventService.update(id, body)

    return NextResponse.json({
      success: true,
      data: updatedEvent
    })
  } catch (error) {
    console.error('Error updating event:', error.message, error.stack)
    return NextResponse.json({ 
      error: 'Failed to update event',
      message: error.message 
    }, { status: error.message === 'Event not found' ? 404 : 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await EventService.delete(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ 
      error: 'Failed to delete event',
      message: error.message 
    }, { status: error.message === 'Event not found' ? 404 : 500 })
  }
}
