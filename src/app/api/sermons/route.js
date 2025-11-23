import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const series = searchParams.get('series')
    
    let query = `
      SELECT 
        s.id, s.title, s.description, s.speaker, s.sermon_date as date, 
        s.youtube_url as video_url, s.youtube_id,
        s.thumbnail_url, s.duration, s.series_name as series, s.scripture_reference,
        s.view_count, s.featured as is_featured, s.created_at, s.status,
        u.full_name as uploaded_by_name
      FROM sermons s
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.status = 'published'
    `
    
    const params = []
    
    // Add search filter
    if (search) {
      query += ` AND (
        s.title LIKE ? OR 
        s.speaker LIKE ? OR 
        s.description LIKE ? OR
        s.scripture_reference LIKE ?
      )`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }
    
    // Add series filter
    if (series && series !== 'all') {
      query += ` AND s.series_name = ?`
      params.push(series)
    }
    
    query += ` ORDER BY s.sermon_date DESC, s.created_at DESC LIMIT 100`
    
    const sermons = await executeQuery(query, params)
    
    return NextResponse.json({
      success: true,
      data: sermons,
      count: sermons.length
    })
  } catch (error) {
    console.error('Error fetching sermons:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sermons' },
      { status: 500 }
    )
  }
}
