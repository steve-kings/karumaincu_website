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

// Server-side data fetching for announcements
async function getAnnouncements() {
  try {
    const query = `
      SELECT id, title, content, priority, status
      FROM announcements
      WHERE status = 'published'
      AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY priority DESC, created_at DESC
      LIMIT 5
    `
    
    const announcements = await executeQuery(query)
    return announcements
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return []
  }
}

export default async function MediaPage() {
  const galleries = await getGalleries()
  const announcements = await getAnnouncements()
  
  console.log('📢 Announcements loaded:', announcements.length)
  if (announcements.length > 0) {
    console.log('First announcement:', announcements[0].title)
  }

  return (
    <div className="min-h-screen">
      {/* Announcements Scrolling Banner */}
      {announcements.length > 0 && (
        <div className="bg-amber-500 text-white py-3 overflow-hidden relative">
          <div className="flex items-center">
            <div className="flex-shrink-0 px-4 font-bold flex items-center">
              <i className="fas fa-bullhorn mr-2 text-xl"></i>
              <span className="text-sm uppercase tracking-wide">Announcements</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll whitespace-nowrap inline-block">
                {announcements.map((announcement, index) => (
                  <span key={announcement.id} className="inline-flex items-center mx-8">
                    <i className="fas fa-circle text-xs mr-3"></i>
                    <span className="font-semibold">{announcement.title}</span>
                    {announcement.content && (
                      <span className="ml-2 opacity-90">- {announcement.content}</span>
                    )}
                  </span>
                ))}
                {/* Duplicate for seamless loop */}
                {announcements.map((announcement, index) => (
                  <span key={`dup-${announcement.id}`} className="inline-flex items-center mx-8">
                    <i className="fas fa-circle text-xs mr-3"></i>
                    <span className="font-semibold">{announcement.title}</span>
                    {announcement.content && (
                      <span className="ml-2 opacity-90">- {announcement.content}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/hero-2.jpg" 
            alt="Media Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-purple-900/80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
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
      <section className="py-16 bg-gray-50">
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
                <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                  className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-all inline-flex items-center justify-center text-lg shadow-lg hover:shadow-xl"
                >
                  <i className="fab fa-youtube mr-3 text-xl"></i>
                  Visit Our YouTube Channel
                </a>
                <a 
                  href="/sermons" 
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all inline-flex items-center justify-center text-lg shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-book-bible mr-3 text-xl"></i>
                  Browse Sermons
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
