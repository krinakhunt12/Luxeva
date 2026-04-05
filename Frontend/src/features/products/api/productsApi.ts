import { Product } from '../../../../types';

const base = '/api/products';

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(base);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export type PagedProducts = { products: Product[]; total: number; page: number; pages: number };

export async function getProductsPaged(page = 1, limit = 12, category?: string): Promise<PagedProducts> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (category) params.set('category', category);
  const res = await fetch(`${base}?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${base}/slug/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export type ProductFilters = { colors: { name: string; hex?: string }[]; sizes: string[]; subCategories: string[] };

export async function getProductFilters(category?: string): Promise<ProductFilters> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  const res = await fetch(`${base}/filters${params.toString() ? `?${params.toString()}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch product filters');
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

