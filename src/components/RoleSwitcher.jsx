'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function RoleSwitcher() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Use cookies instead of localStorage
      const response = await fetch('/api/auth/profile', {
        cache: 'no-store',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  const handleRoleSwitch = (targetRole) => {
    setShowMenu(false);
    
    // Redirect based on target role
    if (targetRole === 'admin') {
      router.push('/admin');
    } else if (targetRole === 'editor') {
      router.push('/editor');
    } else {
      router.push('/member');
    }
  };

  // Don't show if not logged in or not admin/editor
  const userRole = user?.role ? user.role.trim().toLowerCase() : null;
  if (!user || (userRole !== 'admin' && userRole !== 'editor')) {
    return null;
  }

  // Determine current dashboard
  const currentDashboard = pathname.startsWith('/admin') ? 'admin' : 
                          pathname.startsWith('/editor') ? 'editor' : 
                          pathname.startsWith('/member') ? 'member' : null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors"
      >
        <span className="text-sm font-medium">
          {currentDashboard === 'admin' ? '👑 Admin' : 
           currentDashboard === 'editor' ? '✏️ Editor' : 
           '👤 Member'}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-gray-200 dark:border-neutral-800 z-50">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase">
                Switch Dashboard
              </div>
              
              {userRole === 'admin' && (
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ' + (currentDashboard === 'admin' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800')}
                >
                  <span className="text-xl">👑</span>
                  <div>
                    <div className="font-medium">Admin Dashboard</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">Full access</div>
                  </div>
                </button>
              )}

              {(userRole === 'admin' || userRole === 'editor') && (
                <button
                  onClick={() => handleRoleSwitch('editor')}
                  className={'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ' + (currentDashboard === 'editor' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800')}
                >
                  <span className="text-xl">✏️</span>
                  <div>
                    <div className="font-medium">Editor Dashboard</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">Content management</div>
                  </div>
                </button>
              )}

              <button
                onClick={() => handleRoleSwitch('member')}
                className={'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ' + (currentDashboard === 'member' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800')}
              >
                <span className="text-xl">👤</span>
                <div>
                  <div className="font-medium">Member Dashboard</div>
                  <div className="text-xs text-gray-500 dark:text-neutral-400">Personal space</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
