import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/cartApi';
import { CartItem } from '../types';

export const useCart = () => {
  return useQuery<CartItem[]>(['cart'], api.fetchCart);
};

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation((item: CartItem) => api.addToCart(item), { onSuccess: () => qc.invalidateQueries(['cart']) });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation((id: string) => api.removeFromCart(id), { onSuccess: () => qc.invalidateQueries(['cart']) });
};
