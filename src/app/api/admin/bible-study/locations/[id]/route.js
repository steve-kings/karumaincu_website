import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

// GET single location
export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const [location] = await executeQuery(
      'SELECT id, name as location_name, description, capacity, is_active, created_at, updated_at FROM study_locations WHERE id = ?',
      [id]
    )

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: location })
  } catch (error) {
    console.error('Error fetching location:', error)
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 })
  }
}

// PUT update location
export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { location_name, description, capacity, is_active } = body

    if (!location_name) {
      return NextResponse.json({ error: 'Location name is required' }, { status: 400 })
    }

    // Check if location exists
    const [existing] = await executeQuery(
      'SELECT id FROM study_locations WHERE id = ?',
      [id]
    )

    if (!existing) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    // Update location
    await executeQuery(
      `UPDATE study_locations 
       SET name = ?, description = ?, capacity = ?, is_active = ?
       WHERE id = ?`,
      [location_name, description || null, capacity || null, is_active ? 1 : 0, id]
    )

    // Get updated location
    const [location] = await executeQuery(
      'SELECT id, name as location_name, description, capacity, is_active, created_at, updated_at FROM study_locations WHERE id = ?',
      [id]
    )

    return NextResponse.json({ 
      success: true, 
      message: 'Location updated successfully',
      data: location 
    })
  } catch (error) {
    console.error('Error updating location:', error)
    return NextResponse.json({ error: error.message || 'Failed to update location' }, { status: 500 })
  }
}

// DELETE location
export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if location exists
    const [existing] = await executeQuery(
      'SELECT id FROM study_locations WHERE id = ?',
      [id]
    )

    if (!existing) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    // Delete location
    await executeQuery('DELETE FROM study_locations WHERE id = ?', [id])

    return NextResponse.json({ 
      success: true, 
      message: 'Location deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting location:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete location' }, { status: 500 })
  }
}
