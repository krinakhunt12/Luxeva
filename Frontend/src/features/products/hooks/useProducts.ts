import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productsApi';
import { Product } from '../types';
import { showSuccess, showError } from '../../../utils/toastService';

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: getProducts }) as ReturnType<typeof useQuery>;
}

export function useCreateProduct(): ReturnType<typeof useMutation> {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: FormData) => createProduct(payload), onSuccess: (data) => { qc.invalidateQueries({ queryKey: ['products'] }); showSuccess('Product created'); }, onError: (err: any) => showError(err?.message || 'Create product failed') }) as any;
}

export function useUpdateProduct(): ReturnType<typeof useMutation> {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: FormData }) => updateProduct(id, payload), onSuccess: (data) => { qc.invalidateQueries({ queryKey: ['products'] }); showSuccess('Product updated'); }, onError: (err: any) => showError(err?.message || 'Update product failed') }) as any;
}

export function useDeleteProduct(): ReturnType<typeof useMutation> {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteProduct(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); showSuccess('Product deleted'); }, onError: (err: any) => showError(err?.message || 'Delete product failed') }) as any;
}
