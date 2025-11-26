'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DebugTokenPage() {
  const [tokenData, setTokenData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      // Fetch current profile from API (uses cookies automatically)
      const profileResponse = await fetch('/api/auth/profile', {
        credentials: 'include',
        cache: 'no-store'
      });

      if (profileResponse.ok) {
        const data = await profileResponse.json();
        setProfileData(data);
        setTokenData({ message: 'Token stored in httpOnly cookie (secure)', authenticated: true });
      } else {
        setTokenData({ error: 'No valid token found in cookies', authenticated: false });
        setProfileData({ error: 'Failed to fetch profile', status: profileResponse.status });
      }
    } catch (error) {
      setTokenData({ error: 'Authentication check failed', authenticated: false });
      setProfileData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogout = async () => {
    // Call logout API to clear cookie
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    alert('Logged out! Please log in again.');
    router.push('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🔍 Token & Role Debugger</h1>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-neutral-400">Analyzing...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Token Data */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">📝 Token Data (Stored in Browser)</h2>
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 overflow-auto">
                  <pre className="text-sm text-gray-900 dark:text-white">
                    {JSON.stringify(tokenData, null, 2)}
                  </pre>
                </div>
                {tokenData?.role && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Role in token: </span>
                    <span className={'px-3 py-1 rounded-full text-xs font-semibold uppercase ' + (tokenData.role === 'admin' ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300' : tokenData.role === 'editor' ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300')}>
                      {tokenData.role}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Data */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">👤 Current Profile (From Database)</h2>
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 overflow-auto">
                  <pre className="text-sm text-gray-900 dark:text-white">
                    {JSON.stringify(profileData, null, 2)}
                  </pre>
                </div>
                {profileData?.role && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Role in database: </span>
                    <span className={'px-3 py-1 rounded-full text-xs font-semibold uppercase ' + (profileData.role === 'admin' ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300' : profileData.role === 'editor' ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300')}>
                      {profileData.role}
                    </span>
                  </div>
                )}
              </div>

              {/* Comparison */}
              {tokenData?.role && profileData?.role && tokenData.role !== profileData.role && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4">
                  <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2">⚠️ ROLE MISMATCH DETECTED!</h3>
                  <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                    Your token has role <strong>"{tokenData.role}"</strong> but the database shows <strong>"{profileData.role}"</strong>.
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                    This happens when an admin changes your role but you haven't logged out yet.
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-300 font-semibold">
                    Solution: Click "Force Logout & Re-login" below to get a fresh token with your new role.
                  </p>
                </div>
              )}

              {tokenData?.role === profileData?.role && (
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">✅ Roles Match!</h3>
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Your token and database role are in sync: <strong>{tokenData.role}</strong>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  🔄 Refresh Check
                </button>
                <button
                  onClick={handleForceLogout}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  🚪 Force Logout & Re-login
                </button>
              </div>

              <div className="flex gap-3">
                <a
                  href="/member"
                  className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-center"
                >
                  Go to Member Dashboard
                </a>
                <a
                  href="/check-role"
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-center"
                >
                  Check Role Page
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">📚 How to Fix Role Issues:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>Admin updates your role in the database (via /admin/users)</li>
            <li>You see "Role Mismatch" warning above</li>
            <li>Click "Force Logout & Re-login" button</li>
            <li>Log in again with your credentials</li>
            <li>Your new role will now be active!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
