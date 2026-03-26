import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/ordersApi';
import { Order } from '../types';

export const useOrders = () => {
  return useQuery<Order[]>(['orders'], api.fetchOrders);
};

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation((payload: Partial<Order>) => api.createOrder(payload), { onSuccess: () => qc.invalidateQueries(['orders']) });
};
