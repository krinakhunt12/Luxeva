import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../../utils/apiClient';

export const useCreateOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => apiFetch('/api/offers', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offers'] }),
  });
};

export const useDeleteOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/api/offers/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offers'] }),
  });
};

export const useUpdateOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => apiFetch(`/api/offers/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offers'] }),
  });
};

export default useCreateOffer;
