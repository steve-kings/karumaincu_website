import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import PrayerService from '@/services/PrayerService'

// GET - Fetch all public prayer requests
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status') !== 'all' ? searchParams.get('status') : null,
      is_public: 'true', // Only public prayers
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    }

    const prayers = await PrayerService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: prayers
    })
  } catch (error) {
    console.error('Error fetching prayer requests:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch prayers',
      message: error.message 
    }, { status: 500 })
  }
}

// POST - Create new prayer request (public or authenticated)
export async function POST(request) {
  try {
    const body = await request.json()

    // Try to get authenticated user (optional for public submissions)
    let user = null
    try {
      user = await verifyAuth(request)
    } catch (e) {
      // Not authenticated - allow anonymous submission
    }

    const newPrayer = await PrayerService.create(body, user?.id || null)

    return NextResponse.json({
      success: true,
      data: newPrayer
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating prayer request:', error)
    return NextResponse.json({ 
      error: 'Failed to create prayer',
      message: error.message 
    }, { status: 500 })
  }
}
