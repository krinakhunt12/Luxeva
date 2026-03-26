import { Order } from '../types';

export const fetchOrders = async (): Promise<Order[]> => {
  const res = await fetch('/api/orders');
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const createOrder = async (payload: Partial<Order>): Promise<Order> => {
  const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Create order failed');
  return res.json();
};
