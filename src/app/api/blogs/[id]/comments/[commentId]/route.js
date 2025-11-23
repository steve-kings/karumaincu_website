import { NextResponse } from 'next/server'
import getPool from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// DELETE - Delete a comment (only by author)
export async function DELETE(request, { params }) {
  try {
    const { commentId } = await params
    const pool = getPool()
    
    console.log('Delete comment request:', { commentId })
    
    // Try both cookie names (token and auth_token)
    const token = request.cookies.get('token')?.value || request.cookies.get('auth_token')?.value
    
    if (!token) {
      console.log('No auth token found in cookies')
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      console.log('Invalid token')
      return NextResponse.json(
        { success: false, message: 'Invalid token - Please log in again' },
        { status: 401 }
      )
    }

    console.log('User attempting delete:', { userId: decoded.id, email: decoded.email })

    // Get the comment to verify ownership
    const [comments] = await pool.query(
      'SELECT * FROM blog_comments WHERE id = ?',
      [commentId]
    )

    if (comments.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      )
    }

    const comment = comments[0]
    
    console.log('Comment ownership check:', {
      commentAuthorId: comment.author_id,
      commentAuthorEmail: comment.author_email,
      userIdFromToken: decoded.id,
      userEmailFromToken: decoded.email
    })

    // Check if user is the author (check both ID and email)
    const isAuthor = 
      (comment.author_id && comment.author_id === decoded.id) ||
      (comment.author_email && comment.author_email === decoded.email)
    
    if (!isAuthor) {
      console.log('User is not the author of this comment')
      return NextResponse.json(
        { success: false, message: 'You can only delete your own comments' },
        { status: 403 }
      )
    }

    // Delete the comment
    await pool.query('DELETE FROM blog_comments WHERE id = ?', [commentId])
    
    console.log('Comment deleted successfully:', commentId)

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
