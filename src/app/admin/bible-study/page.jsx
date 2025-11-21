'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { BookOpen, Users, MapPin, Calendar, Download, Plus, Edit, Trash2, Eye, X } from 'lucide-react'

export default function BibleStudyAdmin() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('sessions')
  const [loading, setLoading] = useState(true)
  
  // Sessions
  const [sessions, setSessions] = useState([])
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [editingSession, setEditingSession] = useState(null)
  
  // Locations
  const [locations, setLocations] = useState([])
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  
  // Registrations
  const [registrations, setRegistrations] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [filterLocation, setFilterLocation] = useState('')
  const [filterGroup, setFilterGroup] = useState('')

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [activeTab])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.error('No token found in localStorage')
        alert('Session expired. Please login again.')
        router.push('/login')
        return
      }
      
      if (activeTab === 'sessions') {
        console.log('Fetching sessions with token:', token ? 'Token exists' : 'No token')
        const res = await fetch('/api/admin/bible-study/sessions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        console.log('Sessions API response status:', res.status)
        
        if (!res.ok) {
          const errorData = await res.json()
          console.error('Failed to fetch sessions:', res.status, errorData)
          if (res.status === 401) {
            alert('Session expired. Please login again.')
            router.push('/login')
          }
          return
        }
        
        const data = await res.json()
        console.log('Sessions fetched successfully:', data)
        console.log('Number of sessions:', data.data ? data.data.length : 0)
        console.log('Sessions array:', data.data)
        setSessions(data.data || [])
      } else if (activeTab === 'locations') {
        const res = await fetch('/api/admin/bible-study/locations', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setLocations(data.data || [])
        }
      } else if (activeTab === 'registrations') {
        if (selectedSession) {
          console.log('[Frontend] Fetching registrations for session:', selectedSession)
          const res = await fetch(`/api/admin/bible-study/registrations?session_id=${selectedSession}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          console.log('[Frontend] Registrations API response status:', res.status)
          if (res.ok) {
            const data = await res.json()
            console.log('[Frontend] Registrations data:', data)
            console.log('[Frontend] Number of registrations:', data.data ? data.data.length : 0)
            setRegistrations(data.data || [])
          } else {
            const errorData = await res.json()
            console.error('[Frontend] Failed to fetch registrations:', errorData)
            setRegistrations([])
          }
        } else {
          console.log('[Frontend] No session selected, clearing registrations')
          setRegistrations([])
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Error loading data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (selectedSession) params.append('session_id', selectedSession)
      if (filterLocation) params.append('location_id', filterLocation)
      if (filterGroup) params.append('group_number', filterGroup)

      const res = await fetch(`/api/admin/bible-study/export?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bible-study-registrations-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting:', error)
      alert('Failed to export data')
    }
  }

  const handleAutoAssignGroups = async () => {
    if (!selectedSession) {
      alert('Please select a session first')
      return
    }

    const membersPerGroup = prompt('How many members per group?', '10')
    if (!membersPerGroup) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/admin/bible-study/registrations/assign-groups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: selectedSession,
          location_id: filterLocation || null,
          members_per_group: parseInt(membersPerGroup)
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        alert(data.message)
        fetchData() // Refresh data
      } else {
        alert(data.error || 'Failed to assign groups')
      }
    } catch (error) {
      console.error('Error assigning groups:', error)
      alert('Failed to assign groups')
    }
  }

  const handleDeleteSession = async (id) => {
    if (!confirm('Are you sure you want to delete this session?')) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/bible-study/sessions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        fetchData()
      } else {
        alert('Failed to delete session')
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleDeleteLocation = async (id) => {
    if (!confirm('Are you sure you want to delete this location?')) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/bible-study/locations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        fetchData()
      } else {
        alert('Failed to delete location')
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-purple-600" />
                Bible Study Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage sessions, locations, and view registrations
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-200 dark:border-gray-800">
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'sessions'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Sessions
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'locations'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <MapPin className="w-5 h-5 inline mr-2" />
              Locations
            </button>
            <button
              onClick={() => setActiveTab('registrations')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'registrations'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Registrations
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'sessions' && (
              <SessionsTab
                sessions={sessions}
                onAdd={() => {
                  setEditingSession(null)
                  setShowSessionModal(true)
                }}
                onEdit={(session) => {
                  setEditingSession(session)
                  setShowSessionModal(true)
                }}
                onDelete={handleDeleteSession}
              />
            )}

            {activeTab === 'locations' && (
              <LocationsTab
                locations={locations}
                onAdd={() => {
                  setEditingLocation(null)
                  setShowLocationModal(true)
                }}
                onEdit={(location) => {
                  setEditingLocation(location)
                  setShowLocationModal(true)
                }}
                onDelete={handleDeleteLocation}
              />
            )}

            {activeTab === 'registrations' && (
              <RegistrationsTab
                sessions={sessions}
                locations={locations}
                registrations={registrations}
                selectedSession={selectedSession}
                filterLocation={filterLocation}
                filterGroup={filterGroup}
                onSessionChange={(id) => {
                  setSelectedSession(id)
                  setTimeout(fetchData, 100)
                }}
                onLocationChange={setFilterLocation}
                onGroupChange={setFilterGroup}
                onExport={handleExportExcel}
                onAutoAssignGroups={handleAutoAssignGroups}
                onRefresh={fetchData}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showSessionModal && (
        <SessionModal
          session={editingSession}
          onClose={() => {
            setShowSessionModal(false)
            setEditingSession(null)
          }}
          onSuccess={() => {
            setShowSessionModal(false)
            setEditingSession(null)
            fetchData()
          }}
        />
      )}

      {showLocationModal && (
        <LocationModal
          location={editingLocation}
          onClose={() => {
            setShowLocationModal(false)
            setEditingLocation(null)
          }}
          onSuccess={() => {
            setShowLocationModal(false)
            setEditingLocation(null)
            fetchData()
          }}
        />
      )}
    </AdminLayout>
  )
}

// Sessions Tab Component
function SessionsTab({ sessions, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Bible Study Sessions
        </h2>
        <button
          onClick={onAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Session</span>
        </button>
      </div>

      <div className="grid gap-6">
        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No sessions created yet</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {session.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.is_open
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {session.is_open ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  {session.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {session.description}
                    </p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Registration Deadline</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(session.registration_deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Start Date</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(session.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">End Date</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(session.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Registrations</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {session.registration_count || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(session)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(session.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Locations Tab Component
function LocationsTab({ locations, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Study Locations
        </h2>
        <button
          onClick={onAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Location</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No locations added yet</p>
          </div>
        ) : (
          locations.map((location) => (
            <div
              key={location.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {location.location_name}
                  </h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  location.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {location.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => onEdit(location)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(location.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Registrations Tab Component
function RegistrationsTab({ 
  sessions, 
  locations, 
  registrations, 
  selectedSession, 
  filterLocation, 
  filterGroup,
  onSessionChange, 
  onLocationChange, 
  onGroupChange,
  onExport,
  onAutoAssignGroups,
  onRefresh 
}) {
  const groups = [...new Set(registrations.map(r => r.group_number).filter(Boolean))].sort((a, b) => a - b)

  const filteredRegistrations = registrations.filter(reg => {
    if (filterLocation && reg.location_id !== parseInt(filterLocation)) return false
    if (filterGroup && reg.group_number !== parseInt(filterGroup)) return false
    return true
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Member Registrations
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={onRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          <button
            onClick={onAutoAssignGroups}
            disabled={!selectedSession}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Auto-Assign Groups</span>
          </button>
          <button
            onClick={onExport}
            disabled={!selectedSession}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-800">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Session
            </label>
            <select
              value={selectedSession || ''}
              onChange={(e) => onSessionChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">-- Select Session --</option>
              {sessions.map(session => (
                <option key={session.id} value={session.id}>
                  {session.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Location
            </label>
            <select
              value={filterLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              disabled={!selectedSession}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.location_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Group
            </label>
            <select
              value={filterGroup}
              onChange={(e) => onGroupChange(e.target.value)}
              disabled={!selectedSession}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="">All Groups</option>
              {groups.map(group => (
                <option key={group} value={group}>
                  Group {group}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      {selectedSession && (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Registrations</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {registrations.length}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Filtered Results</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {filteredRegistrations.length}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">Total Groups</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {groups.length}
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="text-sm text-amber-600 dark:text-amber-400 mb-1">Locations</div>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {[...new Set(registrations.map(r => r.location_id))].length}
            </div>
          </div>
        </div>
      )}

      {/* Registrations Table */}
      {!selectedSession ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Please select a session to view registrations</p>
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No registrations found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {reg.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {reg.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {reg.phone_number || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {reg.location_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Year {reg.year_of_study}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {reg.school_name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reg.group_number ? (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                          Group {reg.group_number}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(reg.registered_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Session Modal Component
function SessionModal({ session, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: session?.title || '',
    description: session?.description || '',
    registration_deadline: session?.registration_deadline?.split('T')[0] || '',
    start_date: session?.start_date?.split('T')[0] || '',
    end_date: session?.end_date?.split('T')[0] || '',
    is_open: session?.is_open ?? true
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const url = session 
        ? `/api/admin/bible-study/sessions/${session.id}`
        : '/api/admin/bible-study/sessions'
      
      const res = await fetch(url, {
        method: session ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        onSuccess()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to save session')
      }
    } catch (error) {
      console.error('Error saving session:', error)
      alert('Failed to save session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {session ? 'Edit Session' : 'Create New Session'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g., Spring 2024 Bible Study"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Brief description of the session"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Registration Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.registration_deadline}
                onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_open"
              checked={formData.is_open}
              onChange={(e) => setFormData({ ...formData, is_open: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="is_open" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Open for Registration (members can register)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : session ? 'Update Session' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Location Modal Component
function LocationModal({ location, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    location_name: location?.location_name || '',
    is_active: location?.is_active ?? true
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const url = location 
        ? `/api/admin/bible-study/locations/${location.id}`
        : '/api/admin/bible-study/locations'
      
      const res = await fetch(url, {
        method: location ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        onSuccess()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to save location')
      }
    } catch (error) {
      console.error('Error saving location:', error)
      alert('Failed to save location')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {location ? 'Edit Location' : 'Add New Location'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location Name *
            </label>
            <input
              type="text"
              required
              value={formData.location_name}
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g., Main Hall, Library, etc."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="location_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="location_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Active (available for selection)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : location ? 'Update Location' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
