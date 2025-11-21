'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MemberLayout from '@/components/MemberLayout'
import BibleStudyRegistrationModal from '@/components/BibleStudyRegistrationModal'
import { BookOpen, AlertCircle } from 'lucide-react'

export default function MemberDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openSession, setOpenSession] = useState(null)
  const [locations, setLocations] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [hasRegistered, setHasRegistered] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchUserData()
    checkOpenSessions()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        fetchUserData(),
        checkOpenSessions()
      ])
    } finally {
      setRefreshing(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const profileResponse = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setUser(profileData.user)
      } else {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkOpenSessions = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Check for open sessions
      const sessionsResponse = await fetch('/api/member/bible-study/sessions')
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json()
        if (sessionsData.data && sessionsData.data.length > 0) {
          setOpenSession(sessionsData.data[0])
          
          // Get locations
          const locationsResponse = await fetch('/api/member/bible-study/locations')
          if (locationsResponse.ok) {
            const locationsData = await locationsResponse.json()
            setLocations(locationsData.data || [])
          }
          
          // Check if user already registered
          if (token) {
            const myRegsResponse = await fetch('/api/member/bible-study/my-registrations', {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            if (myRegsResponse.ok) {
              const myRegsData = await myRegsResponse.json()
              const registered = myRegsData.data?.some(r => r.session_id === sessionsData.data[0].id)
              setHasRegistered(registered)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking sessions:', error)
    }
  }

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </MemberLayout>
    )
  }

  const tools = [
    {
      href: '/member/bible-reader',
      icon: 'fa-book-open',
      title: 'Bible Reader',
      description: 'Read and study Scripture',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      borderColor: 'border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600'
    },
    {
      href: '/member/verse-of-day',
      icon: 'fa-star',
      title: 'Verse of the Day',
      description: 'Daily Scripture inspiration',
      gradient: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20',
      borderColor: 'border-teal-200 dark:border-teal-800 hover:border-teal-400 dark:hover:border-teal-600'
    },
    {
      href: '/member/reading-plan',
      icon: 'fa-calendar-check',
      title: 'Reading Calendar',
      description: 'Track your Bible reading',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600'
    },
    {
      href: '/member/prayer-journal',
      icon: 'fa-praying-hands',
      title: 'Prayer Journal',
      description: 'Track your prayer life',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20',
      borderColor: 'border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600'
    },
    {
      href: '/member/profile',
      icon: 'fa-user-circle',
      title: 'My Profile',
      description: 'Manage your account',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600'
    },
    {
      href: '/member/blogs',
      icon: 'fa-pen-fancy',
      title: 'My Blogs',
      description: 'Share your testimony',
      gradient: 'from-rose-500 to-rose-600',
      bgGradient: 'from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20',
      borderColor: 'border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-600'
    }
  ]

  return (
    <MemberLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bible Study Registration Banner */}
        {openSession && !hasRegistered && (
          <div className="mb-6 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-xl shadow-2xl overflow-hidden border-2 border-red-500 dark:border-red-600 animate-pulse">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex-shrink-0">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-white animate-bounce" />
                      <h3 className="text-xl font-bold text-white">
                        Bible Study Registration Open!
                      </h3>
                    </div>
                    <p className="text-white/90 text-lg mb-3">
                      {openSession.title}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-white/80">
                      <div className="flex items-center">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        <span>
                          Deadline: {new Date(openSession.registration_deadline).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-clock mr-2"></i>
                        <span>
                          {Math.ceil((new Date(openSession.registration_deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-white text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 flex-shrink-0 ml-4"
                >
                  <span>Register Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
            <div className="bg-red-800/30 px-6 py-2 border-t border-red-500/30">
              <p className="text-white/70 text-sm flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                Don't miss out! Register before the deadline to secure your spot.
              </p>
            </div>
          </div>
        )}

        {/* Registration Success Message */}
        {openSession && hasRegistered && (
          <div className="mb-6 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-xl shadow-lg overflow-hidden border-2 border-green-500 dark:border-green-600">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <i className="fas fa-check-circle text-3xl text-white"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    You're Registered!
                  </h3>
                  <p className="text-white/90">
                    You've successfully registered for {openSession.title}. Check your email for details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-teal-600 dark:from-purple-700 dark:to-teal-700 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <i className="fas fa-hand-sparkles mr-3"></i>
                Welcome back, {user?.full_name?.split(' ')[0] || 'Member'}!
              </h1>
              <p className="text-lg opacity-90">
                Ready to grow in faith today?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh dashboard"
              >
                <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
                  <div className="text-2xl font-bold capitalize">
                    {user?.member_type || 'Member'}
                </div>
                <div className="text-sm opacity-75">Status</div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-id-card text-xl text-purple-600 dark:text-purple-400"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500 dark:text-gray-400">Registration Number</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {user?.registration_number || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-graduation-cap text-xl text-teal-600 dark:text-teal-400"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500 dark:text-gray-400">Course</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {user?.course || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-calendar-alt text-xl text-emerald-600 dark:text-emerald-400"></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500 dark:text-gray-400">Year of Study</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {user?.year_of_study ? `Year ${user.year_of_study}` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spiritual Tools Portal */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 mb-8">
          <div className="flex items-center mb-6">
            <i className="fas fa-tools text-2xl text-purple-600 dark:text-purple-400 mr-3"></i>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Spiritual Tools Portal
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.href} className="group">
                <div className={`bg-gradient-to-br ${tool.bgGradient} p-6 rounded-xl border-2 ${tool.borderColor} transition-all duration-200 group-hover:shadow-lg`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-lg flex items-center justify-center mr-4 shadow-md`}>
                      <i className={`fas ${tool.icon} text-white text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center mb-4">
              <i className="fas fa-address-card text-xl text-purple-600 dark:text-purple-400 mr-3"></i>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Contact Information
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="fas fa-envelope text-gray-400 w-5 mr-3"></i>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                  <div className="text-gray-900 dark:text-white font-medium">{user?.email}</div>
                </div>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-gray-400 w-5 mr-3"></i>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                  <div className="text-gray-900 dark:text-white font-medium">{user?.phone || 'Not provided'}</div>
                </div>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock text-gray-400 w-5 mr-3"></i>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Member Since</div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center mb-4">
              <i className="fas fa-link text-xl text-teal-600 dark:text-teal-400 mr-3"></i>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Quick Links
              </h3>
            </div>
            <div className="space-y-2">
              <Link
                href="/events"
                className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg text-purple-700 dark:text-purple-300 font-medium transition-colors"
              >
                <i className="fas fa-calendar-day w-5 mr-3"></i>
                View Upcoming Events
              </Link>
              <Link
                href="/blog"
                className="flex items-center p-3 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 rounded-lg text-teal-700 dark:text-teal-300 font-medium transition-colors"
              >
                <i className="fas fa-blog w-5 mr-3"></i>
                Read Community Blogs
              </Link>
              <Link
                href="/about"
                className="flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg text-emerald-700 dark:text-emerald-300 font-medium transition-colors"
              >
                <i className="fas fa-info-circle w-5 mr-3"></i>
                About KarUCU
              </Link>
              <Link
                href="/contact"
                className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg text-amber-700 dark:text-amber-300 font-medium transition-colors"
              >
                <i className="fas fa-envelope w-5 mr-3"></i>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bible Study Registration Modal */}
      {showModal && openSession && (
        <BibleStudyRegistrationModal
          isOpen={showModal}
          session={openSession}
          locations={locations}
          onClose={() => {
            setShowModal(false)
            checkOpenSessions() // Refresh registration status
          }}
        />
      )}
    </MemberLayout>
  )
}
