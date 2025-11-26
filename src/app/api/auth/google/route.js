import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { generateToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { credential } = await request.json()


    if (!credential) {
      return NextResponse.json(
        { success: false, message: 'No credential provided' },
        { status: 400 }
      )
    }

    // Decode the Google JWT token
    const decoded = jwt.decode(credential)

    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { success: false, message: 'Invalid Google token' },
        { status: 400 }
      )
    }

    const { email, name, picture, sub: googleId } = decoded

    // Check if user exists
    let users = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    let user

    if (users.length === 0) {
      // Create new user with Google account
      // Generate a registration number for Google users
      const regNumber = `GOOGLE-${Date.now()}`

      const result = await query(
        `INSERT INTO users (
          registration_number,
          email,
          full_name,
          password_hash,
          phone,
          member_type,
          role,
          status,
          profile_image,
          doctrinal_agreement,
          created_at
        ) VALUES (?, ?, ?, ?, NULL, 'associate', 'member', 'active', ?, TRUE, NOW())`,
        [regNumber, email, name, '', picture] // Empty password for OAuth users, NULL phone, active status
      )

      // Fetch the newly created user
      users = await query(
        'SELECT id, email, full_name, role, status, profile_image, phone FROM users WHERE id = ?',
        [result.insertId]
      )
      user = users[0]
      user.needsProfileCompletion = true // Flag for new Google users

      console.log(`New Google user registered: ${email}`)
    } else {
      user = users[0]

      // Check if profile is incomplete (no phone number means incomplete)
      if (!user.phone) {
        user.needsProfileCompletion = true
      }

      // Update profile image if changed
      if (picture && picture !== user.profile_image) {
        await query(
          'UPDATE users SET profile_image = ?, updated_at = NOW() WHERE id = ?',
          [picture, user.id]
        )
        user.profile_image = picture
      }

      // Update last login
      await query(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [user.id]
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    // Set cookie
    const cookieStore = cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        profileImage: user.profile_image,
        needsProfileCompletion: user.needsProfileCompletion || false,
      },
      token,
    })

  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    )
  }
}
