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

    // LIMIT and OFFSET must be integers embedded directly (not as prepared statement params)
    if (limit) {
      const limitInt = parseInt(limit, 10) || 50
      const offsetInt = parseInt(offset, 10) || 0
      query += ` LIMIT ${limitInt} OFFSET ${offsetInt}`
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
    const user = await this.getById(id)

    // Build dynamic update query
    const updates = []
    const params = []

    if (data.full_name !== undefined) {
      updates.push('full_name = ?')
      params.push(data.full_name)
    }

    if (data.role !== undefined) {
      updates.push('role = ?')
      params.push(data.role)
    }

    if (data.status !== undefined) {
      updates.push('status = ?')
      params.push(data.status)
    }

    if (data.phone !== undefined) {
      updates.push('phone = ?')
      params.push(data.phone)
    }

    if (data.profile_image !== undefined) {
      updates.push('profile_image = ?')
      params.push(data.profile_image)
    }

    if (updates.length === 0) {
      return user
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    params.push(id)

    await executeQuery(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
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
