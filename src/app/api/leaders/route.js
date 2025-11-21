import { NextResponse } from 'next/server'
import LeaderService from '@/services/LeaderService'

// GET /api/leaders - Get all leaders (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status') || 'active',
      limit: searchParams.get('limit') || '50',
      offset: searchParams.get('offset') || '0'
    }

    const leaders = await LeaderService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: leaders
    })
  } catch (error) {
    console.error('Error fetching leaders:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leaders', error: error.message },
      { status: 500 }
    )
  }
}
