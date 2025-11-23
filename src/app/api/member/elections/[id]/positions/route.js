import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Get positions for an election (member view)
export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const positions = await query(
      'SELECT id, title, description FROM election_positions WHERE election_id = ? ORDER BY display_order ASC',
      [id]
    )

    return NextResponse.json(positions)
  } catch (error) {
    console.error('Error fetching positions:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch positions',
      message: error.message 
    }, { status: 500 })
  }
}
