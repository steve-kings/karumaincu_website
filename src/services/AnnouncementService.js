import { executeQuery } from '@/lib/db'

class AnnouncementService {
  async getAll(filters = {}) {
    const { search, status, active_only, limit, offset } = filters
    
    let query = 'SELECT * FROM announcements WHERE 1=1'
    const params = []

    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm)
    }

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    if (active_only === 'true') {
      query += ' AND status = "active" AND (expires_at IS NULL OR expires_at > NOW())'
    }

    query += ' ORDER BY created_at DESC'

    if (limit) {
      const limitInt = parseInt(limit, 10) || 50
      const offsetInt = parseInt(offset, 10) || 0
      query += ` LIMIT ${limitInt} OFFSET ${offsetInt}`
    }

    return await executeQuery(query, params)
  }

  async getById(id) {
    const [announcement] = await executeQuery('SELECT * FROM announcements WHERE id = ?', [id])
    
    if (!announcement) {
      throw new Error('Announcement not found')
    }
    
    return announcement
  }

  async create(data, createdBy) {
    const { title, content, priority, expires_at, status } = data

    if (!title || !content) {
      throw new Error('Title and content are required')
    }

    const result = await executeQuery(
      `INSERT INTO announcements (title, content, priority, expires_at, status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, content, priority || 'normal', expires_at, status || 'active', createdBy]
    )

    return await this.getById(result.insertId)
  }

  async update(id, data) {
    const { title, content, priority, expires_at, status } = data

    if (!title || !content) {
      throw new Error('Title and content are required')
    }

    await this.getById(id)

    await executeQuery(
      `UPDATE announcements SET title = ?, content = ?, priority = ?, expires_at = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, content, priority, expires_at, status, id]
    )

    return await this.getById(id)
  }

  async delete(id) {
    await this.getById(id)
    await executeQuery('DELETE FROM announcements WHERE id = ?', [id])
    return { success: true, message: 'Announcement deleted successfully' }
  }

  async getStats() {
    const [stats] = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' AND (expires_at IS NULL OR expires_at > NOW()) THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN expires_at IS NOT NULL AND expires_at <= NOW() THEN 1 ELSE 0 END) as expired
      FROM announcements
    `)
    
    return stats
  }
}

export default new AnnouncementService()
