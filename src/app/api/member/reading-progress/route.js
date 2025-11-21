import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

// GET - Fetch reading progress for a specific plan
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await query(
      `SELECT * FROM reading_progress 
       WHERE user_id = ? 
       ORDER BY reading_date DESC`,
      [user.id]
    )

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error fetching reading progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

// POST - Mark a day as complete or incomplete
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { readingDate, completed } = await request.json()

    if (!readingDate) {
      return NextResponse.json({ error: 'Reading date is required' }, { status: 400 })
    }

    if (completed) {
      // Mark as complete
      await query(
        `INSERT INTO reading_progress (user_id, reading_date, completed, completed_at) 
         VALUES (?, ?, TRUE, NOW())
         ON DUPLICATE KEY UPDATE completed = TRUE, completed_at = NOW()`,
        [user.id, readingDate]
      )
    } else {
      // Mark as incomplete (delete the record)
      await query(
        `DELETE FROM reading_progress 
         WHERE user_id = ? AND reading_date = ?`,
        [user.id, readingDate]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating reading progress:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
