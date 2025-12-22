import { executeQuery } from '@/lib/db'

/**
 * Leader Service - Business logic for leader management
 * This service can be used by any client (web, mobile, etc.)
 */
class LeaderService {
  /**
   * Get all leaders with optional filtering
   */
  async getAll(filters = {}) {
    const { search, status, limit, offset } = filters
    
    let query = 'SELECT * FROM leaders WHERE 1=1'
    const params = []

    if (search) {
      query += ' AND (full_name LIKE ? OR position LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm)
    }

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    query += ' ORDER BY display_order ASC, created_at DESC'

    // LIMIT and OFFSET must be integers embedded directly (not as prepared statement params)
    // to avoid MySQL "Incorrect arguments to mysqld_stmt_execute" error
    if (limit) {
      const limitInt = parseInt(limit, 10) || 50
      const offsetInt = parseInt(offset, 10) || 0
      query += ` LIMIT ${limitInt} OFFSET ${offsetInt}`
    }

    const leaders = await executeQuery(query, params)
    return leaders
  }

  /**
   * Get a single leader by ID
   */
  async getById(id) {
    const [leader] = await executeQuery(
      'SELECT * FROM leaders WHERE id = ?',
      [id]
    )
    
    if (!leader) {
      throw new Error('Leader not found')
    }
    
    return leader
  }

  /**
   * Create a new leader
   */
  async create(data, createdBy) {
    const {
      name,
      position,
      bio,
      photo_url,
      email,
      phone,
      display_order,
      status
    } = data

    // Validation
    if (!name || !position) {
      throw new Error('Name and position are required')
    }

    const result = await executeQuery(
      `INSERT INTO leaders (full_name, position, bio, photo_url, email, phone, display_order, status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        position,
        bio || null,
        photo_url || null,
        email || null,
        phone || null,
        display_order || 0,
        status || 'active',
        createdBy
      ]
    )

    return await this.getById(result.insertId)
  }

  /**
   * Update an existing leader
   */
  async update(id, data) {
    const {
      name,
      position,
      bio,
      photo_url,
      email,
      phone,
      display_order,
      status
    } = data

    // Validation
    if (!name || !position) {
      throw new Error('Name and position are required')
    }

    // Check if leader exists
    await this.getById(id)

    await executeQuery(
      `UPDATE leaders SET 
        full_name = ?, 
        position = ?, 
        bio = ?, 
        photo_url = ?, 
        email = ?, 
        phone = ?, 
        display_order = ?, 
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [name, position, bio, photo_url, email, phone, display_order, status || 'active', id]
    )

    return await this.getById(id)
  }

  /**
   * Delete a leader
   */
  async delete(id) {
    // Check if leader exists
    await this.getById(id)

    await executeQuery('DELETE FROM leaders WHERE id = ?', [id])
    
    return { success: true, message: 'Leader deleted successfully' }
  }

  /**
   * Get leader statistics
   */
  async getStats() {
    const [stats] = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive
      FROM leaders
    `)
    
    return stats
  }

  /**
   * Update leader display order
   */
  async updateOrder(id, newOrder) {
    await this.getById(id)
    
    await executeQuery(
      'UPDATE leaders SET display_order = ? WHERE id = ?',
      [newOrder, id]
    )
    
    return await this.getById(id)
  }
}

export default new LeaderService()
