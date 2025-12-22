'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
  const [darkMode, setDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme')
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark')
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('adminTheme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('adminTheme', 'light')
    }
  }, [darkMode])

  const checkAuth = async () => {
    try {
      console.log('AdminLayout: Checking authentication...')
      const response = await fetch('/api/auth/profile', {
        cache: 'no-store',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        const userRole = data.user.role ? data.user.role.trim().toLowerCase() : 'member'
        
        console.log('AdminLayout: User role:', userRole)

        // Only allow admin role
        if (userRole !== 'admin') {
          console.error('AdminLayout: Access denied - not admin')
          alert('Access Denied: Admin privileges required')
          router.push('/login')
          return
        }

        setUser(data.user)
      } else {
        console.error('AdminLayout: Auth failed, redirecting to login')
        router.push('/login')
      }
    } catch (error) {
      console.error('AdminLayout: Auth error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const topNavigation = [
    { name: 'Dashboard', href: '/admin', icon: 'fa-tachometer-alt', exact: true },
    { name: 'Users', href: '/admin/users', icon: 'fa-users' },
    { name: 'Events', href: '/admin/events', icon: 'fa-calendar-alt' },
    { name: 'Blogs', href: '/admin/blogs', icon: 'fa-blog' },
    { name: 'Bible Study', href: '/admin/bible-study', icon: 'fa-book-bible' },
    { name: 'Prayer', href: '/admin/prayer-requests', icon: 'fa-praying-hands' },
    { name: 'Sermons', href: '/admin/sermons', icon: 'fa-video' },
    { name: 'Leaders', href: '/admin/leaders', icon: 'fa-user-tie' },
    { name: 'Gallery', href: '/admin/gallery', icon: 'fa-images' }
  ]

  const sidebarNavigation = [
    { name: 'Dashboard', href: '/admin', icon: 'fa-tachometer-alt', exact: true },
    { name: 'User Management', href: '/admin/users', icon: 'fa-users' },
    { name: 'Event Management', href: '/admin/events', icon: 'fa-calendar-alt' },
    { name: 'Blog Moderation', href: '/admin/blogs', icon: 'fa-blog' },
    { name: 'Bible Study', href: '/admin/bible-study', icon: 'fa-book-bible' },
    { name: 'Leader Elections', href: '/admin/elections', icon: 'fa-vote-yea' },
    { name: 'Prayer Requests', href: '/admin/prayer-requests', icon: 'fa-praying-hands' },
    { name: 'Sermon Management', href: '/admin/sermons', icon: 'fa-video' },
    { name: 'Announcements', href: '/admin/announcements', icon: 'fa-bullhorn' },
    { name: 'Leadership', href: '/admin/leaders', icon: 'fa-user-tie' },
    { name: 'Gallery', href: '/admin/gallery', icon: 'fa-images' },
    { name: 'Spiritual Content', href: '/admin/spiritual-content', icon: 'fa-book-open' }
  ]

  const isActive = (item) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/login')
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      {/* Top Bar - Website Style */}
      <div className="fixed top-0 left-0 right-0 bg-black dark:bg-black border-b border-gray-800 z-50">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div className="text-white">
                <div className="font-bold text-sm">KarUCU</div>
                <div className="text-xs text-gray-400">Admin Portal</div>
              </div>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-white text-xs">
                <i className="fas fa-user-circle text-lg"></i>
                <span>{user?.full_name || 'Admin'}</span>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition"
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>

              <Link
                href="/"
                className="hidden sm:block px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm transition"
              >
                Website
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Menu Bar */}
        <div className="bg-gradient-to-r from-purple-900 to-teal-900 dark:from-purple-950 dark:to-teal-950">
          <div className="flex items-center gap-1 px-4 overflow-x-auto">
            {/* Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex-shrink-0 p-3 text-white hover:bg-white/10 rounded-lg transition"
            >
              <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>

            {/* Top Navigation Items */}
            {topNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${isActive(item)
                  ? 'bg-white dark:bg-neutral-900 text-purple-600 dark:text-purple-400'
                  : 'text-white hover:bg-white/10'
                  }`}
              >
                <i className={`fas ${item.icon}`}></i>
                <span className="text-xs whitespace-nowrap">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-[120px] bottom-0 bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-900 transition-all duration-300 z-40 shadow-xl ${sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
      >
        <div className="h-full overflow-y-auto">
          <nav className="p-4 space-y-1">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-2 uppercase tracking-wider">
              Admin Menu
            </div>
            {sidebarNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item)
                  ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900'
                  }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                <span className="font-medium text-sm">{item.name}</span>
                {isActive(item) && (
                  <i className="fas fa-chevron-right ml-auto text-xs"></i>
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-neutral-800 mt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold">KarUCU Admin</p>
              <p className="opacity-75">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 pt-[120px] ${sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
      >
        {children}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
