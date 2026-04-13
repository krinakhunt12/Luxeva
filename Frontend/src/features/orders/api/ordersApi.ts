import { Order } from '../types';
import { apiFetch } from '../../../utils/apiClient';

export const fetchOrders = async (): Promise<Order[]> => {
  return apiFetch('/api/orders') as Promise<Order[]>;
};

export const createOrder = async (payload: Partial<Order>): Promise<Order> => {
  return apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload) }) as Promise<Order>;
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  return apiFetch(`/api/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }) as Promise<Order>;
};
