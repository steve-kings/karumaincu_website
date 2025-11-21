'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!token || user.role !== 'admin') {
      router.push('/login')
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('Fetching stats with token:', token ? 'Token exists' : 'No token')
      
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      console.log('Stats response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Stats data received:', data)
        setStats(data)
        setRecentActivity(data.recentActivity || [])
      } else {
        const error = await response.json()
        console.error('Stats API error:', error)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    const icons = {
      user: 'fa-user-plus',
      blog: 'fa-blog',
      event: 'fa-calendar-check',
      prayer: 'fa-praying-hands'
    }
    return icons[type] || 'fa-circle'
  }

  const getActivityColor = (type) => {
    const colors = {
      user: 'text-green-600 bg-green-100 dark:bg-green-950',
      blog: 'text-blue-600 bg-blue-100 dark:bg-blue-950',
      event: 'text-purple-600 bg-purple-100 dark:bg-purple-950',
      prayer: 'text-amber-600 bg-amber-100 dark:bg-amber-950'
    }
    return colors[type] || 'text-gray-600 bg-gray-100 dark:bg-gray-950'
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000) // seconds

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg opacity-90">Welcome back! Here's what's happening with your community.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Stats */}
        <Link href="/admin/users">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-900 hover:shadow-xl transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-users text-white text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.users?.total || 0}</div>
                <div className="text-xs text-green-600 font-medium">+{stats?.users?.newThisMonth || 0} this month</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Members</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stats?.users?.active || 0} active members</p>
          </div>
        </Link>

        {/* Events Stats */}
        <Link href="/admin/events">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-900 hover:shadow-xl transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-calendar-alt text-white text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.events?.total || 0}</div>
                <div className="text-xs text-purple-600 font-medium">{stats?.events?.upcoming || 0} upcoming</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Events</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Church activities</p>
          </div>
        </Link>

        {/* Blogs Stats */}
        <Link href="/admin/blogs">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-900 hover:shadow-xl transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-blog text-white text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.blogs?.total || 0}</div>
                <div className="text-xs text-amber-600 font-medium">{stats?.blogs?.pending || 0} pending</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Blog Posts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Member testimonies</p>
          </div>
        </Link>

        {/* Prayers Stats */}
        <Link href="/admin/prayer-requests">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-900 hover:shadow-xl transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-praying-hands text-white text-xl"></i>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.prayers?.total || 0}</div>
                <div className="text-xs text-green-600 font-medium">{stats?.prayers?.answered || 0} answered</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Prayer Requests</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Community prayers</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400">No recent activity</p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-4 bg-gray-50 dark:bg-neutral-900 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${getActivityColor(activity.type)}`}>
                      <i className={`fas ${getActivityIcon(activity.type)}`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white">{activity.action}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-neutral-900">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Content Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-video text-blue-600 dark:text-blue-400 mr-3"></i>
                  <span className="font-medium text-gray-800 dark:text-white">Sermons</span>
                </div>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{stats?.sermons?.total || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-bullhorn text-red-600 dark:text-red-400 mr-3"></i>
                  <span className="font-medium text-gray-800 dark:text-white">Announcements</span>
                </div>
                <span className="text-red-600 dark:text-red-400 font-bold">{stats?.announcements?.total || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-blog text-green-600 dark:text-green-400 mr-3"></i>
                  <span className="font-medium text-gray-800 dark:text-white">Published Blogs</span>
                </div>
                <span className="text-green-600 dark:text-green-400 font-bold">{(stats?.blogs?.total || 0) - (stats?.blogs?.pending || 0)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt text-purple-600 dark:text-purple-400 mr-3"></i>
                  <span className="font-medium text-gray-800 dark:text-white">Active Events</span>
                </div>
                <span className="text-purple-600 dark:text-purple-400 font-bold">{stats?.events?.upcoming || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
