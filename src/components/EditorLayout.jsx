'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
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
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/auth/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.role !== 'editor' && data.role !== 'admin') {
          router.push('/member');
          return;
        }
        setUser(data);
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/editor', icon: '📊' },
    { name: 'Review Blogs', href: '/editor/blogs', icon: '📝' },
    { name: 'Prayer Requests', href: '/editor/prayer-requests', icon: '🙏' },
    { name: 'Bible Study', href: '/editor/bible-study', icon: '📖' },
    { name: 'Spiritual Content', href: '/editor/spiritual-content', icon: '✨' },
    { name: 'Sermons', href: '/editor/sermons', icon: '🎥' },
    { name: 'Gallery', href: '/editor/gallery', icon: '📷' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <Navigation />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 transition-all duration-300 z-40 ' + (sidebarOpen ? 'w-64' : 'w-20')}>
          <div className="p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full mb-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            >
              {sidebarOpen ? '←' : '→'}
            </button>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/30 text-gray-700 dark:text-neutral-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-neutral-800">
            {sidebarOpen && user && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400 capitalize">{user.role}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition"
            >
              <span>🚪</span>
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

      <Footer />
    </div>
  );
}
