'use client'

import { useState, useEffect } from 'react'
import { Image, Plus, Search, X, Trash2, ExternalLink, Eye } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'

export default function GalleryManagementPage() {
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingGallery, setEditingGallery] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    category: 'other',
    thumbnail_url: '',
    platform: 'other',
    is_active: true
  })

  const categories = [
    { value: 'worship', label: 'Worship' },
    { value: 'fellowship', label: 'Fellowship' },
    { value: 'outreach', label: 'Outreach' },
    { value: 'events', label: 'Events' },
    { value: 'conferences', label: 'Conferences' },
    { value: 'other', label: 'Other' }
  ]

  const platforms = [
    { value: 'google_photos', label: 'Google Photos' },
    { value: 'google_drive', label: 'Google Drive' },
    { value: 'dropbox', label: 'Dropbox' },
    { value: 'onedrive', label: 'OneDrive' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    fetchGalleries()
  }, [search, filterCategory])

  const fetchGalleries = async () => {
    try {
      setLoading(true)
            const params = new URLSearchParams()
      
      if (search) params.append('search', search)
      if (filterCategory !== 'all') params.append('category', filterCategory)

      const response = await fetch(`/api/admin/gallery?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setGalleries(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching galleries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
            const url = editingGallery 
        ? `/api/admin/gallery/${editingGallery.id}`
        : '/api/admin/gallery'
      
      const response = await fetch(url, {
        method: editingGallery ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingGallery(null)
        resetForm()
        fetchGalleries()
      }
    } catch (error) {
      console.error('Error saving gallery:', error)
    }
  }

  const handleEdit = (gallery) => {
    setEditingGallery(gallery)
    setFormData({
      title: gallery.title,
      description: gallery.description || '',
      url: gallery.url,
      category: gallery.category || 'other',
      thumbnail_url: gallery.thumbnail_url || '',
      platform: gallery.platform || 'other',
      is_active: gallery.is_active === 1
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return

    try {
            const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        fetchGalleries()
      }
    } catch (error) {
      console.error('Error deleting gallery:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      category: 'other',
      thumbnail_url: '',
      platform: 'other',
      is_active: true
    })
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      google_photos: 'fab fa-google',
      google_drive: 'fab fa-google-drive',
      dropbox: 'fab fa-dropbox',
      onedrive: 'fab fa-microsoft'
    }
    return icons[platform] || 'fas fa-cloud'
  }



  const stats = {
    total: galleries.length,
    active: galleries.filter(g => g.is_active === 1).length,
    categories: [...new Set(galleries.map(g => g.category))].length
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage photo galleries and media</p>
        </div>
        <button
          onClick={() => {
            setEditingGallery(null)
            resetForm()
            setShowModal(true)
          }}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Gallery</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Galleries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <Image className="w-10 h-10 text-pink-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Eye className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-blue-600">{stats.categories}</p>
            </div>
            <i className="fas fa-folder text-4xl text-blue-600"></i>
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
              placeholder="Search galleries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Galleries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading galleries...</p>
          </div>
        ) : galleries.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No galleries found</h3>
            <p className="text-gray-600 dark:text-gray-400">Add your first gallery to get started</p>
          </div>
        ) : (
          galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-pink-500 to-purple-600">
                {gallery.thumbnail_url ? (
                  <img 
                    src={gallery.thumbnail_url} 
                    alt={gallery.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div className={`w-full h-full ${gallery.thumbnail_url ? 'hidden' : 'flex'} items-center justify-center`}>
                  <img src="/logo.png" alt="KarUCU" className="w-24 h-24 object-contain" />
                </div>
                
                <div className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-1 rounded text-xs font-semibold capitalize">
                  {gallery.category}
                </div>
                
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold">
                  <i className={`${getPlatformIcon(gallery.platform)} mr-1`}></i>
                  {gallery.platform.replace('_', ' ')}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {gallery.title}
                </h3>
                
                {gallery.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {gallery.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{gallery.view_count || 0} views</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    gallery.is_active === 1
                      ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
                  }`}>
                    {gallery.is_active === 1 ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(gallery)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Edit
                  </button>
                  <a
                    href={gallery.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900 text-green-600 dark:text-green-400 px-3 py-2 rounded text-sm font-medium transition-colors text-center"
                  >
                    <ExternalLink className="w-4 h-4 inline mr-1" />
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(gallery.id)}
                    className="bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900 text-red-600 dark:text-red-400 px-3 py-2 rounded text-sm font-medium transition-colors"
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
                  {editingGallery ? 'Edit Gallery' : 'Add Gallery'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingGallery(null)
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
                    Gallery Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Sunday Worship - January 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Brief description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gallery URL * (Google Photos, Drive, etc.)
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="https://photos.google.com/share/..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Platform
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {platforms.map((platform) => (
                        <option key={platform.value} value={platform.value}>{platform.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <ImageUpload
                    label="Thumbnail Image"
                    value={formData.thumbnail_url}
                    onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                    type="gallery"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Active (visible to users)
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold"
                  >
                    {editingGallery ? 'Update Gallery' : 'Create Gallery'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingGallery(null)
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
