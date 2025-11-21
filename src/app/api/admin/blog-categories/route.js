import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

// GET all blog categories
export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get categories with blog count
    const categories = await executeQuery(`
      SELECT 
        c.*,
        COUNT(b.id) as blog_count
      FROM blog_categories c
      LEFT JOIN blogs b ON b.category = c.name
      GROUP BY c.id
      ORDER BY c.name ASC
    `)

    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST create new category
export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if category already exists
    const [existing] = await executeQuery(
      'SELECT id FROM blog_categories WHERE name = ? OR slug = ?',
      [name, slug]
    )

    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
    }

    const result = await executeQuery(
      'INSERT INTO blog_categories (name, slug, description, color) VALUES (?, ?, ?, ?)',
      [name, slug, description || null, '#6366f1']
    )

    const [newCategory] = await executeQuery(
      'SELECT * FROM blog_categories WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ 
      error: 'Failed to create category',
      message: error.message 
    }, { status: 500 })
  }
}
