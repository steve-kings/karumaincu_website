import { executeQuery } from '@/lib/db'

class BlogService {
  async getAll(filters = {}) {
    const { search, status, author_id, limit, offset } = filters
    
    let query = `
      SELECT b.*, u.full_name as author_name, u.email as author_email
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE 1=1
    `
    const params = []

    if (search) {
      query += ' AND (b.title LIKE ? OR b.content LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm)
    }

    if (status) {
      query += ' AND b.status = ?'
      params.push(status)
    }

    if (author_id) {
      query += ' AND b.author_id = ?'
      params.push(author_id)
    }

    query += ' ORDER BY b.created_at DESC'

    if (limit) {
      query += ' LIMIT ?'
      params.push(parseInt(limit))
      
      if (offset) {
        query += ' OFFSET ?'
        params.push(parseInt(offset))
      }
    }

    const blogs = await executeQuery(query, params)
    
    // Parse JSON tags for each blog
    return blogs.map(blog => ({
      ...blog,
      tags: blog.tags ? (typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags) : []
    }))
  }

  async getById(id) {
    const [blog] = await executeQuery(`
      SELECT b.*, u.full_name as author_name, u.email as author_email
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.id = ?
    `, [id])
    
    if (!blog) {
      throw new Error('Blog not found')
    }
    
    // Parse JSON tags
    if (blog.tags) {
      blog.tags = typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags
    } else {
      blog.tags = []
    }
    
    return blog
  }

  async create(data, authorId) {
    const { title, content, excerpt, featured_image, category, tags, status } = data

    if (!title || !content) {
      throw new Error('Title and content are required')
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now()

    // Handle tags - convert to JSON if it's a string or array
    let tagsJson = null
    if (tags) {
      if (typeof tags === 'string') {
        // If it's a comma-separated string, convert to array
        tagsJson = JSON.stringify(tags.split(',').map(t => t.trim()).filter(t => t))
      } else if (Array.isArray(tags)) {
        tagsJson = JSON.stringify(tags)
      } else {
        tagsJson = JSON.stringify([tags])
      }
    }

    const result = await executeQuery(
      `INSERT INTO blogs (title, slug, content, excerpt, featured_image, category, tags, status, author_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        slug,
        content, 
        excerpt || null, 
        featured_image || null, 
        category || null, 
        tagsJson, 
        status || 'draft', 
        authorId
      ]
    )

    return await this.getById(result.insertId)
  }

  async update(id, data) {
    const { title, content, excerpt, featured_image, category, tags, status, rejection_reason } = data

    // Get existing blog
    const existingBlog = await this.getById(id)

    // If only status is being updated (approve/reject), don't require title/content
    const isStatusUpdate = status && !title && !content
    
    if (!isStatusUpdate && (!title || !content)) {
      throw new Error('Title and content are required')
    }

    // Build update query dynamically
    const updates = []
    const params = []

    if (title) {
      updates.push('title = ?')
      params.push(title)
    }

    if (content) {
      updates.push('content = ?')
      params.push(content)
    }

    if (excerpt !== undefined) {
      updates.push('excerpt = ?')
      params.push(excerpt || null)
    }

    if (featured_image !== undefined) {
      updates.push('featured_image = ?')
      params.push(featured_image || null)
    }

    if (category !== undefined) {
      updates.push('category = ?')
      params.push(category || null)
    }

    if (tags !== undefined) {
      // Handle tags - convert to JSON if it's a string or array
      let tagsJson = null
      if (tags) {
        if (typeof tags === 'string') {
          tagsJson = JSON.stringify(tags.split(',').map(t => t.trim()).filter(t => t))
        } else if (Array.isArray(tags)) {
          tagsJson = JSON.stringify(tags)
        } else {
          tagsJson = JSON.stringify([tags])
        }
      }
      updates.push('tags = ?')
      params.push(tagsJson)
    }

    if (status) {
      updates.push('status = ?')
      params.push(status)
    }

    if (rejection_reason !== undefined) {
      updates.push('rejection_reason = ?')
      params.push(rejection_reason || null)
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    params.push(id)

    await executeQuery(
      `UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`,
      params
    )

    return await this.getById(id)
  }

  async delete(id) {
    await this.getById(id)
    await executeQuery('DELETE FROM blogs WHERE id = ?', [id])
    return { success: true, message: 'Blog deleted successfully' }
  }

  async getStats(authorId = null) {
    let query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts
      FROM blogs
    `
    const params = []

    if (authorId) {
      query += ' WHERE author_id = ?'
      params.push(authorId)
    }

    const [stats] = await executeQuery(query, params)
    return stats
  }
}

export default new BlogService()
