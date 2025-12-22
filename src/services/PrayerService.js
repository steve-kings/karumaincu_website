import { executeQuery } from '@/lib/db'

class PrayerService {
  async getAll(filters = {}) {
    const { user_id, status, is_public, limit, offset } = filters
    
    let query = `
      SELECT pr.*, u.full_name as user_full_name 
      FROM prayer_requests pr
      LEFT JOIN users u ON pr.requester_id = u.id
      WHERE 1=1
    `
    const params = []

    if (user_id) {
      query += ' AND pr.requester_id = ?'
      params.push(user_id)
    }

    if (status) {
      query += ' AND pr.status = ?'
      params.push(status)
    }

    if (is_public === 'true') {
      query += ' AND pr.is_public = 1'
    } else if (is_public === 'false') {
      query += ' AND pr.is_public = 0'
    }

    query += ' ORDER BY pr.created_at DESC'

    // LIMIT and OFFSET must be integers embedded directly (not as prepared statement params)
    if (limit) {
      const limitInt = parseInt(limit, 10) || 50
      const offsetInt = parseInt(offset, 10) || 0
      query += ` LIMIT ${limitInt} OFFSET ${offsetInt}`
    }

    const prayers = await executeQuery(query, params)

    // Process prayer requests - handle anonymous names
    return prayers.map(prayer => ({
      ...prayer,
      requester_name: prayer.is_anonymous 
        ? null 
        : (prayer.requester_name || prayer.user_full_name),
      description: prayer.content || prayer.description // Support both field names
    }))
  }

  async getById(id) {
    const [prayer] = await executeQuery(`
      SELECT pr.*, u.full_name as user_full_name 
      FROM prayer_requests pr
      LEFT JOIN users u ON pr.requester_id = u.id
      WHERE pr.id = ?
    `, [id])
    
    if (!prayer) {
      throw new Error('Prayer request not found')
    }
    
    return {
      ...prayer,
      requester_name: prayer.is_anonymous 
        ? null 
        : (prayer.requester_name || prayer.user_full_name),
      description: prayer.content || prayer.description
    }
  }

  async create(data, userId) {
    const { 
      title, 
      content, 
      description, 
      category, 
      isPublic, 
      is_public,
      isAnonymous, 
      is_anonymous,
      requester_name 
    } = data

    // Support both content and description field names
    const prayerContent = content || description

    if (!title || !prayerContent) {
      throw new Error('Title and description are required')
    }

    const isAnon = isAnonymous || is_anonymous || false
    const isPub = isPublic !== undefined ? isPublic : (is_public !== undefined ? is_public : true)

    const result = await executeQuery(
      `INSERT INTO prayer_requests (title, content, category, is_public, is_anonymous, requester_id, requester_name, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        title, 
        prayerContent, 
        category || 'personal', 
        isPub ? 1 : 0, 
        isAnon ? 1 : 0, 
        userId || null,
        isAnon ? null : requester_name
      ]
    )

    return await this.getById(result.insertId)
  }

  async update(id, data) {
    const { title, content, description, category, is_public, is_anonymous, status } = data

    const prayerContent = content || description

    await this.getById(id)

    await executeQuery(
      `UPDATE prayer_requests SET title = ?, content = ?, category = ?, is_public = ?, is_anonymous = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, prayerContent, category, is_public ? 1 : 0, is_anonymous ? 1 : 0, status, id]
    )

    return await this.getById(id)
  }

  async delete(id) {
    await this.getById(id)
    await executeQuery('DELETE FROM prayer_requests WHERE id = ?', [id])
    return { success: true, message: 'Prayer request deleted successfully' }
  }

  async addPrayer(prayerRequestId, userId) {
    await this.getById(prayerRequestId)

    // Check if user already prayed
    const [existing] = await executeQuery(
      'SELECT id FROM prayers WHERE prayer_request_id = ? AND user_id = ?',
      [prayerRequestId, userId]
    )

    if (existing) {
      return { success: true, message: 'Already prayed for this request' }
    }

    await executeQuery(
      'INSERT INTO prayers (prayer_request_id, user_id) VALUES (?, ?)',
      [prayerRequestId, userId]
    )

    // Update prayer count
    await executeQuery(
      'UPDATE prayer_requests SET prayer_count = prayer_count + 1 WHERE id = ?',
      [prayerRequestId]
    )

    return { success: true, message: 'Prayer added successfully' }
  }

  async getStats(userId = null) {
    let query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'answered' THEN 1 ELSE 0 END) as answered,
        COALESCE(SUM(prayer_count), 0) as total_prayers
      FROM prayer_requests
    `
    const params = []

    if (userId) {
      query += ' WHERE requester_id = ?'
      params.push(userId)
    }

    const [stats] = await executeQuery(query, params)
    return stats
  }
}

export default new PrayerService()
