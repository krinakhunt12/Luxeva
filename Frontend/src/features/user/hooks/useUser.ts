import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/userApi';

import { User } from '../types';
import { showSuccess, showError } from '../../../utils/toastService';
export const useCurrentUser = () => {
  return useQuery({ queryKey: ['me'], queryFn: api.fetchCurrentUser, staleTime: 1000 * 60 * 5 });
};

export const useUsers = () => {
  return useQuery({ queryKey: ['users'], queryFn: api.fetchUsers });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.updateUser, onSuccess: (data) => { qc.invalidateQueries({ queryKey: ['me'] }); qc.invalidateQueries({ queryKey: ['users'] }); } });
};

