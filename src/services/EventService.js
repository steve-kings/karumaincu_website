import { executeQuery } from '@/lib/db'

class EventService {
  async getAll(filters = {}) {
    const { search, status, category, upcoming, limit, offset } = filters
    
    let query = 'SELECT * FROM events WHERE 1=1'
    const params = []

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm)
    }

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    if (upcoming === 'true') {
      query += ' AND event_date >= CURDATE()'
    }

    query += ' ORDER BY event_date DESC, created_at DESC'

    if (limit) {
      query += ' LIMIT ?'
      params.push(parseInt(limit))
      
      if (offset) {
        query += ' OFFSET ?'
        params.push(parseInt(offset))
      }
    }

    return await executeQuery(query, params)
  }

  async getById(id) {
    const [event] = await executeQuery('SELECT * FROM events WHERE id = ?', [id])
    
    if (!event) {
      throw new Error('Event not found')
    }
    
    return event
  }

  async create(data, createdBy) {
    const { 
      title, description, event_date, end_date, location, venue_details,
      capacity, registration_required, registration_deadline, featured_image,
      category, status 
    } = data

    if (!title || !event_date) {
      throw new Error('Title and event date are required')
    }

    const result = await executeQuery(
      `INSERT INTO events (
        title, description, event_date, end_date, location, venue_details,
        capacity, registration_required, registration_deadline, featured_image,
        category, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, event_date, end_date || null, location || null, venue_details || null,
        capacity || 0, registration_required || false, registration_deadline || null,
        featured_image || null, category || null, status || 'draft', createdBy
      ]
    )

    return await this.getById(result.insertId)
  }

  async update(id, data) {
    const { 
      title, description, event_date, end_date, location, venue_details,
      capacity, registration_required, registration_deadline, featured_image,
      category, status 
    } = data

    if (!title || !event_date) {
      throw new Error('Title and event date are required')
    }

    await this.getById(id)

    await executeQuery(
      `UPDATE events SET 
        title = ?, description = ?, event_date = ?, end_date = ?, location = ?, venue_details = ?,
        capacity = ?, registration_required = ?, registration_deadline = ?, featured_image = ?,
        category = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        title, description, event_date, end_date, location, venue_details,
        capacity, registration_required, registration_deadline, featured_image,
        category, status, id
      ]
    )

    return await this.getById(id)
  }

  async delete(id) {
    await this.getById(id)
    await executeQuery('DELETE FROM events WHERE id = ?', [id])
    return { success: true, message: 'Event deleted successfully' }
  }

  async getStats() {
    const [stats] = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN event_date >= CURDATE() THEN 1 ELSE 0 END) as upcoming,
        SUM(CASE WHEN event_date < CURDATE() THEN 1 ELSE 0 END) as past
      FROM events WHERE status = 'active'
    `)
    
    return stats
  }
}

export default new EventService()
