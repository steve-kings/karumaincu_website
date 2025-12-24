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
    confirmPassword: '',
    doctrinialAgreement: false
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Fetch user data from API
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      console.log('Complete-profile: Fetching user profile...')
      const response = await fetch('/api/auth/profile', {
        credentials: 'include',
        cache: 'no-store'
      })
      
      console.log('Complete-profile: Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Complete-profile: User data received:', data.user?.email)
        setUser(data.user)
        
        // If profile is already complete, redirect to dashboard
        if (data.user.profile_complete) {
          console.log('Complete-profile: Profile already complete, redirecting to member')
          router.push('/member')
        } else {
          console.log('Complete-profile: Profile incomplete, showing form')
        }
      } else {
        console.error('Complete-profile: Authentication failed, status:', response.status)
        const errorData = await response.json().catch(() => ({}))
        console.error('Complete-profile: Error details:', errorData)
        
        // Wait a bit before redirecting to allow cookie to be set
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      }
    } catch (error) {
      console.error('Complete-profile: Error fetching user:', error)
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate doctrinal agreement
    if (!formData.doctrinialAgreement) {
      toast.error('You must agree to the doctrinal statement')
      return
    }
    
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
      console.log('Complete-profile: Submitting profile data...')
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Complete-profile: Submit response:', data)

      if (data.success) {
        toast.success('Profile completed successfully!')
        
        // Redirect to member dashboard (user is already authenticated via Google)
        console.log('Complete-profile: Redirecting to member dashboard')
        window.location.href = '/member'
        return // Don't set loading to false, we're redirecting
      } else {
        toast.error(data.message || 'Failed to update profile')
        setLoading(false)
      }
    } catch (error) {
      console.error('Profile completion error:', error)
      toast.error('An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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

            {/* Doctrinal Agreement */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  id="doctrinialAgreement"
                  name="doctrinialAgreement"
                  type="checkbox"
                  required
                  checked={formData.doctrinialAgreement}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                />
                <label htmlFor="doctrinialAgreement" className="ml-3 block text-sm text-gray-700 dark:text-neutral-300">
                  <span className="font-medium">I agree to the KarUCU Doctrinal Statement</span>
                  <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    By checking this box, I affirm that I believe in the core Christian doctrines as outlined in the 
                    <a href="/about" className="text-purple-600 hover:text-purple-500 ml-1">Statement of Faith</a>.
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
