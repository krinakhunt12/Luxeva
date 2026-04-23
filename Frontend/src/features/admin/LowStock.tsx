import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLowStock, restockProduct } from './api/inventoryApi';
import { Package, AlertTriangle, RefreshCw, Edit2 } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LowStock: React.FC = () => {
  const qc = useQueryClient();
  const [threshold, setThreshold] = useState(10);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['lowstock', threshold],
    queryFn: () => fetchLowStock(threshold)
  });

  const mut = useMutation({
    mutationFn: (payload: { id: string; stock?: number }) => restockProduct(payload.id, payload.stock),
    onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['lowstock'] });
        qc.invalidateQueries({ queryKey: ['products'] });
        qc.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    }
  });

  if (isLoading) return <div className="p-12"><Skeleton lines={4} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-accent p-6">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                <AlertTriangle size={20} />
            </div>
            <div>
                <h3 className="text-sm font-bold uppercase tracking-widest">Inventory Alerts</h3>
                <p className="text-[10px] text-muted uppercase tracking-widest">Identify products with critical stock levels</p>
            </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] uppercase tracking-widest font-bold text-muted">Threshold</label>
            <input 
                type="number" 
                value={threshold} 
                onChange={(e) => setThreshold(Number(e.target.value))} 
                className="bg-bg border border-accent p-2 w-24 text-xs focus:outline-none focus:border-primary" 
            />
          </div>
          <button 
            onClick={() => qc.invalidateQueries({ queryKey: ['lowstock'] })} 
            className="mt-auto p-2 border border-accent hover:border-primary transition-colors disabled:opacity-50"
            disabled={isFetching}
          >
            <RefreshCw size={16} className={cn(isFetching && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-accent overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-accent/30 border-b border-accent">
            <tr>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Product</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Current Stock</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Status</th>
              <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent">
            {data && data.products && data.products.length > 0 ? (
              data.products.map((p: any) => (
                <tr key={p._id} className="hover:bg-accent/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                            <Package size={14} className="text-muted" />
                        </div>
                        <span className="text-xs font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                        "text-xs font-bold",
                        p.stock === 0 ? "text-red-600" : "text-orange-600"
                    )}>
                        {p.stock || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                        "px-2 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full",
                        p.stock === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                    )}>
                        {p.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => mut.mutate({ id: p._id, stock: (p.stock || 0) + 10 })} 
                        className="px-4 py-2 bg-primary text-white text-[8px] uppercase tracking-widest font-bold hover:bg-gold transition-colors"
                      >
                        Restock +10
                      </button>
                      <button 
                        onClick={() => { 
                            const qty = Number(prompt('Enter exact stock quantity:', String(p.stock || 0))); 
                            if (!Number.isNaN(qty)) mut.mutate({ id: p._id, stock: qty }); 
                        }} 
                        className="p-2 border border-accent hover:border-primary text-muted transition-colors"
                        title="Edit Quantity"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-muted italic">All products are well-stocked</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStock;
