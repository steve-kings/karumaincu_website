import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import BibleStudyService from '@/services/BibleStudyService'

// GET group settings
export async function GET(request) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await BibleStudyService.getGroupSettings()

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error fetching group settings:', error)
    return NextResponse.json({ error: 'Failed to fetch group settings' }, { status: 500 })
  }
}

// PUT update group settings
export async function PUT(request) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { members_per_group } = body

    if (!members_per_group || members_per_group < 1) {
      return NextResponse.json({ error: 'Invalid members_per_group value' }, { status: 400 })
    }

    const settings = await BibleStudyService.updateGroupSettings({ members_per_group })

    return NextResponse.json({ 
      success: true, 
      message: 'Group settings updated successfully',
      data: settings 
    })
  } catch (error) {
    console.error('Error updating group settings:', error)
    return NextResponse.json({ error: error.message || 'Failed to update group settings' }, { status: 500 })
  }
}
