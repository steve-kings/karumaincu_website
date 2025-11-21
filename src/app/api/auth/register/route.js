import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'

export async function POST(request) {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      registrationNumber, 
      course, 
      yearOfStudy, 
      password 
    } = await request.json()

    // Validate required fields
    if (!fullName || !email || !phone || !registrationNumber || !course || !yearOfStudy || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ? OR registration_number = ?',
      [email, registrationNumber]
    )

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: 'User with this email or registration number already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const result = await query(
      `INSERT INTO users (
        full_name, 
        email, 
        phone, 
        registration_number, 
        course, 
        year_of_study, 
        password_hash,
        member_type,
        role,
        status,
        doctrinal_agreement,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'student', 'member', 'active', TRUE, NOW())`,
      [fullName, email, phone, registrationNumber, course, yearOfStudy, hashedPassword]
    )

    console.log(`New user registered: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now login with your credentials.',
      userId: result.insertId
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to register user' },
      { status: 500 }
    )
  }
}
