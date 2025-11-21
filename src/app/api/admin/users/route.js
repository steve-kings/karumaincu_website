import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import UserService from '@/services/UserService'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status'),
      role: searchParams.get('role'),
      search: searchParams.get('search'),
      limit: searchParams.get('limit') || '50',
      offset: searchParams.get('offset') || '0'
    }

    const users = await UserService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch users',
      message: error.message 
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const newUser = await UserService.create(body)

    return NextResponse.json({
      success: true,
      data: newUser
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ 
      error: 'Failed to create user',
      message: error.message 
    }, { status: 500 })
  }
}
