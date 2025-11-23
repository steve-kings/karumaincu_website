import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(request) {
  try {
    // Get token from Authorization header or cookies
    let token = null

    // Try Authorization header first
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }

    // Fall back to cookies if no header
    if (!token) {
      const cookieStore = cookies()
      token = cookieStore.get('token')?.value
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify and decode token
    const decoded = verifyToken(token)

    if (!decoded) {
      console.log('Profile: Token verification failed')
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get fresh user data from database
    const users = await query(
      'SELECT id, email, full_name, role, status, profile_image, registration_number, phone, member_type, course, year_of_study, created_at FROM users WHERE id = ?',
      [decoded.id || decoded.userId]
    )

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const user = users[0]
    console.log(`Profile: Returning user ${user.email} with role: ${user.role}`)

    // Check if account is still active
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Account is not active' },
        { status: 403 }
      )
    }

    // Return user profile data (using snake_case for consistency with frontend)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        registration_number: user.registration_number,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        member_type: user.member_type,
        role: user.role ? user.role.trim() : 'member', // Fresh role from database
        status: user.status,
        profile_image: user.profile_image,
        course: user.course,
        year_of_study: user.year_of_study,
        created_at: user.created_at
      }
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request) {
  try {
    // Get token from cookies
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const { full_name, email, phone, course, year_of_study } = body

    // Validate required fields
    if (!full_name || !email) {
      return NextResponse.json(
        { success: false, message: 'Full name and email are required' },
        { status: 400 }
      )
    }

    // Update user in database
    await query(
      `UPDATE users 
       SET full_name = ?, email = ?, phone = ?, course = ?, year_of_study = ?
       WHERE id = ?`,
      [full_name, email, phone || null, course || null, year_of_study || null, decoded.id]
    )

    // Get updated user data
    const users = await query(
      'SELECT id, email, full_name, role, status, profile_image, registration_number, phone, member_type, course, year_of_study, created_at FROM users WHERE id = ?',
      [decoded.id]
    )

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const user = users[0]

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        registration_number: user.registration_number,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        member_type: user.member_type,
        role: user.role ? user.role.trim() : 'member',
        status: user.status,
        profile_image: user.profile_image,
        course: user.course,
        year_of_study: user.year_of_study,
        created_at: user.created_at
      }
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
