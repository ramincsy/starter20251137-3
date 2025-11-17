import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const admin = JSON.parse(localStorage.getItem('admin_user') || '{}');
  const isSuperAdmin = admin.role === 'super_admin';

  const menuItems = [
    {
      icon: '📊',
      label: 'داشبورد',
      path: '/admin/dashboard',
    },
    {
      icon: '🏢',
      label: 'مدیریت شرکت‌ها',
      path: '/admin/companies',
    },
    {
      icon: '👥',
      label: 'مدیریت کاربران',
      path: '/admin/employees',
    },
    {
      icon: '📋',
      label: 'سوابق فعالیت',
      path: '/admin/activity',
    },
    ...(isSuperAdmin
      ? [
          {
            icon: '🔐',
            label: 'مدیریت ادمین‌ها',
            path: '/admin/users',
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-700 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚙️</span>
              </div>
              <div>
                <h1 className="font-bold text-sm">پنل ادمین</h1>
                <p className="text-xs text-blue-200">Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-white bg-opacity-20 border-l-4 border-white'
                  : 'hover:bg-blue-700'
              }`}
            >
              <span className="text-xl min-w-6">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-blue-700">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors relative"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold">
              {admin.username?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{admin.username}</p>
                <p className="text-xs text-blue-200 truncate">
                  {admin.role === 'super_admin' ? '🔴 Super Admin' : '🟢 Admin'}
                </p>
              </div>
            )}

            {/* Dropdown Menu */}
            {userMenuOpen && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg text-gray-800 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600 font-semibold rounded-lg"
                >
                  ✕ خروج از سیستم
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              ☰
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{admin.username}</p>
              <p className="text-xs text-gray-500">
                {admin.role === 'super_admin' ? 'مدیر سیستم' : 'مدیر'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              خروج
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
};
