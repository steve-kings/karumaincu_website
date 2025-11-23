'use client';

import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';

export default function EditorGalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    category: 'other',
    thumbnail_url: '',
    platform: 'google_photos'
  });



  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setGalleries(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      setGalleries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
            const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Gallery added successfully!');
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          url: '',
          category: 'other',
          thumbnail_url: '',
          platform: 'google_photos'
        });
        fetchGalleries();
      } else {
        alert('Failed to add gallery');
      }
    } catch (error) {
      console.error('Error adding gallery:', error);
      alert('Failed to add gallery');
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Photo Galleries</h1>
              <p className="text-gray-600 dark:text-neutral-400">Add new photo gallery links</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              + Add Gallery
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <div
                key={gallery.id}
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-neutral-800"
              >
                {gallery.thumbnail_url && gallery.thumbnail_url.includes('unsplash.com') ? (
                  <img
                    src={gallery.thumbnail_url}
                    alt={gallery.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/logo.png'
                      e.target.className = 'w-24 h-24 object-contain mx-auto mt-12'
                    }}
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-purple-100 to-teal-100">
                    <img src="/logo.png" alt="KarUCU" className="w-24 h-24 object-contain" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{gallery.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-neutral-400 mb-2 line-clamp-2">{gallery.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 capitalize">
                      {gallery.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-neutral-500">
                      {gallery.view_count} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Gallery Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-neutral-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Gallery</h3>

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
                    Gallery URL * (Google Photos, Drive, etc.)
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    placeholder="https://photos.google.com/share/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Thumbnail URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    >
                      <option value="worship">Worship</option>
                      <option value="fellowship">Fellowship</option>
                      <option value="outreach">Outreach</option>
                      <option value="events">Events</option>
                      <option value="conferences">Conferences</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Platform
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({...formData, platform: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    >
                      <option value="google_photos">Google Photos</option>
                      <option value="google_drive">Google Drive</option>
                      <option value="dropbox">Dropbox</option>
                      <option value="onedrive">OneDrive</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Add Gallery
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
