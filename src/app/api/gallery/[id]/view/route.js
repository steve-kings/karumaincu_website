import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  try {
    const { id } = await params

    // Increment view count
    const query = `
      UPDATE galleries 
      SET view_count = view_count + 1 
      WHERE id = ?
    `
    
    await executeQuery(query, [id])

    return NextResponse.json({ 
      success: true, 
      message: 'View count updated' 
    })
  } catch (error) {
    console.error('Error updating view count:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update view count' },
      { status: 500 }
    )
  }
}
