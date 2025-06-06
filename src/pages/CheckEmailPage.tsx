// src/pages/CheckEmailPage.tsx
import { Box, VStack, Text } from '@chakra-ui/react';

export default function CheckEmailPage() {
  return (
    <Box maxW="md" mx="auto" mt={24} p={6} borderRadius="lg" boxShadow="lg" bg="white" textAlign="center">
      <VStack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold" color="green.500">
          ✅ Magic Link Sent!
        </Text>
        <Text>
          Please check your email inbox. Click the link we sent to complete your login.
        </Text>
        <Text fontSize="sm" color="gray.500">
          Didn’t receive it? Make sure to check your spam folder.
        </Text>
      </VStack>
    </Box>
  );
}