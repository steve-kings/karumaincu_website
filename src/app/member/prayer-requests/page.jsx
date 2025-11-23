'use client'

import { useState, useEffect } from 'react'
import MemberLayout from '@/components/MemberLayout'
import toast from 'react-hot-toast'

export default function PrayerRequestsPage() {
  const [prayers, setPrayers] = useState([])
  const [filter, setFilter] = useState('active')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    isPublic: true,
    isAnonymous: false
  })

  const categories = [
    { value: 'general', label: 'General', icon: 'fa-pray', color: 'purple' },
    { value: 'healing', label: 'Healing', icon: 'fa-heartbeat', color: 'red' },
    { value: 'guidance', label: 'Guidance', icon: 'fa-compass', color: 'blue' },
    { value: 'provision', label: 'Provision', icon: 'fa-hand-holding-heart', color: 'green' },
    { value: 'family', label: 'Family', icon: 'fa-home', color: 'amber' },
    { value: 'urgent', label: 'Urgent', icon: 'fa-exclamation-circle', color: 'red' }
  ]

  useEffect(() => {
    fetchPrayers()
  }, [filter])

  const fetchPrayers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/prayer-requests?status=${filter}`)
      const data = await response.json()
      setPrayers(data.prayers || [])
    } catch (error) {
      console.error('Error fetching prayers:', error)
      toast.error('Failed to load prayers')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
            const response = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Prayer request submitted!')
        setShowForm(false)
        setFormData({
          title: '',
          content: '',
          category: 'general',
          isPublic: true,
          isAnonymous: false
        })
        fetchPrayers()
      } else {
        toast.error(data.error || 'Failed to submit prayer')
      }
    } catch (error) {
      console.error('Error submitting prayer:', error)
      toast.error('An error occurred')
    }
  }

  const markAsAnswered = async (id) => {
    const testimony = prompt('How did God answer this prayer?')
    if (!testimony) return

    try {
            const response = await fetch(`/api/prayer-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'answered', testimony })
      })

      if (response.ok) {
        toast.success('Prayer marked as answered!')
        fetchPrayers()
      } else {
        toast.error('Failed to update prayer')
      }
    } catch (error) {
      console.error('Error updating prayer:', error)
      toast.error('An error occurred')
    }
  }

  const deletePrayer = async (id) => {
    if (!confirm('Are you sure you want to delete this prayer request?')) return

    try {
            const response = await fetch(`/api/prayer-requests/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Prayer deleted')
        fetchPrayers()
      } else {
        toast.error('Failed to delete prayer')
      }
    } catch (error) {
      console.error('Error deleting prayer:', error)
      toast.error('An error occurred')
    }
  }

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[0]
  }

  const stats = {
    total: prayers.length,
    active: prayers.filter(p => p.status === 'active').length,
    answered: prayers.filter(p => p.status === 'answered').length
  }

  return (
    <MemberLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <i className="fas fa-praying-hands text-3xl text-purple-600 dark:text-purple-400 mr-3"></i>
                <h1 className="text-3xl font-heading font-bold text-black dark:text-white">Prayer Requests</h1>
              </div>
              <p className="text-gray-600 dark:text-neutral-400">Share and pray for community needs</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all font-medium shadow-lg inline-flex items-center"
            >
              <i className="fas fa-plus-circle mr-2"></i>
              Submit Prayer
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-pray text-2xl text-purple-600 dark:text-purple-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Active Prayers</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-hands text-2xl text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Answered</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.answered}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 dark:bg-green-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-2xl text-green-600 dark:text-green-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: 'active', label: 'Active', count: stats.active },
            { key: 'answered', label: 'Answered', count: stats.answered },
            { key: 'all', label: 'All', count: stats.total }
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-neutral-950 text-gray-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-neutral-900 border border-gray-200 dark:border-neutral-900'
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>

        {/* Submit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-950 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-neutral-900">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-heading font-bold text-black dark:text-white">Submit Prayer Request</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                    <i className="fas fa-heading mr-2"></i>Prayer Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                    placeholder="Brief title for your prayer request..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                    <i className="fas fa-align-left mr-2"></i>Prayer Request
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={6}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white resize-none"
                    placeholder="Describe your prayer request..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                    <i className="fas fa-tags mr-2"></i>Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                      className="mr-3 w-4 h-4 text-purple-600"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-neutral-300">
                      <i className="fas fa-globe mr-2"></i>Make this prayer public (visible to all members)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                      className="mr-3 w-4 h-4 text-purple-600"
                    />
                    <label htmlFor="isAnonymous" className="text-sm text-gray-700 dark:text-neutral-300">
                      <i className="fas fa-user-secret mr-2"></i>Submit anonymously
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-lg hover:from-purple-700 hover:to-teal-700 transition-all font-medium"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>Submit Prayer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Prayer List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-neutral-400">Loading prayers...</p>
            </div>
          ) : prayers.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-950 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-900">
              <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-praying-hands text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-neutral-400 mb-2">No prayer requests</h3>
              <p className="text-gray-500 dark:text-neutral-500 mb-6">Be the first to submit a prayer request</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center"
              >
                <i className="fas fa-plus-circle mr-2"></i>Submit Prayer
              </button>
            </div>
          ) : (
            prayers.map((prayer) => {
              const categoryInfo = getCategoryInfo(prayer.category)
              const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
              const isOwner = currentUser.id === prayer.requester_id

              return (
                <div
                  key={prayer.id}
                  className={`bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border transition-all hover:shadow-xl ${
                    prayer.status === 'answered'
                      ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/10'
                      : 'border-gray-100 dark:border-neutral-900'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-heading font-bold text-black dark:text-white">{prayer.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          prayer.status === 'answered'
                            ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                        }`}>
                          {prayer.status === 'answered' ? '✓ Answered' : 'Active'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-neutral-400 mb-3">
                        <span className="flex items-center">
                          <i className={`fas ${categoryInfo.icon} mr-1`}></i>
                          {categoryInfo.label}
                        </span>
                        <span className="flex items-center">
                          <i className="fas fa-user mr-1"></i>
                          {prayer.requester_name}
                        </span>
                        <span>{new Date(prayer.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-neutral-300 mb-4 leading-relaxed">{prayer.content}</p>

                  {prayer.status === 'answered' && prayer.testimony && (
                    <div className="bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center">
                        <i className="fas fa-check-circle mr-2"></i>
                        Testimony:
                      </h4>
                      <p className="text-green-700 dark:text-green-300">{prayer.testimony}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        Answered on {new Date(prayer.answered_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm inline-flex items-center">
                      <i className="fas fa-hands-praying mr-2"></i>
                      I'm Praying
                    </button>
                    {isOwner && prayer.status === 'active' && (
                      <button
                        onClick={() => markAsAnswered(prayer.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm inline-flex items-center"
                      >
                        <i className="fas fa-check mr-2"></i>
                        Mark Answered
                      </button>
                    )}
                    {isOwner && (
                      <button
                        onClick={() => deletePrayer(prayer.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm inline-flex items-center"
                      >
                        <i className="fas fa-trash-alt mr-2"></i>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </MemberLayout>
  )
}
