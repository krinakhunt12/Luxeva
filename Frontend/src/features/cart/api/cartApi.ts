import { CartItem } from '../types';

export const fetchCart = async (): Promise<CartItem[]> => {
  const res = await fetch('/api/cart');
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
};

export const addToCart = async (item: CartItem): Promise<CartItem> => {
  const res = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
  if (!res.ok) throw new Error('Add failed');
  return res.json();
};

export const removeFromCart = async (id: string): Promise<void> => {
  const res = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Remove failed');
};
