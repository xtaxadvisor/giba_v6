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
    if (hydrated && user) {
      switch (user.role) {
        case 'client':
          navigate('/client');
          break;
        case 'professional':
          navigate('/professional');
          break;
        case 'student':
          navigate('/student');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/unauthorized');
          break;
      }
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