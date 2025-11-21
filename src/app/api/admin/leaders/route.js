import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import LeaderService from '@/services/LeaderService'

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
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    }

    const leaders = await LeaderService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: leaders
    })
  } catch (error) {
    console.error('Error fetching leaders:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch leaders',
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
    const newLeader = await LeaderService.create(body, user.id)

    return NextResponse.json({
      success: true,
      data: newLeader
    })
  } catch (error) {
    console.error('Error creating leader:', error)
    return NextResponse.json({ 
      error: 'Failed to create leader', 
      message: error.message 
    }, { status: 500 })
  }
}
