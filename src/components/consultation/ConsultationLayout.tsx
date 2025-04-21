import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { Calendar, Clock, Video, MessageSquare, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export function ConsultationLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'My Consultations', href: '', icon: Calendar },
    { title: 'Schedule', href: 'book', icon: Clock },
    { title: 'Video Sessions', href: 'sessions', icon: Video },
    { title: 'Messages', href: 'messages', icon: MessageSquare },
    { title: 'Settings', href: 'settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                icon={ArrowLeft}
                className="mr-4"
              >
                Back to Home
              </Button>
              <span className="text-xl font-bold text-blue-600">Consultation Portal</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] border-r border-gray-200 fixed overflow-y-auto">
          <nav className="mt-5 px-2">
            {menuItems.map((item) => {
              return (
                <NavLink
                  key={item.title}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1 ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 ml-64 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}