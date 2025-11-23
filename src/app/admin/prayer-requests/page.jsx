'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPrayerRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all') // 'all', 'journal', 'public'

  useEffect(() => {
    checkAuth()
    fetchRequests()
  }, [])

  const checkAuth = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!token || user.role !== 'admin') {
      router.push('/login')
    }
  }

  const fetchRequests = async () => {
    try {
            // Use admin endpoint to get all prayers
      const response = await fetch('/api/admin/prayers', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const result = await response.json()
        // Handle both array and object responses
        const data = result.data || result
        setRequests(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching prayer requests:', error)
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status, testimony = null) => {
    try {
            const response = await fetch(`/api/prayer-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          status,
          testimony,
          answered_at: status === 'answered' ? new Date().toISOString() : null
        })
      })

      if (response.ok) {
        alert('Prayer request updated!')
        fetchRequests()
      }
    } catch (error) {
      console.error('Error updating prayer request:', error)
      alert('Failed to update prayer request')
    }
  }

  const deleteRequest = async (id) => {
    if (!confirm('Delete this prayer request? This action cannot be undone.')) return

    try {
            const response = await fetch(`/api/prayer-requests/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        alert('Prayer request deleted')
        fetchRequests()
      }
    } catch (error) {
      console.error('Error deleting prayer request:', error)
      alert('Failed to delete prayer request')
    }
  }

  const markAsAnswered = (request) => {
    const testimony = prompt('How was this prayer answered?', request.testimony || '')
    if (testimony) {
      updateStatus(request.id, 'answered', testimony)
    }
  }

  const filteredRequests = (Array.isArray(requests) ? requests : [])
    .filter(r => {
      // Filter by status
      if (filter === 'active') return r.status === 'active'
      if (filter === 'answered') return r.status === 'answered'
      return true
    })
    .filter(r => {
      // Filter by source
      if (sourceFilter === 'journal') return r.source_type === 'journal'
      if (sourceFilter === 'public') return r.source_type === 'public'
      return true
    })
    .filter(r => 
      r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.content?.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const requestsArray = Array.isArray(requests) ? requests : []
  
  const stats = {
    total: requestsArray.length,
    active: requestsArray.filter(r => r.status === 'active').length,
    answered: requestsArray.filter(r => r.status === 'answered').length,
    anonymous: requestsArray.filter(r => r.is_anonymous).length,
    journal: requestsArray.filter(r => r.source_type === 'journal').length,
    public: requestsArray.filter(r => r.source_type === 'public').length
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Prayer Requests Management</h1>
              <p className="text-gray-400">Review and manage community prayer requests</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
            >
              ← Back to Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-purple-400">{stats.total}</p>
              </div>
              <span className="text-3xl">🙏</span>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active</p>
                <p className="text-3xl font-bold text-blue-400">{stats.active}</p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Answered</p>
                <p className="text-3xl font-bold text-green-400">{stats.answered}</p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Anonymous</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.anonymous}</p>
              </div>
              <span className="text-3xl">🔒</span>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="space-y-4 mb-8">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'active'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setFilter('answered')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'answered'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Answered ({stats.answered})
            </button>
          </div>

          {/* Source Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400 self-center mr-2">Source:</span>
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-4 py-2 rounded-lg transition text-sm ${
                sourceFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Sources ({stats.total})
            </button>
            <button
              onClick={() => setSourceFilter('journal')}
              className={`px-4 py-2 rounded-lg transition text-sm ${
                sourceFilter === 'journal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              📖 Member Journals ({stats.journal})
            </button>
            <button
              onClick={() => setSourceFilter('public')}
              className={`px-4 py-2 rounded-lg transition text-sm ${
                sourceFilter === 'public'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              🌐 Public Requests ({stats.public})
            </button>
          </div>

          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search prayer requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Prayer Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading prayer requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
            <span className="text-6xl mb-4 block">🙏</span>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No prayer requests found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className={`bg-gray-900 rounded-2xl p-6 border transition-all hover:border-gray-700 ${
                  request.status === 'answered'
                    ? 'border-green-800'
                    : 'border-gray-800'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-white">{request.title}</h3>
                      
                      {/* Source Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.source_type === 'journal'
                          ? 'bg-purple-900/30 text-purple-300 border border-purple-800'
                          : 'bg-cyan-900/30 text-cyan-300 border border-cyan-800'
                      }`}>
                        {request.source_type === 'journal' ? '📖 Member Journal' : '🌐 Public Request'}
                      </span>
                      
                      {request.is_anonymous && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-300 border border-yellow-800">
                          🔒 Anonymous
                        </span>
                      )}
                      {request.category && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800">
                          {request.category}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'answered'
                          ? 'bg-green-900/30 text-green-300 border border-green-800'
                          : 'bg-blue-900/30 text-blue-300 border border-blue-800'
                      }`}>
                        {request.status === 'answered' ? '✓ Answered' : 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3 flex-wrap">
                      <span>
                        Submitted by: Anonymous
                      </span>
                      <span>•</span>
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      {request.is_private && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-400">🔒 Private</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 whitespace-pre-wrap">
                  {request.description || request.content}
                </p>

                {request.status === 'answered' && request.testimony && (
                  <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-green-300 mb-2">✓ Testimony:</h4>
                    <p className="text-green-200">{request.testimony}</p>
                    {request.answered_at && (
                      <p className="text-xs text-green-400 mt-2">
                        Answered on {new Date(request.answered_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  {request.status === 'active' && (
                    <button
                      onClick={() => markAsAnswered(request)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
                    >
                      Mark as Answered
                    </button>
                  )}
                  {request.status === 'answered' && (
                    <button
                      onClick={() => updateStatus(request.id, 'active')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                    >
                      Mark as Active
                    </button>
                  )}
                  <button
                    onClick={() => deleteRequest(request.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
