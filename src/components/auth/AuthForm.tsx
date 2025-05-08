import React from 'react';
import SignInForm from './AuthForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
        <SignInForm />
      </div>
    </div>
  );
}