import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
// Define AdminHeader directly in this file
interface AdminHeaderProps {
  user: any;
  onLogout: () => void;
}

export function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow z-10">
      <div className="flex justify-between items-center px-4 py-2">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <span>{user?.name || 'Guest'}</span>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
// Removed incorrect import of AdminSidebar

interface AdminLayoutProps {
  children: React.ReactNode;
}
// Ensure this file contains the definition of AdminSidebar
// and export it properly.
export function AdminSidebar() {
  return (
    <div>
      {/* Sidebar content */}
    </div>
  );
}
export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      // handle error
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <AdminHeader user={user} onLogout={handleLogout} />

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] border-r border-gray-200 overflow-y-auto">
          <AdminSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// Removed circular export of AdminHeader
