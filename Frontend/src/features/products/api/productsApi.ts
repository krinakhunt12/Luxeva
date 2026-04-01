import { Product } from '../../../../types';

const base = '/api/products';

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(base);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${base}/slug/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function createProduct(payload: FormData): Promise<Product> {
  const token = localStorage.getItem('luxeva_token');
  const res = await fetch(base, { method: 'POST', headers: { 'Authorization': token ? `Bearer ${token}` : '' }, body: payload });
  if (!res.ok) throw new Error('Create failed');
  return res.json();
}

export async function updateProduct(id: string, payload: FormData): Promise<Product> {
  const token = localStorage.getItem('luxeva_token');
  const res = await fetch(`${base}/${id}`, { method: 'PUT', headers: { 'Authorization': token ? `Bearer ${token}` : '' }, body: payload });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const token = localStorage.getItem('luxeva_token');
  const res = await fetch(`${base}/${id}`, { method: 'DELETE', headers: { 'Authorization': token ? `Bearer ${token}` : '' } });
  if (!res.ok) throw new Error('Delete failed');
}

