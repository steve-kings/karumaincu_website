import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import SermonService from '@/services/SermonService'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      search: searchParams.get('search'),
      speaker: searchParams.get('speaker'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    }

    const sermons = await SermonService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: sermons
    })
  } catch (error) {
    console.error('Error fetching sermons:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch sermons',
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
    const newSermon = await SermonService.create(body, user.id)

    return NextResponse.json({
      success: true,
      data: newSermon
    })
  } catch (error) {
    console.error('Error creating sermon:', error)
    return NextResponse.json({ 
      error: 'Failed to create sermon',
      message: error.message 
    }, { status: 500 })
  }
}
