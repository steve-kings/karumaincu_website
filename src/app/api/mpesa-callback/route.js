import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Log the callback for reference
    console.log('M-Pesa Callback:', JSON.stringify(body, null, 2))

    // Always respond with success to M-Pesa
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })

  } catch (error) {
    console.error('M-Pesa callback error:', error)
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'M-Pesa callback endpoint is active' })
}
