import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/productsApi';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productsApi';
import { Product } from '../types';
import { showSuccess, showError } from '../../../utils/toastService';


export const useProducts = () => {
  return useQuery({ queryKey: ['products'], queryFn: api.getProducts });
};

export const usePagedProducts = (page = 1, limit = 12, category?: string) => {
  return useQuery({ queryKey: ['products', page, category], queryFn: () => api.getProductsPaged(page, limit, category), keepPreviousData: true });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({ queryKey: ['product', slug], queryFn: () => api.getProductBySlug(slug), enabled: !!slug });
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
