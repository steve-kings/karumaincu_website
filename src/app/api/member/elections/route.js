import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Get active elections for members
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // DEBUG: Get ALL elections first to see what's in database
    const allElections = await query(
      'SELECT id, title, status, start_date, end_date, created_at FROM leader_elections ORDER BY created_at DESC'
    )
    console.log('🔍 [MEMBER ELECTIONS DEBUG] All elections in database:', JSON.stringify(allElections, null, 2))
    console.log('🕐 [MEMBER ELECTIONS DEBUG] Current server time:', new Date().toISOString())

    // Get open elections - more lenient date check
    const elections = await query(
      `SELECT * FROM leader_elections 
       WHERE status = 'open' 
       AND start_date <= NOW() 
       AND end_date >= NOW()
       ORDER BY end_date ASC`
    )

    console.log('✅ [MEMBER ELECTIONS DEBUG] Filtered elections for members:', JSON.stringify(elections, null, 2))

    // DEBUG: Show why elections might be filtered out
    if (elections.length === 0 && allElections.length > 0) {
      console.log('❌ [MEMBER ELECTIONS DEBUG] No elections visible to members. Checking reasons:')
      for (const election of allElections) {
        const reasons = []
        
        if (election.status !== 'open') {
          reasons.push(`Status is '${election.status}' (needs 'open')`)
        }
        
        // Check dates using MySQL
        const [dateCheck] = await query(
          `SELECT 
            ? <= NOW() as start_ok,
            ? >= NOW() as end_ok,
            NOW() as server_now`,
          [election.start_date, election.end_date]
        )
        
        if (!dateCheck.start_ok) {
          reasons.push(`Start date ${election.start_date} is in future`)
        }
        if (!dateCheck.end_ok) {
          reasons.push(`End date ${election.end_date} is in past`)
        }
        
        console.log(`   📋 Election "${election.title}" (ID: ${election.id}):`, reasons.length > 0 ? reasons : ['✅ Should be visible'])
      }
    }

    // For each election, get user's nomination count
    for (let election of elections) {
      const count = await query(
        'SELECT COUNT(*) as count FROM leader_nominations WHERE election_id = ? AND nominator_id = ?',
        [election.id, user.id]
      )
      election.my_nominations_count = count[0].count
      election.remaining_nominations = election.max_nominations_per_member - count[0].count
    }

    return NextResponse.json(elections)
  } catch (error) {
    console.error('Error fetching elections:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch elections',
      message: error.message 
    }, { status: 500 })
  }
}
