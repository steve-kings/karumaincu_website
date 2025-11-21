'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, ArrowLeft, Shield, Check } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setFormData(prev => ({ ...prev, token }))
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (!formData.token.trim()) {
        alert('Reset token is required')
        setIsLoading(false)
        return
      }

      if (!formData.newPassword) {
        alert('New password is required')
        setIsLoading(false)
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        alert('Passwords do not match')
        setIsLoading(false)
        return
      }

      if (formData.newPassword.length < 8) {
        alert('Password must be at least 8 characters long')
        setIsLoading(false)
        return
      }

      const hasUpperCase = /[A-Z]/.test(formData.newPassword)
      const hasLowerCase = /[a-z]/.test(formData.newPassword)
      const hasNumbers = /\d/.test(formData.newPassword)

      if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        alert('Password must contain at least one uppercase letter, one lowercase letter, and one number')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formData.token.trim(),
          newPassword: formData.newPassword
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setIsSuccess(true)
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        alert(data.message || 'Failed to reset password')
      }
      
    } catch (error) {
      console.error('Reset password error:', error)
      alert('Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getPasswordStrength = () => {
    const password = formData.newPassword
    if (!password) return { strength: 0, label: '', color: '' }

    let strength = 0
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    ]

    strength = checks.filter(Boolean).length

    if (strength <= 2) return { strength: strength * 20, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 3) return { strength: strength * 20, label: 'Fair', color: 'bg-yellow-500' }
    if (strength <= 4) return { strength: strength * 20, label: 'Good', color: 'bg-blue-500' }
    return { strength: 100, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength()

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your password has been updated successfully
            </p>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center space-y-4">
                <Shield className="mx-auto h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">
                  All Set!
                </h3>
                <p className="text-gray-600">
                  You can now login with your new password. You'll be redirected to the login page in a few seconds.
                </p>
                
                <Link 
                  href="/login"
                  className="inline-block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors mt-6"
                >
                  Login Now
                </Link>
              </div>
            </div>
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
            Reset Password
          </h2>
          <p className="text-xl text-gray-600">
            Enter your new password
          </p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Token Field */}
            <div>
              <label htmlFor="token" className="block text-sm font-semibold text-gray-700 mb-2">
                Reset Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  value={formData.token}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your reset token"
                />
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Password Strength:</span>
                    <span className={`font-semibold ${
                      passwordStrength.label === 'Weak' ? 'text-red-600' :
                      passwordStrength.label === 'Fair' ? 'text-yellow-600' :
                      passwordStrength.label === 'Good' ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={`flex items-center ${formData.newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{formData.newPassword.length >= 8 ? '✓' : '○'}</span>
                  At least 8 characters long
                </li>
                <li className={`flex items-center ${/[a-z]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{/[a-z]/.test(formData.newPassword) ? '✓' : '○'}</span>
                  One lowercase letter
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{/[A-Z]/.test(formData.newPassword) ? '✓' : '○'}</span>
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/\d/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                  <span className="mr-2">{/\d/.test(formData.newPassword) ? '✓' : '○'}</span>
                  One number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || formData.newPassword !== formData.confirmPassword}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Resetting Password...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Reset Password
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
      </div>
    </div>
  )
}
