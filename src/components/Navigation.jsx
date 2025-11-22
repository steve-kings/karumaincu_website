'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/auth/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    }
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Leadership', href: '/leadership' },
    { name: 'Media', href: '/media' },
    { name: 'Blog', href: '/blog' },
    { name: 'Events', href: '/events' },
    { name: 'Prayer', href: '/prayer-requests' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <>
      {/* Top Header - Hidden on Mobile */}
      <div className="hidden md:block bg-purple-600 dark:bg-black text-white py-2 text-sm fixed top-0 left-0 right-0 z-50 dark:border-b dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-1">
                <i className="fas fa-map-marker-alt text-xs"></i>
                <span>Karatina University, Main Campus</span>
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <a href="#" className="hover:text-purple-200 transition-colors">
                <span className="sr-only">Facebook</span>
                <i className="fab fa-facebook text-lg"></i>
              </a>
              <a href="#" className="hover:text-purple-200 transition-colors">
                <span className="sr-only">Twitter</span>
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="hover:text-purple-200 transition-colors">
                <span className="sr-only">Instagram</span>
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="https://www.youtube.com/@karucumain" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition-colors">
                <span className="sr-only">YouTube</span>
                <i className="fab fa-youtube text-lg"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm fixed md:top-8 top-0 left-0 right-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="KarUCU Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="font-heading font-bold text-xl text-purple-600 dark:text-purple-400">KarUCU</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Donate Button */}
              <Link
                href="/give"
                className="hidden sm:flex items-center space-x-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
              >
                <i className="fas fa-heart"></i>
                <span>Give</span>
              </Link>

              {/* Auth Buttons / Dashboard Links */}
              <div className="hidden md:flex items-center space-x-2">
                {user ? (
                  <>
                    <Link
                      href={user.role === 'admin' ? '/admin' : user.role === 'editor' ? '/editor' : '/member'}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      {user.role === 'admin' ? 'Admin' : user.role === 'editor' ? 'Editor' : 'Dashboard'}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Join Us
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-gray-700 dark:text-gray-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div className="fixed md:top-24 top-16 right-0 w-80 max-w-[85vw] h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] bg-white dark:bg-black shadow-xl dark:border-l dark:border-gray-800 z-40 lg:hidden overflow-y-auto">
            <div className="p-6">
              {/* Theme Toggle in Mobile Menu */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                  <ThemeToggle />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Link
                  href="/give"
                  className="flex items-center justify-center space-x-2 w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-heart"></i>
                  <span>Give</span>
                </Link>

                <div className="space-y-2">
                  {user ? (
                    <Link
                      href={user.role === 'admin' ? '/admin' : user.role === 'editor' ? '/editor' : '/member'}
                      className="block w-full text-center py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {user.role === 'admin' ? 'Admin Dashboard' : user.role === 'editor' ? 'Editor Dashboard' : 'My Dashboard'}
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block w-full text-center py-3 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full text-center py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Join Us
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
