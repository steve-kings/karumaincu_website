'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MemberLayout from '@/components/MemberLayout'
import ImageUpload from '@/components/ImageUpload'

export default function MemberBlogsPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, pending: 0, total_views: 0 })
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: '',
    tags: '',
    status: 'draft'
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }

      // Fetch blogs
      const blogsResponse = await fetch(`/api/member/blogs?status=${filter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const blogsData = await blogsResponse.json()
      
      if (blogsData.success) {
        setBlogs(blogsData.blogs)
      }

      // Fetch categories
      const categoriesResponse = await fetch('/api/member/blogs/categories')
      const categoriesData = await categoriesResponse.json()
      
      if (categoriesData.success) {
        setCategories(categoriesData.categories)
      }

      // Fetch stats
      const statsResponse = await fetch('/api/member/blogs/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const statsData = await statsResponse.json()
      
      if (statsData.success) {
        setStats(statsData.stats)
      }

    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage({ type: 'error', text: 'Failed to load blogs' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage({ type: 'error', text: 'Title and content are required' })
      return
    }

    try {
      const token = localStorage.getItem('token')
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)

      const url = editingBlog 
        ? `/api/member/blogs/${editingBlog.id}`
        : '/api/member/blogs'
      
      const method = editingBlog ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          featured_image: formData.featured_image,
          category: formData.category,
          tags: tags,
          status: formData.status
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!' 
        })
        setShowCreateForm(false)
        setEditingBlog(null)
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          featured_image: '',
          category: '',
          tags: '',
          status: 'draft'
        })
        fetchData()
      } else {
        setMessage({ type: 'error', text: data.message || 'Operation failed' })
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      featured_image: blog.featured_image || '',
      category: blog.category || '',
      tags: blog.tags.join(', '),
      status: blog.status
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/member/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Blog deleted successfully' })
        fetchData()
      } else {
        setMessage({ type: 'error', text: data.message || 'Delete failed' })
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
      pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
      published: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
    }
    return badges[status] || badges.draft
  }

  return (
    <MemberLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Blogs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage your blog posts</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Blogs</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.total || 0}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <i className="fas fa-blog text-2xl text-purple-600 dark:text-purple-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Published</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.published || 0}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-2xl text-green-600 dark:text-green-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Drafts</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.draft || 0}</p>
              </div>
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                <i className="fas fa-file-alt text-2xl text-gray-600 dark:text-gray-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Views</p>
                <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.total_views || 0}</p>
              </div>
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                <i className="fas fa-eye text-2xl text-teal-600 dark:text-teal-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'published', label: 'Published', count: stats.published },
              { key: 'draft', label: 'Drafts', count: stats.draft },
              { key: 'pending', label: 'Pending', count: stats.pending }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-purple-600 dark:bg-purple-700 text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                }`}
              >
                {filterOption.label} ({filterOption.count || 0})
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setShowCreateForm(true)
              setEditingBlog(null)
              setFormData({
                title: '',
                content: '',
                excerpt: '',
                featured_image: '',
                category: '',
                tags: '',
                status: 'draft'
              })
            }}
            className="bg-gradient-to-r from-purple-600 to-teal-600 dark:from-purple-700 dark:to-teal-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Create New Blog
          </button>
        </div>

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingBlog(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Enter your blog title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Brief description of your blog post..."
                  />
                </div>

                <div>
                  <ImageUpload
                    value={formData.featured_image}
                    onChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                    label="Featured Image"
                    type="blogs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
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
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="faith, testimony, growth"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="pending">Submit for Review</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingBlog(null)
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 dark:from-purple-700 dark:to-teal-700 text-white rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all"
                  >
                    {editingBlog ? 'Update Blog' : 'Create Blog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blog List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-blog text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No blogs found</h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                {filter === 'all' 
                  ? 'Start by creating your first blog post' 
                  : `No ${filter} blogs at the moment`
                }
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-purple-600 dark:bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors inline-flex items-center"
              >
                <i className="fas fa-plus-circle mr-2"></i>
                Create Your First Blog
              </button>
            </div>
          ) : (
            blogs.map((blog) => (
              <div 
                key={blog.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800"
              >
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
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{blog.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(blog.status)}`}>
                          {blog.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        {blog.category_name && (
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: blog.category_color || '#8b5cf6'}}></span>
                            {blog.category_name}
                          </span>
                        )}
                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        <span>👁️ {blog.views || 0} views</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {blog.excerpt || blog.content.substring(0, 200) + '...'}
                  </p>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-sm inline-flex items-center"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-sm inline-flex items-center"
                    >
                      <i className="fas fa-trash-alt mr-2"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MemberLayout>
  )
}
