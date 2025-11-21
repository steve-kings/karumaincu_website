import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      memberType, 
      registrationNumber, 
      phone, 
      course, 
      yearOfStudy,
      staffId,
      alumniYear,
      password 
    } = await request.json()

    // Validate required fields
    if (!memberType || !registrationNumber || !phone) {
      return NextResponse.json(
        { success: false, message: 'Member type, registration number, and phone are required' },
        { status: 400 }
      )
    }

    // Additional validation for students
    if (memberType === 'student' && (!course || !yearOfStudy)) {
      return NextResponse.json(
        { success: false, message: 'Course and year of study are required for students' },
        { status: 400 }
      )
    }

    // Validate password if provided
    if (password && password.length < 4) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 4 characters' },
        { status: 400 }
      )
    }

    // Check if registration number is already used by another user
    const existing = await query(
      'SELECT id FROM users WHERE registration_number = ? AND id != ?',
      [registrationNumber, user.id]
    )

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'This registration number is already in use' },
        { status: 409 }
      )
    }

    // Hash password if provided
    let passwordHash = null
    if (password) {
      passwordHash = await bcrypt.hash(password, 10)
    }

    // Update user profile and set status to active
    if (passwordHash) {
      await query(
        `UPDATE users SET 
          registration_number = ?,
          phone = ?,
          member_type = ?,
          course = ?,
          year_of_study = ?,
          staff_id = ?,
          alumni_year = ?,
          password_hash = ?,
          status = 'active',
          updated_at = NOW()
        WHERE id = ?`,
        [
          registrationNumber,
          phone,
          memberType,
          course || null,
          yearOfStudy || null,
          staffId || null,
          alumniYear || null,
          passwordHash,
          user.id
        ]
      )
    } else {
      await query(
        `UPDATE users SET 
          registration_number = ?,
          phone = ?,
          member_type = ?,
          course = ?,
          year_of_study = ?,
          staff_id = ?,
          alumni_year = ?,
          status = 'active',
          updated_at = NOW()
        WHERE id = ?`,
        [
          registrationNumber,
          phone,
          memberType,
          course || null,
          yearOfStudy || null,
          staffId || null,
          alumniYear || null,
          user.id
        ]
      )
    }

    // Fetch updated user data
    const updatedUser = await query(
      'SELECT id, email, full_name, role, profile_image, member_type, registration_number FROM users WHERE id = ?',
      [user.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Profile completed successfully',
      user: updatedUser[0]
    })

  } catch (error) {
    console.error('Profile completion error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to complete profile' },
      { status: 500 }
    )
  }
}
