import { NextResponse } from 'next/server'
import { verifyAuth, hashPassword } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

export async function POST(request) {
  try {
    // Verify user is authenticated
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      memberType,
      registrationNumber,
      phone,
      course,
      yearOfStudy,
      alumniYear,
      password
    } = body

    // Validate required fields
    if (!memberType || !registrationNumber || !phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate student-specific fields
    if (memberType === 'student' && (!course || !yearOfStudy)) {
      return NextResponse.json(
        { success: false, message: 'Course and year of study are required for students' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData = {
      member_type: memberType,
      registration_number: registrationNumber,
      phone,
      course: memberType === 'student' ? course : null,
      year_of_study: memberType === 'student' ? yearOfStudy : null,
      alumni_year: memberType === 'associate' ? alumniYear : null,
      profile_complete: true
    }

    // Hash password if provided
    if (password && password.length >= 4) {
      updateData.password_hash = await hashPassword(password)
    }

    // Build update query
    const fields = Object.keys(updateData)
    const values = Object.values(updateData)
    const setClause = fields.map((field, index) => `${field} = ?`).join(', ')

    // Update user profile
    await executeQuery(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      [...values, user.id]
    )

    // Fetch updated user data
    const [updatedUser] = await executeQuery(
      'SELECT id, email, full_name, role, member_type, registration_number, phone, course, year_of_study, profile_complete FROM users WHERE id = ?',
      [user.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Profile completed successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Complete profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to complete profile', error: error.message },
      { status: 500 }
    )
  }
}
