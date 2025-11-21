'use client'

import { useState, useEffect } from 'react'
import MemberLayout from '@/components/MemberLayout'

export default function BibleReaderPage() {
  const [selectedBook, setSelectedBook] = useState('Genesis')
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [fontSize, setFontSize] = useState(16)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState({})
  const [highlights, setHighlights] = useState({})
  const [bookmarks, setBookmarks] = useState([])

  const bibleBooks = {
    'Old Testament': [
      { name: 'Genesis', chapters: 50 },
      { name: 'Exodus', chapters: 40 },
      { name: 'Leviticus', chapters: 27 },
      { name: 'Numbers', chapters: 36 },
      { name: 'Deuteronomy', chapters: 34 },
      { name: 'Joshua', chapters: 24 },
      { name: 'Judges', chapters: 21 },
      { name: 'Ruth', chapters: 4 },
      { name: '1 Samuel', chapters: 31 },
      { name: '2 Samuel', chapters: 24 },
      { name: 'Psalms', chapters: 150 },
      { name: 'Proverbs', chapters: 31 }
    ],
    'New Testament': [
      { name: 'Matthew', chapters: 28 },
      { name: 'Mark', chapters: 16 },
      { name: 'Luke', chapters: 24 },
      { name: 'John', chapters: 21 },
      { name: 'Acts', chapters: 28 },
      { name: 'Romans', chapters: 16 },
      { name: '1 Corinthians', chapters: 16 },
      { name: '2 Corinthians', chapters: 13 },
      { name: 'Galatians', chapters: 6 },
      { name: 'Ephesians', chapters: 6 },
      { name: 'Philippians', chapters: 4 },
      { name: 'Colossians', chapters: 4 },
      { name: '1 Thessalonians', chapters: 5 },
      { name: '2 Thessalonians', chapters: 3 },
      { name: 'Revelation', chapters: 22 }
    ]
  }

  // Sample Bible text (in production, this would come from an API)
  const sampleVerses = [
    { verse: 1, text: "In the beginning God created the heavens and the earth." },
    { verse: 2, text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters." },
    { verse: 3, text: "And God said, 'Let there be light,' and there was light." },
    { verse: 4, text: "God saw that the light was good, and he separated the light from the darkness." },
    { verse: 5, text: "God called the light 'day,' and the darkness he called 'night.' And there was evening, and there was morning—the first day." }
  ]

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    const savedNotes = JSON.parse(localStorage.getItem('bible-notes') || '{}')
    const savedHighlights = JSON.parse(localStorage.getItem('bible-highlights') || '{}')
    const savedBookmarks = JSON.parse(localStorage.getItem('bible-bookmarks') || '[]')
    
    setNotes(savedNotes)
    setHighlights(savedHighlights)
    setBookmarks(savedBookmarks)
  }

  const saveNote = (verse, noteText) => {
    const key = `${selectedBook}-${selectedChapter}-${verse}`
    const newNotes = { ...notes, [key]: noteText }
    setNotes(newNotes)
    localStorage.setItem('bible-notes', JSON.stringify(newNotes))
  }

  const toggleHighlight = (verse, color) => {
    const key = `${selectedBook}-${selectedChapter}-${verse}`
    const newHighlights = { ...highlights }
    
    if (newHighlights[key] === color) {
      delete newHighlights[key]
    } else {
      newHighlights[key] = color
    }
    
    setHighlights(newHighlights)
    localStorage.setItem('bible-highlights', JSON.stringify(newHighlights))
  }

  const addBookmark = () => {
    const bookmark = {
      book: selectedBook,
      chapter: selectedChapter,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }
    const newBookmarks = [bookmark, ...bookmarks]
    setBookmarks(newBookmarks)
    localStorage.setItem('bible-bookmarks', JSON.stringify(newBookmarks))
  }

  const removeBookmark = (id) => {
    const newBookmarks = bookmarks.filter(b => b.id !== id)
    setBookmarks(newBookmarks)
    localStorage.setItem('bible-bookmarks', JSON.stringify(newBookmarks))
  }

  const goToBookmark = (bookmark) => {
    setSelectedBook(bookmark.book)
    setSelectedChapter(bookmark.chapter)
  }

  const getCurrentBookInfo = () => {
    for (const testament in bibleBooks) {
      const book = bibleBooks[testament].find(b => b.name === selectedBook)
      if (book) return book
    }
    return { chapters: 1 }
  }

  const currentBook = getCurrentBookInfo()

  const nextChapter = () => {
    if (selectedChapter < currentBook.chapters) {
      setSelectedChapter(selectedChapter + 1)
    }
  }

  const previousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1)
    }
  }

  return (
    <MemberLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <i className="fas fa-book-open text-3xl text-blue-600 dark:text-blue-400 mr-3"></i>
                <h1 className="text-3xl font-heading font-bold text-black dark:text-white">Bible Reader</h1>
              </div>
              <p className="text-gray-600 dark:text-neutral-400">Read, study, and meditate on God's Word</p>
            </div>
            <button
              onClick={addBookmark}
              className="bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <i className="fas fa-bookmark mr-2"></i>
              Bookmark
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Book Selection */}
            <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-neutral-900">
              <h3 className="text-lg font-heading font-bold text-black dark:text-white mb-4 flex items-center">
                <i className="fas fa-bible text-purple-600 dark:text-purple-400 mr-2"></i>
                Select Book
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(bibleBooks).map(([testament, books]) => (
                  <div key={testament}>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-neutral-500 mb-2">{testament}</h4>
                    <div className="space-y-1">
                      {books.map((book) => (
                        <button
                          key={book.name}
                          onClick={() => {
                            setSelectedBook(book.name)
                            setSelectedChapter(1)
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedBook === book.name
                              ? 'bg-blue-600 dark:bg-blue-700 text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-neutral-900 text-gray-700 dark:text-neutral-300'
                          }`}
                        >
                          {book.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookmarks */}
            <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-neutral-900">
              <h3 className="text-lg font-heading font-bold text-black dark:text-white mb-4 flex items-center">
                <i className="fas fa-bookmark text-amber-600 dark:text-amber-400 mr-2"></i>
                Bookmarks
              </h3>
              {bookmarks.length > 0 ? (
                <div className="space-y-2">
                  {bookmarks.slice(0, 5).map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900"
                    >
                      <button
                        onClick={() => goToBookmark(bookmark)}
                        className="flex-1 text-left text-sm text-black dark:text-white hover:text-amber-600 dark:hover:text-amber-400"
                      >
                        {bookmark.book} {bookmark.chapter}
                      </button>
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-neutral-500">No bookmarks yet</p>
              )}
            </div>

            {/* Reading Controls */}
            <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-neutral-900">
              <h3 className="text-lg font-heading font-bold text-black dark:text-white mb-4 flex items-center">
                <i className="fas fa-sliders-h text-teal-600 dark:text-teal-400 mr-2"></i>
                Controls
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    showNotes
                      ? 'bg-purple-600 dark:bg-purple-700 text-white'
                      : 'bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300'
                  }`}
                >
                  <i className="fas fa-sticky-note mr-2"></i>
                  {showNotes ? 'Hide Notes' : 'Show Notes'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Reading Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-900">
              {/* Chapter Navigation */}
              <div className="p-6 border-b border-gray-200 dark:border-neutral-900">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-heading font-bold text-black dark:text-white">
                    {selectedBook} {selectedChapter}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={previousChapter}
                      disabled={selectedChapter === 1}
                      className="px-4 py-2 bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <select
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(Number(e.target.value))}
                      className="px-4 py-2 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((ch) => (
                        <option key={ch} value={ch}>
                          Chapter {ch}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={nextChapter}
                      disabled={selectedChapter === currentBook.chapters}
                      className="px-4 py-2 bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bible Text */}
              <div className="p-8">
                <div className="space-y-4" style={{ fontSize: `${fontSize}px` }}>
                  {sampleVerses.map((verseData) => {
                    const key = `${selectedBook}-${selectedChapter}-${verseData.verse}`
                    const highlightColor = highlights[key]
                    const hasNote = notes[key]

                    return (
                      <div key={verseData.verse} className="group">
                        <div
                          className={`p-4 rounded-lg transition-all ${
                            highlightColor === 'yellow'
                              ? 'bg-yellow-100 dark:bg-yellow-950/30'
                              : highlightColor === 'green'
                              ? 'bg-green-100 dark:bg-green-950/30'
                              : highlightColor === 'blue'
                              ? 'bg-blue-100 dark:bg-blue-950/30'
                              : highlightColor === 'pink'
                              ? 'bg-pink-100 dark:bg-pink-950/30'
                              : 'hover:bg-gray-50 dark:hover:bg-neutral-900'
                          }`}
                        >
                          <div className="flex items-start">
                            <span className="text-sm font-bold text-gray-500 dark:text-neutral-500 mr-3 mt-1">
                              {verseData.verse}
                            </span>
                            <p className="flex-1 text-gray-800 dark:text-neutral-200 leading-relaxed">
                              {verseData.text}
                            </p>
                          </div>

                          {/* Verse Actions */}
                          <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleHighlight(verseData.verse, 'yellow')}
                              className="px-2 py-1 bg-yellow-200 dark:bg-yellow-900 rounded text-xs hover:bg-yellow-300 dark:hover:bg-yellow-800"
                              title="Yellow highlight"
                            >
                              <i className="fas fa-highlighter"></i>
                            </button>
                            <button
                              onClick={() => toggleHighlight(verseData.verse, 'green')}
                              className="px-2 py-1 bg-green-200 dark:bg-green-900 rounded text-xs hover:bg-green-300 dark:hover:bg-green-800"
                              title="Green highlight"
                            >
                              <i className="fas fa-highlighter"></i>
                            </button>
                            <button
                              onClick={() => toggleHighlight(verseData.verse, 'blue')}
                              className="px-2 py-1 bg-blue-200 dark:bg-blue-900 rounded text-xs hover:bg-blue-300 dark:hover:bg-blue-800"
                              title="Blue highlight"
                            >
                              <i className="fas fa-highlighter"></i>
                            </button>
                            <button
                              onClick={() => {
                                const noteText = prompt('Add a note:', notes[key] || '')
                                if (noteText !== null) saveNote(verseData.verse, noteText)
                              }}
                              className={`px-2 py-1 rounded text-xs ${
                                hasNote
                                  ? 'bg-purple-200 dark:bg-purple-900 hover:bg-purple-300 dark:hover:bg-purple-800'
                                  : 'bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700'
                              }`}
                              title="Add note"
                            >
                              <i className="fas fa-sticky-note"></i>
                            </button>
                          </div>

                          {/* Show Note */}
                          {showNotes && hasNote && (
                            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500 rounded">
                              <p className="text-sm text-purple-900 dark:text-purple-200 italic">
                                <i className="fas fa-sticky-note mr-2"></i>
                                {notes[key]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <i className="fas fa-info-circle mr-2"></i>
                    <strong>Note:</strong> This is a demo with sample verses. In production, this would connect to a complete Bible API to display all chapters and verses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  )
}
