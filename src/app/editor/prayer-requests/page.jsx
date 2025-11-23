'use client';

import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';

export default function EditorPrayerRequestsPage() {
  const [prayers, setPrayers] = useState([]);
  const [filter, setFilter] = useState('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayers();
  }, [filter]);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/prayers?status=' + filter, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setPrayers(data);
      }
    } catch (error) {
      console.error('Error fetching prayers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Prayer Requests</h1>
          <p className="text-gray-600 dark:text-neutral-400">View and monitor prayer requests (Read-only)</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['active', 'answered', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={'px-4 py-2 rounded-lg transition capitalize ' + (filter === status ? 'bg-purple-600 text-white' : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-800')}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : prayers.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-praying-hands text-blue-600 dark:text-blue-400 text-4xl"></i>
            </div>
            <p className="text-gray-600 dark:text-neutral-400">No prayer requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{prayer.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">
                      By {prayer.user_name} • {new Date(prayer.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {prayer.category}
                      </span>
                      <span className={'px-3 py-1 rounded-full text-xs font-medium ' + (prayer.priority === 'high' ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-300')}>
                        {prayer.priority}
                      </span>
                    </div>
                  </div>
                  <span className={'px-3 py-1 rounded-full text-xs font-medium ' + (prayer.status === 'answered' ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300' : prayer.status === 'archived' ? 'bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-300' : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300')}>
                    {prayer.status}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-neutral-300 mb-4 whitespace-pre-wrap">{prayer.content}</p>

                {prayer.testimony && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">✓ Testimony:</h4>
                    <p className="text-green-700 dark:text-green-300">{prayer.testimony}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </EditorLayout>
  );
}
