import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || (decoded.role !== 'editor' && decoded.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    const connection = await pool.getConnection();

    try {
      await connection.query(
        `UPDATE blogs 
         SET status = 'approved', 
             approved_by = ?, 
             approved_at = NOW(),
             published_at = NOW()
         WHERE id = ?`,
        [decoded.userId, id]
      );

      connection.release();
      return NextResponse.json({ message: 'Blog approved successfully' });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Approve blog error:', error);
    return NextResponse.json(
      { error: 'Failed to approve blog' },
      { status: 500 }
    );
  }
}
