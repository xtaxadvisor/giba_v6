import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Settings, 
  Shield, 
  Database,
  Activity,
  UserPlus,
  ArrowLeft,
  BookOpen,
  Bell
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../ui/Button'; // Ensure this path is correct or update it
import type { MenuItem } from './AdminSidebar'; // Ensure the file 'AdminSidebar.ts' or 'AdminSidebar.tsx' exists in the same directory

const menuItems: MenuItem[] = [
  { title: 'Dashboard', href: '', icon: Home },
  { title: 'Services', href: 'services', icon: BookOpen },
  { title: 'Team Management', href: 'team', icon: Users },
  { title: 'User Management', href: 'users', icon: UserPlus },
  { title: 'System Logs', href: 'logs', icon: Activity },
  { title: 'Database', href: 'database', icon: Database },
  { title: 'Settings', href: 'settings', icon: Settings }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                icon={ArrowLeft}
                aria-label="Back to Home"
              />
              <span className="text-xl font-bold text-blue-600">Admin Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative group">
                <button className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700">{user?.role || 'Unknown Role'}</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] border-r border-gray-200 fixed">
          <nav className="mt-5 px-2">
            {menuItems.map((item) => {
              return (
                <NavLink
                  key={item.title}
                  to={item.href}
                  end={item.href === ''}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1 ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-4 h-6 w-6" aria-hidden="true" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}