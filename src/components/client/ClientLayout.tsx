import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';

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

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const [menuOpen, setMenuOpen] = useState(false);

  if (!formCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
          <h2 className="text-xl font-semibold text-center mb-4">Welcome! Please complete your profile:</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFormCompleted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">I am a</label>
              <select
                name="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value as 'personal'|'business')}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="personal">Personal user</option>
                <option value="business">Business user</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                name="fullName"
                type="text"
                placeholder="Your full name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            {userType === 'business' && (
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <input
                  name="businessName"
                  type="text"
                  placeholder="Your business name"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Which service are you interested in?</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">Select a service</option>
                <option value="tax-planning">Tax Planning</option>
                <option value="financial-review">Financial Review</option>
                <option value="investment-advisory">Investment Advisory</option>
                <option value="business-consulting">Business Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
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
              <div className="relative">
                <button 
                  className="flex items-center space-x-3"
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(!menuOpen)}
                  type="button"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-700">{user?.name}</span>
                </button>
                {menuOpen && (
                  <div 
                    className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl"
                    role="menu"
                    aria-orientation="vertical"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <Link 
                      to="/client/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/client/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      role="menuitem"
                      type="button"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
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
          <header className="px-8 pt-4">
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