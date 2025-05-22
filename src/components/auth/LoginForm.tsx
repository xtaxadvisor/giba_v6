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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

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
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        toast({ title: 'Login failed', description: authError.message, status: 'error', duration: 4000, isClosable: true });
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profileData) {
        toast({ title: 'Login error', description: 'Failed to fetch user role.', status: 'error', duration: 4000, isClosable: true });
        return;
      }

      toast({ title: 'Login successful', status: 'success', duration: 2000, isClosable: true });

      const role = profileData.role;
      navigate(`/${role}`);
    } catch (err) {
      toast({ title: 'Unexpected error', description: 'Something went wrong.', status: 'error', duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} rounded="md" shadow="md">
      <Heading mb={4} textAlign="center">Login</Heading>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button size="sm" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button colorScheme="blue" isLoading={loading} onClick={handleLogin}>Login</Button>

        <Text textAlign="right">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot your password?
          </a>
        </Text>

        <Divider />

        <Button
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin + '/dashboard' }
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
              options: { redirectTo: window.location.origin + '/dashboard' }
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
              options: { redirectTo: window.location.origin + '/dashboard' }
            })
          }
          bg="black"
          color="white"
          _hover={{ bg: 'gray.800' }}
        >
          Continue with Apple
        </Button>

        <Text textAlign="center">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up here
          </a>
        </Text>
      </Stack>
    </Box>
  );
}