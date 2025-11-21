import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const verses = await executeQuery(
      'SELECT * FROM verse_of_day ORDER BY date DESC LIMIT 30'
    )

    return NextResponse.json({
      success: true,
      data: verses
    })
  } catch (error) {
    console.error('Error fetching verses:', error)
    return NextResponse.json({ error: 'Failed to fetch verses' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { verse_reference, verse_text, commentary, date } = body

    const result = await executeQuery(
      `INSERT INTO verse_of_day (verse_reference, verse_text, commentary, date) 
       VALUES (?, ?, ?, ?)`,
      [verse_reference, verse_text, commentary || null, date]
    )

    const [newVerse] = await executeQuery('SELECT * FROM verse_of_day WHERE id = ?', [result.insertId])

    return NextResponse.json({
      success: true,
      data: newVerse
    })
  } catch (error) {
    console.error('Error creating verse:', error)
    return NextResponse.json({ error: 'Failed to create verse' }, { status: 500 })
  }
}
