'use client'

import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google'

export default function GoogleOAuthProvider({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.warn('Google Client ID not configured')
    return <>{children}</>
  }

  return (
    <GoogleProvider clientId={clientId}>
      {children}
    </GoogleProvider>
  )
}
