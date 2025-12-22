import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Search members for nomination
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const year = searchParams.get('year')
    const course = searchParams.get('course')
    const limit = parseInt(searchParams.get('limit') || '20')

    let sql = `
      SELECT 
        id,
        full_name,
        email,
        registration_number,
        course,
        year_of_study,
        phone
      FROM users
      WHERE status = 'active'
      AND role = 'member'
    `
    const params = []

    // Search by name, email, or registration number
    if (search) {
      sql += ` AND (
        full_name LIKE ? OR 
        email LIKE ? OR 
        registration_number LIKE ?
      )`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    // Filter by year
    if (year) {
      sql += ` AND year_of_study = ?`
      params.push(year)
    }

    // Filter by course
    if (course) {
      sql += ` AND course LIKE ?`
      params.push(`%${course}%`)
    }

    // LIMIT must be embedded directly (not as prepared statement param)
    const limitInt = parseInt(limit, 10) || 20
    sql += ` ORDER BY full_name ASC LIMIT ${limitInt}`

    const members = await query(sql, params)

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error searching members:', error)
    return NextResponse.json({ 
      error: 'Failed to search members',
      message: error.message 
    }, { status: 500 })
  }
}
