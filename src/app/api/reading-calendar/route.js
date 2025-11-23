import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

export async function GET(request) {
  try {
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
