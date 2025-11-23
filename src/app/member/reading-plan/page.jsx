'use client'

import { useState, useEffect } from 'react'
import MemberLayout from '@/components/MemberLayout'
import { useSocket } from '@/contexts/SocketContext'
import { useRealtimeReadingCalendar } from '@/hooks/useRealtime'

export default function ReadingPlanPage() {
  const { socket } = useSocket()
  const newReading = useRealtimeReadingCalendar()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(false)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  useEffect(() => {
    fetchReadings()
  }, [currentDate])

  // Listen for real-time reading calendar updates
  useEffect(() => {
    if (newReading) {
      setReadings(prev => {
        const exists = prev.some(r => r.id === newReading.id)
        if (exists) {
          return prev.map(r => r.id === newReading.id ? newReading : r)
        }
        return [...prev, newReading].sort((a, b) => a.day - b.day)
      })
    }
  }, [newReading])

  const fetchReadings = async () => {
    try {
      setLoading(true)
      const month = currentDate.getMonth() + 1
      const year = currentDate.getFullYear()
      
      const response = await fetch(`/api/reading-calendar?month=${month}&year=${year}`, {
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

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear()
  }

  const getDaysInMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  }

  return (
    <MemberLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <i className="fas fa-calendar-alt text-3xl text-emerald-600 dark:text-emerald-400 mr-3"></i>
            <h1 className="text-3xl font-heading font-bold text-black dark:text-white">Bible Reading Calendar</h1>
          </div>
          <p className="text-gray-600 dark:text-neutral-400">Follow the church's monthly Bible reading schedule</p>
        </div>

        {/* Month Navigation */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-neutral-900 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => changeMonth(-1)}
              className="px-4 py-2 bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-800 transition-colors"
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Previous
            </button>
            
            <h2 className="text-2xl font-heading font-bold text-black dark:text-white">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => changeMonth(1)}
              className="px-4 py-2 bg-gray-200 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-800 transition-colors"
            >
              Next
              <i className="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Total Readings</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{readings.length}</p>
              </div>
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-book-open text-2xl text-emerald-600 dark:text-emerald-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Days in Month</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{getDaysInMonth()}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-calendar-day text-2xl text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Current Day</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{new Date().getDate()}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-calendar-check text-2xl text-purple-600 dark:text-purple-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Calendar */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-neutral-900">
          <h3 className="text-xl font-heading font-bold text-black dark:text-white mb-6 flex items-center">
            <i className="fas fa-bible text-emerald-600 dark:text-emerald-400 mr-2"></i>
            Monthly Reading Schedule
          </h3>
          
          {loading ? (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-4xl text-emerald-600 dark:text-emerald-400 mb-4"></i>
              <p className="text-gray-600 dark:text-neutral-400">Loading readings...</p>
            </div>
          ) : readings.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-calendar-times text-6xl text-gray-300 dark:text-neutral-700 mb-4"></i>
              <p className="text-gray-600 dark:text-neutral-400 text-lg mb-2">No readings scheduled for this month</p>
              <p className="text-gray-500 dark:text-neutral-500 text-sm">Check back later or contact your church admin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {readings.map((reading) => {
                const today = isToday(reading.day)
                
                return (
                  <div
                    key={reading.id}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      today
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-lg'
                        : 'border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    {/* Day Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        today
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-300 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300'
                      }`}>
                        {reading.day}
                      </div>
                      {today && (
                        <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                          TODAY
                        </span>
                      )}
                    </div>
                    
                    {/* Reading Info */}
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-black dark:text-white mb-2">
                        {reading.book} {reading.chapter_start}
                        {reading.chapter_end && reading.chapter_end !== reading.chapter_start && 
                          `-${reading.chapter_end}`}
                      </h4>
                      
                      {reading.verse_start && (
                        <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">
                          Verses: {reading.verse_start}
                          {reading.verse_end && reading.verse_end !== reading.verse_start && 
                            `-${reading.verse_end}`}
                        </p>
                      )}
                      
                      {reading.devotional_note && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded">
                          <p className="text-sm text-gray-700 dark:text-neutral-300 italic">
                            <i className="fas fa-quote-left text-blue-500 mr-2 text-xs"></i>
                            {reading.devotional_note}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Link to Bible Reader */}
                    <a
                      href={`/member/bible-reader?book=${reading.book}&chapter=${reading.chapter_start}`}
                      className="block w-full text-center px-4 py-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 dark:hover:bg-emerald-800 transition-colors"
                    >
                      <i className="fas fa-book-open mr-2"></i>
                      Read Now
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </MemberLayout>
  )
}
