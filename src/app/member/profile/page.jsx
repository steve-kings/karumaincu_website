'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MemberLayout from '@/components/MemberLayout'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    course: '',
    year_of_study: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFormData({
          full_name: data.user.full_name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          course: data.user.course || '',
          year_of_study: data.user.year_of_study || ''
        })
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setEditing(false)
        fetchProfile()
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    }
  }

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-neutral-400">Loading profile...</p>
          </div>
        </div>
      </MemberLayout>
    )
  }

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <i className="fas fa-user-circle text-3xl text-purple-600 dark:text-purple-400 mr-3"></i>
            <h1 className="text-3xl font-heading font-bold text-black dark:text-white">My Profile</h1>
          </div>
          <p className="text-gray-600 dark:text-neutral-400">Manage your account information</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
          }`}>
            <div className="flex items-center">
              <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
              {message.text}
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-900 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-teal-600 dark:from-purple-700 dark:to-teal-700 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold">
                {user?.full_name?.charAt(0) || 'M'}
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold">{user?.full_name}</h2>
                <p className="text-purple-100">{user?.email}</p>
                <p className="text-sm text-purple-200 mt-1 flex items-center">
                  <i className="fas fa-clock mr-2"></i>
                  Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {!editing ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user text-purple-600 dark:text-purple-400"></i>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">
                        Full Name
                      </label>
                      <div className="text-lg text-black dark:text-white font-medium">{user?.full_name}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-950 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-id-card text-teal-600 dark:text-teal-400"></i>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">
                        Registration Number
                      </label>
                      <div className="text-lg text-black dark:text-white font-medium">{user?.registration_number}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-envelope text-emerald-600 dark:text-emerald-400"></i>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">
                        Email Address
                      </label>
                      <div className="text-lg text-black dark:text-white font-medium">{user?.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-phone text-amber-600 dark:text-amber-400"></i>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">
                        Phone Number
                      </label>
                      <div className="text-lg text-black dark:text-white font-medium">{user?.phone || 'Not provided'}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-graduation-cap text-indigo-600 dark:text-indigo-400"></i>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">
                        Course/Program
                      </label>
                      <div className="text-lg text-black dark:text-white font-medium">{user?.course || 'Not specified'}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-rose-100 dark:bg-rose-950 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-calendar-alt text-rose-600 dark:text-rose-400"></i>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">
                        Year of Study
                      </label>
                      <div className="text-lg text-black dark:text-white font-medium">
                        {user?.year_of_study ? `Year ${user.year_of_study}` : 'Not specified'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user-tag text-blue-600 dark:text-blue-400"></i>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">
                        Member Type
                      </label>
                      <div className="text-lg text-black dark:text-white font-medium capitalize">{user?.member_type || 'Student'}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-check-circle text-green-600 dark:text-green-400"></i>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">
                        Account Status
                      </label>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300">
                        <i className="fas fa-check mr-2"></i>
                        Active
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-neutral-900">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                      <i className="fas fa-user mr-2"></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                      <i className="fas fa-envelope mr-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                      <i className="fas fa-phone mr-2"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                      <i className="fas fa-graduation-cap mr-2"></i>
                      Course/Program
                    </label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      Year of Study
                    </label>
                    <select
                      name="year_of_study"
                      value={formData.year_of_study}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                    >
                      <option value="">Select Year</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                      <option value="5">Year 5</option>
                      <option value="6">Year 6</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-neutral-900 flex space-x-4">
                  <button
                    type="submit"
                    className="bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                  >
                    <i className="fas fa-save mr-2"></i>
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      setMessage({ type: '', text: '' })
                      fetchProfile()
                    }}
                    className="bg-gray-200 dark:bg-neutral-900 hover:bg-gray-300 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                  >
                    <i className="fas fa-times mr-2"></i>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </MemberLayout>
  )
}
