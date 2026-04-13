
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/ordersApi';
import { Order } from '../types';
import { showSuccess, showError } from '../../../utils/toastService';

export const useOrders = () => {
  return useQuery<Order[]>({ queryKey: ['orders'], queryFn: api.fetchOrders });
};

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: Partial<Order>) => api.createOrder(payload), onSuccess: (data) => { qc.invalidateQueries({ queryKey: ['orders'] }); showSuccess('Order placed'); }, onError: (err: any) => showError(err?.message || 'Create order failed') });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.updateOrderStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); showSuccess('Order status updated'); },
    onError: (err: any) => showError(err?.message || 'Update order status failed')
  });
};
