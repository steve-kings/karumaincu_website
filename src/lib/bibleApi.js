/**
 * Bible API Integration using bible-api.com
 * Simple, free API with KJV and NIV support
 * No authentication required, CORS-enabled
 */

const BIBLE_API_BASE = 'https://bible-api.com'

/**
 * Fetch a chapter from the Bible API
 * @param {string} book - Book name (e.g., "John", "Genesis")
 * @param {number} chapter - Chapter number
 * @param {string} translation - Translation (kjv or niv, default: kjv)
 * @returns {Promise<Object>} Chapter data with verses
 */
export async function fetchChapterFromAPI(book, chapter, translation = 'kjv') {
  try {
    // Format: book chapter (e.g., "john 3")
    const reference = `${book} ${chapter}`
    const url = `${BIBLE_API_BASE}/${encodeURIComponent(reference)}?translation=${translation}`
    
    console.log('Fetching from Bible API:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch chapter: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Parse verses from the response
    const verses = parseVersesFromResponse(data)
    
    return {
      book: data.reference || book,
      chapter: chapter,
      verses: verses,
      translation: translation.toUpperCase(),
      reference: data.reference
    }
  } catch (error) {
    console.error('Error fetching chapter from Bible API:', error)
    throw error
  }
}

/**
 * Parse verses from bible-api.com response
 * The API returns verses in an array with verse numbers and text
 */
function parseVersesFromResponse(data) {
  if (!data.verses || !Array.isArray(data.verses)) {
    return []
  }
  
  return data.verses.map(v => ({
    verse: v.verse,
    text: v.text.trim()
  }))
}

/**
 * Fetch a single verse or verse range
 * @param {string} reference - Verse reference (e.g., "John 3:16" or "John 3:16-17")
 * @param {string} translation - Translation (kjv or niv, default: kjv)
 * @returns {Promise<Object>} Verse data
 */
export async function fetchVerseFromAPI(reference, translation = 'kjv') {
  try {
    const url = `${BIBLE_API_BASE}/${encodeURIComponent(reference)}?translation=${translation}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch verse: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      reference: data.reference,
      text: data.text,
      translation: translation.toUpperCase(),
      verses: data.verses || []
    }
  } catch (error) {
    console.error('Error fetching verse from Bible API:', error)
    throw error
  }
}

/**
 * Get verse of the day - rotates through curated verses
 */
const DAILY_VERSES = [
  'John 3:16',
  'Philippians 4:13',
  'Jeremiah 29:11',
  'Proverbs 3:5-6',
  'Romans 8:28',
  'Psalm 23:1-4',
  'Isaiah 41:10',
  'Matthew 6:33',
  'Joshua 1:9',
  'Psalm 46:1',
  'Romans 12:2',
  'Proverbs 16:3',
  'Psalm 119:105',
  'Matthew 11:28-30',
  'Galatians 5:22-23',
  '2 Timothy 1:7',
  'James 1:2-4',
  'Ephesians 2:8-9',
  'Psalm 27:1',
  'John 14:6',
  'Romans 5:8',
  'Psalm 37:4',
  'Colossians 3:23',
  'Hebrews 11:1',
  'Matthew 5:14-16',
  'Psalm 91:1-2',
  '1 Corinthians 13:4-7',
  'Proverbs 22:6',
  'Isaiah 40:31',
  'John 15:5',
  'Psalm 139:14'
]

export function getTodaysVerseReference() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now - start
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)
  
  const index = dayOfYear % DAILY_VERSES.length
  return DAILY_VERSES[index]
}

/**
 * Generate automatic verse of the day
 */
export async function generateAutoVerseOfDay(translation = 'kjv') {
  const reference = getTodaysVerseReference()
  
  try {
    const verseData = await fetchVerseFromAPI(reference, translation)
    
    const commentary = `Today's verse reminds us of God's faithfulness and love. Take time to meditate on these words and let them guide your day.`
    
    return {
      verse_reference: verseData.reference,
      verse_text: verseData.text,
      commentary: commentary,
      date: new Date().toISOString().split('T')[0],
      auto_generated: true
    }
  } catch (error) {
    console.error('Error generating auto verse:', error)
    
    // Fallback verse if API fails
    return {
      verse_reference: 'John 3:16',
      verse_text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      commentary: 'God\'s love for us is immeasurable. He gave His only Son so that we might have eternal life.',
      date: new Date().toISOString().split('T')[0],
      auto_generated: true,
      fallback: true
    }
  }
}

/**
 * Get available Bible versions
 * Note: bible-api.com primarily supports KJV and WEB (World English Bible)
 * NIV may not be available due to copyright restrictions
 */
export function getAvailableVersions() {
  return [
    { id: 'kjv', name: 'King James Version', language: 'English' },
    { id: 'web', name: 'World English Bible', language: 'English' }
  ]
}
