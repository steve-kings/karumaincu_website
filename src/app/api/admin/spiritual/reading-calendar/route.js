import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let query = 'SELECT * FROM reading_calendar WHERE 1=1'
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
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { month, year, day, book, chapter_start, chapter_end, verse_start, verse_end, devotional_note } = body

    const result = await executeQuery(
      `INSERT INTO reading_calendar (month, year, day, book, chapter_start, chapter_end, verse_start, verse_end, devotional_note) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [month, year, day, book, chapter_start, chapter_end || null, verse_start || null, verse_end || null, devotional_note || null]
    )

    const [newReading] = await executeQuery('SELECT * FROM reading_calendar WHERE id = ?', [result.insertId])

    return NextResponse.json({
      success: true,
      data: newReading
    })
  } catch (error) {
    console.error('Error creating reading:', error)
    return NextResponse.json({ error: 'Failed to create reading' }, { status: 500 })
  }
}
