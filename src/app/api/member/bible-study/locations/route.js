import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

// GET active locations (public - no auth required for viewing)
export async function GET(request) {
  try {
    const query = `
      SELECT id, name as location_name, description, capacity, is_active, created_at, updated_at 
      FROM study_locations 
      WHERE is_active = 1
      ORDER BY name ASC
    `
    
    const locations = await executeQuery(query)
    
    return NextResponse.json({ 
      success: true, 
      data: locations || [] 
    })
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch locations',
      message: error.message 
    }, { status: 500 })
  }
}
