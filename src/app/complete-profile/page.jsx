'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CompleteProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    memberType: 'student',
    registrationNumber: '',
    phone: '',
    course: '',
    yearOfStudy: '',
    staffId: '',
    alumniYear: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/login')
    }
  }, [router])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate password if provided
    if (formData.password) {
      if (formData.password.length < 4) {
        toast.error('Password must be at least 4 characters')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
    }
    
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Profile completed successfully! Redirecting...')
        
        // Update user data in localStorage
        const updatedUser = { ...user, profileComplete: true, ...data.user }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // Hard redirect to dashboard
        setTimeout(() => {
          window.location.href = '/member'
        }, 1000)
      } else {
        toast.error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile completion error:', error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold text-black dark:text-white">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-gray-600 dark:text-neutral-400">
            Please provide additional information to complete your registration
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-neutral-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                <i className="fas fa-user-tag mr-2"></i>
                Member Type *
              </label>
              <select
                name="memberType"
                value={formData.memberType}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
              >
                <option value="student">Student</option>
                <option value="associate">Associate (Staff/Alumni)</option>
              </select>
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                <i className="fas fa-id-card mr-2"></i>
                {formData.memberType === 'student' ? 'Registration Number' : 'Staff ID / Alumni ID'} *
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                placeholder={formData.memberType === 'student' ? 'e.g., C027-01-1234/2021' : 'Enter your ID'}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                <i className="fas fa-phone mr-2"></i>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                placeholder="+254712345678"
              />
            </div>

            {/* Student-specific fields */}
            {formData.memberType === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    <i className="fas fa-book mr-2"></i>
                    Course *
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required={formData.memberType === 'student'}
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                    placeholder="e.g., Bachelor of Science in Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    <i className="fas fa-graduation-cap mr-2"></i>
                    Year of Study *
                  </label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    required={formData.memberType === 'student'}
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                  >
                    <option value="">Select Year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                    <option value="5">Year 5</option>
                  </select>
                </div>
              </>
            )}

            {/* Associate-specific fields */}
            {formData.memberType === 'associate' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  <i className="fas fa-calendar mr-2"></i>
                  Alumni Year (if applicable)
                </label>
                <input
                  type="number"
                  name="alumniYear"
                  value={formData.alumniYear}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                  placeholder="e.g., 2020"
                  min="1990"
                  max={new Date().getFullYear()}
                />
              </div>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-950 text-gray-500 dark:text-neutral-500">
                  Optional: Set a password for manual login
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                <i className="fas fa-lock mr-2"></i>
                Password (Optional - for manual login)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 pr-12 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                  placeholder="Minimum 4 characters"
                  minLength="4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                Set a password if you want to login manually without Google
              </p>
            </div>

            {/* Confirm Password Field */}
            {formData.password && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  <i className="fas fa-lock mr-2"></i>
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-neutral-900 text-black dark:text-white"
                  placeholder="Re-enter your password"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completing Profile...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle mr-2"></i>
                  Complete Profile
                </>
              )}
            </button>
          </form>
        </div>

        {/* Note */}
        <div className="text-center text-sm text-gray-600 dark:text-neutral-400">
          <i className="fas fa-info-circle mr-1"></i>
          All fields marked with * are required
        </div>
      </div>
    </div>
  )
}
