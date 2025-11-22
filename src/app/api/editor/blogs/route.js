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
