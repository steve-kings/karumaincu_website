import { executeQuery } from '@/lib/db'
import MediaClient from './MediaClient'

// Server-side data fetching for galleries
async function getGalleries() {
  try {
    const query = `
      SELECT 
        g.id, g.title, g.description, g.url, g.category, g.thumbnail_url,
        g.platform, g.is_active, g.view_count, g.created_at, g.updated_at,
        u.full_name as creator_name, u.email as creator_email
      FROM galleries g
      LEFT JOIN users u ON g.created_by = u.id
      WHERE g.is_active = 1
      ORDER BY g.created_at DESC
      LIMIT 50
    `
    
    const galleries = await executeQuery(query)
    return galleries
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return []
  }
}

export default async function MediaPage() {
  const galleries = await getGalleries()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-800 via-teal-700 to-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
              Media & Gallery
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Sermons, worship sessions, and photo galleries
            </p>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              Access our collection of inspiring sermons, worship sessions, and photo galleries 
              from various KarUCU events and activities.
            </p>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-gray-800 mb-6">
              Catch Us Live / Watch Our Sermons
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              Experience our worship services and inspiring messages from KarUCU Main Campus
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fab fa-youtube text-white text-3xl"></i>
                </div>
                <h3 className="font-heading font-bold text-2xl text-gray-800 mb-2">
                  KarUCU Main Campus YouTube Channel
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Subscribe to our YouTube channel for live streams, sermon recordings, worship sessions, 
                  and exclusive content from KarUCU Main Campus Christian Union.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                  <div className="text-gray-600">Sermon Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">Live</div>
                  <div className="text-gray-600">Weekly Streams</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">1K+</div>
                  <div className="text-gray-600">Subscribers</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.youtube.com/@karucumain" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all inline-flex items-center justify-center text-lg shadow-lg hover:shadow-xl"
                >
                  <i className="fab fa-youtube mr-3 text-xl"></i>
                  Visit Our YouTube Channel
                </a>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>🔴 Live streams every Sunday at 10:00 AM and Wednesday at 6:00 PM (EAT)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pass galleries data to client component */}
      <MediaClient galleries={galleries} />
    </div>
  )
}
