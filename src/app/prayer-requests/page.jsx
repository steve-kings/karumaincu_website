'use client';

import { useState } from 'react';

export default function PublicPrayerRequestsPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    is_anonymous: true,
    requester_name: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          is_anonymous: true
        })
      });

      if (response.ok) {
        alert('Prayer request submitted successfully! Our team will pray for you.');
        setFormData({
          title: '',
          description: '',
          category: 'personal',
          is_anonymous: true,
          requester_name: ''
        });
        setShowForm(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit prayer request');
      }
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      alert('Failed to submit prayer request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/hero-3.jpg)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Prayer Requests</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Submit your prayer request and our community will lift you up in prayer. 
            All requests are anonymous and handled with care.
          </p>
        </div>
      </div>

      {/* Submit Button Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            {showForm ? 'CANCEL' : 'SUBMIT A PRAYER REQUEST'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Submission Form */}
        {showForm && (
          <div className="bg-neutral-950 rounded-lg p-8 mb-12 border border-neutral-900 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Share Your Prayer Need</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prayer Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="e.g., Healing for my mother"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prayer Request Details *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                  placeholder="Share your prayer need in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                >
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                  <option value="family">Family</option>
                  <option value="work">Work/Career</option>
                  <option value="spiritual">Spiritual Growth</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
                <p className="text-sm text-purple-300">
                  <strong>Privacy:</strong> All prayer requests are submitted anonymously. 
                  Only our prayer team will see your request.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 disabled:from-gray-700 disabled:to-gray-700 text-white py-4 rounded-lg transition font-bold text-lg shadow-lg"
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT PRAYER REQUEST'}
              </button>
            </form>
          </div>
        )}

        {/* Info Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-900">
              <div className="text-purple-500 mb-4">
                <i className="fas fa-edit text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Submit</h3>
              <p className="text-gray-400">Share your prayer request anonymously using the form above</p>
            </div>
            <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-900">
              <div className="text-teal-500 mb-4">
                <i className="fas fa-praying-hands text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. We Pray</h3>
              <p className="text-gray-400">Our prayer team will lift your request up in prayer</p>
            </div>
            <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-900">
              <div className="text-purple-500 mb-4">
                <i className="fas fa-check-circle text-4xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. God Answers</h3>
              <p className="text-gray-400">Trust in God's perfect timing and plan for your life</p>
            </div>
          </div>
        </div>

        {/* Scripture Section */}
        <div className="bg-gradient-to-r from-purple-900/30 to-teal-900/30 border border-purple-800/50 rounded-lg p-8 text-center">
          <p className="text-2xl text-white font-serif italic mb-4">
            "Do not be anxious about anything, but in every situation, by prayer and petition, 
            with thanksgiving, present your requests to God."
          </p>
          <p className="text-purple-400 font-semibold">Philippians 4:6</p>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Need immediate spiritual support or have questions?
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-lg transition border border-neutral-800"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </div>
  );
}
