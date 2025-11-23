import { NextResponse } from 'next/server'
import { fetchChapterFromAPI } from '@/lib/bibleApi'

/**
 * Public API endpoint to fetch Bible chapters
 * GET /api/bible/chapter?book=john&chapter=3&translation=kjv
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const book = searchParams.get('book')
    const chapter = searchParams.get('chapter')
    const translation = searchParams.get('translation') || 'kjv'
    
    if (!book || !chapter) {
      return NextResponse.json({
        success: false,
        error: 'Book and chapter parameters are required'
      }, { status: 400 })
    }
    
    const chapterData = await fetchChapterFromAPI(book, parseInt(chapter), translation)
    
    return NextResponse.json({
      success: true,
      data: chapterData
    })
    
  } catch (error) {
    console.error('Error fetching Bible chapter:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch chapter'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
