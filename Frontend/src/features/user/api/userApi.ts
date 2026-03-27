import { User } from '../types';

export const fetchCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem('luxeva_token');
  const res = await fetch('/api/me', { headers: { 'Authorization': token ? `Bearer ${token}` : '' } });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const fetchUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem('luxeva_token');
  const res = await fetch('/api/users', {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const updateUser = async (payload: Partial<User>): Promise<User> => {
  const token = localStorage.getItem('luxeva_token');
  const res = await fetch('/api/users', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
};

