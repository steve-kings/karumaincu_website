'use client'

import { useState, useEffect } from 'react'

export default function BlogComments({ blogId }) {
  const [user, setUser] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchComments()
    checkAuth()
  }, [blogId])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        cache: 'no-store',
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      // User not logged in - that's okay for public pages
      console.log('User not authenticated (optional for comments)')
    }
  }

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blogs/${blogId}/comments`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setComments(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!newComment.trim()) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: newComment,
          author_id: user?.id,
          author_name: user?.full_name,
          author_email: user?.email
        })
      })

      if (response.ok) {
        setNewComment('')
        alert('Comment posted successfully!')
        // Refresh comments to show the new one
        fetchComments()
      } else {
        alert('Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      setDeleting(commentId)
      const response = await fetch(`/api/blogs/${blogId}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()
      console.log('Delete response:', data)

      if (response.ok) {
        alert('Comment deleted successfully!')
        fetchComments()
      } else {
        alert(data.message || 'Failed to delete comment')
        console.error('Delete failed:', data)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment: ' + error.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="mt-12 border-t border-gray-200 dark:border-neutral-800 pt-8">
      <h3 className="text-2xl font-heading font-bold text-black dark:text-white mb-6">
        <i className="fas fa-comments text-emerald-600 dark:text-emerald-400 mr-2"></i>
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="bg-white dark:bg-neutral-950 rounded-xl border border-gray-200 dark:border-neutral-800 p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-black dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              disabled={submitting}
            />
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                <i className="fas fa-info-circle mr-1"></i>
                Your comment will appear immediately
              </p>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Post Comment
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl text-center">
          <i className="fas fa-sign-in-alt text-3xl text-blue-600 dark:text-blue-400 mb-3"></i>
          <p className="text-gray-700 dark:text-neutral-300 mb-3">
            Please log in to leave a comment
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>
            Log In
          </a>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <i className="fas fa-spinner fa-spin text-3xl text-emerald-600 dark:text-emerald-400"></i>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-neutral-900 rounded-xl">
          <i className="fas fa-comment-slash text-5xl text-gray-300 dark:text-neutral-700 mb-4"></i>
          <p className="text-gray-600 dark:text-neutral-400">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-neutral-950 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                      <i className="fas fa-user text-white"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black dark:text-white text-lg">
                        {comment.author_name || 'Anonymous'}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-neutral-400">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed ml-13">
                    {comment.content}
                  </p>
                </div>

                {/* Delete Button - Only show if user is the author */}
                {user && (user.id === comment.author_id || user.email === comment.author_email) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={deleting === comment.id}
                    className="flex-shrink-0 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete comment"
                  >
                    {deleting === comment.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
