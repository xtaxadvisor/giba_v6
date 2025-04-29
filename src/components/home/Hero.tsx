import React from 'react';
import { Phone, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onBookNow: (serviceType: string) => void;
}

export function Hero({ onBookNow }: HeroProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuth();
  const isAuthenticated = Boolean(user);

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div>
      <div className="relative bg-gradient-to-b from-blue-50 to-white">
        {/* Content inside this div */}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        <div className="text-center animate-slideUp">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Financial Excellence<br />
            <span className="text-gradient">Made Simple</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Expert tax and financial advisory services tailored to your needs.
            Join thousands of satisfied clients in achieving their financial goals.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => onBookNow('consultation')}
              variant="primary"
              size="lg"
              icon={Phone}
              className="px-8 hover-scale"
            >
              Get Started with a FREE TaxConsultation
            </Button> 
             {!isAuthenticated && (
              <Button
                onClick={handleCreateAccount}
                variant="primary"
                size="lg"
                className="px-8 hover-scale"
              >
                Create new Account 
              </Button>
            )}
            {isAuthenticated && (
              <Button
                variant="secondary"
                size="lg"
                className="px-8 hover-scale"
                onClick={() => logout()}
              >
                Logout
              </Button>
            )}
          </div>    
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <Button
              variant="secondary"
              size="lg"
              icon={Video}
              className="px-8 hover-scale"
              onClick={() => navigate('/browse-videos')}
            >
              become a client
            </Button>
            {isAuthenticated && (
              <Button
                variant="secondary"
                size="lg"
                className="px-8 hover-scale"
                onClick={() => navigate('/client')}
              >
                Go to Client Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}
//
// CSS Animations
// .animate-slideUp {
//   animation: slideUp 0.5s ease-out forwards;
// }
// @keyframes slideUp {
//   0% {
//     transform: translateY(20px);     
