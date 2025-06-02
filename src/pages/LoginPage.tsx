// src/pages/LoginPage.tsx
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Text } from '@chakra-ui/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { hydrated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated || !user) return;

    // Replace 'onboarding_complete' with the correct property name, e.g., 'onboardingComplete'
    const hasCompletedOnboarding = (user as any).onboarding_complete;

    const basePath = hasCompletedOnboarding
      ? `/${user.role}`
      : `/onboarding/${user.role}`;

    if (user.role && ['client', 'professional', 'student', 'admin', 'investor'].includes(user.role)) {
      console.log(`🔐 Authenticated as ${user.role} → redirecting to ${basePath}`);
      navigate(basePath);
    } else {
      console.warn('🚫 Unknown or unauthorized role:', user.role);
      navigate('/unauthorized');
    }
  }, [hydrated, user, navigate]);

  return (
    <>
      <Helmet>
        <title>Login | ProTaxAdvisors</title>
      </Helmet>

      {!hydrated ? (
        <Box textAlign="center" mt={20}>
          <Text>Initializing session... Please wait.</Text>
        </Box>
      ) : (
        <LoginForm />
      )}
    </>
  );
}