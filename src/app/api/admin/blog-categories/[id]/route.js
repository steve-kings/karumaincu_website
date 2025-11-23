import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { executeQuery } from '@/lib/db'

// GET single category
export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const [category] = await executeQuery(
      'SELECT * FROM blog_categories WHERE id = ?',
      [id]
    )

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

// PUT update category
export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    // Check if category exists
    const [existing] = await executeQuery(
      'SELECT id FROM blog_categories WHERE id = ?',
      [id]
    )

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if new name conflicts with another category
    const [duplicate] = await executeQuery(
      'SELECT id FROM blog_categories WHERE name = ? AND id != ?',
      [name, id]
    )

    if (duplicate) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Update category
    await executeQuery(
      'UPDATE blog_categories SET name = ?, slug = ?, description = ? WHERE id = ?',
      [name, slug, description || null, id]
    )

    // Update all blogs using the old category name
    const oldName = existing.name
    if (oldName !== name) {
      await executeQuery(
        'UPDATE blogs SET category = ? WHERE category = ?',
        [name, oldName]
      )
    }

    const [updated] = await executeQuery(
      'SELECT * FROM blog_categories WHERE id = ?',
      [id]
    )

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: updated
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE category
export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if category exists
    const [category] = await executeQuery(
      'SELECT * FROM blog_categories WHERE id = ?',
      [id]
    )

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Set category to NULL for all blogs using this category
    await executeQuery(
      'UPDATE blogs SET category = NULL WHERE category = ?',
      [category.name]
    )

    // Delete category
    await executeQuery('DELETE FROM blog_categories WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
