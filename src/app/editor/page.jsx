'use client';

import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';

export default function EditorDashboard() {
  const [stats, setStats] = useState({
    pendingBlogs: 0,
    prayerRequests: 0,
    bibleStudyRegistrations: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/editor/stats', {
        headers: { 'Authorization': 'Bearer ' + token }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Editor Dashboard</h1>
          <p className="text-gray-600 dark:text-neutral-400">Manage content and review submissions</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Pending Blogs</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.pendingBlogs}</p>
                  </div>
                  <span className="text-4xl">📝</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-500 mt-2">Awaiting review</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Prayer Requests</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.prayerRequests}</p>
                  </div>
                  <span className="text-4xl">🙏</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-500 mt-2">Active requests</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Bible Study</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.bibleStudyRegistrations}</p>
                  </div>
                  <span className="text-4xl">📖</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-500 mt-2">Registrations</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-800 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <a
                  href="/editor/blogs"
                  className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition text-center"
                >
                  <span className="text-3xl block mb-2">📝</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Review Blogs</span>
                </a>
                <a
                  href="/editor/sermons"
                  className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition text-center"
                >
                  <span className="text-3xl block mb-2">🎥</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Add Sermon</span>
                </a>
                <a
                  href="/editor/gallery"
                  className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50 transition text-center"
                >
                  <span className="text-3xl block mb-2">📷</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Add Gallery</span>
                </a>
                <a
                  href="/editor/spiritual-content"
                  className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition text-center"
                >
                  <span className="text-3xl block mb-2">✨</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Add Content</span>
                </a>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-800">
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-neutral-400 text-center py-8">No recent activity</p>
              )}
            </div>
          </>
        )}
      </div>
    </EditorLayout>
  );
}
