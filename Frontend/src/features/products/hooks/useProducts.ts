import { useQuery, useMutation } from '@tanstack/react-query';
import * as api from '../api/productsApi';
import { Product } from '../types';

export const useProducts = () => {
  return useQuery<Product[]>(['products'], api.fetchProducts);
};

export const useCreateProduct = () => {
  return useMutation((payload: Partial<Product>) => api.createProduct(payload));
};

export const useUpdateProduct = (id: string) => {
  return useMutation((payload: Partial<Product>) => api.updateProduct(id, payload));
};

export const useDeleteProduct = () => {
  return useMutation((id: string) => api.deleteProduct(id));
};
