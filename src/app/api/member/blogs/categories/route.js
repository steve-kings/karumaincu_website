import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET - Get all blog categories
export async function GET() {
  try {
    const categories = await query(
      `SELECT id, name, slug, description, color 
       FROM blog_categories 
       ORDER BY name ASC`
    )

    return NextResponse.json({
      success: true,
      categories
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
