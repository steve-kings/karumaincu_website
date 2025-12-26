import { executeQuery } from '@/lib/db'
import EventsClient from './EventsClient'

// Disable caching - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Server-side data fetching for events and announcements
async function getEventsData() {
  try {
    // Fetch all published events - upcoming first, then past events
    const eventsQuery = `
      SELECT 
        id, title, description, event_date, end_date, location, venue_details,
        category, featured_image, registration_required, capacity,
        registration_deadline, status, created_at, updated_at
      FROM events
      WHERE status = 'published'
      ORDER BY 
        CASE WHEN event_date >= CURDATE() THEN 0 ELSE 1 END,
        event_date ASC
      LIMIT 50
    `
    const events = await executeQuery(eventsQuery)

    // Fetch active announcements for hero slider
    const announcementsQuery = `
      SELECT 
        id, title, content, priority, category, featured_image,
        created_at
      FROM announcements
      WHERE status = 'published' 
      AND (expires_at IS NULL OR expires_at >= NOW())
      ORDER BY priority DESC, created_at DESC
      LIMIT 5
    `
    const announcements = await executeQuery(announcementsQuery)

    return { events, announcements }
  } catch (error) {
    console.error('Error fetching events data:', error)
    return { events: [], announcements: [] }
  }
}

export default async function EventsPage() {
  const { events, announcements } = await getEventsData()

  return (
    <div className="min-h-screen">
      {/* Pass events and announcements data to client component */}
      <EventsClient events={events} announcements={announcements} />
    </div>
  )
}
