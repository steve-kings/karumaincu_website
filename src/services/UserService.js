import { executeQuery } from '@/lib/db'
import bcrypt from 'bcryptjs'

class UserService {
  async getAll(filters = {}) {
    const { search, role, status, limit, offset } = filters
    
    let query = 'SELECT id, email, full_name, role, status, phone, created_at FROM users WHERE 1=1'
    const params = []

    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm)
    }

    if (role) {
      query += ' AND role = ?'
      params.push(role)
    }

    if (status) {
      query += ' AND status = ?'
      params.push(status)
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
    const [user] = await executeQuery(
      'SELECT id, email, full_name, role, status, phone, profile_image, created_at FROM users WHERE id = ?',
      [id]
    )
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user
  }

  async getByEmail(email) {
    const [user] = await executeQuery(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    
    return user || null
  }

  async create(data) {
    const { email, password, full_name, role, phone } = data

    if (!email || !password || !full_name) {
      throw new Error('Email, password, and full name are required')
    }

    // Check if user exists
    const existing = await this.getByEmail(email)
    if (existing) {
      throw new Error('User with this email already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await executeQuery(
      `INSERT INTO users (email, password, full_name, role, phone, status) 
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [email, hashedPassword, full_name, role || 'member', phone]
    )

    return await this.getById(result.insertId)
  }

  async update(id, data) {
    const { full_name, role, status, phone, profile_image } = data

    await this.getById(id)

    await executeQuery(
      `UPDATE users SET full_name = ?, role = ?, status = ?, phone = ?, profile_image = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [full_name, role, status, phone, profile_image, id]
    )

    return await this.getById(id)
  }

  async updatePassword(id, newPassword) {
    await this.getById(id)

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await executeQuery(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, id]
    )

    return { success: true, message: 'Password updated successfully' }
  }

  async delete(id) {
    await this.getById(id)
    await executeQuery('DELETE FROM users WHERE id = ?', [id])
    return { success: true, message: 'User deleted successfully' }
  }

  async getStats() {
    const [stats] = await executeQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN role = 'member' THEN 1 ELSE 0 END) as members,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
      FROM users
    `)
    
    return stats
  }
}

export default new UserService()
