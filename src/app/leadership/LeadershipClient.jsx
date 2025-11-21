'use client'

import { useState } from 'react'

export default function LeadershipClient({ leaders }) {
  const [selectedLeader, setSelectedLeader] = useState(null)

  const getLeaderPhoto = (photoUrl) => {
    if (!photoUrl) {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    }
    
    if (photoUrl.startsWith('http')) {
      return photoUrl
    }
    
    // If it's already a full path starting with /uploads, use it directly
    if (photoUrl.startsWith('/uploads')) {
      return photoUrl
    }
    
    // Otherwise, construct the path
    return `/uploads/leaders/${photoUrl}`
  }

  return (
    <>
      {/* Leaders Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {leaders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-users text-4xl"></i>
              </div>
              <p className="text-gray-600">No leadership information available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader) => (
                <div 
                  key={leader.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-t-4 border-purple-500 cursor-pointer"
                  onClick={() => setSelectedLeader(leader)}
                >
                  <div className="relative">
                    <img 
                      src={getLeaderPhoto(leader.photo_url)} 
                      alt={leader.full_name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl text-gray-800 mb-2">
                      {leader.full_name}
                    </h3>
                    <p className="font-semibold mb-3 text-purple-600">
                      {leader.position}
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                      {leader.bio || `${leader.full_name} serves as ${leader.position}`}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        {leader.email && (
                          <a 
                            href={`mailto:${leader.email}`}
                            className="text-purple-600 hover:opacity-70 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <i className="fas fa-envelope"></i>
                          </a>
                        )}
                        {leader.phone && (
                          <a 
                            href={`tel:${leader.phone}`}
                            className="text-purple-600 hover:opacity-70 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <i className="fas fa-phone"></i>
                          </a>
                        )}
                      </div>
                      <button 
                        className="text-sm text-purple-600 hover:opacity-70 transition-opacity font-medium"
                        onClick={() => setSelectedLeader(leader)}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Leader Modal */}
      {selectedLeader && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLeader(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img 
                src={getLeaderPhoto(selectedLeader.photo_url)} 
                alt={selectedLeader.full_name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button 
                onClick={() => setSelectedLeader(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-8">
              <h3 className="font-heading font-bold text-3xl text-gray-800 mb-2">
                {selectedLeader.full_name}
              </h3>
              <p className="font-semibold text-xl mb-4 text-purple-600">
                {selectedLeader.position}
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                {selectedLeader.bio || `${selectedLeader.full_name} serves as ${selectedLeader.position} with dedication and commitment to advancing God's kingdom at Karatina University.`}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {selectedLeader.email && (
                  <a 
                    href={`mailto:${selectedLeader.email}`}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <i className="fas fa-envelope"></i>
                    <span>Send Email</span>
                  </a>
                )}
                {selectedLeader.phone && (
                  <a 
                    href={`tel:${selectedLeader.phone}`}
                    className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-phone"></i>
                    <span>Call</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
