'use client';

import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';

export default function EditorSermonsPage() {
  const [sermons, setSermons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube_url: '',
    speaker: '',
    sermon_date: '',
    series_name: '',
    scripture_reference: ''
  });

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sermons');
      if (response.ok) {
        const data = await response.json();
        setSermons(data);
      }
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/sermons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Sermon added successfully!');
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          youtube_url: '',
          speaker: '',
          sermon_date: '',
          series_name: '',
          scripture_reference: ''
        });
        fetchSermons();
      } else {
        alert('Failed to add sermon');
      }
    } catch (error) {
      console.error('Error adding sermon:', error);
      alert('Failed to add sermon');
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sermons</h1>
              <p className="text-gray-600 dark:text-neutral-400">Add new sermon videos</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              + Add Sermon
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <div
                key={sermon.id}
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-neutral-800"
              >
                {sermon.thumbnail_url && (
                  <img
                    src={sermon.thumbnail_url}
                    alt={sermon.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{sermon.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2">{sermon.speaker}</p>
                  <p className="text-xs text-gray-500 dark:text-neutral-500">
                    {new Date(sermon.sermon_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Sermon Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-neutral-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Sermon</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Speaker
                    </label>
                    <input
                      type="text"
                      value={formData.speaker}
                      onChange={(e) => setFormData({...formData, speaker: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.sermon_date}
                      onChange={(e) => setFormData({...formData, sermon_date: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Series Name
                    </label>
                    <input
                      type="text"
                      value={formData.series_name}
                      onChange={(e) => setFormData({...formData, series_name: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Scripture Reference
                    </label>
                    <input
                      type="text"
                      value={formData.scripture_reference}
                      onChange={(e) => setFormData({...formData, scripture_reference: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                      placeholder="e.g., John 3:16"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Add Sermon
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </EditorLayout>
  );
}
