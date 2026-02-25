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
    const connection = await pool.getConnection();

    try {
      await connection.query(
        `UPDATE blogs 
         SET status = 'approved', 
             approved_by = ?, 
             approved_at = NOW(),
             published_at = NOW()
         WHERE id = ?`,
        [user.userId, id]
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
