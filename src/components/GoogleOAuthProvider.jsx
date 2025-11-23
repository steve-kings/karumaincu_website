'use client'

import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google'

export default function GoogleOAuthProvider({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  // If no client ID, just return children without Google OAuth
  // This allows the app to work without Google OAuth configured
  if (!clientId || clientId === 'your-google-client-id-here.apps.googleusercontent.com') {
    console.warn('⚠️ Google OAuth not configured - Google Sign In will not work')
    console.warn('To enable Google Sign In, add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local')
    return <>{children}</>
  }

  return (
    <GoogleProvider clientId={clientId}>
      {children}
    </GoogleProvider>
  )
}
