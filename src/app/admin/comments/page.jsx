'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'

export default function CommentsManagementPage() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/comments', {
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

  const handleApprove = async (commentId) => {
    if (!confirm('Approve this comment?')) return

    try {
      const response = await fetch(`/api/admin/comments/${commentId}/approve`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        alert('Comment approved!')
        fetchComments()
      } else {
        alert('Failed to approve comment')
      }
    } catch (error) {
      console.error('Error approving comment:', error)
      alert('Failed to approve comment')
    }
  }

  const handleReject = async (commentId) => {
    if (!confirm('Reject this comment?')) return

    try {
      const response = await fetch(`/api/admin/comments/${commentId}/reject`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        alert('Comment rejected!')
        fetchComments()
      } else {
        alert('Failed to reject comment')
      }
    } catch (error) {
      console.error('Error rejecting comment:', error)
      alert('Failed to reject comment')
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <i className="fas fa-comments text-3xl text-emerald-600 dark:text-emerald-400 mr-3"></i>
            <h1 className="text-3xl font-heading font-bold text-black dark:text-white">
              Comment Moderation
            </h1>
          </div>
          <p className="text-gray-600 dark:text-neutral-400">
            Review and moderate blog comments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {comments.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-clock text-2xl text-yellow-600 dark:text-yellow-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-900">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-800">
            <h2 className="text-xl font-heading font-bold text-black dark:text-white">
              Pending Comments
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-emerald-600 dark:text-emerald-400 mb-4"></i>
                <p className="text-gray-600 dark:text-neutral-400">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-check-circle text-6xl text-green-300 dark:text-green-700 mb-4"></i>
                <p className="text-gray-600 dark:text-neutral-400 text-lg">
                  No pending comments
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-gray-200 dark:border-neutral-800 rounded-xl p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                  >
                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-black dark:text-white mb-1">
                          {comment.author_name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                          {comment.author_email}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-neutral-500 mt-1">
                          On: <span className="font-medium">{comment.blog_title}</span>
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-neutral-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Comment Content */}
                    <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 dark:text-neutral-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <i className="fas fa-check mr-2"></i>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(comment.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <i className="fas fa-times mr-2"></i>
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
