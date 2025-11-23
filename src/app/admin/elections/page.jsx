'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

export default function AdminElectionsPage() {
  const router = useRouter()
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingElection, setEditingElection] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    max_nominations_per_member: 5
  })

  useEffect(() => {
    fetchElections()
  }, [])

  const fetchElections = async () => {
    try {
            const response = await fetch('/api/admin/elections', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setElections(data)
      }
    } catch (error) {
      console.error('Error fetching elections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
            const url = editingElection 
        ? `/api/admin/elections/${editingElection.id}`
        : '/api/admin/elections'
      
      const response = await fetch(url, {
        method: editingElection ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(editingElection ? 'Election updated successfully!' : 'Election created successfully as DRAFT!')
        setShowForm(false)
        setEditingElection(null)
        setFormData({
          title: '',
          description: '',
          start_date: '',
          end_date: '',
          max_nominations_per_member: 5
        })
        fetchElections()
      } else {
        const error = await response.json()
        alert(error.error || `Failed to ${editingElection ? 'update' : 'create'} election`)
      }
    } catch (error) {
      console.error(`Error ${editingElection ? 'updating' : 'creating'} election:`, error)
      alert(`Failed to ${editingElection ? 'update' : 'create'} election`)
    }
  }

  const editElection = (election) => {
    setEditingElection(election)
    setFormData({
      title: election.title,
      description: election.description || '',
      start_date: election.start_date.slice(0, 16), // Format for datetime-local
      end_date: election.end_date.slice(0, 16),
      max_nominations_per_member: election.max_nominations_per_member
    })
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingElection(null)
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      max_nominations_per_member: 5
    })
  }

  const updateStatus = async (id, status) => {
    if (!confirm(`Are you sure you want to ${status} this election?`)) return

    try {
            const response = await fetch(`/api/admin/elections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        alert(`Election ${status} successfully!`)
        fetchElections()
      }
    } catch (error) {
      console.error('Error updating election:', error)
    }
  }

  const deleteElection = async (id) => {
    if (!confirm('Are you sure? This will delete all nominations!')) return

    try {
            const response = await fetch(`/api/admin/elections/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        alert('Election deleted successfully!')
        fetchElections()
      }
    } catch (error) {
      console.error('Error deleting election:', error)
    }
  }

  const viewResults = (id) => {
    router.push(`/admin/elections/${id}/results`)
  }

  const managePositions = (id) => {
    router.push(`/admin/elections/${id}/positions`)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                Leader Elections
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage leadership nomination elections
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              + Create Election
            </button>
          </div>
        </div>

        {/* Create Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-gray-800">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                {editingElection ? 'Edit Election' : 'Create New Election'}
              </h3>
              {!editingElection && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    ℹ️ Election will be created as <strong>DRAFT</strong>. You can edit it and publish when ready.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                    placeholder="e.g., 2025/2026 Executive Committee Elections"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                    placeholder="Describe the election..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Nominations Per Member
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.max_nominations_per_member}
                    onChange={(e) => setFormData({...formData, max_nominations_per_member: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700"
                  >
                    {editingElection ? 'Update Election' : 'Create as Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Elections List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : elections.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <span className="text-6xl mb-4 block">🗳️</span>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No elections yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Create your first leadership election
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {elections.map((election) => (
              <div
                key={election.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-black dark:text-white">
                        {election.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        election.status === 'open'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : election.status === 'closed'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                      }`}>
                        {election.status.toUpperCase()}
                      </span>
                    </div>
                    {election.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {election.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                      <span>📅 {new Date(election.start_date).toLocaleDateString()} - {new Date(election.end_date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Max {election.max_nominations_per_member} nominations/member</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {election.status === 'draft' && (
                    <>
                      <button
                        onClick={() => editElection(election)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => managePositions(election.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                      >
                        📋 Add Positions
                      </button>
                      <button
                        onClick={() => updateStatus(election.id, 'open')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold"
                      >
                        ✅ Publish & Open
                      </button>
                    </>
                  )}
                  
                  {election.status === 'open' && (
                    <>
                      <button
                        onClick={() => managePositions(election.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                      >
                        📋 Manage Positions
                      </button>
                      <button
                        onClick={() => viewResults(election.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        📊 View Results
                      </button>
                      <button
                        onClick={() => updateStatus(election.id, 'closed')}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                      >
                        🔒 Close Election
                      </button>
                    </>
                  )}
                  
                  {election.status === 'closed' && (
                    <>
                      <button
                        onClick={() => viewResults(election.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        📊 View Results
                      </button>
                      <button
                        onClick={() => updateStatus(election.id, 'archived')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                      >
                        📦 Archive
                      </button>
                    </>
                  )}
                  
                  {election.status === 'archived' && (
                    <button
                      onClick={() => viewResults(election.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      📊 View Results
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteElection(election.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
