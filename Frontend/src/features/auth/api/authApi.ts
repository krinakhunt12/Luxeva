import { LoginPayload, SignUpPayload, User } from '../types';
import { apiFetch } from '../../../utils/apiClient';

export const login = async (payload: LoginPayload): Promise<{ token: string; user: User }> => {
  return apiFetch('/api/login', { method: 'POST', body: JSON.stringify(payload) }) as Promise<{ token: string; user: User }>;
};

export const signup = async (payload: SignUpPayload): Promise<{ token: string; user: User }> => {
  return apiFetch('/api/signup', { method: 'POST', body: JSON.stringify(payload) }) as Promise<{ token: string; user: User }>;
};
