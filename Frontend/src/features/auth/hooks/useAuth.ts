import { useMutation } from '@tanstack/react-query';
import * as api from '../api/authApi';
import { LoginPayload, SignUpPayload } from '../types';

export const useLogin = () => {
  return useMutation((payload: LoginPayload) => api.login(payload));
};

export const useSignUp = () => {
  return useMutation((payload: SignUpPayload) => api.signup(payload));
};
