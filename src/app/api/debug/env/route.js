import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    cookieSecure: process.env.NODE_ENV === 'production',
    hasJWTSecret: !!process.env.JWT_SECRET,
    hasDBConfig: !!(process.env.DB_HOST && process.env.DB_NAME)
  })
}
