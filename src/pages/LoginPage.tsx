import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Text } from '@chakra-ui/react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const { hydrated } = useAuth();

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