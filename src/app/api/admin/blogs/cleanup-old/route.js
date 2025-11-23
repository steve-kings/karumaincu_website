import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

/**
 * Admin API endpoint to cleanup old blog posts
 * DELETE /api/admin/blogs/cleanup-old
 * Deletes approved blogs older than 2 months
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

    // Calculate date 2 months ago
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
    const cutoffDate = twoMonthsAgo.toISOString().split('T')[0]

    // Count blogs to be deleted
    const [countResult] = await executeQuery(
      `SELECT COUNT(*) as count FROM blogs 
       WHERE status = 'approved' 
       AND created_at < ?`,
      [cutoffDate]
    )

    const blogsToDelete = countResult.count

    if (blogsToDelete === 0) {
      return NextResponse.json({
        success: true,
        message: 'No old blogs to delete',
        deleted: 0,
        cutoffDate
      })
    }

    // Create archive table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS blogs_archive (
        id INT PRIMARY KEY,
        title VARCHAR(255),
        content LONGTEXT,
        author_id INT,
        category VARCHAR(100),
        status VARCHAR(50),
        created_at TIMESTAMP,
        archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deletion_reason VARCHAR(255) DEFAULT 'Automatic cleanup - 2+ months old'
      )
    `)

    // Archive blogs before deletion
    await executeQuery(`
      INSERT INTO blogs_archive (id, title, content, author_id, category, status, created_at)
      SELECT id, title, content, author_id, category, status, created_at
      FROM blogs
      WHERE status = 'approved' 
      AND created_at < ?
      AND id NOT IN (SELECT id FROM blogs_archive)
    `, [cutoffDate])

    // Delete old blogs
    const result = await executeQuery(
      `DELETE FROM blogs 
       WHERE status = 'approved' 
       AND created_at < ?`,
      [cutoffDate]
    )

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.affectedRows} old blogs`,
      deleted: result.affectedRows,
      archived: true,
      cutoffDate
    })

  } catch (error) {
    console.error('Error cleaning up old blogs:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to cleanup old blogs'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
