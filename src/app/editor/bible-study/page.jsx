'use client';

import { useState, useEffect } from 'react';
import EditorLayout from '@/components/EditorLayout';

export default function EditorBibleStudyPage() {
  const [sessions, setSessions] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/member/bible-study/sessions', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        // Handle both array and object with data property
        setSessions(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (sessionId) => {
    try {
      const response = await fetch('/api/admin/bible-study/registrations?session_id=' + sessionId, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        // Handle both array and object with data property
        setRegistrations(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setRegistrations([]); // Set empty array on error
    }
  };

  const handleViewRegistrations = (session) => {
    setSelectedSession(session);
    fetchRegistrations(session.id);
  };

  return (
    <EditorLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bible Study Sessions</h1>
          <p className="text-gray-600 dark:text-neutral-400">View sessions and registrations (Read-only)</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-book-bible text-green-600 dark:text-green-400 text-4xl"></i>
            </div>
            <p className="text-gray-600 dark:text-neutral-400">No bible study sessions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{session.title}</h3>
                    <p className="text-gray-700 dark:text-neutral-300 mb-3">{session.description}</p>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-neutral-400">
                      <span><i className="fas fa-calendar-alt mr-1"></i> Start: {new Date(session.start_date).toLocaleDateString()}</span>
                      <span><i className="fas fa-calendar-alt mr-1"></i> End: {new Date(session.end_date).toLocaleDateString()}</span>
                      <span><i className="fas fa-clock mr-1"></i> Deadline: {new Date(session.registration_deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={'px-3 py-1 rounded-full text-xs font-medium ' + (session.is_open ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300')}>
                    {session.is_open ? 'Open' : 'Closed'}
                  </span>
                </div>

                <button
                  onClick={() => handleViewRegistrations(session)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  View Registrations ({session.registration_count || 0})
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Registrations Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-neutral-800">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSession.title}</h2>
                  <p className="text-gray-600 dark:text-neutral-400">Registrations</p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200 text-2xl"
                >
                  ×
                </button>
              </div>

              {registrations.length === 0 ? (
                <p className="text-center py-8 text-gray-600 dark:text-neutral-400">No registrations yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-neutral-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">School</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">Year</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                      {registrations.map((reg) => (
                        <tr key={reg.id}>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{reg.full_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">{reg.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">{reg.phone}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">{reg.school}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">{reg.year_of_study}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-neutral-400">{reg.location_name}</td>
                          <td className="px-4 py-3">
                            <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (reg.status === 'approved' ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300' : reg.status === 'rejected' ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300')}>
                              {reg.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </EditorLayout>
  );
}
