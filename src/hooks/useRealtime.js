'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'

export function useRealtimeBlogs() {
  const { socket } = useSocket()
  const [newBlog, setNewBlog] = useState(null)

  useEffect(() => {
    if (!socket) return

    socket.on('blog:created', (blogData) => {
      setNewBlog(blogData)
    })

    return () => {
      socket.off('blog:created')
    }
  }, [socket])

  return newBlog
}

export function useRealtimeEvents() {
  const { socket } = useSocket()
  const [newEvent, setNewEvent] = useState(null)

  useEffect(() => {
    if (!socket) return

    socket.on('event:created', (eventData) => {
      setNewEvent(eventData)
    })

    return () => {
      socket.off('event:created')
    }
  }, [socket])

  return newEvent
}

export function useRealtimeAnnouncements() {
  const { socket } = useSocket()
  const [newAnnouncement, setNewAnnouncement] = useState(null)

  useEffect(() => {
    if (!socket) return

    socket.on('announcement:created', (announcementData) => {
      setNewAnnouncement(announcementData)
    })

    return () => {
      socket.off('announcement:created')
    }
  }, [socket])

  return newAnnouncement
}

export function useRealtimePrayers() {
  const { socket } = useSocket()
  const [newPrayer, setNewPrayer] = useState(null)

  useEffect(() => {
    if (!socket) return

    socket.on('prayer:created', (prayerData) => {
      setNewPrayer(prayerData)
    })

    return () => {
      socket.off('prayer:created')
    }
  }, [socket])

  return newPrayer
}

export function useRealtimeActivities() {
  const { socket } = useSocket()
  const [newActivity, setNewActivity] = useState(null)

  useEffect(() => {
    if (!socket) return

    socket.on('activity:new', (activityData) => {
      setNewActivity(activityData)
    })

    return () => {
      socket.off('activity:new')
    }
  }, [socket])

  return newActivity
}

export function emitNewBlog(socket, blogData) {
  if (socket) {
    socket.emit('blog:new', blogData)
  }
}

export function emitNewEvent(socket, eventData) {
  if (socket) {
    socket.emit('event:new', eventData)
  }
}

export function emitNewAnnouncement(socket, announcementData) {
  if (socket) {
    socket.emit('announcement:new', announcementData)
  }
}

export function emitNewPrayer(socket, prayerData) {
  if (socket) {
    socket.emit('prayer:new', prayerData)
  }
}

export function useRealtimeReadingCalendar() {
  const { socket } = useSocket()
  const [newReading, setNewReading] = useState(null)

  useEffect(() => {
    if (!socket) return

    socket.on('reading-calendar:created', (readingData) => {
      setNewReading(readingData)
    })

    return () => {
      socket.off('reading-calendar:created')
    }
  }, [socket])

  return newReading
}

export function emitNewReadingCalendar(socket, readingData) {
  if (socket) {
    socket.emit('reading-calendar:new', readingData)
  }
}
