import { User } from '../types';
import { apiFetch } from '../../../utils/apiClient';

export const fetchCurrentUser = async (): Promise<User> => {
  return apiFetch('/api/me') as Promise<User>;
};

export const fetchUsers = async (): Promise<User[]> => {
  return apiFetch('/api/users') as Promise<User[]>;
};

export const updateUser = async (payload: Partial<User>): Promise<User> => {
  return apiFetch('/api/users', { method: 'PUT', body: JSON.stringify(payload) }) as Promise<User>;
};

