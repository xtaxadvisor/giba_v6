import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client'
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Settings,
  Bell,
  User,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Video
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';
import ProfileForm from '../../pages/client/ClientForm';

const menuItems = [
  { title: 'Dashboard', href: '/client', icon: Home },
  { title: 'Documents', href: '/client/documents', icon: FileText },
  { title: 'Messages', href: '/client/messages', icon: MessageSquare },
  { title: 'Appointments', href: '/client/appointments', icon: Calendar },
  { title: 'Consultations', href: '/client/consultations', icon: Video },
  { title: 'Finances', href: '/client/finances', icon: DollarSign },
  { title: 'Tax Planning', href: '/client/tax-planning', icon: TrendingUp },
  { title: 'Settings', href: '/client/settings', icon: Settings },
];

// Development mock user
const user = {
  name: 'Development Client',
  role: 'client',
};

interface ClientLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const ClientLayout = ({ children, title, description }: ClientLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formCompleted, setFormCompleted] = useState(false);
  const [userType, setUserType] = useState<'personal'|'business'>('personal');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    businessName: '',
    service: '',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (!formCompleted) {
    return (
      <ProfileForm
        initialData={formData}
        onSubmit={(data) => {
          setFormData(data);
          setFormCompleted(true);
        }}
        onCancel={() => setFormCompleted(false)}
      />
    );
  }

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
                aria-label="Back to Home"
              >
                Back to Home
              </Button>
              <span className="text-xl font-bold text-blue-600">Client Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative group">
                <button 
                  className="flex items-center space-x-3"
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700">{user?.name}</span>
                </button>
                <div 
                  className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <Link 
                    to="/client/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/client/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    role="menuitem"
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
          <nav className="mt-5 px-2" role="navigation" aria-label="Main navigation">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className={`mr-4 h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} aria-hidden="true" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 ml-64 p-8" role="main">
          <header className="ml-64 px-8 pt-4">
            {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;