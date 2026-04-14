import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import * as api from '../api/offerApi';
import { apiFetch } from '../../../utils/apiClient';

export function useValidateOffer() {
  const qc = useQueryClient();
  return useMutation(
    (payload: { code: string; cart: any; options?: any }) => api.validateOffer(payload.code, payload.cart, payload.options),
    {
      onSuccess: () => {
        qc.invalidateQueries(['cart']);
        qc.invalidateQueries(['offers']);
      },
    }
  );
}

export const useOffers = () => {
  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      const res = await apiFetch('/api/offers').catch(() => null);
      return Array.isArray(res) ? res : [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export default useOffers;
