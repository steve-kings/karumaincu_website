'use client'

import { useState } from 'react'

export default function MediaClient({ galleries }) {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Photos', color: 'purple' },
    { id: 'worship', name: 'Worship', color: 'teal' },
    { id: 'fellowship', name: 'Fellowship', color: 'emerald' },
    { id: 'outreach', name: 'Outreach', color: 'amber' },
    { id: 'events', name: 'Events', color: 'purple' },
    { id: 'conferences', name: 'Conferences', color: 'teal' }
  ]

  const filteredGalleries = selectedCategory === 'all'
    ? galleries
    : galleries.filter(gallery => gallery.category === selectedCategory)

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'google_photos': return 'fab fa-google'
      case 'google_drive': return 'fab fa-google-drive'
      case 'dropbox': return 'fab fa-dropbox'
      case 'onedrive': return 'fab fa-microsoft'
      default: return 'fas fa-cloud'
    }
  }

  const handleGalleryClick = async (gallery) => {
    try {
      await fetch(`/api/gallery/${gallery.id}/view`, { method: 'POST' })
      window.open(gallery.url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking gallery view:', error)
      window.open(gallery.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-gray-800 mb-6">
            Our Story in Pictures
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Browse our photo collections from worship services, fellowship events, and ministry activities. 
            Click any image to access the full gallery.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredGalleries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-images text-4xl"></i>
            </div>
            <p className="text-gray-600">No gallery links available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGalleries.map((gallery) => (
              <div 
                key={gallery.id}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer bg-white hover:scale-105"
                onClick={() => handleGalleryClick(gallery)}
              >
                <div className="relative aspect-square">
                  {gallery.thumbnail_url ? (
                    <img 
                      src={gallery.thumbnail_url} 
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center">
                      <div className="text-center">
                        <i className="fas fa-images text-4xl text-gray-400 mb-2"></i>
                        <p className="text-xs text-gray-500 font-medium">Gallery</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <i className="fas fa-external-link-alt text-2xl mb-2"></i>
                      <p className="text-sm font-medium">View Photos</p>
                    </div>
                  </div>

                  <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold capitalize">
                    {gallery.category}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {gallery.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-gray-500 text-xs">
                      <i className={`${getPlatformIcon(gallery.platform)} mr-1`}></i>
                      <span>{gallery.view_count || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
