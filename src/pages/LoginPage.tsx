import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Text,
  Select,
  Spinner,
  VStack,
  Heading,
  Button
} from '@chakra-ui/react';

import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { useNotificationStore } from '@/lib/store';

export default function LoginPage() {
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [selectedRole, setSelectedRole] = useState<string | null>(() => {
    return localStorage.getItem('lastRole') || null;
  });

  useEffect(() => {
    if (!hydrated || !user) return;

    const roles: string[] = Array.isArray(user.roles)
      ? user.roles
      : user.role
      ? [user.role]
      : [];

    const hasCompleted = (user as any)?.onboarding_complete;

    if (!roles.length) {
      addNotification('No role assigned. Contact support.', 'error');
      navigate('/unauthorized');
      return;
    }

    if (roles.length === 1) {
      const role = roles[0];
      localStorage.setItem('lastRole', role);
      const path = hasCompleted ? `/${role}` : `/onboarding/${role}`;
      navigate(path, { replace: true });
      return;
    }

    if (selectedRole && roles.includes(selectedRole)) {
      localStorage.setItem('lastRole', selectedRole);
      const path = hasCompleted ? `/${selectedRole}` : `/onboarding/${selectedRole}`;
      navigate(path, { replace: true });
    }
  }, [hydrated, user, selectedRole, navigate, addNotification]);

  if (!hydrated) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner />
        <Text mt={2}>Initializing session... Please wait.</Text>
      </Box>
    );
  }

  // Show role selector if user has multiple roles
  if (user && Array.isArray(user.roles) && user.roles.length > 1 && !selectedRole) {
    return (
      <Box maxW="md" mx="auto" mt={10}>
        <VStack spacing={6} align="stretch">
          <Heading size="md">Select a role to continue</Heading>
          <Select
            placeholder="Choose your portal"
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {user.roles.map((role: string) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="indigo"
            onClick={() => {
              if (!selectedRole) {
                addNotification('Please select a role.', 'info');
              }
            }}
          >
            Continue
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login | ProTaxAdvisors</title>
      </Helmet>

      <LoginForm />
    </>
  );
}