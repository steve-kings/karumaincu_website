'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Share2, Heart, Loader2 } from 'lucide-react'

export default function VerseOfDayPage() {
  const [verse, setVerse] = useState(null)
  const [previousVerses, setPreviousVerses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingPrevious, setLoadingPrevious] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchVerseOfDay()
    fetchPreviousVerses()
  }, [])

  const fetchVerseOfDay = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/verse-of-day', {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        setVerse(data.data)
      }
    } catch (error) {
      console.error('Error fetching verse:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPreviousVerses = async () => {
    try {
      setLoadingPrevious(true)
      const response = await fetch('/api/verse-of-day/previous', {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        setPreviousVerses(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching previous verses:', error)
    } finally {
      setLoadingPrevious(false)
    }
  }

  const handleShare = () => {
    const text = `${verse.verse_text}\n\n- ${verse.verse_reference}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Verse of the Day',
        text: text
      })
    } else {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 shadow-sm border-b border-gray-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/member" className="text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verse of the Day</h1>
                <p className="text-gray-600 dark:text-neutral-400 mt-1">Daily scripture inspiration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Verse */}
        {loading ? (
          <div className="bg-purple-600 rounded-2xl p-8 text-white mb-8">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
              <p className="text-lg">Loading today's verse...</p>
            </div>
          </div>
        ) : verse ? (
          <div className="bg-purple-600 dark:bg-purple-700 rounded-2xl p-8 text-white mb-8 shadow-xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <BookOpen className="w-6 h-6" />
                <h3 className="text-2xl font-bold">
                  Today's Verse
                </h3>
              </div>
              
              {verse.auto_generated && (
                <div className="mb-4 inline-block px-3 py-1 bg-white/20 rounded-full text-sm">
                  <i className="fas fa-magic mr-2"></i>
                  Auto-generated
                </div>
              )}
              
              <blockquote className="text-xl md:text-2xl italic mb-6 leading-relaxed">
                "{verse.verse_text}"
              </blockquote>
              
              <cite className="text-lg md:text-xl font-semibold block mb-4">
                - {verse.verse_reference}
              </cite>
              
              {verse.commentary && (
                <p className="text-white/90 text-base md:text-lg mb-6 max-w-2xl mx-auto">
                  {verse.commentary}
                </p>
              )}
              
              <div className="mt-6 flex justify-center space-x-4">
                <button 
                  onClick={handleShare}
                  className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
                >
                  {copied ? (
                    <>
                      <i className="fas fa-check"></i>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
                <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Save</span>
                </button>
              </div>
              
              <div className="mt-6 text-sm text-white/70">
                <i className="fas fa-calendar mr-2"></i>
                {new Date(verse.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl p-8 text-center">
            <i className="fas fa-exclamation-circle text-4xl text-red-600 dark:text-red-400 mb-4"></i>
            <p className="text-red-700 dark:text-red-300">Failed to load verse. Please try again.</p>
          </div>
        )}

        {/* Previous Verses */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow border border-gray-200 dark:border-neutral-800 p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <i className="fas fa-history text-purple-600 dark:text-purple-400"></i>
            Previous Verses
          </h3>
          
          {loadingPrevious ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-neutral-400">Loading previous verses...</p>
            </div>
          ) : previousVerses.length > 0 ? (
            <div className="space-y-4">
              {previousVerses.map((prevVerse, index) => (
                <div 
                  key={prevVerse.id || index}
                  className="border border-gray-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-50 dark:bg-neutral-950"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                      <i className="fas fa-calendar"></i>
                      <span>
                        {new Date(prevVerse.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {prevVerse.verse_reference}
                    </span>
                  </div>
                  
                  <blockquote className="text-gray-700 dark:text-neutral-300 italic mb-3 leading-relaxed">
                    "{prevVerse.verse_text}"
                  </blockquote>
                  
                  {prevVerse.commentary && (
                    <p className="text-sm text-gray-600 dark:text-neutral-400 border-l-2 border-purple-300 dark:border-purple-700 pl-3">
                      {prevVerse.commentary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Previous Verses</h3>
              <p className="text-gray-600 dark:text-neutral-400 mb-4">
                Previous verses will appear here once they are added
              </p>
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                Check back tomorrow for more verses!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
