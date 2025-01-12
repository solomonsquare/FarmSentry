import React from 'react';
import { SignUpForm } from '../components/auth/SignUpForm';
import { AuthLayout } from '../components/auth/AuthLayout';

export function RegisterPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
} 