import { NextResponse } from 'next/server'
import SermonService from '@/services/SermonService'

// GET /api/sermons - Get all sermons (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status') || 'published',
      category: searchParams.get('category'),
      limit: searchParams.get('limit') || '50',
      offset: searchParams.get('offset') || '0'
    }

    const sermons = await SermonService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: sermons,
      count: sermons.length
    })
  } catch (error) {
    console.error('Error fetching sermons:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sermons', error: error.message },
      { status: 500 }
    )
  }
}
