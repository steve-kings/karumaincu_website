import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const user = await verifyAuth(request);
    
    if (!user || (user.role !== 'editor' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
