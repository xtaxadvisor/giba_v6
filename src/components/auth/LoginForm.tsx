import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useToast,
  Divider
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/';

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both email and password.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: 'Login successful',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      // 🔐 Extend with role or onboarding redirect (optional):
      const user = (await supabase.auth.getUser()).data.user;
      const role = user?.user_metadata?.primary_role;

      if (role) {
        navigate(`/onboarding/${role}`);
      } else {
        navigate(redirectTo);
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      toast({
        title: 'Unexpected error',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} rounded="md" shadow="md">
      <Heading mb={4} textAlign="center">
        Login
      </Heading>

      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            id="email"
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button colorScheme="blue" onClick={handleLogin} isLoading={loading}>
          Login
        </Button>

        <Text textAlign="right" fontSize="sm">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot your password?
          </a>
        </Text>

        <Divider />

        <Button
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin + redirectTo },
            })
          }
          colorScheme="red"
        >
          Continue with Google
        </Button>

        <Button
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: 'github',
              options: { redirectTo: window.location.origin + redirectTo },
            })
          }
          bg="gray.800"
          color="white"
          _hover={{ bg: 'gray.700' }}
        >
          Continue with GitHub
        </Button>

        <Button
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: 'apple',
              options: { redirectTo: window.location.origin + redirectTo },
            })
          }
          bg="black"
          color="white"
          _hover={{ bg: 'gray.800' }}
        >
          Continue with Apple
        </Button>

        <Text textAlign="center" fontSize="sm">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up here
          </a>
        </Text>
      </Stack>
    </Box>
  );
}