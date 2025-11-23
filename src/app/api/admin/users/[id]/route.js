import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import UserService from '@/services/UserService'

export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const targetUser = await UserService.getById(id)

    return NextResponse.json({
      success: true,
      data: targetUser
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch user',
      message: error.message 
    }, { status: error.message === 'User not found' ? 404 : 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updatedUser = await UserService.update(id, body)

    return NextResponse.json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ 
      error: 'Failed to update user',
      message: error.message 
    }, { status: error.message === 'User not found' ? 404 : 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await UserService.delete(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ 
      error: 'Failed to delete user',
      message: error.message 
    }, { status: error.message === 'User not found' ? 404 : 500 })
  }
}
