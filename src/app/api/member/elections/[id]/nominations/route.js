import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Get all nominations for an election (grouped by position)
export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify election exists and is open
    const election = await query(
      `SELECT * FROM leader_elections 
       WHERE id = ? AND status = 'open'`,
      [id]
    )

    if (election.length === 0) {
      return NextResponse.json({ error: 'Election not found or not open' }, { status: 404 })
    }

    // Get all nominations for this election with nominee details
    const nominations = await query(
      `SELECT 
        ln.id,
        ln.position,
        ln.created_at,
        u.id as nominee_id,
        u.full_name as nominee_name,
        u.registration_number,
        u.course,
        u.year_of_study,
        COUNT(*) OVER (PARTITION BY ln.nominee_id, ln.position) as vote_count
       FROM leader_nominations ln
       JOIN users u ON ln.nominee_id = u.id
       WHERE ln.election_id = ?
       ORDER BY ln.position, vote_count DESC, ln.created_at ASC`,
      [id]
    )

    // Group nominations by position with vote counts
    const grouped = {}
    const seen = new Set()
    
    for (const nom of nominations) {
      const key = `${nom.position}-${nom.nominee_id}`
      if (seen.has(key)) continue
      seen.add(key)
      
      if (!grouped[nom.position]) {
        grouped[nom.position] = []
      }
      
      grouped[nom.position].push({
        nominee_id: nom.nominee_id,
        nominee_name: nom.nominee_name,
        registration_number: nom.registration_number,
        course: nom.course,
        year_of_study: nom.year_of_study,
        vote_count: nom.vote_count
      })
    }

    // Sort each position's nominees by vote count
    for (const position in grouped) {
      grouped[position].sort((a, b) => b.vote_count - a.vote_count)
    }

    return NextResponse.json({
      election: election[0],
      nominations: grouped,
      total_votes: nominations.length
    })
  } catch (error) {
    console.error('Error fetching election nominations:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch nominations',
      message: error.message 
    }, { status: 500 })
  }
}
