import React, { useState } from 'react';
import { useLogin } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const mutation = useLogin();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password, remember });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {mutation.isError && <div className="text-red-600">{(mutation.error as Error).message}</div>}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="input" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="input" />
      <div className="flex items-center gap-3">
        <input id="remember" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-primary" />
        <label htmlFor="remember" className="text-sm text-muted">Remember me</label>
      </div>
      <button type="submit" className="btn-primary" disabled={mutation.isLoading}>{mutation.isLoading ? 'Logging...' : 'Login'}</button>
      {mutation.isSuccess && <div className="text-green-600">Logged in</div>}
    </form>
  );
};
