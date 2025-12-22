'use client'

import { useState, useEffect } from 'react'
import MemberLayout from '@/components/MemberLayout'

export default function PrayerJournalPage() {
  const [prayers, setPrayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPrayer, setEditingPrayer] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal'
  })

  useEffect(() => {
    fetchPrayers()
  }, [])

  const fetchPrayers = async () => {
    try {
      const response = await fetch('/api/member/prayers', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setPrayers(data)
      }
    } catch (error) {
      console.error('Error fetching prayers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingPrayer 
        ? `/api/member/prayers/${editingPrayer.id}`
        : '/api/member/prayers'
      
      const response = await fetch(url, {
        method: editingPrayer ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(editingPrayer ? 'Prayer updated!' : 'Prayer added!')
        setShowForm(false)
        setEditingPrayer(null)
        setFormData({ title: '', content: '', category: 'personal' })
        fetchPrayers()
      }
    } catch (error) {
      console.error('Error saving prayer:', error)
      alert('Failed to save prayer')
    }
  }

  const handleEdit = (prayer) => {
    setEditingPrayer(prayer)
    setFormData({
      title: prayer.title,
      content: prayer.content,
      category: prayer.category
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this prayer?')) return

    try {
      const response = await fetch(`/api/member/prayers/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        alert('Prayer deleted')
        fetchPrayers()
      }
    } catch (error) {
      console.error('Error deleting prayer:', error)
    }
  }

  const markAsAnswered = async (id) => {
    const answer = prompt('How was this prayer answered?')
    if (!answer) return

    try {
      const response = await fetch(`/api/member/prayers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          status: 'answered',
          answer_description: answer
        })
      })

      if (response.ok) {
        alert('Prayer marked as answered!')
        fetchPrayers()
      }
    } catch (error) {
      console.error('Error updating prayer:', error)
      alert('Failed to mark prayer as answered')
    }
  }

  const filteredPrayers = (prayers || [])
    .filter(p => {
      if (filter === 'answered') return p.status === 'answered'
      if (filter === 'active') return p.status === 'active'
      return true
    })
    .filter(p => 
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content?.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Prayer Journal</h1>
              <p className="text-gray-600 dark:text-neutral-400">Your personal prayer life tracker</p>
            </div>
            <button
              onClick={() => {
                setEditingPrayer(null)
                setFormData({ title: '', content: '', category: 'personal' })
                setShowForm(true)
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
            >
              + Add Prayer
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Total Prayers</p>
                <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-praying-hands text-2xl text-pink-600 dark:text-pink-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Active</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏳</span>
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
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white dark:bg-neutral-950 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-900'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'active'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white dark:bg-neutral-950 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-900'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setFilter('answered')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'answered'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white dark:bg-neutral-950 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-900'
              }`}
            >
              Answered ({stats.answered})
            </button>
          </div>

          <input
            type="text"
            placeholder="Search prayers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-950 rounded-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-neutral-900">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                {editingPrayer ? 'Edit Prayer' : 'Add Prayer'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Prayer title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Prayer
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={6}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    placeholder="Write your prayer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="personal">Personal</option>
                    <option value="family">Family</option>
                    <option value="health">Health</option>
                    <option value="work">Work</option>
                    <option value="spiritual">Spiritual Growth</option>
                    <option value="thanksgiving">Thanksgiving</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                  >
                    {editingPrayer ? 'Update' : 'Add'} Prayer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingPrayer(null)
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-900 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Prayers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-neutral-400">Loading prayers...</p>
          </div>
        ) : filteredPrayers.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-950 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-900">
            <i className="fas fa-praying-hands text-6xl mb-4 block text-gray-400 dark:text-neutral-600"></i>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-neutral-400 mb-2">No prayers yet</h3>
            <p className="text-gray-500 dark:text-neutral-500 mb-6">Start your prayer journal today</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
            >
              Add Your First Prayer
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPrayers.map((prayer) => (
              <div
                key={prayer.id}
                className={`bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border transition-all hover:shadow-xl ${
                  prayer.status === 'answered'
                    ? 'border-green-200 dark:border-green-900'
                    : 'border-gray-100 dark:border-neutral-900'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-black dark:text-white">{prayer.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        prayer.status === 'answered'
                          ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                      }`}>
                        {prayer.category}
                      </span>
                      {prayer.status === 'answered' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300">
                          ✓ Answered
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      {new Date(prayer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-neutral-300 mb-4 whitespace-pre-wrap">{prayer.content}</p>

                {prayer.status === 'answered' && prayer.testimony && (
                  <div className="bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      ✓ Answer:
                    </h4>
                    <p className="text-green-700 dark:text-green-300">{prayer.testimony}</p>
                    {prayer.answered_at && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        Answered on {new Date(prayer.answered_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  {prayer.status !== 'answered' && (
                    <button
                      onClick={() => markAsAnswered(prayer.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      Mark as Answered
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(prayer)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prayer.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  )
}
