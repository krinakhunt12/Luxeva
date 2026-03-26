import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productsApi';
import { Product } from '../../../../types';

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: getProducts }) as ReturnType<typeof useQuery>;
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createProduct, onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<Product> }) => updateProduct(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteProduct(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
}
