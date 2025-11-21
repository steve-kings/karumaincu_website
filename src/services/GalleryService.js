import { executeQuery } from '@/lib/db'

class GalleryService {
  async getAll(filters = {}) {
    const { search, category, limit, offset } = filters
    
    let query = 'SELECT * FROM galleries WHERE 1=1'
    const params = []

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm)
    }

    if (category && category !== 'all') {
      query += ' AND category = ?'
      params.push(category)
    }

    query += ' ORDER BY created_at DESC'

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
    const [item] = await executeQuery('SELECT * FROM galleries WHERE id = ?', [id])
    
    if (!item) {
      throw new Error('Gallery item not found')
    }
    
    return item
  }

  async create(data, createdBy) {
    const { title, description, url, category, thumbnail_url, platform, is_active } = data

    if (!title || !url) {
      throw new Error('Title and URL are required')
    }

    const result = await executeQuery(
      `INSERT INTO galleries (title, description, url, category, thumbnail_url, platform, is_active, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, url, category || 'other', thumbnail_url || null, platform || 'other', is_active ? 1 : 0, createdBy]
    )

    return await this.getById(result.insertId)
  }

  async update(id, data) {
    const { title, description, url, category, thumbnail_url, platform, is_active } = data

    if (!title || !url) {
      throw new Error('Title and URL are required')
    }

    await this.getById(id)

    await executeQuery(
      `UPDATE galleries SET title = ?, description = ?, url = ?, category = ?, thumbnail_url = ?, platform = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, description, url, category, thumbnail_url, platform, is_active ? 1 : 0, id]
    )

    return await this.getById(id)
  }

  async delete(id) {
    await this.getById(id)
    await executeQuery('DELETE FROM galleries WHERE id = ?', [id])
    return { success: true, message: 'Gallery item deleted successfully' }
  }

  async getStats() {
    const [stats] = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT category) as categories,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
      FROM galleries
    `)
    
    return stats
  }
}

export default new GalleryService()
