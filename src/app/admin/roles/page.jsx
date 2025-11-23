'use client';

import { useState, useEffect } from 'react';

export default function RolesManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filterRole !== 'all') params.append('role', filterRole);

      const response = await fetch('/api/admin/users?' + params, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    admins: users.filter(u => u.role === 'admin').length,
    editors: users.filter(u => u.role === 'editor').length,
    members: users.filter(u => u.role === 'member').length,
    total: users.length
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Roles Management</h1>
        <p className="text-gray-600 dark:text-gray-400">View and manage user roles and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <span className="text-3xl">👥</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
              <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
            </div>
            <span className="text-3xl">👑</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Editors</p>
              <p className="text-2xl font-bold text-purple-600">{stats.editors}</p>
            </div>
            <span className="text-3xl">✏️</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
              <p className="text-2xl font-bold text-blue-600">{stats.members}</p>
            </div>
            <span className="text-3xl">👤</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 p-6 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterRole('all')}
            className={'px-4 py-2 rounded-lg transition ' + (filterRole === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300')}
          >
            All Users
          </button>
          <button
            onClick={() => setFilterRole('admin')}
            className={'px-4 py-2 rounded-lg transition ' + (filterRole === 'admin' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300')}
          >
            👑 Admins
          </button>
          <button
            onClick={() => setFilterRole('editor')}
            className={'px-4 py-2 rounded-lg transition ' + (filterRole === 'editor' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300')}
          >
            ✏️ Editors
          </button>
          <button
            onClick={() => setFilterRole('member')}
            className={'px-4 py-2 rounded-lg transition ' + (filterRole === 'member' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300')}
          >
            👤 Members
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-900 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl block mb-4">👥</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-neutral-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {user.role === 'admin' ? '👑' : user.role === 'editor' ? '✏️' : '👤'}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.registration_number}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={'px-3 py-1 rounded-full text-xs font-semibold uppercase ' + (user.role === 'admin' ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300' : user.role === 'editor' ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300')}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={'px-3 py-1 rounded-full text-xs font-semibold ' + (user.status === 'active' ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-300')}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Role Permissions:</h3>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
          <li><strong>Admin:</strong> Full access to all features including user management</li>
          <li><strong>Editor:</strong> Can review blogs, add sermons, galleries, and spiritual content</li>
          <li><strong>Member:</strong> Access to personal dashboard and member features</li>
        </ul>
        <p className="text-sm text-blue-800 dark:text-blue-300 mt-3">
          To change roles, go to <a href="/admin/users" className="underline font-semibold">User Management</a> page.
        </p>
      </div>
    </div>
  );
}
