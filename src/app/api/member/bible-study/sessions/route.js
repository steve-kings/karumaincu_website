import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

// GET open Bible Study sessions (public - no auth required)
export async function GET(request) {
  try {
    const query = `
      SELECT * FROM bible_study_sessions 
      WHERE is_open = 1 
      AND registration_deadline >= CURDATE()
      ORDER BY registration_deadline ASC
    `
    
    const sessions = await executeQuery(query)
    
    return NextResponse.json({ 
      success: true, 
      data: sessions || [] 
    })
  } catch (error) {
    console.error('Error fetching open sessions:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch sessions',
      message: error.message 
    }, { status: 500 })
  }
}
