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
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !user) return;

    const roles: string[] = Array.isArray(user.roles) ? user.roles : [user.role].filter(Boolean);
    const hasCompleted = (user as any)?.onboarding_complete;

    if (!roles.length) {
      addNotification('No role assigned. Contact support.', 'error');
      navigate('/unauthorized');
      return;
    }

    if (roles.length === 1) {
      const role = roles[0];
      const path = hasCompleted ? `/${role}` : `/onboarding/${role}`;
      navigate(path, { replace: true });
    }

    if (roles.length > 1 && !selectedRole) {
      // Wait for user to pick role via dropdown
      return;
    }

    if (selectedRole) {
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

  // If user is already authenticated but needs to pick a role
  if (user && Array.isArray(user.roles) && user.roles.length > 1 && !selectedRole) {
    return (
      <Box maxW="md" mx="auto" mt={10}>
        <VStack spacing={6} align="stretch">
          <Heading size="md">Select a role to continue</Heading>
          <Select placeholder="Choose your portal" onChange={(e) => setSelectedRole(e.target.value)}>
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
                addNotification('Please select a role.', 'warning');
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