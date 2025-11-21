'use client';

import { useState, useEffect } from 'react';
import MemberLayout from '@/components/MemberLayout';

export default function MemberPrayersPage() {
  const [prayers, setPrayers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, answered: 0, archived: 0 });
  const [filter, setFilter] = useState('active');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal',
    priority: 'medium',
    is_private: true
  });

  const categories = [
    { value: 'personal', label: 'Personal', icon: '🙏' },
    { value: 'health', label: 'Health', icon: '❤️' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'work', label: 'Work/Studies', icon: '📚' },
    { value: 'spiritual', label: 'Spiritual Growth', icon: '✨' },
    { value: 'financial', label: 'Financial', icon: '💰' },
    { value: 'relationships', label: 'Relationships', icon: '💑' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  useEffect(() => {
    fetchPrayers();
    fetchStats();
  }, [filter]);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = filter === 'all' ? '/api/member/prayers' : '/api/member/prayers?status=' + filter;
      
      const response = await fetch(url, {
        headers: { 'Authorization': 'Bearer ' + token }
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

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/member/prayers/stats', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/member/prayers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Prayer request submitted!');
        setShowForm(false);
        setFormData({
          title: '',
          content: '',
          category: 'personal',
          priority: 'medium',
          is_private: true
        });
        fetchPrayers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error submitting prayer:', error);
      alert('Failed to submit prayer');
    }
  };

  return (
    <MemberLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Prayer Requests</h1>
              <p className="text-gray-600 dark:text-neutral-400">Submit and track your prayer requests</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all"
            >
              + New Prayer Request
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Total</p>
                <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">{stats.total}</p>
              </div>
              <span className="text-2xl">🙏</span>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Active</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</p>
              </div>
              <span className="text-2xl">⏳</span>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Answered</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.answered}</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-1">Archived</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.archived}</p>
              </div>
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all'
                ? 'bg-pink-600 text-white'
                : 'bg-white dark:bg-neutral-950 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'active'
                ? 'bg-pink-600 text-white'
                : 'bg-white dark:bg-neutral-950 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('answered')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'answered'
                ? 'bg-pink-600 text-white'
                : 'bg-white dark:bg-neutral-950 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-900'
            }`}
          >
            Answered
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'archived'
                ? 'bg-pink-600 text-white'
                : 'bg-white dark:bg-neutral-950 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-900'
            }`}
          >
            Archived
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-950 rounded-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-neutral-900">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">New Prayer Request</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Prayer request title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Prayer Request
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={6}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    placeholder="Describe your prayer request..."
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
                      className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_private"
                    checked={formData.is_private}
                    onChange={(e) => setFormData({...formData, is_private: e.target.checked})}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <label htmlFor="is_private" className="ml-2 text-sm text-gray-700 dark:text-neutral-300">
                    Keep this prayer request private
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all"
                  >
                    Submit Prayer Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-neutral-800 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-900 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Prayers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-neutral-400">Loading prayers...</p>
          </div>
        ) : prayers.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-950 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-900">
            <span className="text-6xl mb-4 block">🙏</span>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-neutral-400 mb-2">No prayer requests yet</h3>
            <p className="text-gray-500 dark:text-neutral-500 mb-6">Submit your first prayer request</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
            >
              Submit Prayer Request
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className="bg-white dark:bg-neutral-950 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-neutral-900"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-black dark:text-white">{prayer.title}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {categories.find(c => c.value === prayer.category)?.icon} {prayer.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        prayer.priority === 'urgent' ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300' :
                        prayer.priority === 'high' ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300' :
                        'bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-300'
                      }`}>
                        {prayer.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      {new Date(prayer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-neutral-300 mb-4 whitespace-pre-wrap">{prayer.content}</p>

                {prayer.status === 'answered' && prayer.testimony && (
                  <div className="bg-green-100 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">✓ Answered:</h4>
                    <p className="text-green-700 dark:text-green-300">{prayer.testimony}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  );
}
