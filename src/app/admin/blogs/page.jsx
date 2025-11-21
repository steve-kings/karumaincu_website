'use client'

import { useState, useEffect } from 'react'
import { FileText, Search, Check, X, Star, Trash2, Eye, Plus } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'

export default function BlogModerationPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: '',
    tags: '',
    status: 'approved'
  })

  useEffect(() => {
    fetchBlogs()
  }, [filterStatus, search])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/blogs?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setBlogs(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'approved' })
      })

      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error approving blog:', error)
    }
  }

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected', rejection_reason: reason })
      })

      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error rejecting blog:', error)
    }
  }

  const handleCreateBlog = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          tags
        })
      })

      if (response.ok) {
        setShowCreateModal(false)
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          featured_image: '',
          category: '',
          tags: '',
          status: 'approved'
        })
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: !currentFeatured })
      })

      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchBlogs()
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
    return styles[status] || styles.draft
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateText = (text, maxLength = 150) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const stats = {
    total: blogs.length,
    pending: blogs.filter(b => b.status === 'pending').length,
    approved: blogs.filter(b => b.status === 'approved').length,
    featured: blogs.filter(b => b.featured).length
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Moderation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review and approve blog posts</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Blog</span>
          </button>
          <a
            href="/admin/blog-categories"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <i className="fas fa-folder"></i>
            <span>Manage Categories</span>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <i className="fas fa-clock text-4xl text-yellow-600"></i>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <Check className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Featured</p>
              <p className="text-2xl font-bold text-purple-600">{stats.featured}</p>
            </div>
            <Star className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Blogs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-950 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-950 rounded-lg shadow-lg">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No blogs found</h3>
            <p className="text-gray-600 dark:text-gray-400">No blog posts match your filters</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 overflow-hidden">
              {/* Featured Image */}
              {blog.featured_image && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={blog.featured_image} 
                    alt={blog.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{blog.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(blog.status)}`}>
                        {blog.status}
                      </span>
                      {blog.featured && (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {truncateText(blog.content)}
                    </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      <i className="fas fa-user mr-1"></i>
                      {blog.author_name || 'Unknown'}
                    </span>
                    <span>
                      <i className="fas fa-calendar mr-1"></i>
                      {formatDate(blog.created_at)}
                    </span>
                    {blog.category && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400 rounded text-xs">
                        {blog.category}
                      </span>
                    )}
                  </div>

                    {blog.status === 'rejected' && blog.rejection_reason && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-400">
                          <strong>Rejection Reason:</strong> {blog.rejection_reason}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedBlog(blog)
                      setShowModal(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  {blog.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(blog.id)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(blog.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {blog.status === 'approved' && (
                    <button
                      onClick={() => handleToggleFeatured(blog.id, blog.featured)}
                      className={`p-2 rounded-lg ${
                        blog.featured
                          ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
                          : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                      }`}
                      title={blog.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  )}

                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-950 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Featured Image */}
            {selectedBlog.featured_image && (
              <div className="w-full h-64 overflow-hidden rounded-t-lg">
                <img 
                  src={selectedBlog.featured_image} 
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedBlog.title}</h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedBlog(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>By {selectedBlog.author_name || 'Unknown'}</span>
                  <span>•</span>
                  <span>{formatDate(selectedBlog.created_at)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedBlog.status)}`}>
                    {selectedBlog.status}
                  </span>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedBlog.content}
                  </p>
                </div>

                {selectedBlog.status === 'pending' && (
                  <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
                    <button
                      onClick={() => {
                        handleApprove(selectedBlog.id)
                        setShowModal(false)
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedBlog.id)
                        setShowModal(false)
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Blog Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-950 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Blog</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateBlog} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter blog title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="e.g., Testimony, Teaching"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Brief description of the blog post..."
                  />
                </div>

                <div>
                  <ImageUpload
                    value={formData.featured_image}
                    onChange={(url) => setFormData({ ...formData, featured_image: url })}
                    label="Featured Image"
                    type="blogs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Write your blog content here..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="faith, testimony, growth"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="approved">Approved & Publish</option>
                      <option value="pending">Pending Review</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 dark:from-purple-700 dark:to-teal-700 text-white rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all"
                  >
                    Create Blog
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
