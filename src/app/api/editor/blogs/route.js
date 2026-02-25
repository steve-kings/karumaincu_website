import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    
    if (!user || (user.role !== 'editor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const connection = await pool.getConnection();

    try {
      const [blogs] = await connection.query(
        `SELECT b.*, u.full_name as author_name 
         FROM blogs b 
         JOIN users u ON b.author_id = u.id 
         WHERE b.status = ? 
         ORDER BY b.created_at DESC`,
        [status]
      );

      connection.release();
      return NextResponse.json(blogs);

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Editor blogs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
