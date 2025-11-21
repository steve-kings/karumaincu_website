import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { comparePassword, generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, registrationNumber, password } = body
    
    const loginIdentifier = email || registrationNumber

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Email/Registration number and password are required' },
        { status: 400 }
      )
    }

    // Find user by email or registration number
    const query = `
      SELECT id, registration_number, email, password_hash, full_name, 
             member_type, role, status
      FROM users 
      WHERE email = ? OR registration_number = ?
    `
    
    const users = await executeQuery(query, [loginIdentifier, loginIdentifier])

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = users[0]

    // Check if account is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Account is not active. Please contact admin.' },
        { status: 403 }
      )
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      registrationNumber: user.registration_number,
      email: user.email,
      role: user.role,
      memberType: user.member_type
    })

    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    )

    // Set cookie
    cookies().set('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Return user data (without password)
    const { password_hash, ...userData } = user

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed', error: error.message },
      { status: 500 }
    )
  }
}
