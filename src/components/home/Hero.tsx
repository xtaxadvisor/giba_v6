import React from 'react';
import { Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '@/contexts/AuthContext'; // ✅
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onBookNow: (serviceType: string) => void;
}

export function Hero({ onBookNow }: HeroProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const logout = useAuth()?.logout; // Safely access logout
  const isAuthenticated = Boolean(user);


  return (
    <div>
      <div>
        <div className="relative bg-gradient-to-b from-blue-50 to-white">
          {/* Content inside this div */}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
        </div>
      </div>
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
          {/* First step in client onboarding-to-calendar flow: redirect to profile setup */}
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login');
              } else {
                onBookNow('consultation');
              }
            }}
            variant="primary"
            size="lg"
            icon={Phone}
            className="px-8 hover-scale"
          >
            Get Started with a FREE Tax Consultation
          </Button> 
          <Button
            onClick={() => {
              const el = document.getElementById('pricing');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            variant="primary"
            size="lg"
            className="px-8 hover-scale"
          >
            View Pricing Plans
          </Button>
          {!isAuthenticated && (
            <>
              <Button
                onClick={() => navigate('/register')}
                variant="primary"
                size="lg"
                className="px-8 hover-scale"
              >
                Create FREE Account
              </Button>
              <Button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    onBookNow('video-consultation');
                  }
                }}
                variant="primary"
                size="lg"
                className="px-8 hover-scale"
              >
                Book a Video Consultation
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
