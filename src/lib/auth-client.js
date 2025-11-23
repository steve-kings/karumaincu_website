/**
 * Client-side authentication utilities
 * No localStorage - uses HTTP-only cookies for security
 */

/**
 * Make an authenticated API request
 * Automatically includes credentials (cookies) in the request
 */
export async function authFetch(url, options = {}) {
  const defaultOptions = {
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  return fetch(url, { ...defaultOptions, ...options })
}

/**
 * Check if user is authenticated
 * Returns user data if authenticated, null otherwise
 */
export async function checkAuth() {
  try {
    const response = await authFetch('/api/auth/profile')
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error('Auth check failed:', error)
    return null
  }
}

/**
 * Logout user
 * Clears server-side cookies
 */
export async function logout() {
  try {
    await authFetch('/api/auth/logout', { method: 'POST' })
    return true
  } catch (error) {
    console.error('Logout failed:', error)
    return false
  }
}
