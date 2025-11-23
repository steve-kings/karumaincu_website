import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body
    
    console.log('Test login for:', email)
    
    // Find user
    const query = `
      SELECT id, registration_number, email, password_hash, full_name, 
             member_type, role, status,
             LENGTH(password_hash) as hash_length
      FROM users 
      WHERE email = ?
    `
    
    const users = await executeQuery(query, [email])
    
    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      })
    }
    
    const user = users[0]
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        hasPassword: user.password_hash && user.password_hash.length > 0,
        hashLength: user.hash_length
      }
    })
  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
