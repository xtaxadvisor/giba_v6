import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AuthService } from '../../services/auth/authService';
import { roleRoutes } from '../../utils/constants/roleRoutes'; // Adjust the path as needed

export function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await AuthService.signIn(formData.email, formData.password);
      if (user?.role && roleRoutes[user.role as keyof typeof roleRoutes]) {
        navigate(roleRoutes[user.role as keyof typeof roleRoutes]);
      } else {
        console.warn('Unknown or missing user role:', user?.role);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Sign-in failed:', error);
      // Optionally display error to the user here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/')}
            icon={ArrowLeft}
          >
            Back to Home
          </Button>
          <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-700">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-800 hover:text-blue-900">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email address"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            autoComplete="email"
            placeholder="Enter your email"
            aria-label="Email address"
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-label="Password"
          />

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-800 hover:text-blue-900">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Development Login Credentials:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>Admin: admin@protaxadvisors.tax / Admin123!@#</li>
                <li>Client: client@example.com / Client123!@#</li>
                <li>Professional: professional@example.com / Professional123!@#</li>
                <li>Investor: investor@example.com / Investor123!@#</li>
                <li>Student: student@example.com / Student123!@#</li>
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}