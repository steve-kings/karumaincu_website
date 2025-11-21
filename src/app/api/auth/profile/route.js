import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function verifyToken(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function GET(request) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Fetch user data from database (decoded.id comes from the JWT token)
    const userId = decoded.id || decoded.userId
    const users = await query(
      `SELECT 
        id,
        full_name,
        email,
        phone,
        registration_number,
        course,
        year_of_study,
        member_type,
        role,
        status,
        created_at
      FROM users 
      WHERE id = ? AND status = 'active'`,
      [userId]
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
      user: {
        user_id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        registration_number: user.registration_number,
        course: user.course,
        year_of_study: user.year_of_study,
        member_type: user.member_type,
        role: user.role,
        status: user.status,
        created_at: user.created_at
      }
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}


export async function PUT(request) {
  try {
    const decoded = verifyToken(request)
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { full_name, email, phone, course, year_of_study } = body

    // Validate required fields
    if (!full_name || !email) {
      return NextResponse.json(
        { success: false, message: 'Full name and email are required' },
        { status: 400 }
      )
    }

    // Update user profile
    const userId = decoded.id || decoded.userId
    await query(
      `UPDATE users 
       SET full_name = ?, 
           email = ?, 
           phone = ?, 
           course = ?, 
           year_of_study = ?
       WHERE id = ?`,
      [full_name, email, phone || null, course || null, year_of_study || null, userId]
    )

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
