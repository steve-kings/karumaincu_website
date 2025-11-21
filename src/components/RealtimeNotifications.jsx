'use client'

import { useEffect, useState } from 'react'
import { useRealtimeBlogs, useRealtimeEvents, useRealtimeAnnouncements, useRealtimePrayers } from '@/hooks/useRealtime'

export default function RealtimeNotifications() {
  const [notifications, setNotifications] = useState([])
  const newBlog = useRealtimeBlogs()
  const newEvent = useRealtimeEvents()
  const newAnnouncement = useRealtimeAnnouncements()
  const newPrayer = useRealtimePrayers()

  useEffect(() => {
    if (newBlog) {
      addNotification({
        id: Date.now(),
        type: 'blog',
        title: 'New Blog Post',
        message: newBlog.title,
        icon: '📝'
      })
    }
  }, [newBlog])

  useEffect(() => {
    if (newEvent) {
      addNotification({
        id: Date.now(),
        type: 'event',
        title: 'New Event',
        message: newEvent.title,
        icon: '📅'
      })
    }
  }, [newEvent])

  useEffect(() => {
    if (newAnnouncement) {
      addNotification({
        id: Date.now(),
        type: 'announcement',
        title: 'New Announcement',
        message: newAnnouncement.title,
        icon: '📢'
      })
    }
  }, [newAnnouncement])

  useEffect(() => {
    if (newPrayer) {
      addNotification({
        id: Date.now(),
        type: 'prayer',
        title: 'New Prayer Request',
        message: `${newPrayer.userName} needs prayer`,
        icon: '🙏'
      })
    }
  }, [newPrayer])

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id)
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-slide-in-right"
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{notification.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{notification.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
