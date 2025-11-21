import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    
    console.log('Admin stats - User:', user)
    
    if (!user || user.role !== 'admin') {
      console.log('Admin stats - Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user stats
    const userStatsResult = await executeQuery(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE()) 
            AND YEAR(created_at) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) as new_users_this_month
      FROM users
    `)
    const userStats = userStatsResult[0]

    // Get event stats
    const eventStatsResult = await executeQuery(`
      SELECT 
        COUNT(*) as total_events,
        SUM(CASE WHEN event_date >= CURRENT_DATE() THEN 1 ELSE 0 END) as upcoming_events
      FROM events
      WHERE status != 'cancelled'
    `)
    const eventStats = eventStatsResult[0] || { total_events: 0, upcoming_events: 0 }

    // Get blog stats
    const blogStatsResult = await executeQuery(`
      SELECT 
        COUNT(*) as total_blogs,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_blogs
      FROM blogs
    `)
    const blogStats = blogStatsResult[0] || { total_blogs: 0, pending_blogs: 0 }

    // Get prayer stats
    const prayerStatsResult = await executeQuery(`
      SELECT 
        COUNT(*) as total_prayers,
        SUM(CASE WHEN status = 'answered' THEN 1 ELSE 0 END) as answered_prayers
      FROM prayer_requests
    `)
    const prayerStats = prayerStatsResult[0] || { total_prayers: 0, answered_prayers: 0 }

    // Get sermon stats
    const sermonStatsResult = await executeQuery(`
      SELECT COUNT(*) as total_sermons
      FROM sermons
      WHERE status = 'published'
    `)
    const sermonStats = sermonStatsResult[0] || { total_sermons: 0 }

    // Get announcement stats
    const announcementStatsResult = await executeQuery(`
      SELECT 
        COUNT(*) as total_announcements,
        SUM(CASE WHEN status = 'published' 
            AND (expires_at IS NULL OR expires_at >= CURRENT_DATE()) THEN 1 ELSE 0 END) as active_announcements
      FROM announcements
    `)
    const announcementStats = announcementStatsResult[0] || { total_announcements: 0, active_announcements: 0 }

    // Get recent activity
    const recentActivity = await executeQuery(`
      SELECT 
        'user' as type,
        CONCAT('New user: ', full_name) as action,
        CONCAT(full_name, ' joined as ', member_type) as details,
        created_at as timestamp
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      UNION ALL
      
      SELECT 
        'blog' as type,
        'Blog post submitted' as action,
        title as details,
        created_at as timestamp
      FROM blogs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      UNION ALL
      
      SELECT 
        'event' as type,
        'Event created' as action,
        title as details,
        created_at as timestamp
      FROM events
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      UNION ALL
      
      SELECT 
        'prayer' as type,
        'Prayer request' as action,
        title as details,
        created_at as timestamp
      FROM prayer_requests
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      ORDER BY timestamp DESC
      LIMIT 10
    `)

    const response = {
      users: {
        total: parseInt(userStats.total_users) || 0,
        active: parseInt(userStats.active_users) || 0,
        newThisMonth: parseInt(userStats.new_users_this_month) || 0
      },
      events: {
        total: parseInt(eventStats.total_events) || 0,
        upcoming: parseInt(eventStats.upcoming_events) || 0
      },
      blogs: {
        total: parseInt(blogStats.total_blogs) || 0,
        pending: parseInt(blogStats.pending_blogs) || 0
      },
      prayers: {
        total: parseInt(prayerStats.total_prayers) || 0,
        answered: parseInt(prayerStats.answered_prayers) || 0
      },
      sermons: {
        total: parseInt(sermonStats.total_sermons) || 0
      },
      announcements: {
        total: parseInt(announcementStats.total_announcements) || 0,
        active: parseInt(announcementStats.active_announcements) || 0
      },
      recentActivity
    }

    console.log('Admin stats response:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
