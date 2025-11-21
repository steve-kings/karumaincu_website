'use client'

import Link from 'next/link'
import { ArrowLeft, BookOpen, Share2, Heart } from 'lucide-react'

export default function VerseOfDayPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/member" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Verse of the Day</h1>
                <p className="text-gray-600 mt-1">Daily scripture inspiration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Verse */}
        <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Today's Verse
            </h3>
            <blockquote className="text-xl italic mb-4 leading-relaxed">
              "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."
            </blockquote>
            <cite className="text-lg font-semibold">- Jeremiah 29:11 (NIV)</cite>
            <div className="mt-6 flex justify-center space-x-4">
              <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Previous Verses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Previous Verses</h3>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Verse Archive</h3>
            <p className="text-gray-600 mb-4">This section is under development</p>
            <p className="text-sm text-gray-500">
              Features: View previous verses, search archive, save favorites
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
