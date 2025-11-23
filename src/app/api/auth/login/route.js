import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { comparePassword, generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    console.log('Login attempt started')
    const body = await request.json()
    const { email, registrationNumber, password } = body

    const loginIdentifier = email || registrationNumber
    console.log('Login identifier:', loginIdentifier)

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

    console.log('Querying database...')
    const users = await executeQuery(query, [loginIdentifier, loginIdentifier])
    console.log('Users found:', users.length)

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
    console.log('Verifying password...')
    const isPasswordValid = await comparePassword(password, user.password_hash)
    console.log('Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    console.log('Generating token...')
    const token = generateToken({
      id: user.id,
      registrationNumber: user.registration_number,
      email: user.email,
      role: user.role ? user.role.trim() : 'member',
      memberType: user.member_type
    })
    console.log('Token generated')

    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    )

    // Set cookie with 30 days expiration
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    })

    // Return user data (without password)
    const { password_hash, ...userData } = user

    console.log('Login successful for:', user.email)
    console.log('Raw role from DB:', user.role, 'Type:', typeof user.role, 'Length:', user.role?.length)
    console.log('Role bytes:', user.role ? Buffer.from(user.role).toString('hex') : 'null')
    const trimmedRole = user.role ? user.role.trim() : 'member'
    console.log('Trimmed role:', trimmedRole, 'Length:', trimmedRole.length)

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { ...userData, role: userData.role ? userData.role.trim() : 'member' },
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
