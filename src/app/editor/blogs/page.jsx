'use client';

import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';

export default function EditorBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, [filter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/editor/blogs?status=' + filter, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (blogId) => {
    if (!confirm('Approve this blog post?')) return;

    try {
      const response = await fetch('/api/editor/blogs/' + blogId + '/approve', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        alert('Blog approved successfully!');
        fetchBlogs();
        setSelectedBlog(null);
      } else {
        alert('Failed to approve blog');
      }
    } catch (error) {
      console.error('Error approving blog:', error);
      alert('Failed to approve blog');
    }
  };

  const handleReject = async (blogId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const response = await fetch('/api/editor/blogs/' + blogId + '/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        alert('Blog rejected');
        fetchBlogs();
        setSelectedBlog(null);
      } else {
        alert('Failed to reject blog');
      }
    } catch (error) {
      console.error('Error rejecting blog:', error);
      alert('Failed to reject blog');
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Review Blogs</h1>
          <p className="text-gray-600 dark:text-neutral-400">Approve or reject blog submissions</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('pending')}
            className={'px-4 py-2 rounded-lg transition ' + (filter === 'pending' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-800')}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={'px-4 py-2 rounded-lg transition ' + (filter === 'approved' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-800')}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={'px-4 py-2 rounded-lg transition ' + (filter === 'rejected' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-800')}
          >
            Rejected
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
            <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-blog text-gray-400 dark:text-neutral-500 text-4xl"></i>
            </div>
            <p className="text-gray-600 dark:text-neutral-400">No blogs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{blog.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">
                      By {blog.author_name} • {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                    {blog.category && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                        {blog.category}
                      </span>
                    )}
                  </div>
                  <span className={'px-3 py-1 rounded-full text-xs font-medium ' + (blog.status === 'approved' ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300' : blog.status === 'rejected' ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300')}>
                    {blog.status}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-neutral-300 mb-4 line-clamp-3">{blog.excerpt}</p>

                {blog.rejection_reason && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-300">
                      <strong>Rejection Reason:</strong> {blog.rejection_reason}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="px-4 py-2 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
                  >
                    View Full
                  </button>
                  {blog.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(blog.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(blog.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Preview Modal */}
        {selectedBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-neutral-800">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedBlog.title}</h2>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  By {selectedBlog.author_name} • {new Date(selectedBlog.created_at).toLocaleDateString()}
                </p>
              </div>

              {selectedBlog.featured_image && (
                <img
                  src={selectedBlog.featured_image}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-gray-700 dark:text-neutral-300 whitespace-pre-wrap">{selectedBlog.content}</p>
              </div>

              {selectedBlog.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
                  <button
                    onClick={() => handleApprove(selectedBlog.id)}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedBlog.id)}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </EditorLayout>
  );
}
