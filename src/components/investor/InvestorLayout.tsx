import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Home, Video, MessageSquare, TrendingUp, BookOpen, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface InvestorLayoutProps {
  children: React.ReactNode;
}

export default function InvestorLayout({ children }: InvestorLayoutProps) {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', href: '', icon: Home },
    { title: 'Video Library', href: 'videos', icon: Video },
    { title: 'Investment Forum', href: 'forum', icon: MessageSquare },
    { title: 'Market Analysis', href: 'analysis', icon: TrendingUp },
    { title: 'Resources', href: 'resources', icon: BookOpen },
    { title: 'Settings', href: 'settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top navigation */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              icon={ArrowLeft}
              aria-label="Back to Home"
            >
              Back to Home
            </Button>
            <span className="text-xl font-bold text-blue-600 ml-4">Investor Portal</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            aria-label="Sign Out"
          >
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] border-r border-gray-200 fixed overflow-y-auto">
          <nav className="mt-5 px-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.href}
                end={item.href === ''}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-4 h-6 w-6" aria-hidden="true" />
                {item.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}