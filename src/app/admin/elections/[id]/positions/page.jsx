'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

export default function ManagePositionsPage() {
  const router = useRouter()
  const params = useParams()
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPosition, setEditingPosition] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    display_order: 0
  })

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
            const response = await fetch(`/api/admin/elections/${params.id}/positions`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setPositions(data)
      }
    } catch (error) {
      console.error('Error fetching positions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
            if (editingPosition) {
        // Update
        const response = await fetch(`/api/admin/elections/${params.id}/positions`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
          body: JSON.stringify({
            position_id: editingPosition.id,
            ...formData
          })
        })

        if (response.ok) {
          alert('Position updated!')
        }
      } else {
        // Create
        const response = await fetch(`/api/admin/elections/${params.id}/positions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
          body: JSON.stringify(formData)
        })

        if (response.ok) {
          alert('Position created!')
        }
      }

      setShowForm(false)
      setEditingPosition(null)
      setFormData({ title: '', description: '', display_order: 0 })
      fetchPositions()
    } catch (error) {
      console.error('Error saving position:', error)
      alert('Failed to save position')
    }
  }

  const deletePosition = async (positionId) => {
    if (!confirm('Delete this position?')) return

    try {
            const response = await fetch(`/api/admin/elections/${params.id}/positions?position_id=${positionId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        alert('Position deleted!')
        fetchPositions()
      }
    } catch (error) {
      console.error('Error deleting position:', error)
    }
  }

  const editPosition = (position) => {
    setEditingPosition(position)
    setFormData({
      title: position.title,
      description: position.description || '',
      display_order: position.display_order
    })
    setShowForm(true)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-purple-600 dark:text-purple-400 hover:underline mb-4"
          >
            ← Back to Elections
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                Manage Positions
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Add, edit, or delete leadership positions
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPosition(null)
                setFormData({ title: '', description: '', display_order: positions.length })
                setShowForm(true)
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              + Add Position
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl w-full">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                {editingPosition ? 'Edit Position' : 'Add Position'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                    placeholder="e.g., Chairperson"
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
                    placeholder="Brief description of the role..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingPosition ? 'Update' : 'Create'} Position
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingPosition(null)
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Positions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {positions.map((position) => (
              <div
                key={position.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-500 dark:text-gray-500 font-mono text-sm">
                      #{position.display_order}
                    </span>
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      {position.title}
                    </h3>
                  </div>
                  {position.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {position.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editPosition(position)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePosition(position.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {positions.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <span className="text-6xl mb-4 block">📋</span>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No positions yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Add positions for members to nominate
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
