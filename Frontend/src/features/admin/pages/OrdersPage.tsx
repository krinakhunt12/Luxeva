import React from 'react';
import { useOrders } from '../../orders/hooks/useOrders';

export default function OrdersManagement() {
  const { data: orders = [], isLoading } = useOrders();

  if (isLoading) return <div className="p-8 italic font-serif">Loading instances of order...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between font-serif animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Orders Management</h3>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 italic font-serif">
            <tr className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              <th className="p-6 font-bold">ID</th>
              <th className="p-6 font-bold">Customer</th>
              <th className="p-6 font-bold">Total</th>
              <th className="p-6 font-bold">Status</th>
              <th className="p-6 font-bold">Date</th>
              <th className="p-6 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order: any) => (
              <tr key={order.id || order._id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="p-6 text-sm font-bold text-gray-900 tracking-tight">#{ (order.id || order._id).slice(-6).toUpperCase() }</td>
                <td className="p-6 font-bold text-gray-600 tracking-tight italic">
                  {order.user?.firstName || 'Guest'} {order.user?.lastName || ''}
                </td>
                <td className="p-6 text-sm font-black text-primary">${order.totalAmount?.toFixed(2) || '0.00'}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                    order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                    'bg-yellow-50 text-yellow-600'
                  }`}>
                    {order.status || 'pending'}
                  </span>
                </td>
                <td className="p-6 text-xs text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="p-6">
                  <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline transition-all">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

