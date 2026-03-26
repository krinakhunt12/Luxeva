import React from 'react';
import { useProducts } from '../../products/hooks/useProducts';

export default function AdminDashboard() {
  const { data: products = [], isLoading } = useProducts();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Products</span>
            <span className="text-xl group-hover:scale-110 transition-transform">📦</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{isLoading ? '...' : products.length}</div>
          <div className="mt-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">+12% from last month</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Orders</span>
            <span className="text-xl group-hover:scale-110 transition-transform">🛒</span>
          </div>
          <div className="text-3xl font-black text-gray-900">482</div>
          <div className="mt-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">+5.4% from last month</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Revenue</span>
            <span className="text-xl group-hover:scale-110 transition-transform">💰</span>
          </div>
          <div className="text-3xl font-black text-gray-900">$12,482</div>
          <div className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">-2.1% from last month</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Active Users</span>
            <span className="text-xl group-hover:scale-110 transition-transform">👥</span>
          </div>
          <div className="text-3xl font-black text-gray-900">1,204</div>
          <div className="mt-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">+15% from last month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Recent Activity
          </h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg">🛍️</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">New order #ORD-492{i}</p>
                  <p className="text-xs text-gray-500 mt-1">Order placed for Silk Midi Dress ($240)</p>
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-2">{i} hour ago</p>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest py-1 px-2 bg-yellow-50 text-yellow-600 rounded">Pending</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Performance Overview
          </h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
             <span className="text-gray-300 font-serif italic">Chart Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
