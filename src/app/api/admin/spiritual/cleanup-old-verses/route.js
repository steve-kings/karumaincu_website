import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Admin API endpoint to cleanup old verse of the day entries
 * DELETE /api/admin/spiritual/cleanup-old-verses
 * Deletes verses older than 30 days
 */
export async function DELETE(request) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    
    if (!authResult.authenticated) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const userRole = authResult.user.role?.trim().toLowerCase()
    if (userRole !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Admin access required'
      }, { status: 403 })
    }

    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0]

    // Count verses to be deleted
    const [countResult] = await executeQuery(
      'SELECT COUNT(*) as count FROM verse_of_day WHERE date < ?',
      [cutoffDate]
    )

    const versesToDelete = countResult.count

    if (versesToDelete === 0) {
      return NextResponse.json({
        success: true,
        message: 'No old verses to delete',
        deleted: 0,
        cutoffDate
      })
    }

    // Delete old verses
    const result = await executeQuery(
      'DELETE FROM verse_of_day WHERE date < ?',
      [cutoffDate]
    )

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.affectedRows} old verses`,
      deleted: result.affectedRows,
      cutoffDate
    })

  } catch (error) {
    console.error('Error cleaning up old verses:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to cleanup old verses'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
