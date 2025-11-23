import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    
    // Allow both admin and editor
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let query = 'SELECT * FROM bible_reading_calendar WHERE 1=1'
    const params = []

    if (month) {
      query += ' AND month = ?'
      params.push(parseInt(month))
    }

    if (year) {
      query += ' AND year = ?'
      params.push(parseInt(year))
    }

    query += ' ORDER BY day ASC'

    const readings = await executeQuery(query, params)

    return NextResponse.json({
      success: true,
      data: readings
    })
  } catch (error) {
    console.error('Error fetching reading calendar:', error)
    return NextResponse.json({ error: 'Failed to fetch reading calendar' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    
    // Allow both admin and editor
    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'You must be an admin or editor to create reading plans'
      }, { status: 401 })
    }

    const body = await request.json()
    const { month, year, day, book, chapter_start, chapter_end, verse_start, verse_end, devotional_note } = body

    // Validate required fields
    if (!month || !year || !day || !book || !chapter_start) {
      return NextResponse.json({
        success: false,
        error: 'Validation Error',
        message: 'Month, year, day, book, and chapter_start are required'
      }, { status: 400 })
    }

    // Check if reading already exists for this date
    const existing = await executeQuery(
      'SELECT id FROM bible_reading_calendar WHERE year = ? AND month = ? AND day = ?',
      [year, month, day]
    )

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Duplicate Entry',
        message: `A reading plan already exists for ${year}-${month}-${day}. Please choose a different date or update the existing one.`
      }, { status: 409 })
    }

    const result = await executeQuery(
      `INSERT INTO bible_reading_calendar (month, year, day, book, chapter_start, chapter_end, verse_start, verse_end, devotional_note, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [month, year, day, book, chapter_start, chapter_end || null, verse_start || null, verse_end || null, devotional_note || null, user.id]
    )

    const [newReading] = await executeQuery('SELECT * FROM bible_reading_calendar WHERE id = ?', [result.insertId])

    return NextResponse.json({
      success: true,
      message: 'Reading plan created successfully',
      data: newReading
    })
  } catch (error) {
    console.error('Error creating reading:', error)
    
    // Check for duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({
        success: false,
        error: 'Duplicate Entry',
        message: 'A reading plan already exists for this date'
      }, { status: 409 })
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Database Error',
      message: error.message || 'Failed to create reading plan'
    }, { status: 500 })
  }
}
