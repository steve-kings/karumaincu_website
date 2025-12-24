'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditorLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('EditorLayout: Checking authentication...')
      // Fetch fresh data from database - cookies sent automatically
      const response = await fetch('/api/auth/profile', {
        cache: 'no-store',
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        const userRole = data.user.role ? data.user.role.trim().toLowerCase() : 'member'
        
        console.log('EditorLayout: User role:', userRole)
        
        // Only allow editor and admin roles
        if (userRole !== 'editor' && userRole !== 'admin') {
          console.error('EditorLayout: Access denied - not editor/admin')
          alert('Access Denied: You do not have editor permissions. Please contact an administrator.')
          router.push('/member')
          return
        }
        
        setUser(data.user)
      } else {
        console.error('EditorLayout: Auth failed, redirecting to login')
        router.push('/login')
      }
    } catch (error) {
      console.error('EditorLayout: Auth error:', error)
      router.push('/login')
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/login')
    }
  }

  const handleRoleSwitch = (targetRole) => {
    const userRole = user?.role ? user.role.trim().toLowerCase() : 'member'
    
    if (targetRole === 'admin') {
      if (userRole === 'admin') {
        router.push('/admin');
      } else {
        alert('You do not have admin access. Please contact an administrator.');
      }
    } else if (targetRole === 'member') {
      router.push('/member');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/editor', icon: 'fa-tachometer-alt' },
    { name: 'Review Blogs', href: '/editor/blogs', icon: 'fa-blog' },
    { name: 'Prayer Requests', href: '/editor/prayer-requests', icon: 'fa-praying-hands' },
    { name: 'Bible Study', href: '/editor/bible-study', icon: 'fa-book-bible' },
    { name: 'Spiritual Content', href: '/editor/spiritual-content', icon: 'fa-cross' },
    { name: 'Sermons', href: '/editor/sermons', icon: 'fa-video' },
    { name: 'Gallery', href: '/editor/gallery', icon: 'fa-images' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="flex">
        {/* Sidebar */}
        <aside className={'fixed left-0 top-16 md:top-24 h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 z-30 flex flex-col ' + (sidebarOpen ? 'w-64' : 'w-20')}>
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(156 163 175) transparent'
          }}>
            <div className="p-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full mb-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition flex items-center justify-center"
              >
                <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-gray-600 dark:text-neutral-400`}></i>
              </button>

              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/30 text-gray-700 dark:text-neutral-300 hover:text-purple-600 dark:hover:text-purple-400 transition group"
                  >
                    <i className={`fas ${item.icon} text-lg group-hover:scale-110 transition-transform`}></i>
                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Fixed Bottom Section */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-neutral-800 space-y-2 bg-white dark:bg-neutral-900">
            {sidebarOpen && user && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400 capitalize">{user.role}</p>
              </div>
            )}
            
            {/* Role Switcher - Show for all editors */}
            {user && sidebarOpen && (
              <div className="mb-2">
                <p className="text-xs text-gray-500 dark:text-neutral-400 mb-1">Switch Dashboard:</p>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition text-sm mb-1"
                >
                  <i className="fas fa-crown"></i>
                  <span className="font-medium">Admin Dashboard</span>
                  {user.role !== 'admin' && <i className="fas fa-lock text-xs"></i>}
                </button>
                <button
                  onClick={() => handleRoleSwitch('member')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition text-sm"
                >
                  <i className="fas fa-user"></i>
                  <span className="font-medium">Member Dashboard</span>
                </button>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition"
            >
              <i className="fas fa-sign-out-alt"></i>
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={'flex-1 transition-all duration-300 ' + (sidebarOpen ? 'ml-64' : 'ml-20')}>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
