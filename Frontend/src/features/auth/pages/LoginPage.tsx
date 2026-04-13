import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { Layout } from '../../../components/Layout';

export const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl mb-4">Login</h1>
        <LoginForm />
      </div>
    </Layout>
  );
};

// named export only
