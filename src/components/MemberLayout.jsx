'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function MemberLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      console.log('MemberLayout: Fetching profile...')
      // Fetch fresh data from database - cookies sent automatically
      const response = await fetch('/api/auth/profile', { cache: 'no-store' })

      console.log('MemberLayout: Profile response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('MemberLayout: User data:', data)

        console.log('MemberLayout: Setting user, role:', data.user.role)
        setUser(data.user)
      } else {
        console.error('MemberLayout: Profile fetch failed', response.status)
        router.push('/login')
      }
    } catch (error) {
      console.error('MemberLayout: Error fetching profile:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/login')
    }
  }

  const handleRoleSwitch = (targetRole) => {
    const userRole = user?.role ? user.role.trim().toLowerCase() : 'member'
    
    if (targetRole === 'admin') {
      if (userRole === 'admin') {
        router.push('/admin')
      } else {
        alert('You do not have admin access. Please contact an administrator.')
      }
    } else if (targetRole === 'editor') {
      if (userRole === 'editor' || userRole === 'admin') {
        router.push('/editor')
      } else {
        alert('You do not have editor access. Please contact an administrator to assign you the editor role.')
      }
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/member', icon: 'fa-home' },
    { name: 'My Profile', href: '/member/profile', icon: 'fa-user' },
    { name: 'Bible Reader', href: '/member/bible-reader', icon: 'fa-book-open' },
    { name: 'Verse of Day', href: '/member/verse-of-day', icon: 'fa-star' },
    { name: 'Reading Plan', href: '/member/reading-plan', icon: 'fa-calendar-alt' },
    { name: 'Prayer Journal', href: '/member/prayer-journal', icon: 'fa-praying-hands' },
    { name: 'Nominations', href: '/member/nominations', icon: 'fa-vote-yea' },
    { name: 'My Blogs', href: '/member/blogs', icon: 'fa-pen-fancy' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-neutral-900 sticky top-0 z-50 backdrop-blur-lg bg-white/95 dark:bg-black/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/member" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">KarUCU</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Member Portal</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-900'
                      }`}
                  >
                    <i className={`fas ${item.icon} mr-2`}></i>
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.full_name || 'Member'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.registration_number || ''}
                </div>
              </div>

              {/* Role Switcher - Show for admin and editor */}
              {user && (user.role?.trim().toLowerCase() === 'admin' || user.role?.trim().toLowerCase() === 'editor') && (
                <div className="relative group">
                  <button className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition flex items-center gap-2">
                    <span>👤 Member</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {user.role?.trim().toLowerCase() === 'admin' && (
                      <button
                        onClick={() => handleRoleSwitch('admin')}
                        className="w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-lg transition flex items-center gap-2"
                      >
                        <span>👑</span> Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => handleRoleSwitch('editor')}
                      className={'w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-2 ' + (user.role?.trim().toLowerCase() === 'admin' ? '' : 'rounded-lg')}
                    >
                      <span>✏️</span> Editor Dashboard
                    </button>
                  </div>
                </div>
              )}

              <ThemeToggle />
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Website
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-neutral-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-900'
                      }`}
                  >
                    <i className={`fas ${item.icon} mr-3`}></i>
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}
