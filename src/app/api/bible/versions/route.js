import { NextResponse } from 'next/server'
import { getAvailableVersions } from '@/lib/bibleApi'

/**
 * Public API endpoint to get available Bible versions
 * GET /api/bible/versions
 */
export async function GET(request) {
  try {
    const versions = await getAvailableVersions()
    
    return NextResponse.json({
      success: true,
      data: versions,
      count: versions.length
    })
    
  } catch (error) {
    console.error('Error fetching Bible versions:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Bible versions'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
