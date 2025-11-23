'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ForceLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Call logout API to clear server-side cookies
    const logout = async () => {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    }
    logout()
  }, [])

  const handleRelogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-950 rounded-2xl p-8 border border-neutral-900">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Logged Out Successfully
            </h1>
            <p className="text-gray-400 mb-6">
              All authentication data has been cleared. Please log in again to refresh your session.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleRelogin}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Log In Again
            </button>

            <Link
              href="/"
              className="block w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-colors text-center"
            >
              Go to Home
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              💡 <strong>Tip:</strong> If you recently had your role updated, logging in again will apply the changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
