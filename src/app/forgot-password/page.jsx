'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Send, Check } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [resetToken, setResetToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (!email.trim()) {
        alert('Email is required')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()
      
      if (data.success) {
        setIsSubmitted(true)
        
        // In development, show the reset token for testing
        if (data.resetToken) {
          setResetToken(data.resetToken)
          console.log('Reset Token:', data.resetToken)
        }
      } else {
        alert(data.message || 'Failed to send reset instructions')
      }
      
    } catch (error) {
      console.error('Forgot password error:', error)
      alert('Failed to send reset instructions')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              We've sent password reset instructions to:
            </p>
            <p className="text-lg text-gray-900 font-semibold bg-gray-100 rounded-lg px-4 py-2 mb-6">
              {email}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center space-y-4">
              <Mail className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">
                Instructions Sent!
              </h3>
              <p className="text-gray-600">
                Please check your email and follow the instructions to reset your password.
              </p>
              
              {resetToken && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">
                    Development Mode - Reset Token:
                  </p>
                  <code className="text-xs bg-yellow-100 px-2 py-1 rounded text-yellow-900 break-all block">
                    {resetToken}
                  </code>
                  <p className="text-xs text-yellow-700 mt-2">
                    Use this token to reset your password
                  </p>
                </div>
              )}

              <div className="pt-4 space-y-3">
                <Link 
                  href="/reset-password"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Reset Password Now
                </Link>
                
                <Link 
                  href="/login"
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="inline-block w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-600">
            <p className="text-sm">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail('')
                  setResetToken('')
                }}
                className="text-purple-600 hover:text-purple-500 underline"
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8">
            <img
              src="/logo.png"
              alt="KarUCU Logo"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="font-heading font-bold text-2xl text-purple-600">KarUCU</h1>
              <p className="text-sm text-gray-500">Main Campus</p>
            </div>
          </Link>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h2>
          <p className="text-xl text-gray-600">
            Enter your email to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                We'll send you a link to reset your password
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Instructions...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Reset Instructions
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link 
              href="/login" 
              className="font-semibold text-purple-600 hover:text-purple-500 transition-colors inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-gray-600">
          <p className="text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-500 underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
