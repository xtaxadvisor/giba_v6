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
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { useNotificationStore } from '@/lib/store';

export default function LoginPage() {
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [selectedRole, setSelectedRole] = useState<string | null>(() => {
    const stored = localStorage.getItem('lastRole');
    return stored && stored !== 'null' ? stored : null;
  });

  const redirectToRolePath = (role: string, hasCompleted: boolean) => {
    localStorage.setItem('lastRole', role);
    const path = hasCompleted ? `/${role}` : `/onboarding/${role}`;
    navigate(path, { replace: true });
  };

  useEffect(() => {
    if (!hydrated || !user) return;

    const roles: string[] = Array.isArray(user.roles)
      ? user.roles
      : user.role
      ? [user.role]
      : [];

    const hasCompleted = user?.onboardingcomplete ?? false;

    if (!roles.length) {
      addNotification('No role assigned. Contact support.', 'error');
      navigate('/unauthorized');
      return;
    }

    if (roles.length === 1) {
      redirectToRolePath(roles[0], hasCompleted);
      return;
    }

    if (selectedRole && roles.includes(selectedRole)) {
      redirectToRolePath(selectedRole, hasCompleted);
    }
  }, [hydrated, user, selectedRole, navigate, addNotification]);

  if (!hydrated) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Box textAlign="center" mt={20}>
            <Spinner />
            <Text mt={2}>Initializing session... Please wait.</Text>
          </Box>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Show role selector if user has multiple roles
  if (user && Array.isArray(user.roles) && user.roles.length > 1 && !selectedRole) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Box maxW="md" mx="auto" mt={10}>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Select a role to continue</Heading>
              <Select
                aria-label="Select role"
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
                colorScheme="blue"
                isDisabled={!selectedRole}
                onClick={() => {
                  if (!selectedRole) {
                    addNotification('Please select a role.', 'info');
                    return;
                  }

                  const hasCompleted = user?.onboardingcomplete ?? false;

                  addNotification('🎯 Redirecting to your dashboard...', 'info');
                  setTimeout(() => {
                    redirectToRolePath(selectedRole, hasCompleted);
                  }, 800);
                }}
              >
                Continue
              </Button>
            </VStack>
          </Box>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login | ProTaxAdvisors</title>
        <meta name="description" content="Login to ProTaxAdvisors to manage your taxes, roles, and financial tools." />
      </Helmet>

      <LoginForm />
    </>
  );
}