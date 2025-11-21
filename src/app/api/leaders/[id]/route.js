import { NextResponse } from 'next/server'
import LeaderService from '@/services/LeaderService'

// GET /api/leaders/[id] - Get single leader (public)
export async function GET(request, { params }) {
  try {
    const { id } = params
    const leader = await LeaderService.getById(id)

    return NextResponse.json({
      success: true,
      data: leader
    })
  } catch (error) {
    console.error('Error fetching leader:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message === 'Leader not found' ? 404 : 500 }
    )
  }
}
