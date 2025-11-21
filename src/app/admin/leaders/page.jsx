'use client'

import { useState, useEffect } from 'react'
import { UserCheck, Plus, Search, X, Trash2, User } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'

export default function LeaderManagementPage() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingLeader, setEditingLeader] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    photo_url: '',
    email: '',
    phone: '',
    display_order: 0,
    status: 'active'
  })

  useEffect(() => {
    fetchLeaders()
  }, [search])

  const fetchLeaders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/leaders?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setLeaders(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching leaders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = editingLeader 
        ? `/api/admin/leaders/${editingLeader.id}`
        : '/api/admin/leaders'
      
      const response = await fetch(url, {
        method: editingLeader ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingLeader(null)
        resetForm()
        fetchLeaders()
      }
    } catch (error) {
      console.error('Error saving leader:', error)
    }
  }

  const handleEdit = (leader) => {
    setEditingLeader(leader)
    setFormData({
      name: leader.full_name || leader.name,
      position: leader.position || '',
      bio: leader.bio || '',
      photo_url: leader.photo_url || leader.image_url || '',
      email: leader.email || '',
      phone: leader.phone || '',
      display_order: leader.display_order || 0,
      status: leader.status || 'active'
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this leader?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/leaders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchLeaders()
      }
    } catch (error) {
      console.error('Error deleting leader:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      bio: '',
      photo_url: '',
      email: '',
      phone: '',
      display_order: 0,
      status: 'active'
    })
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leader Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage leadership information</p>
        </div>
        <button
          onClick={() => {
            setEditingLeader(null)
            resetForm()
            setShowModal(true)
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Leader</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Leaders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{leaders.length}</p>
            </div>
            <UserCheck className="w-10 h-10 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search leaders by name or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Leaders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading leaders...</p>
          </div>
        ) : leaders.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No leaders found</h3>
            <p className="text-gray-600 dark:text-gray-400">Add your first leader to get started</p>
          </div>
        ) : (
          leaders.map((leader) => (
            <div key={leader.id} className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                {(leader.photo_url || leader.image_url) ? (
                  <img src={leader.photo_url || leader.image_url} alt={leader.full_name || leader.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-20 h-20 text-white opacity-50" />
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{leader.full_name || leader.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-3">{leader.position}</p>
                
                {leader.bio && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {leader.bio}
                  </p>
                )}

                {(leader.email || leader.phone) && (
                  <div className="space-y-1 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    {leader.email && (
                      <div className="flex items-center">
                        <i className="fas fa-envelope w-5 mr-2"></i>
                        {leader.email}
                      </div>
                    )}
                    {leader.phone && (
                      <div className="flex items-center">
                        <i className="fas fa-phone w-5 mr-2"></i>
                        {leader.phone}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-neutral-800">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Order: {leader.display_order}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(leader)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(leader.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                  {editingLeader ? 'Edit Leader' : 'Add Leader'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingLeader(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Leader name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Position *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Senior Pastor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Brief biography..."
                  />
                </div>

                <ImageUpload
                  label="Leader Photo"
                  value={formData.photo_url}
                  onChange={(url) => setFormData({ ...formData, photo_url: url })}
                  type="leaders"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+254 700 000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Lower numbers appear first
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
                  >
                    {editingLeader ? 'Update Leader' : 'Add Leader'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingLeader(null)
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
