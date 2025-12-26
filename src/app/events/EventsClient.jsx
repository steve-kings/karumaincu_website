'use client'

import { useState, useEffect } from 'react'

export default function EventsClient({ events, announcements }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showCopyToast, setShowCopyToast] = useState(false)

  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'worship', name: 'Worship Services' },
    { id: 'fellowship', name: 'Fellowship' },
    { id: 'conference', name: 'Conferences' },
    { id: 'outreach', name: 'Outreach' },
    { id: 'training', name: 'Training' }
  ]

  // Auto-advance slider
  useEffect(() => {
    if (!announcements || announcements.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [announcements])

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(event => event.category === selectedCategory)

  const getEventImage = (event) => {
    if (event.featured_image) {
      return event.featured_image
    }
    return 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop'
  }

  const getAnnouncementImage = (announcement) => {
    if (announcement.featured_image) {
      return announcement.featured_image
    }
    return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      default:
        return 'bg-blue-500'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const isPastEvent = (eventDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDay = new Date(eventDate)
    eventDay.setHours(0, 0, 0, 0)
    return eventDay < today
  }

  const copyEventLink = (eventId) => {
    const url = `${window.location.origin}/events?event=${eventId}`
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyToast(true)
      setTimeout(() => setShowCopyToast(false), 3000)
    })
  }

  const shareEvent = async (event) => {
    const url = `${window.location.origin}/events?event=${event.id}`
    const shareData = {
      title: event.title,
      text: event.description,
      url: url
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        copyEventLink(event.id)
      }
    } else {
      copyEventLink(event.id)
    }
  }

  return (
    <>
      {/* Copy Toast Notification */}
      {showCopyToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
          <i className="fas fa-check-circle"></i>
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* Hero Slider - Announcements */}
      {announcements && announcements.length > 0 && (
        <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-r from-purple-900 to-purple-700">
          {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0">
                <img
                  src={getAnnouncementImage(announcement)}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
              </div>

              <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="max-w-3xl text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`${getPriorityColor(announcement.priority)} px-4 py-1 rounded-full text-sm font-semibold uppercase`}>
                      {announcement.priority} Priority
                    </span>
                    <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-semibold capitalize">
                      {announcement.category}
                    </span>
                  </div>
                  
                  <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                    {announcement.title}
                  </h1>
                  
                  <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed line-clamp-3">
                    {announcement.content}
                  </p>

                  <div className="flex items-center space-x-4">
                    <button className="bg-white text-purple-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      Learn More
                    </button>
                    <span className="text-sm text-gray-300">
                      <i className="fas fa-clock mr-2"></i>
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          {announcements.length > 1 && (
            <>
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + announcements.length) % announcements.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % announcements.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <i className="fas fa-chevron-right"></i>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-calendar-alt text-4xl"></i>
              </div>
              <p className="text-gray-600 dark:text-gray-400">No events found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer border border-gray-100 dark:border-neutral-900"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative">
                    <img 
                      src={getEventImage(event)} 
                      alt={event.title}
                      className={`w-full h-48 object-cover ${isPastEvent(event.event_date) ? 'opacity-70' : ''}`}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {event.category && (
                        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                          {event.category}
                        </div>
                      )}
                      {isPastEvent(event.event_date) && (
                        <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Past Event
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl text-gray-800 dark:text-white mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <i className="fas fa-calendar-day w-5 mr-2"></i>
                        <span className="text-sm">{formatDate(event.event_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <i className="fas fa-map-marker-alt w-5 mr-2"></i>
                          <span className="text-sm">{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(event)
                        }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          copyEventLink(event.id)
                        }}
                        className="bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
                        title="Copy link"
                      >
                        <i className="fas fa-link"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white dark:bg-neutral-950 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={getEventImage(selectedEvent)} 
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-8">
              <div className="mb-4">
                {selectedEvent.category && (
                  <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {selectedEvent.category}
                  </span>
                )}
              </div>
              
              <h2 className="font-heading font-bold text-3xl text-gray-800 dark:text-white mb-6">
                {selectedEvent.title}
              </h2>
              
              <div className="space-y-3 mb-6 bg-gray-50 dark:bg-neutral-900 p-6 rounded-xl">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <i className="fas fa-calendar-day w-6 mr-3 text-purple-600"></i>
                  <span className="font-medium">{formatDate(selectedEvent.event_date)}</span>
                </div>
                {selectedEvent.end_date && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <i className="fas fa-calendar-check w-6 mr-3 text-purple-600"></i>
                    <span className="font-medium">Ends: {formatDate(selectedEvent.end_date)}</span>
                  </div>
                )}
                {selectedEvent.location && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <i className="fas fa-map-marker-alt w-6 mr-3 text-purple-600"></i>
                    <span className="font-medium">{selectedEvent.location}</span>
                  </div>
                )}
              </div>
              
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>
              
              {selectedEvent.venue_details && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-400 mb-2">
                    <i className="fas fa-info-circle mr-2"></i>
                    Venue Details
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">{selectedEvent.venue_details}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => shareEvent(selectedEvent)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  <i className="fas fa-share-alt mr-2"></i>
                  Share Event
                </button>
                <button 
                  onClick={() => copyEventLink(selectedEvent.id)}
                  className="flex-1 border-2 border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-link mr-2"></i>
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
