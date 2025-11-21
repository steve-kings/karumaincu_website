import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { query } from '@/lib/db'

// GET - Fetch all prayers (both personal journals and public requests) for admin
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source') // 'journal', 'public', or 'all'
    const status = searchParams.get('status') // 'active', 'answered', 'archived'

    let prayers = []

    // Fetch member prayer journals
    if (!source || source === 'all' || source === 'journal') {
      const journalPrayers = await query(
        `SELECT 
          upr.*,
          u.full_name as member_name,
          u.email as member_email,
          'journal' as source_type
         FROM user_prayer_requests upr
         LEFT JOIN users u ON upr.user_id = u.id
         ${status ? 'WHERE upr.status = ?' : ''}
         ORDER BY upr.created_at DESC`,
        status ? [status] : []
      )
      prayers = [...prayers, ...journalPrayers]
    }

    // Fetch public prayer requests
    if (!source || source === 'all' || source === 'public') {
      const publicPrayers = await query(
        `SELECT 
          pr.*,
          u.full_name as member_name,
          u.email as member_email,
          'public' as source_type
         FROM prayer_requests pr
         LEFT JOIN users u ON pr.requester_id = u.id
         ${status ? 'WHERE pr.status = ?' : ''}
         ORDER BY pr.created_at DESC`,
        status ? [status] : []
      )
      prayers = [...prayers, ...publicPrayers]
    }

    // Sort by created_at descending
    prayers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return NextResponse.json(prayers)
  } catch (error) {
    console.error('Error fetching prayers:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch prayers',
      message: error.message 
    }, { status: 500 })
  }
}
