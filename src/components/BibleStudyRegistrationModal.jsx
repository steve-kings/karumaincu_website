'use client'

import { useState, useEffect } from 'react'
import { X, BookOpen, MapPin, Calendar, Users } from 'lucide-react'

export default function BibleStudyRegistrationModal({ isOpen, onClose, session, locations }) {
  const [formData, setFormData] = useState({
    session_id: session?.id || '',
    full_name: '',
    email: '',
    phone: '',
    location_id: '',
    year_of_study: '',
    school: '',
    registration_number: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (session) {
      setFormData(prev => ({ ...prev, session_id: session.id }))
    }
  }, [session])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/member/bible-study/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 2000)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('Failed to submit registration')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-neutral-950 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-red-500 animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-6 h-6 text-white" />
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  REGISTRATION OPEN
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {session?.title || 'Bible Study Registration'}
              </h2>
              <p className="text-red-100 text-sm">
                {session?.description || 'Join us for weekly Bible study sessions'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Session Info */}
          {session && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-2 text-white">
                  <Calendar className="w-4 h-4" />
                  <div>
                    <p className="text-xs opacity-80">Deadline</p>
                    <p className="font-semibold text-sm">
                      {new Date(session.registration_deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-2 text-white">
                  <Users className="w-4 h-4" />
                  <div>
                    <p className="text-xs opacity-80">Starts</p>
                    <p className="font-semibold text-sm">
                      {new Date(session.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Registration Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your registration has been submitted for approval.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Wanjiku Mwangi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="wanjiku@student.karu.ac.ke"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="+254 700 000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <select
                    required
                    value={formData.location_id}
                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Location</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.location_name || loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year of Study *
                  </label>
                  <select
                    required
                    value={formData.year_of_study}
                    onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Year</option>
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registration_number}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="E012-01-1234/2024"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  School/Faculty *
                </label>
                <input
                  type="text"
                  required
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., School of Education, School of Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-300 dark:border-neutral-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Any special requirements or questions..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Register Now'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
