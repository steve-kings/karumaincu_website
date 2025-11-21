import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import BibleStudyService from '@/services/BibleStudyService'

// GET single registration
export async function GET(request, { params }) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const registration = await BibleStudyService.getRegistrationById(id)

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: registration })
  } catch (error) {
    console.error('Error fetching registration:', error)
    return NextResponse.json({ error: 'Failed to fetch registration' }, { status: 500 })
  }
}

// PUT update registration (status, group assignment)
export async function PUT(request, { params }) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    
    const updatedRegistration = await BibleStudyService.updateRegistration(id, body)

    return NextResponse.json({ 
      success: true, 
      message: 'Registration updated successfully',
      data: updatedRegistration 
    })
  } catch (error) {
    console.error('Error updating registration:', error)
    return NextResponse.json({ error: error.message || 'Failed to update registration' }, { status: 500 })
  }
}

// DELETE registration
export async function DELETE(request, { params }) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    await BibleStudyService.deleteRegistration(id)

    return NextResponse.json({ 
      success: true, 
      message: 'Registration deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting registration:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete registration' }, { status: 500 })
  }
}
