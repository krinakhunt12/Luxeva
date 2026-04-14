import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/productsApi';
import { Product } from '../../../types';

export const useProducts = () => {
  return useQuery<Product[]>({ queryKey: ['products'], queryFn: api.getProducts, staleTime: 1000 * 60 * 2 });
};

export const usePagedProducts = (page = 1, limit = 12, category?: string) => {
  return useQuery<{ products: Product[]; total: number; page: number; pages: number }>(
    { queryKey: ['products', page, category], queryFn: () => api.getProductsPaged(page, limit, category), keepPreviousData: true }
  );
};

export const useProductBySlug = (slug?: string) => {
  return useQuery<Product | null>({ queryKey: ['product', slug], queryFn: () => (slug ? api.getProductBySlug(slug) : Promise.resolve(null)), enabled: !!slug });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createProduct, onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: any) => api.updateProduct(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => api.deleteProduct(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

export default useProducts;
