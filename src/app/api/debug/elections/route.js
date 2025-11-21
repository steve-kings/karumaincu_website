import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// Debug endpoint to check election status (no auth required for debugging)
export async function GET(request) {
  try {
    // Get all elections
    const allElections = await query(
      'SELECT id, title, status, start_date, end_date, created_at FROM leader_elections ORDER BY created_at DESC'
    )

    // Get positions count for each election
    const electionsWithPositions = await Promise.all(
      allElections.map(async (election) => {
        const positions = await query(
          'SELECT COUNT(*) as count FROM election_positions WHERE election_id = ?',
          [election.id]
        )
        return {
          ...election,
          position_count: positions[0].count
        }
      })
    )

    const now = new Date()

    // Analyze each election
    const analysis = electionsWithPositions.map(election => {
      const startDate = new Date(election.start_date)
      const endDate = new Date(election.end_date)
      
      const issues = []
      const fixes = []
      
      if (election.status !== 'open') {
        issues.push(`Status is '${election.status}' (needs 'open')`)
        fixes.push(`UPDATE leader_elections SET status = 'open' WHERE id = ${election.id};`)
      }
      
      if (startDate > now) {
        issues.push(`Start date is in future: ${election.start_date}`)
        fixes.push(`UPDATE leader_elections SET start_date = DATE_SUB(NOW(), INTERVAL 1 DAY) WHERE id = ${election.id};`)
      }
      
      if (endDate < now) {
        issues.push(`End date is in past: ${election.end_date}`)
        fixes.push(`UPDATE leader_elections SET end_date = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE id = ${election.id};`)
      }
      
      if (election.position_count === 0) {
        issues.push('No positions defined')
        fixes.push(`-- Add positions via Admin UI: /admin/elections/${election.id}/positions`)
      }
      
      return {
        id: election.id,
        title: election.title,
        status: election.status,
        start_date: election.start_date,
        end_date: election.end_date,
        position_count: election.position_count,
        visible_to_members: issues.length === 0,
        issues: issues.length > 0 ? issues : ['✅ Should be visible to members'],
        quick_fixes: fixes
      }
    })

    // Get what members actually see
    const memberVisibleElections = await query(
      `SELECT id, title FROM leader_elections 
       WHERE status = 'open' 
       AND start_date <= NOW() 
       AND end_date >= NOW()`
    )

    return NextResponse.json({
      current_time: now.toISOString(),
      total_elections: allElections.length,
      visible_to_members: memberVisibleElections.length,
      member_visible_elections: memberVisibleElections,
      all_elections_analysis: analysis,
      summary: {
        message: memberVisibleElections.length === 0 
          ? '❌ No elections are currently visible to members'
          : `✅ ${memberVisibleElections.length} election(s) visible to members`,
        action_needed: analysis.filter(e => !e.visible_to_members).length > 0
          ? 'Some elections need fixes - check the analysis below'
          : 'All elections are properly configured'
      }
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch debug info',
      message: error.message 
    }, { status: 500 })
  }
}
