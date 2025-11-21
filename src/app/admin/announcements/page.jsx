'use client'

import { useState, useEffect } from 'react'
import { Megaphone, Plus, Search, X, AlertCircle, Trash2 } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'

export default function AnnouncementManagementPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    category: 'general',
    expires_at: '',
    featured_image: '',
    status: 'published'
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [search])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/announcements?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = editingAnnouncement 
        ? `/api/admin/announcements/${editingAnnouncement.id}`
        : '/api/admin/announcements'
      
      const response = await fetch(url, {
        method: editingAnnouncement ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingAnnouncement(null)
        resetForm()
        fetchAnnouncements()
      }
    } catch (error) {
      console.error('Error saving announcement:', error)
    }
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content || '',
      priority: announcement.priority || 'medium',
      expires_at: announcement.expires_at?.split('T')[0] || '',
      status: announcement.status || 'published'
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchAnnouncements()
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      expires_at: '',
      status: 'published'
    })
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
    }
    return styles[priority] || styles.medium
  }

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return <AlertCircle className="w-5 h-5 text-red-600" />
    if (priority === 'medium') return <AlertCircle className="w-5 h-5 text-yellow-600" />
    return <AlertCircle className="w-5 h-5 text-blue-600" />
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const stats = {
    total: announcements.length,
    active: announcements.filter(a => a.status === 'published' && !isExpired(a.expires_at)).length,
    high: announcements.filter(a => a.priority === 'high').length
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcement Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage announcements</p>
        </div>
        <button
          onClick={() => {
            setEditingAnnouncement(null)
            resetForm()
            setShowModal(true)
          }}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <Megaphone className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <i className="fas fa-check-circle text-4xl text-green-600"></i>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.high}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-950 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-950 rounded-lg shadow-lg">
            <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No announcements found</h3>
            <p className="text-gray-600 dark:text-gray-400">Create your first announcement</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getPriorityIcon(announcement.priority)}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{announcement.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityBadge(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                    {isExpired(announcement.expires_at) && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                        Expired
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-wrap">
                    {announcement.content}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      <i className="fas fa-calendar mr-1"></i>
                      Created: {formatDate(announcement.created_at)}
                    </span>
                    {announcement.expires_at && (
                      <span>
                        <i className="fas fa-clock mr-1"></i>
                        Expires: {formatDate(announcement.expires_at)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-950 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingAnnouncement(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Announcement title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Announcement content..."
                  />
                </div>

                <ImageUpload
                  label="Featured Image"
                  value={formData.featured_image}
                  onChange={(url) => setFormData({ ...formData, featured_image: url })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expires At
                    </label>
                    <input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold"
                  >
                    {editingAnnouncement ? 'Update' : 'Create'} Announcement
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingAnnouncement(null)
                      resetForm()
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold"
                  >
                    Cancel
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
