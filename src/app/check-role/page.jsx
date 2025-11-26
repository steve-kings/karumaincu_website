'use client';

import { useState, useEffect } from 'react';

export default function CheckRolePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Check authentication via API (uses cookies)
      const response = await fetch('/api/auth/profile', {
        credentials: 'include',
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser({ error: 'No valid authentication found' });
      }
    } catch (error) {
      setUser({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Check Your Role</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-neutral-400">Loading...</p>
          </div>
        ) : user?.error ? (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-300">{user.error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-neutral-400">Full Name</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.full_name}</p>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-neutral-400">Email</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.email}</p>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-neutral-400">Current Role</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 uppercase">{user?.role}</p>
            </div>

            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-neutral-400">User ID</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.id}</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Access Levels:</h3>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                <li>✓ Member Dashboard: /member</li>
                {(user?.role === 'editor' || user?.role === 'admin') && (
                  <li>✓ Editor Dashboard: /editor</li>
                )}
                {user?.role === 'admin' && (
                  <li>✓ Admin Dashboard: /admin</li>
                )}
              </ul>
            </div>

            {user?.role === 'member' && (
              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">⚠️ Note:</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  You currently have 'member' role. To access the Editor Dashboard, an admin needs to change your role to 'editor' in the database.
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-2">
                  SQL Command: <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">UPDATE users SET role = 'editor' WHERE id = {user?.id};</code>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <a
            href="/member"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
          >
            Go to Member Dashboard
          </a>
          {(user?.role === 'editor' || user?.role === 'admin') && (
            <a
              href="/editor"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center"
            >
              Go to Editor Dashboard
            </a>
          )}
          {user?.role === 'admin' && (
            <a
              href="/admin"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-center"
            >
              Go to Admin Dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
