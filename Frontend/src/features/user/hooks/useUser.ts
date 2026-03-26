import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/userApi';
import { User } from '../types';

export const useCurrentUser = () => {
  return useQuery<User>(['me'], api.fetchCurrentUser);
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation((payload: Partial<User>) => api.updateUser(payload), { onSuccess: () => qc.invalidateQueries(['me']) });
};
