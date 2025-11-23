import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    console.log('Setting password for:', email)
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password required'
      }, { status: 400 })
    }
    
    // Check if user exists
    const users = await executeQuery(
      'SELECT id, email, role FROM users WHERE email = ?',
      [email]
    )
    
    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 })
    }
    
    // Hash the password
    console.log('Hashing password...')
    const hashedPassword = await hashPassword(password)
    console.log('Password hashed, length:', hashedPassword.length)
    
    // Update user password
    await executeQuery(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE email = ?',
      [hashedPassword, email]
    )
    
    console.log('Password updated successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Password set successfully',
      user: {
        id: users[0].id,
        email: users[0].email,
        role: users[0].role
      }
    })
  } catch (error) {
    console.error('Set password error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to set password',
      error: error.message
    }, { status: 500 })
  }
}
