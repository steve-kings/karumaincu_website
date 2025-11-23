'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function GoogleLoginButton({ onSuccess }) {
  const router = useRouter()
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  // If Google OAuth is not configured, show a message
  if (!clientId || clientId === 'your-google-client-id-here.apps.googleusercontent.com') {
    return (
      <div className="w-full p-4 bg-gray-100 dark:bg-neutral-800 rounded-lg border border-gray-300 dark:border-neutral-700 text-center">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Google Sign In not configured
        </p>
        <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
          Use email and password to login
        </p>
      </div>
    )
  }

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log('Google login initiated...')

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      })

      const data = await response.json()
      console.log('Google login response:', data)

      if (data.success) {
        toast.success('Login successful! Redirecting...')

        // Call custom onSuccess if provided
        if (onSuccess) {
          onSuccess(data)
        } else {
          // Check if user needs to complete profile
          if (data.user.needsProfileCompletion) {
            console.log('Redirecting to complete profile...')
            setTimeout(() => {
              window.location.href = '/complete-profile'
            }, 500)
          } else {
            // Force redirect based on role with a small delay for toast
            setTimeout(() => {
              let redirectPath = '/member' // default
              if (data.user.role === 'admin') {
                redirectPath = '/admin'
              } else if (data.user.role === 'editor') {
                redirectPath = '/editor'
              }
              console.log('Redirecting to:', redirectPath, '(role:', data.user.role, ')')
              window.location.href = redirectPath // Use window.location for hard redirect
            }, 500)
          }
        }
      } else {
        console.error('Login failed:', data.message)
        toast.error(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('An error occurred during login')
    }
  }

  const handleError = () => {
    toast.error('Google login failed')
  }

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
        width="100%"
      />
    </div>
  )
}
