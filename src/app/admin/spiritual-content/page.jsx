'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Plus, X, Sun, Calendar as CalendarIcon } from 'lucide-react'

export default function SpiritualContentManagementPage() {
  const [activeTab, setActiveTab] = useState('verse-of-day')
  const [loading, setLoading] = useState(false)
  
  // Verse of Day State
  const [verses, setVerses] = useState([])
  const [todayVerse, setTodayVerse] = useState(null)
  const [showVerseForm, setShowVerseForm] = useState(false)
  const [verseForm, setVerseForm] = useState({
    verse_reference: '',
    verse_text: '',
    commentary: '',
    date: new Date().toISOString().split('T')[0]
  })

  // Reading Calendar State
  const [readings, setReadings] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showReadingForm, setShowReadingForm] = useState(false)
  const [editingReading, setEditingReading] = useState(null)
  const [readingForm, setReadingForm] = useState({
    day: '',
    book: '',
    chapter_start: '',
    chapter_end: '',
    verse_start: '',
    verse_end: '',
    devotional_note: ''
  })

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const bibleBooks = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah',
    'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah',
    'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
    'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke',
    'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians',
    'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
    'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ]

  useEffect(() => {
    if (activeTab === 'verse-of-day') {
      fetchVerses()
      fetchTodayVerse()
    } else if (activeTab === 'reading-calendar') {
      fetchReadings()
    }
  }, [activeTab, selectedMonth, selectedYear])

  const fetchTodayVerse = async () => {
    try {
      const response = await fetch('/api/verse-of-day')
      if (response.ok) {
        const data = await response.json()
        setTodayVerse(data.data)
      }
    } catch (error) {
      console.error('Error fetching today verse:', error)
    }
  }

  const fetchVerses = async () => {
    try {
      setLoading(true)
            const response = await fetch('/api/admin/spiritual/verse-of-day', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setVerses(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching verses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReadings = async () => {
    try {
      setLoading(true)
            const response = await fetch(`/api/admin/spiritual/reading-calendar?month=${selectedMonth}&year=${selectedYear}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setReadings(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching readings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerseSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/spiritual/verse-of-day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(verseForm)
      })

      if (response.ok) {
        alert('Verse of the day created successfully!')
        setShowVerseForm(false)
        setVerseForm({
          verse_reference: '',
          verse_text: '',
          commentary: '',
          date: new Date().toISOString().split('T')[0]
        })
        fetchVerses()
        fetchTodayVerse()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to create verse')
      }
    } catch (error) {
      console.error('Error creating verse:', error)
      alert('Error creating verse. Please try again.')
    }
  }

  const handleReadingSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingReading
        ? `/api/admin/spiritual/reading-calendar/${editingReading.id}`
        : '/api/admin/spiritual/reading-calendar'
      
      const method = editingReading ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...readingForm,
          month: selectedMonth,
          year: selectedYear,
          day: parseInt(readingForm.day),
          chapter_start: parseInt(readingForm.chapter_start),
          chapter_end: readingForm.chapter_end ? parseInt(readingForm.chapter_end) : null,
          verse_start: readingForm.verse_start ? parseInt(readingForm.verse_start) : null,
          verse_end: readingForm.verse_end ? parseInt(readingForm.verse_end) : null
        })
      })

      if (response.ok) {
        alert(editingReading ? 'Reading plan updated successfully!' : 'Reading plan created successfully!')
        setShowReadingForm(false)
        setEditingReading(null)
        setReadingForm({
          day: '',
          book: '',
          chapter_start: '',
          chapter_end: '',
          verse_start: '',
          verse_end: '',
          devotional_note: ''
        })
        fetchReadings()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to save reading plan')
      }
    } catch (error) {
      console.error('Error saving reading:', error)
      alert('Error saving reading plan. Please try again.')
    }
  }

  const handleEditReading = (reading) => {
    setEditingReading(reading)
    setReadingForm({
      day: reading.day.toString(),
      book: reading.book,
      chapter_start: reading.chapter_start.toString(),
      chapter_end: reading.chapter_end ? reading.chapter_end.toString() : '',
      verse_start: reading.verse_start ? reading.verse_start.toString() : '',
      verse_end: reading.verse_end ? reading.verse_end.toString() : '',
      devotional_note: reading.devotional_note || ''
    })
    setShowReadingForm(true)
  }

  const handleDeleteReading = async (id) => {
    if (!confirm('Are you sure you want to delete this reading plan?')) return

    try {
      const response = await fetch(`/api/admin/spiritual/reading-calendar/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        alert('Reading plan deleted successfully!')
        fetchReadings()
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete reading plan')
      }
    } catch (error) {
      console.error('Error deleting reading:', error)
      alert('Error deleting reading plan. Please try again.')
    }
  }

  const handleCleanupOldVerses = async () => {
    if (!confirm('This will delete all verses older than 30 days. Continue?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/spiritual/cleanup-old-verses', {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Successfully deleted ${data.deleted} old verses`)
        fetchVerses()
      } else {
        alert('Failed to cleanup old verses')
      }
    } catch (error) {
      console.error('Error cleaning up verses:', error)
      alert('Error cleaning up verses')
    }
  }

  const tabs = [
    { id: 'verse-of-day', name: 'Verse of Day', icon: 'fas fa-sun' },
    { id: 'reading-calendar', name: 'Reading Calendar', icon: 'fas fa-calendar-alt' },
    { id: 'statistics', name: 'Statistics', icon: 'fas fa-chart-bar' }
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Spiritual Content Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage spiritual resources and content</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Verses</p>
              <p className="text-2xl font-bold text-purple-600">{verses.length}</p>
            </div>
            <Sun className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reading Entries</p>
              <p className="text-2xl font-bold text-teal-600">{readings.length}</p>
            </div>
            <CalendarIcon className="w-10 h-10 text-teal-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-blue-600">{readings.length}</p>
            </div>
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Content</p>
              <p className="text-2xl font-bold text-green-600">{verses.length + readings.length}</p>
            </div>
            <i className="fas fa-cross text-4xl text-green-600"></i>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-neutral-800">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Verse of Day Tab */}
          {activeTab === 'verse-of-day' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Verse of the Day Management</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCleanupOldVerses}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    title="Delete verses older than 30 days"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Cleanup Old Verses
                  </button>
                  <button
                    onClick={() => setShowVerseForm(!showVerseForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add New Verse
                  </button>
                </div>
              </div>

              {/* Today's Verse Preview */}
              {todayVerse && (
                <div className={`rounded-lg p-6 border-2 ${
                  todayVerse.auto_generated 
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800' 
                    : 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        Today's Verse ({new Date().toLocaleDateString()})
                      </h4>
                    </div>
                    {todayVerse.auto_generated && (
                      <span className="bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-semibold px-3 py-1 rounded-full">
                        Auto-Generated
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-purple-600 dark:text-purple-400">{todayVerse.verse_reference}</p>
                    <p className="text-gray-700 dark:text-gray-300">{todayVerse.verse_text}</p>
                    {todayVerse.commentary && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm italic">{todayVerse.commentary}</p>
                    )}
                  </div>
                  {todayVerse.auto_generated && (
                    <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-950/40 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        <i className="fas fa-info-circle mr-2"></i>
                        This verse was automatically generated from the Bible API. Add your own verse above to replace it.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Verse Form */}
              {showVerseForm && (
                <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-6">
                  <form onSubmit={handleVerseSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Verse Reference *
                        </label>
                        <input
                          type="text"
                          required
                          value={verseForm.verse_reference}
                          onChange={(e) => setVerseForm({...verseForm, verse_reference: e.target.value})}
                          className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., John 3:16"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={verseForm.date}
                          onChange={(e) => setVerseForm({...verseForm, date: e.target.value})}
                          className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Verse Text *
                      </label>
                      <textarea
                        required
                        value={verseForm.verse_text}
                        onChange={(e) => setVerseForm({...verseForm, verse_text: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="3"
                        placeholder="Enter the verse text..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Commentary (Optional)
                      </label>
                      <textarea
                        value={verseForm.commentary}
                        onChange={(e) => setVerseForm({...verseForm, commentary: e.target.value})}
                        className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows="3"
                        placeholder="Add a brief commentary..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Create Verse
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowVerseForm(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Recent Verses */}
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Recent Verses</h4>
                <div className="space-y-3">
                  {verses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Sun className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No verses created yet. Add your first verse above!</p>
                    </div>
                  ) : (
                    verses.map((verse) => (
                      <div key={verse.id} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-purple-600 dark:text-purple-400">{verse.verse_reference}</h5>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">{verse.verse_text}</p>
                            {verse.commentary && (
                              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 italic">{verse.commentary}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {new Date(verse.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reading Calendar Tab */}
          {activeTab === 'reading-calendar' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Bible Reading Calendar</h3>
                  <div className="flex space-x-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="px-3 py-1 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {months.map((month, index) => (
                        <option key={index} value={index + 1}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="px-3 py-1 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {[2024, 2025, 2026].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setShowReadingForm(!showReadingForm)}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Reading
                </button>
              </div>

              {/* Reading Form */}
              {showReadingForm && (
                <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-6">
                  <form onSubmit={handleReadingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Day *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="31"
                          required
                          value={readingForm.day}
                          onChange={(e) => setReadingForm({...readingForm, day: e.target.value})}
                          className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Book *
                        </label>
                        <select
                          required
                          value={readingForm.book}
                          onChange={(e) => setReadingForm({...readingForm, book: e.target.value})}
                          className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select a book</option>
                          {bibleBooks.map(book => (
                            <option key={book} value={book}>{book}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Chapter *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={readingForm.chapter_start}
                          onChange={(e) => setReadingForm({...readingForm, chapter_start: e.target.value})}
                          className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        {editingReading ? 'Update Reading' : 'Create Reading'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReadingForm(false)
                          setEditingReading(null)
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reading Calendar */}
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  {months[selectedMonth - 1]} {selectedYear} Reading Plan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {readings.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No reading plan for this month. Add readings above!</p>
                    </div>
                  ) : (
                    readings.map((reading) => (
                      <div key={reading.id} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-400 text-xs font-semibold px-2 py-1 rounded">
                                Day {reading.day}
                              </span>
                            </div>
                            <h5 className="font-semibold text-gray-800 dark:text-white">
                              {reading.book} {reading.chapter_start}
                              {reading.chapter_end && reading.chapter_end !== reading.chapter_start && 
                                `-${reading.chapter_end}`}
                            </h5>
                            {reading.devotional_note && (
                              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{reading.devotional_note}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleEditReading(reading)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                              title="Edit reading"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteReading(reading.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                              title="Delete reading"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Spiritual Content Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4">
                    <Sun className="w-5 h-5 inline mr-2" />
                    Verse of Day Statistics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-700 dark:text-purple-400">Total Verses:</span>
                      <span className="font-semibold text-purple-800 dark:text-purple-300">{verses.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-teal-800 dark:text-teal-300 mb-4">
                    <CalendarIcon className="w-5 h-5 inline mr-2" />
                    Reading Calendar Statistics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-teal-700 dark:text-teal-400">Total Readings:</span>
                      <span className="font-semibold text-teal-800 dark:text-teal-300">{readings.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
