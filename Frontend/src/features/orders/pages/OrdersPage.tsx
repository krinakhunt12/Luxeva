import React from 'react';
import { useOrders } from '../hooks/useOrders';
import Skeleton from '../../../components/ui/Skeleton';

export const OrdersPage: React.FC = () => {
  const { data: orders = [], isLoading, isError, error } = useOrders();

  if (isLoading) return <div className="p-6"><Skeleton count={3} lines={2} /></div>;
  if (isError) return <div className="p-6 text-red-600">{(error as Error).message}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">Orders</h1>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={(o as any)._id || (o as any).id} className="bg-white border p-4">
            <div>Order #{(o as any)._id}</div>
            <div>Status: {o.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// named export only
