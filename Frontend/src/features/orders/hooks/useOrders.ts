import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/ordersApi';
import { Order } from '../types';
import { showSuccess, showError } from '../../../utils/toastService';

export const useOrders = () => {
  return useQuery<Order[]>(['orders'], api.fetchOrders);
};

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: Partial<Order>) => api.createOrder(payload), onSuccess: (data) => { qc.invalidateQueries({ queryKey: ['orders'] }); showSuccess('Order created'); }, onError: (err: any) => showError(err?.message || 'Create order failed') });
};
