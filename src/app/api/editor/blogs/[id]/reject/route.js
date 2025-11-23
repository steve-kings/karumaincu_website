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

    const { id } = await params;
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.query(
        `UPDATE blogs 
         SET status = 'rejected', 
             rejection_reason = ?
         WHERE id = ?`,
        [reason, id]
      );

      connection.release();
      return NextResponse.json({ message: 'Blog rejected' });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Reject blog error:', error);
    return NextResponse.json(
      { error: 'Failed to reject blog' },
      { status: 500 }
    );
  }
}
