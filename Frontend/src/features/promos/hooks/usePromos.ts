import { useQuery } from '@tanstack/react-query';
import * as api from '../api/promoApi';

export function usePromosContext(productId: string | undefined) {
  return useQuery(['promos', productId], () => (productId ? api.getPromosContext(productId) : Promise.resolve(null)), { enabled: !!productId });
}

export default usePromosContext;
