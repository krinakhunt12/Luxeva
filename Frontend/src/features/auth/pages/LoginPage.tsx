import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">Login</h1>
      <LoginForm />
    </div>
  );
};

// named export only
