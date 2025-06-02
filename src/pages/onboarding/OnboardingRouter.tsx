// src/pages/onboarding/OnboardingRouter.tsx (Enhanced with welcome UI, onboarding steps, first-time guard)
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Heading, Spinner, Text, VStack, Checkbox, Button } from '@chakra-ui/react';

export default function OnboardingRouter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { role } = useParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(true); // TODO: replace with real logic from Supabase profiles

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

    // Simulate profile fetch / first-time check
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [user, navigate]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Final redirect based on role
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
          break;
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
    // If already onboarded, skip
    navigate(`/${role}`);
    return null;
  }

  return (
    <Box maxW="xl" mx="auto" mt={10} p={6} borderWidth={1} rounded="md" shadow="md" textAlign="center">
      <Heading mb={4}>Welcome, {user?.email || 'New User'}!</Heading>
      <Text fontSize="lg" color="gray.600" mb={6}>Let’s complete your {role} onboarding in a few quick steps.</Text>

      <VStack spacing={4} align="stretch">
        <Checkbox isChecked={stepIndex >= 1} isReadOnly>
          {steps[0]}
        </Checkbox>
        <Checkbox isChecked={stepIndex >= 2} isReadOnly>
          {steps[1]}
        </Checkbox>
        <Checkbox isChecked={stepIndex >= 3} isReadOnly>
          {steps[2]}
        </Checkbox>
        <Checkbox isChecked={stepIndex >= 4} isReadOnly>
          {steps[3]}
        </Checkbox>
      </VStack>

      <Button mt={8} colorScheme="blue" onClick={handleNext}>
        {stepIndex < steps.length - 1 ? 'Next' : 'Finish and Enter Dashboard'}
      </Button>
    </Box>
  );
}