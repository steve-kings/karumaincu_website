'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Plus, X, Sun, Calendar as CalendarIcon } from 'lucide-react'

export default function SpiritualContentManagementPage() {
  const [activeTab, setActiveTab] = useState('verse-of-day')
  const [loading, setLoading] = useState(false)
  
  // Verse of Day State
  const [verses, setVerses] = useState([])
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
    } else if (activeTab === 'reading-calendar') {
      fetchReadings()
    }
  }, [activeTab, selectedMonth, selectedYear])

  const fetchVerses = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/spiritual/verse-of-day', {
        headers: { 'Authorization': `Bearer ${token}` }
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
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/spiritual/reading-calendar?month=${selectedMonth}&year=${selectedYear}`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/spiritual/verse-of-day', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(verseForm)
      })

      if (response.ok) {
        setShowVerseForm(false)
        setVerseForm({
          verse_reference: '',
          verse_text: '',
          commentary: '',
          date: new Date().toISOString().split('T')[0]
        })
        fetchVerses()
      }
    } catch (error) {
      console.error('Error creating verse:', error)
    }
  }

  const handleReadingSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/spiritual/reading-calendar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
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
        setShowReadingForm(false)
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
      }
    } catch (error) {
      console.error('Error creating reading:', error)
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
                <button
                  onClick={() => setShowVerseForm(!showVerseForm)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add New Verse
                </button>
              </div>

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
                        Create Reading
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReadingForm(false)}
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
