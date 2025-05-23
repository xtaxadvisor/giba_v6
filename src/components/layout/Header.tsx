import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Menu, X, Shield, Video, FileText, Calculator } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/Button';

export function Header() {
  const navigate = useNavigate();
  let isAuthenticated = false;
  let user = null;
  let logout = () => {};

  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    user = auth.user;
    logout = auth.logout;
  } catch (err) {
    console.error('Header must be used within an AuthProvider.', err);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700">Authentication Unavailable</h2>
          <p className="text-sm text-gray-500 mt-2">Please reload the page or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1 flex justify-center items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className={`brand-logo text-4xl sm:text-5xl font-extrabold tracking-tight leading-snug transition-all duration-700 ease-out ${
              isScrolled ? 'scale-95 text-gray-800' : 'scale-100 opacity-100'
            }`}>
              <span className="text-blue-600">PRo</span>
              <span className={isScrolled ? 'text-gray-900' : 'text-gray-800'}>Ta</span>
              <span className="text-blue-600">X</span>
              <span className={isScrolled ? 'text-gray-900' : 'text-gray-800'}>AdvisorS</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 px-6 py-2 rounded-full shadow transition h-10">
                Explore
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <Link to="/services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  All Services
                </Link>
                <Link to="/same-day-services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Same Day Services
                </Link>
                <Link to="/video-classes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Video Classes
                </Link>
                <Link to="/tax-calculator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Tax Calculator
                </Link>
                <Link to="/tax-forms" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Tax Forms
                </Link>
                <a href="#about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  About
                </a>
                <a href="#contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Contact
                </a>
              </div>
            </div>
            
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="hover-scale"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="hover-scale"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  icon={LogIn}
                  className="hover-scale"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/register')}
                  className="hover-scale"
                >
                  Get Started
                </Button>
              </div>
            )}
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg`}>
        <div className="px-4 pt-2 pb-3 space-y-1">
          <Link
            to="/services"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Services
          </Link>
          <Link
            to="/same-day-services"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Same Day Services
          </Link>
          <Link
            to="/video-classes"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Video Classes
          </Link>
          <Link
            to="/tax-calculator"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Tax Calculator
          </Link>
          <Link
            to="/tax-forms"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Tax Forms
          </Link>
          <a
            href="#about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            About
          </a>
          <a
            href="#contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Contact
          </a>
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Admin Portal
            </Link>
          )}
          <div className="pt-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="w-full mb-2"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  icon={LogIn}
                  className="w-full mb-2"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/register')}
                  className="w-full"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}