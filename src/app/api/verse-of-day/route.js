import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import { generateAutoVerseOfDay } from '@/lib/bibleApi'

/**
 * Public API endpoint for verse of the day
 * Automatically generates verse if editor hasn't added one for today
 */
export async function GET(request) {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // Check if there's a verse for today
    const [existingVerse] = await executeQuery(
      'SELECT * FROM verse_of_day WHERE date = ? ORDER BY id DESC LIMIT 1',
      [today]
    )
    
    if (existingVerse) {
      // Return editor-added verse
      return NextResponse.json({
        success: true,
        data: {
          ...existingVerse,
          auto_generated: false
        }
      })
    }
    
    // No verse for today - generate automatically (NOT stored in database)
    console.log('No verse found for today, generating automatically...')
    
    const autoVerse = await generateAutoVerseOfDay()
    
    // Return auto-generated verse WITHOUT saving to database
    return NextResponse.json({
      success: true,
      data: autoVerse,
      message: 'Auto-generated verse of the day (not stored)'
    })
    
  } catch (error) {
    console.error('Error fetching verse of the day:', error)
    
    // Return fallback verse
    return NextResponse.json({
      success: true,
      data: {
        verse_reference: 'Psalm 118:24',
        verse_text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.',
        commentary: 'Every day is a gift from God. Rejoice and be glad!',
        date: new Date().toISOString().split('T')[0],
        auto_generated: true,
        fallback: true
      }
    })
  }
}

// Allow CORS for public access
export const dynamic = 'force-dynamic'
