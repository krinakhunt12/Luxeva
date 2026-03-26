import React from 'react';

export default function OrdersManagement() {
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
              <th className="p-6 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[1, 2, 3].map(i => (
              <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                <td className="p-6 text-sm font-bold text-gray-900 tracking-tight">#ORD-492{i}</td>
                <td className="p-6 font-bold text-gray-600 tracking-tight italic">Customer Name {i}</td>
                <td className="p-6 text-sm font-black text-primary">$495.00</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">Processing</span>
                </td>
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
