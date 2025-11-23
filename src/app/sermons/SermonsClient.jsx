'use client'

import { useState, useEffect } from 'react'
import { Play, Calendar, User, BookOpen } from 'lucide-react'

export default function SermonsClient() {
  const [sermons, setSermons] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSeries, setSelectedSeries] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSermons()
    }, 300) // Debounce search by 300ms
    
    return () => clearTimeout(timeoutId)
  }, [selectedSeries, searchQuery])

  const fetchSermons = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchQuery) params.append('search', searchQuery)
      if (selectedSeries !== 'all') params.append('series', selectedSeries)

      const response = await fetch(`/api/sermons?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setSermons(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching sermons:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique series
  const series = ['all', ...new Set(sermons.filter(s => s.series).map(s => s.series))]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handlePlay = (sermon) => {
    if (sermon.video_url) {
      window.open(sermon.video_url, '_blank')
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search sermons by title, speaker, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Series</option>
              {series.filter(s => s !== 'all').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sermons Grid */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sermons...</p>
          </div>
        ) : sermons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sermons found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <div 
                key={sermon.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-purple-500 to-indigo-600">
                  {sermon.thumbnail_url && sermon.thumbnail_url.includes('unsplash.com') ? (
                    <img 
                      src={sermon.thumbnail_url} 
                      alt={sermon.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/logo.png'
                        e.target.className = 'w-24 h-24 object-contain mx-auto mt-12'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img src="/logo.png" alt="KarUCU" className="w-24 h-24 object-contain" />
                    </div>
                  )}
                  
                  {sermon.is_featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Featured
                    </div>
                  )}
                  
                  {sermon.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {formatDuration(sermon.duration)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {sermon.series && (
                    <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">
                      {sermon.series}
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {sermon.title}
                  </h3>
                  
                  {sermon.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {sermon.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      <span>{sermon.speaker}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(sermon.date)}</span>
                    </div>
                    {sermon.scripture_reference && (
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="w-4 h-4 mr-2" />
                        <span>{sermon.scripture_reference}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {sermon.video_url && (
                      <button
                        onClick={() => handlePlay(sermon)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Watch</span>
                      </button>
                    )}
                  </div>

                  {sermon.is_featured && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-yellow-600 font-semibold text-xs">
                        <i className="fas fa-star mr-1"></i>
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
