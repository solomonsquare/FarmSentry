import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { AuthLayout } from '../components/auth/AuthLayout';

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
} 