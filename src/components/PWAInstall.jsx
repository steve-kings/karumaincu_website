'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    setIsMobile(checkMobile())

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered for app install')
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Check if user has seen the prompt before
      const hasSeenPrompt = localStorage.getItem('pwa-install-seen')
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      
      // Show on first visit for mobile, or if not dismissed
      if (!hasSeenPrompt || (!dismissed && checkMobile())) {
        setShowInstallPrompt(true)
        localStorage.setItem('pwa-install-seen', 'true')
      }
    }

    // Only add listener if beforeinstallprompt is supported
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      // Check if already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallPrompt(false)
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('Banner not shown: beforeinstallprompt event not fired')
      return
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      console.log(`User response to install prompt: ${outcome}`)
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      console.error('Error showing install prompt:', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-neutral-900 rounded-lg shadow-2xl border border-gray-200 dark:border-neutral-800 p-4 z-50 animate-fade-in">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img src="/logo.png" alt="KarUCU" className="w-12 h-12 rounded-lg" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Install KarUCU App
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Install our app for quick access and offline features
          </p>
          
          <button
            onClick={handleInstallClick}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>
        </div>
      </div>
    </div>
  )
}
