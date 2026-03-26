import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/userApi';
import { User } from '../types';
import { showSuccess, showError } from '../../../utils/toastService';

export const useCurrentUser = () => {
  return useQuery<User>(['me'], api.fetchCurrentUser);
};

export const useUsers = () => {
  return useQuery({ queryKey: ['users'], queryFn: api.fetchUsers });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: Partial<User>) => api.updateUser(payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['me'] }); showSuccess('Profile updated'); }, onError: (err: any) => showError(err?.message || 'Update failed') });
};

