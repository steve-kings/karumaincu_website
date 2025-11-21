'use client'

import { useState, useEffect } from 'react'
import MemberLayout from '@/components/MemberLayout'

export default function MemberNominationsPage() {
  const [elections, setElections] = useState([])
  const [myNominations, setMyNominations] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [selectedElection, setSelectedElection] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    year: '',
    course: ''
  })

  useEffect(() => {
    fetchElections()
    fetchMyNominations()
  }, [])

  const fetchElections = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/member/elections', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setElections(data)
        if (data.length > 0) {
          setSelectedElection(data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching elections:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyNominations = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/member/nominations', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMyNominations(data)
        
        // Track which positions have been voted for in the selected election
        if (selectedElection) {
          const positions = data
            .filter(nom => nom.election_id === selectedElection)
            .map(nom => nom.position)
          setVotedPositions(positions)
        }
      }
    } catch (error) {
      console.error('Error fetching nominations:', error)
    }
  }

  const searchMembers = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        search: searchTerm,
        ...(filters.year && { year: filters.year }),
        ...(filters.course && { course: filters.course })
      })

      const response = await fetch(`/api/member/search-members?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error('Error searching members:', error)
    } finally {
      setSearching(false)
    }
  }

  const [positions, setPositions] = useState([])
  const [showNominateModal, setShowNominateModal] = useState(false)
  const [selectedNominee, setSelectedNominee] = useState(null)
  const [nominationData, setNominationData] = useState({
    position: '',
    reason: ''
  })
  const [votedPositions, setVotedPositions] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        fetchElections(),
        fetchMyNominations()
      ])
    } finally {
      setRefreshing(false)
    }
  }

  const fetchPositions = async (electionId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/member/elections/${electionId}/positions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPositions(data)
      }
    } catch (error) {
      console.error('Error fetching positions:', error)
    }
  }

  useEffect(() => {
    if (selectedElection) {
      fetchPositions(selectedElection)
      // Update voted positions when election changes
      const positions = myNominations
        .filter(nom => nom.election_id === selectedElection)
        .map(nom => nom.position)
      setVotedPositions(positions)
    }
  }, [selectedElection, myNominations])

  const openNominateModal = (member) => {
    if (!selectedElection) {
      alert('Please select an election first')
      return
    }
    setSelectedNominee(member)
    setNominationData({ position: '', reason: '' })
    setShowNominateModal(true)
  }

  const submitNomination = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/member/nominations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          election_id: selectedElection,
          nominee_id: selectedNominee.id,
          position: nominationData.position,
          reason: nominationData.reason
        })
      })

      if (response.ok) {
        alert('Nomination submitted successfully!')
        fetchElections()
        fetchMyNominations()
        setSearchTerm('')
        setSearchResults([])
        setShowNominateModal(false)
        setSelectedNominee(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit nomination')
      }
    } catch (error) {
      console.error('Error nominating:', error)
      alert('Failed to submit nomination')
    }
  }

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchMembers()
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(delaySearch)
  }, [searchTerm, filters])

  const currentElection = elections.find(e => e.id === selectedElection)
  const currentElectionNominations = myNominations.filter(nom => nom.election_id === selectedElection)

  const completeNomination = async () => {
    if (!selectedElection) {
      alert('Please select an election first')
      return
    }

    if (currentElectionNominations.length === 0) {
      alert('Please submit at least one nomination before completing')
      return
    }

    if (!confirm('Are you sure you want to complete your nominations? You can still add more nominations later if needed.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/member/nominations/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          election_id: selectedElection
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`${result.message}\n\nYou voted for ${result.positions_voted} position(s) with ${result.nominations_count} total nomination(s).`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to complete nomination')
      }
    } catch (error) {
      console.error('Error completing nomination:', error)
      alert('Failed to complete nomination')
    }
  }

  return (
    <MemberLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                Leader Nominations
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Nominate members for leadership positions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh elections and nominations"
              >
                <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              {currentElectionNominations.length > 0 && (
                <button
                  onClick={completeNomination}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 font-medium"
                >
                  ✅ Complete Nomination
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : elections.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <span className="text-6xl mb-4 block">🗳️</span>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No active elections
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Check back later when elections are open
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Search & Nominate */}
            <div className="lg:col-span-2 space-y-6">
              {/* Election Selector */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Election
                </label>
                <select
                  value={selectedElection || ''}
                  onChange={(e) => setSelectedElection(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                  {elections.map(election => (
                    <option key={election.id} value={election.id}>
                      {election.title} ({election.remaining_nominations} nominations left)
                    </option>
                  ))}
                </select>
                {currentElection && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Ends: {new Date(currentElection.end_date).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Search Box */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                  Search Members
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Search by name, email, or reg number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={filters.year}
                      onChange={(e) => setFilters({...filters, year: e.target.value})}
                      className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                    >
                      <option value="">All Years</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Filter by course..."
                      value={filters.course}
                      onChange={(e) => setFilters({...filters, course: e.target.value})}
                      className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                  </div>
                </div>

                {/* Search Results */}
                {searching ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                    {searchResults.map(member => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-black dark:text-white">{member.full_name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.registration_number} • {member.course} • Year {member.year_of_study}
                          </p>
                        </div>
                        <button
                          onClick={() => openNominateModal(member)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                          disabled={!currentElection || currentElection.remaining_nominations <= 0}
                        >
                          Nominate
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchTerm.length >= 2 ? (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-500">
                    No members found
                  </p>
                ) : null}
              </div>
            </div>

            {/* Nominate Modal */}
            {showNominateModal && selectedNominee && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full">
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                    Nominate {selectedNominee.full_name}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Position *
                      </label>
                      <select
                        value={nominationData.position}
                        onChange={(e) => setNominationData({...nominationData, position: e.target.value})}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                        required
                      >
                        <option value="">Select a position...</option>
                        {positions.map(pos => {
                          const alreadyVoted = votedPositions.includes(pos.title)
                          return (
                            <option 
                              key={pos.id} 
                              value={pos.title}
                              disabled={alreadyVoted}
                            >
                              {pos.title} {alreadyVoted ? '(Already voted)' : ''}
                            </option>
                          )
                        })}
                      </select>
                      {votedPositions.length > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          You have voted for: {votedPositions.join(', ')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reason (Optional)
                      </label>
                      <textarea
                        value={nominationData.reason}
                        onChange={(e) => setNominationData({...nominationData, reason: e.target.value})}
                        rows={3}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                        placeholder="Why are you nominating this person?"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={submitNomination}
                        disabled={!nominationData.position}
                        className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Nomination
                      </button>
                      <button
                        onClick={() => {
                          setShowNominateModal(false)
                          setSelectedNominee(null)
                        }}
                        className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right: My Nominations */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    My Nominations ({currentElectionNominations.length})
                  </h3>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50"
                    title="Refresh nominations"
                  >
                    <span className={refreshing ? 'animate-spin inline-block' : 'inline-block'}>🔄</span>
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                  {currentElectionNominations.length === 0 ? (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-500 text-sm">
                      No nominations yet
                    </p>
                  ) : (
                    currentElectionNominations.map(nom => (
                      <div
                        key={nom.id}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <p className="font-medium text-black dark:text-white text-sm">
                          {nom.nominee_name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {nom.election_title}
                        </p>
                        {nom.position && (
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                            Position: {nom.position}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {currentElectionNominations.length > 0 && (
                  <button
                    onClick={completeNomination}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all font-medium"
                  >
                    ✅ Complete & Get Summary
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  )
}
