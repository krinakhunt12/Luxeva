import React, { useState } from 'react';
import { useLogin } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const mutation = useLogin();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {mutation.isError && <div className="text-red-600">{(mutation.error as Error).message}</div>}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="input" />
      <button type="submit" className="btn-primary" disabled={mutation.isLoading}>{mutation.isLoading ? 'Logging...' : 'Login'}</button>
      {mutation.isSuccess && <div className="text-green-600">Logged in</div>}
    </form>
  );
};
