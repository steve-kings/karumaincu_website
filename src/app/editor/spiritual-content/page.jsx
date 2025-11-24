'use client';

import { useState } from 'react';
import EditorLayout from '@/components/EditorLayout';

export default function EditorSpiritualContentPage() {
  const [activeTab, setActiveTab] = useState('verse');
  const [verseData, setVerseData] = useState({
    verse_reference: '',
    verse_text: '',
    commentary: '',
    date: ''
  });
  const [readingData, setReadingData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: '',
    book: '',
    chapter_start: '',
    chapter_end: '',
    devotional_note: ''
  });

  const handleVerseSubmit = async (e) => {
    e.preventDefault();

    try {
            const response = await fetch('/api/admin/spiritual/verse-of-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(verseData)
      });

      if (response.ok) {
        alert('Verse of the day added successfully!');
        setVerseData({
          verse_reference: '',
          verse_text: '',
          commentary: '',
          date: ''
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add verse');
      }
    } catch (error) {
      console.error('Error adding verse:', error);
      alert('Failed to add verse');
    }
  };

  const handleReadingSubmit = async (e) => {
    e.preventDefault();

    try {
            const response = await fetch('/api/admin/spiritual/reading-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(readingData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Reading calendar entry added successfully!');
        
        setReadingData({
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          day: '',
          book: '',
          chapter_start: '',
          chapter_end: '',
          devotional_note: ''
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add reading');
      }
    } catch (error) {
      console.error('Error adding reading:', error);
      alert('Failed to add reading');
    }
  };

  return (
    <EditorLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Spiritual Content</h1>
          <p className="text-gray-600 dark:text-neutral-400">Add verse of the day and reading calendar</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('verse')}
            className={'px-6 py-3 rounded-lg transition font-medium ' + (activeTab === 'verse' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-800')}
          >
            Verse of the Day
          </button>
          <button
            onClick={() => setActiveTab('reading')}
            className={'px-6 py-3 rounded-lg transition font-medium ' + (activeTab === 'reading' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-800')}
          >
            Reading Calendar
          </button>
        </div>

        {/* Verse of the Day Form */}
        {activeTab === 'verse' && (
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-neutral-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Verse of the Day</h2>

            <form onSubmit={handleVerseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={verseData.date}
                  onChange={(e) => setVerseData({...verseData, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Verse Reference * (e.g., John 3:16)
                </label>
                <input
                  type="text"
                  required
                  value={verseData.verse_reference}
                  onChange={(e) => setVerseData({...verseData, verse_reference: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="John 3:16"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Verse Text *
                </label>
                <textarea
                  required
                  value={verseData.verse_text}
                  onChange={(e) => setVerseData({...verseData, verse_text: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="For God so loved the world..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Commentary
                </label>
                <textarea
                  value={verseData.commentary}
                  onChange={(e) => setVerseData({...verseData, commentary: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Brief reflection on the verse..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Add Verse of the Day
              </button>
            </form>
          </div>
        )}

        {/* Reading Calendar Form */}
        {activeTab === 'reading' && (
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-neutral-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add Reading Calendar Entry</h2>

            <form onSubmit={handleReadingSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={readingData.year}
                    onChange={(e) => setReadingData({...readingData, year: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Month *
                  </label>
                  <select
                    required
                    value={readingData.month}
                    onChange={(e) => setReadingData({...readingData, month: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Day *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="31"
                    value={readingData.day}
                    onChange={(e) => setReadingData({...readingData, day: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Book *
                </label>
                <input
                  type="text"
                  required
                  value={readingData.book}
                  onChange={(e) => setReadingData({...readingData, book: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Genesis"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Chapter Start *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={readingData.chapter_start}
                    onChange={(e) => setReadingData({...readingData, chapter_start: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Chapter End (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={readingData.chapter_end}
                    onChange={(e) => setReadingData({...readingData, chapter_end: e.target.value ? parseInt(e.target.value) : ''})}
                    className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Devotional Note
                </label>
                <textarea
                  value={readingData.devotional_note}
                  onChange={(e) => setReadingData({...readingData, devotional_note: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Brief reflection or note about this reading..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Add Reading Entry
              </button>
            </form>
          </div>
        )}
      </div>
    </EditorLayout>
  );
}
