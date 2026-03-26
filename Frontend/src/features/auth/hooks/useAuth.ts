import { useMutation } from '@tanstack/react-query';
import * as api from '../api/authApi';
import { LoginPayload, SignUpPayload } from '../types';
import { showSuccess, showError } from '../../../utils/toastService';

export const useLogin = () => {
  return useMutation({ mutationFn: (payload: LoginPayload) => api.login(payload), onSuccess: () => showSuccess('Logged in'), onError: (err: any) => showError(err?.message || 'Login failed') });
};

export const useSignUp = () => {
  return useMutation({ mutationFn: (payload: SignUpPayload) => api.signup(payload), onSuccess: () => showSuccess('Account created'), onError: (err: any) => showError(err?.message || 'Signup failed') });
};
