import { Product } from '../../../../types';

const base = '/api/products';

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(base);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const res = await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Create failed');
  return res.json();
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const res = await fetch(`${base}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${base}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
}

