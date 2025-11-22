import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'editor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const connection = await pool.getConnection();

    try {
      // Get pending blogs count
      const [pendingBlogs] = await connection.query(
        'SELECT COUNT(*) as count FROM blogs WHERE status = ?',
        ['pending']
      );

      // Get active prayer requests count
      const [prayerRequests] = await connection.query(
        'SELECT COUNT(*) as count FROM user_prayer_requests WHERE status = ?',
        ['active']
      );

      // Get bible study registrations count
      const [bibleStudyRegs] = await connection.query(
        'SELECT COUNT(*) as count FROM bible_study_registrations WHERE status = ?',
        ['pending']
      );

      // Get recent activity
      const [recentBlogs] = await connection.query(
        'SELECT title, created_at FROM blogs WHERE status = ? ORDER BY created_at DESC LIMIT 5',
        ['pending']
      );

      const recentActivity = recentBlogs.map(blog => ({
        icon: '📝',
        title: 'New blog: ' + blog.title,
        time: new Date(blog.created_at).toLocaleDateString()
      }));

      connection.release();

      return NextResponse.json({
        pendingBlogs: pendingBlogs[0].count,
        prayerRequests: prayerRequests[0].count,
        bibleStudyRegistrations: bibleStudyRegs[0].count,
        recentActivity
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Editor stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
