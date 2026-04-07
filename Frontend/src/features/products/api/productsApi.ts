import { Product } from '../../../../types';
import { apiFetch } from '../../../utils/apiClient';

const base = '/api/products';

export async function getProducts(): Promise<Product[]> {
  return apiFetch(base) as Promise<Product[]>;
}

export type PagedProducts = { products: Product[]; total: number; page: number; pages: number };

export async function getProductsPaged(page = 1, limit = 12, category?: string): Promise<PagedProducts> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (category) params.set('category', category);
  return apiFetch(`${base}?${params.toString()}`) as Promise<PagedProducts>;
}

export async function getProductBySlug(slug: string): Promise<Product> {
  return apiFetch(`${base}/slug/${slug}`) as Promise<Product>;
}

export type ProductFilters = { colors: { name: string; hex?: string }[]; sizes: string[]; subCategories: string[] };

export async function getProductFilters(category?: string): Promise<ProductFilters> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  return apiFetch(`${base}/filters${params.toString() ? `?${params.toString()}` : ''}`) as Promise<ProductFilters>;
}

export async function createProduct(payload: FormData | any): Promise<Product> {
  const body = (payload instanceof FormData) ? payload : JSON.stringify(payload);
  return apiFetch(base, { method: 'POST', body }) as Promise<Product>;
}

export async function updateProduct(id: string, payload: FormData | any): Promise<Product> {
  const body = (payload instanceof FormData) ? payload : JSON.stringify(payload);
  return apiFetch(`${base}/${id}`, { method: 'PUT', body }) as Promise<Product>;
}

export async function deleteProduct(id: string): Promise<void> {
  return apiFetch(`${base}/${id}`, { method: 'DELETE' }) as Promise<void>;
}

