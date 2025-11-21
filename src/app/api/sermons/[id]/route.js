import { NextResponse } from 'next/server'
import SermonService from '@/services/SermonService'

// GET /api/sermons/[id] - Get single sermon (public)
export async function GET(request, { params }) {
  try {
    const { id } = params
    const sermon = await SermonService.getById(id)

    if (!sermon) {
      return NextResponse.json(
        { success: false, message: 'Sermon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: sermon
    })
  } catch (error) {
    console.error('Error fetching sermon:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sermon', error: error.message },
      { status: 500 }
    )
  }
}
