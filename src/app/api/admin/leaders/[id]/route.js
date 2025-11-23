import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import LeaderService from '@/services/LeaderService'

export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const leader = await LeaderService.getById(id)

    return NextResponse.json({
      success: true,
      data: leader
    })
  } catch (error) {
    console.error('Error fetching leader:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch leader',
      message: error.message 
    }, { status: error.message === 'Leader not found' ? 404 : 500 })
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
    const updatedLeader = await LeaderService.update(id, body)

    return NextResponse.json({
      success: true,
      data: updatedLeader
    })
  } catch (error) {
    console.error('Error updating leader:', error)
    return NextResponse.json({ 
      error: 'Failed to update leader',
      message: error.message 
    }, { status: error.message === 'Leader not found' ? 404 : 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await LeaderService.delete(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting leader:', error)
    return NextResponse.json({ 
      error: 'Failed to delete leader',
      message: error.message 
    }, { status: error.message === 'Leader not found' ? 404 : 500 })
  }
}
