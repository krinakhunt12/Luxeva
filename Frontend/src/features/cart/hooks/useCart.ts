import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/cartApi';
import { CartItem } from '../types';
import { showSuccess, showError } from '../../../utils/toastService';

export const useCart = () => {
  return useQuery<CartItem[]>(['cart'], api.fetchCart);
};

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (item: CartItem) => api.addToCart(item), onSuccess: () => { qc.invalidateQueries({ queryKey: ['cart'] }); showSuccess('Added to cart'); }, onError: (err: any) => showError(err?.message || 'Add to cart failed') });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => api.removeFromCart(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['cart'] }); showSuccess('Removed from cart'); }, onError: (err: any) => showError(err?.message || 'Remove from cart failed') });
};
