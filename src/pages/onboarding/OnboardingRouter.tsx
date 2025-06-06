// src/pages/onboarding/OnboardingRouter.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Heading, Spinner, Text, VStack, Checkbox, Button, useToast } from '@chakra-ui/react';
import { supabase } from '@/lib/supabase/client';

export default function OnboardingRouter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { role } = useParams();
  const toast = useToast();

  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(true);

  const steps = [
    'Welcome to ProTaxAdvisors!',
    'Verify your profile information',
    'Upload ID or key documents',
    'Schedule your first consultation'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const checkOnboardingStatus = async () => {
      try {
        if (!user) return;
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking onboarding status:', error);
        }

        if (data?.onboarding_complete) {
          setFirstTime(false);
        }
      } catch (err) {
        console.error('Error during onboarding status check:', err);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, navigate]);

  const handleNext = async () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      try {
        if (!user) {
          throw new Error('User is not authenticated');
        }
        const { error } = await supabase
          .from('profiles')
          .update({ onboarding_complete: true })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: 'Welcome aboard!',
          description: 'Onboarding complete. Redirecting you now...',
          status: 'success',
          duration: 3000,
          isClosable: true
        });

        switch (role) {
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
        }
      } catch (err: any) {
        console.error('Failed to complete onboarding:', err);
        toast({
          title: 'Error',
          description: 'Could not finish onboarding. Please try again.',
          status: 'error',
          duration: 4000,
          isClosable: true
        });
      }
    }
  };

  if (loading) {
    return (
      <Box p={10} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading onboarding...</Text>
      </Box>
    );
  }

  if (!firstTime) {
    navigate(`/${role}`);
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
      >
        <Box maxW="xl" mx="auto" mt={10} p={6} borderWidth={1} rounded="md" shadow="md" textAlign="center">
          <Heading mb={4}>Welcome, {user?.email || 'New User'}!</Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>Let’s complete your {role} onboarding in a few quick steps.</Text>

          <VStack spacing={4} align="stretch">
            {steps.map((label, index) => (
              <Checkbox key={index} isChecked={stepIndex >= index + 1} isReadOnly>
                {label}
              </Checkbox>
            ))}
          </VStack>

          <Button mt={8} colorScheme="blue" onClick={handleNext}>
            {stepIndex < steps.length - 1 ? 'Next' : 'Finish and Enter Dashboard'}
          </Button>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}