import { User } from '../types';

export const fetchCurrentUser = async (): Promise<User> => {
  const res = await fetch('/api/me');
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('/api/users', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const updateUser = async (payload: Partial<User>): Promise<User> => {
  const res = await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
};

