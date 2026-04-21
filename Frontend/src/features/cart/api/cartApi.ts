import { CartItem } from '../types';
import { apiFetch } from '../../../utils/apiClient';

export const fetchCart = async (): Promise<CartItem[]> => {
  return apiFetch('/api/cart') as Promise<CartItem[]>;
};

export const addToCart = async (item: CartItem): Promise<CartItem> => {
  return apiFetch('/api/cart', { 
    method: 'POST', 
    body: JSON.stringify(item),
    successMessage: 'Added to cart'
  }) as Promise<CartItem>;
};

export const removeFromCart = async (id: string): Promise<void> => {
  return apiFetch(`/api/cart/${id}`, { 
    method: 'DELETE',
    successMessage: 'Removed from cart'
  }) as Promise<void>;
};
