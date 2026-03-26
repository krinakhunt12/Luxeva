import { useMutation } from '@tanstack/react-query';
import * as api from '../api/authApi';
import { LoginPayload, SignUpPayload } from '../types';

export const useLogin = () => {
  return useMutation({ mutationFn: (payload: LoginPayload) => api.login(payload) });
};

export const useSignUp = () => {
  return useMutation({ mutationFn: (payload: SignUpPayload) => api.signup(payload) });
};
