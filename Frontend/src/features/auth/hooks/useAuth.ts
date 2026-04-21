import { useMutation } from '@tanstack/react-query';
import * as api from '../api/authApi';
import { LoginPayload, SignUpPayload } from '../types';
import { setToken } from '../../../utils/apiClient';

type LoginWithRemember = LoginPayload & { remember?: boolean };

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginWithRemember) => api.login({ email: payload.email, password: payload.password }).then(data => ({ ...data, remember: payload.remember })),
    onSuccess: (data: any) => {
      try { setToken(data.token, data.remember !== false); } catch (e) {}
      try {
        if (data.remember === false) sessionStorage.setItem('luxeva_user', JSON.stringify(data.user));
        else localStorage.setItem('luxeva_user', JSON.stringify(data.user));
      } catch (e) {}
      window.dispatchEvent(new Event('luxeva:user-changed'));
    }
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: (payload: SignUpPayload & { remember?: boolean }) => api.signup(payload).then(data => ({ ...data, remember: (payload as any).remember })),
    onSuccess: (data: any) => {
      try { setToken(data.token, data.remember !== false); } catch (e) {}
      try {
        if (data.remember === false) sessionStorage.setItem('luxeva_user', JSON.stringify(data.user));
        else localStorage.setItem('luxeva_user', JSON.stringify(data.user));
      } catch (e) {}
      window.dispatchEvent(new Event('luxeva:user-changed'));
    }
  });
};
