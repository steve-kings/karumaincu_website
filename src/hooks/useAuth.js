import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Custom hook for authentication using HTTP-only cookies
 * Replaces localStorage-based authentication
 */
export function useAuth(requiredRole = null) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        cache: 'no-store',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        const userRole = data.user.role ? data.user.role.trim().toLowerCase() : 'member'
        
        // Check if user has required role
        if (requiredRole) {
          const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
          const hasAccess = required.some(role => role.toLowerCase() === userRole)
          
          if (!hasAccess) {
            setError('Access denied: Insufficient permissions')
            router.push('/login')
            return
          }
        }

        setUser(data.user)
      } else {
        setError('Not authenticated')
        router.push('/login')
      }
    } catch (err) {
      console.error('Auth check error:', err)
      setError(err.message)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
      router.push('/login')
    }
  }

  return { user, loading, error, logout, refetch: checkAuth }
}

/**
 * Get auth token for API calls (from cookies, not localStorage)
 * Note: For most API calls, you don't need this - just use credentials: 'include'
 */
export async function getAuthHeaders() {
  // Cookies are sent automatically with credentials: 'include'
  // This function is kept for backward compatibility
  return {
    'Content-Type': 'application/json'
  }
}

/**
 * Make authenticated API call
 */
export async function fetchWithAuth(url, options = {}) {
  const headers = await getAuthHeaders()
  
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...headers,
      ...options.headers
    }
  })
}
