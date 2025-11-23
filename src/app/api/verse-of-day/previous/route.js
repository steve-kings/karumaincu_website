import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

/**
 * Get previous 3 verses from database
 */
export async function GET(request) {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // Get previous 3 verses (excluding today)
    const verses = await executeQuery(
      `SELECT * FROM verse_of_day 
       WHERE date < ? 
       ORDER BY date DESC 
       LIMIT 3`,
      [today]
    )
    
    return NextResponse.json({
      success: true,
      data: verses,
      count: verses.length
    })
    
  } catch (error) {
    console.error('Error fetching previous verses:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch previous verses',
        data: []
      },
      { status: 500 }
    )
  }
}

// Allow CORS for public access
export const dynamic = 'force-dynamic'
