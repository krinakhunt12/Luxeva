import { Product } from '../types';

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const createProduct = async (payload: Partial<Product>): Promise<Product> => {
  const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
};

export const updateProduct = async (id: string, payload: Partial<Product>): Promise<Product> => {
  const res = await fetch(`/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
  const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
};
