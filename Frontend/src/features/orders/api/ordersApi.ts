import { Order } from '../types';

export const fetchOrders = async (): Promise<Order[]> => {
  const token = localStorage.getItem('luxeva_token');
  const res = await fetch('/api/orders', {
    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const createOrder = async (payload: Partial<Order>): Promise<Order> => {
  const token = localStorage.getItem('luxeva_token');
  const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Create order failed');
  return res.json();
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  const token = localStorage.getItem('luxeva_token');
  const res = await fetch(`/api/orders/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' }, body: JSON.stringify({ status }) });
  if (!res.ok) throw new Error('Update order status failed');
  return res.json();
};
