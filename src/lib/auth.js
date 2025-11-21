import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Generate JWT token
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Compare password
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

// Get current user from cookies
export function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')?.value
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}

// Check if user is authenticated
export function isAuthenticated() {
  return getCurrentUser() !== null
}

// Check if user has required role
export function hasRole(requiredRoles = []) {
  const user = getCurrentUser()
  
  if (!user) {
    return false
  }
  
  if (requiredRoles.length === 0) {
    return true
  }
  
  return requiredRoles.includes(user.role)
}

// Verify auth from request (checks both cookies and Authorization header)
export async function verifyAuth(request) {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const user = verifyToken(token)
    if (user) {
      return user
    }
  }
  
  // Fall back to cookies
  return getCurrentUser()
}

// Middleware to protect API routes
export function withAuth(handler, options = {}) {
  return async (request, context) => {
    const user = getCurrentUser()
    
    if (!user) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check role if specified
    if (options.roles && !options.roles.includes(user.role)) {
      return Response.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      )
    }
    
    // Add user to request
    request.user = user
    
    return handler(request, context)
  }
}
