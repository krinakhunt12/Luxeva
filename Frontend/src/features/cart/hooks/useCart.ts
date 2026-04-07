import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/cartApi';

import { CartItem } from '../types';
import { showSuccess, showError } from '../../../utils/toastService';

export const useCart = () => {
  return useQuery({ queryKey: ['cart'], queryFn: api.fetchCart, initialData: [] });
};

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.addToCart, onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }) });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.removeFromCart, onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }) });
};

export default useCart;

