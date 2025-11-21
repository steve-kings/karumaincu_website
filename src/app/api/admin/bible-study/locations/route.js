import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const is_active = searchParams.get('is_active')

    let query = 'SELECT id, name as location_name, description, capacity, is_active, created_at, updated_at FROM study_locations WHERE 1=1'
    const params = []

    if (is_active !== null && is_active !== undefined) {
      query += ' AND is_active = ?'
      params.push(is_active === 'true' ? 1 : 0)
    }

    query += ' ORDER BY name ASC'

    console.log('[API] Fetching locations with query:', query)
    const locations = await executeQuery(query, params)
    console.log('[API] Locations retrieved:', locations ? locations.length : 0)

    return NextResponse.json({ success: true, data: locations || [] })
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { location_name, description, capacity, is_active } = body

    if (!location_name) {
      return NextResponse.json({ error: 'Location name is required' }, { status: 400 })
    }

    console.log('[API] Creating location:', { location_name, is_active })

    const result = await executeQuery(
      `INSERT INTO study_locations (name, description, capacity, is_active) 
       VALUES (?, ?, ?, ?)`,
      [location_name, description || null, capacity || null, is_active !== false ? 1 : 0]
    )

    const [location] = await executeQuery(
      'SELECT * FROM study_locations WHERE id = ?',
      [result.insertId]
    )

    console.log('[API] Location created:', location)

    return NextResponse.json({ success: true, data: location }, { status: 201 })
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}