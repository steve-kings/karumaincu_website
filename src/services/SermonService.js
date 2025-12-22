import { executeQuery } from '@/lib/db'

class SermonService {
  async getAll(filters = {}) {
    const { search, speaker, limit, offset } = filters
    
    let query = 'SELECT * FROM sermons WHERE 1=1'
    const params = []

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR speaker LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    if (speaker) {
      query += ' AND speaker LIKE ?'
      params.push(`%${speaker}%`)
    }

    query += ' ORDER BY sermon_date DESC, created_at DESC'

    // LIMIT and OFFSET must be integers embedded directly (not as prepared statement params)
    if (limit) {
      const limitInt = parseInt(limit, 10) || 50
      const offsetInt = parseInt(offset, 10) || 0
      query += ` LIMIT ${limitInt} OFFSET ${offsetInt}`
    }

    return await executeQuery(query, params)
  }

  async getById(id) {
    const [sermon] = await executeQuery('SELECT * FROM sermons WHERE id = ?', [id])
    
    if (!sermon) {
      throw new Error('Sermon not found')
    }
    
    return sermon
  }

  async create(data, createdBy) {
    const { title, description, speaker, sermon_date, video_url, audio_url, thumbnail_url } = data

    if (!title || !speaker || !sermon_date) {
      throw new Error('Title, speaker, and sermon date are required')
    }

    const result = await executeQuery(
      `INSERT INTO sermons (title, description, speaker, sermon_date, video_url, audio_url, thumbnail_url, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, speaker, sermon_date, video_url, audio_url, thumbnail_url, createdBy]
    )

    return await this.getById(result.insertId)
  }

  async update(id, data) {
    const { title, description, speaker, sermon_date, video_url, audio_url, thumbnail_url } = data

    if (!title || !speaker || !sermon_date) {
      throw new Error('Title, speaker, and sermon date are required')
    }

    await this.getById(id)

    await executeQuery(
      `UPDATE sermons SET title = ?, description = ?, speaker = ?, sermon_date = ?, video_url = ?, audio_url = ?, thumbnail_url = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, description, speaker, sermon_date, video_url, audio_url, thumbnail_url, id]
    )

    return await this.getById(id)
  }

  async delete(id) {
    await this.getById(id)
    await executeQuery('DELETE FROM sermons WHERE id = ?', [id])
    return { success: true, message: 'Sermon deleted successfully' }
  }

  async getStats() {
    const [stats] = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT speaker) as speakers,
        SUM(CASE WHEN video_url IS NOT NULL THEN 1 ELSE 0 END) as with_video,
        SUM(CASE WHEN audio_url IS NOT NULL THEN 1 ELSE 0 END) as with_audio
      FROM sermons
    `)
    
    return stats
  }
}

export default new SermonService()
