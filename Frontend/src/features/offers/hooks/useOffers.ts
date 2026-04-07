import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../../utils/apiClient';

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
