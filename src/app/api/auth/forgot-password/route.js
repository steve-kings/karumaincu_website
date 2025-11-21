import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { query } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const users = await query(
      'SELECT id, email, full_name FROM users WHERE email = ? AND status = "active"',
      [email]
    )

    if (users.length === 0) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions.'
      })
    }

    const user = users[0]

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in database
    await query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id]
    )

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.full_name)

    // Log for development
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment) {
      console.log('Password Reset Token:', resetToken)
      console.log('Reset Link:', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`)
      console.log('Email sent:', emailResult.success)
    }

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error)
      // Still return success to user for security, but log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions sent to your email',
      ...(isDevelopment && { resetToken, emailSent: emailResult.success }) // Only include in development
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}
