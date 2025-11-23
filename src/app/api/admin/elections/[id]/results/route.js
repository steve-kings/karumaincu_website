import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Get nomination results for an election
export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get election details
    const election = await query(
      'SELECT * FROM leader_elections WHERE id = ?',
      [id]
    )

    if (election.length === 0) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 })
    }

    // Get nomination results
    const results = await query(
      `SELECT 
        ln.nominee_id,
        u.full_name as nominee_name,
        u.email as nominee_email,
        u.registration_number,
        u.course,
        u.year_of_study,
        u.phone,
        COUNT(ln.id) as nomination_count,
        GROUP_CONCAT(DISTINCT ln.position ORDER BY ln.position SEPARATOR ', ') as suggested_positions,
        GROUP_CONCAT(DISTINCT nominator.full_name ORDER BY nominator.full_name SEPARATOR '; ') as nominators
       FROM leader_nominations ln
       JOIN users u ON ln.nominee_id = u.id
       LEFT JOIN users nominator ON ln.nominator_id = nominator.id
       WHERE ln.election_id = ?
       GROUP BY ln.nominee_id, u.full_name, u.email, u.registration_number, u.course, u.year_of_study, u.phone
       ORDER BY nomination_count DESC`,
      [id]
    )

    // Get position-specific breakdown
    const positionBreakdown = await query(
      `SELECT 
        ln.position,
        ln.nominee_id,
        u.full_name as nominee_name,
        COUNT(ln.id) as votes
       FROM leader_nominations ln
       JOIN users u ON ln.nominee_id = u.id
       WHERE ln.election_id = ?
       GROUP BY ln.position, ln.nominee_id, u.full_name
       ORDER BY ln.position, votes DESC`,
      [id]
    )

    // Get total nominations count
    const totalNominations = await query(
      'SELECT COUNT(*) as total FROM leader_nominations WHERE election_id = ?',
      [id]
    )

    // Get unique nominators count
    const uniqueNominators = await query(
      'SELECT COUNT(DISTINCT nominator_id) as total FROM leader_nominations WHERE election_id = ?',
      [id]
    )

    // Get all positions for this election
    const positions = await query(
      'SELECT DISTINCT position FROM leader_nominations WHERE election_id = ? ORDER BY position',
      [id]
    )

    return NextResponse.json({
      election: election[0],
      results,
      positionBreakdown,
      positions: positions.map(p => p.position),
      stats: {
        total_nominations: totalNominations[0].total,
        unique_nominators: uniqueNominators[0].total,
        unique_nominees: results.length
      }
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch results',
      message: error.message 
    }, { status: 500 })
  }
}
