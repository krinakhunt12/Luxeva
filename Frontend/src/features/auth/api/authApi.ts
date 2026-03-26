import { LoginPayload, SignUpPayload, User } from '../types';

export const login = async (payload: LoginPayload): Promise<{ token: string; user: User }> => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
};

export const signup = async (payload: SignUpPayload): Promise<{ token: string; user: User }> => {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Signup failed');
  return res.json();
};
