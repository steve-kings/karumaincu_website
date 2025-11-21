'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function GoogleLoginButton({ onSuccess }) {
  const router = useRouter()

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
        
        // Store user data AND token in localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
        
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
              const redirectPath = data.user.role === 'admin' ? '/admin' : '/member'
              console.log('Redirecting to:', redirectPath)
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
