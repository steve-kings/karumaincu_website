'use client'

import { useState, useEffect } from 'react'
import { Download, CheckCircle } from 'lucide-react'

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no prompt available, show instructions
      alert('To install this app:\n\n• On Chrome/Edge: Click the menu (⋮) and select "Install app"\n• On Safari (iOS): Tap Share button and select "Add to Home Screen"\n• On Firefox: Look for the install icon in the address bar')
      return
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error showing install prompt:', error)
    }
  }

  // Always show the button
  return (
    <button
      onClick={handleInstallClick}
      disabled={isInstalled}
      className={`${
        isInstalled 
          ? 'bg-green-600 cursor-not-allowed' 
          : 'bg-purple-600 hover:bg-purple-700'
      } text-white px-6 py-2.5 rounded-lg font-semibold flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl`}
    >
      {isInstalled ? (
        <>
          <CheckCircle className="w-5 h-5" />
          <span>App Installed</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Install App</span>
        </>
      )}
    </button>
  )
}
