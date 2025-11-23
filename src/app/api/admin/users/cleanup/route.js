import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

// GET - Preview members that will be deleted
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    
    // Only admins can access this
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get members who have been registered for more than 4 years
    const oldMembers = await executeQuery(`
      SELECT 
        id, 
        registration_number, 
        email, 
        full_name, 
        course,
        year_of_study,
        created_at,
        TIMESTAMPDIFF(YEAR, created_at, NOW()) as years_registered,
        TIMESTAMPDIFF(MONTH, created_at, NOW()) as months_registered
      FROM users
      WHERE member_type = 'student'
      AND role = 'member'
      AND created_at < DATE_SUB(NOW(), INTERVAL 4 YEAR)
      ORDER BY created_at ASC
    `)

    return NextResponse.json({
      success: true,
      count: oldMembers.length,
      members: oldMembers,
      message: `Found ${oldMembers.length} members registered for more than 4 years`
    })
  } catch (error) {
    console.error('Error fetching old members:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch old members',
      message: error.message 
    }, { status: 500 })
  }
}

// POST - Execute cleanup (delete old members)
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    
    // Only admins can execute cleanup
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { confirm, archive = true } = body

    // Require explicit confirmation
    if (confirm !== 'DELETE_OLD_MEMBERS') {
      return NextResponse.json({ 
        error: 'Confirmation required',
        message: 'Please send { "confirm": "DELETE_OLD_MEMBERS" } to proceed'
      }, { status: 400 })
    }

    // Get members to be deleted
    const membersToDelete = await executeQuery(`
      SELECT * FROM users
      WHERE member_type = 'student'
      AND role = 'member'
      AND created_at < DATE_SUB(NOW(), INTERVAL 4 YEAR)
    `)

    if (membersToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        deleted: 0,
        message: 'No members found for cleanup'
      })
    }

    // Archive members before deletion (if requested)
    if (archive) {
      for (const member of membersToDelete) {
        await executeQuery(`
          INSERT INTO users_archive 
          (id, registration_number, email, password_hash, full_name, phone, 
           member_type, role, status, course, year_of_study, staff_id, 
           alumni_year, doctrinal_agreement, profile_image, reset_token, 
           reset_token_expiry, created_at, updated_at, last_login, 
           deleted_at, deletion_reason)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
        `, [
          member.id,
          member.registration_number,
          member.email,
          member.password_hash,
          member.full_name,
          member.phone,
          member.member_type,
          member.role,
          member.status,
          member.course,
          member.year_of_study,
          member.staff_id,
          member.alumni_year,
          member.doctrinal_agreement,
          member.profile_image,
          member.reset_token,
          member.reset_token_expiry,
          member.created_at,
          member.updated_at,
          member.last_login,
          'Automatic cleanup - 4+ years registered'
        ])
      }
    }

    // Delete old members
    const result = await executeQuery(`
      DELETE FROM users
      WHERE member_type = 'student'
      AND role = 'member'
      AND created_at < DATE_SUB(NOW(), INTERVAL 4 YEAR)
    `)

    return NextResponse.json({
      success: true,
      deleted: result.affectedRows || membersToDelete.length,
      archived: archive ? membersToDelete.length : 0,
      message: `Successfully deleted ${result.affectedRows || membersToDelete.length} members${archive ? ' (archived before deletion)' : ''}`
    })
  } catch (error) {
    console.error('Error cleaning up old members:', error)
    return NextResponse.json({ 
      error: 'Failed to cleanup old members',
      message: error.message 
    }, { status: 500 })
  }
}
