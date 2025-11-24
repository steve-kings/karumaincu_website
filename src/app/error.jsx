'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-neutral-800">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-exclamation-triangle text-4xl text-red-600 dark:text-red-400"></i>
          </div>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 mb-6">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-left">
              <p className="text-sm font-mono text-red-800 dark:text-red-300 break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => reset()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <i className="fas fa-redo mr-2"></i>
              Try Again
            </button>
            <a
              href="/"
              className="flex-1 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              <i className="fas fa-home mr-2"></i>
              Go Home
            </a>
          </div>

          {/* Support Link */}
          <p className="mt-6 text-sm text-gray-500 dark:text-neutral-500">
            Need help?{' '}
            <a href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
