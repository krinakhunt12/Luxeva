import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLowStock, restockProduct } from './api/inventoryApi';

const LowStock: React.FC = () => {
  const qc = useQueryClient();
  const [threshold, setThreshold] = useState(5);
  const { data, isLoading } = useQuery(['lowstock', threshold], () => fetchLowStock(threshold));
  const mut = useMutation((payload: { id: string; stock?: number }) => restockProduct(payload.id, payload.stock), { onSuccess: () => qc.invalidateQueries(['lowstock']) });

  if (isLoading) return <div className="p-6">Loading low-stock items…</div>;

  return (
    <div className="bg-white border p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Low-stock Products</h3>
        <div className="flex items-center gap-2">
          <input type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="border p-2 w-20" />
          <button onClick={() => qc.invalidateQueries(['lowstock'])} className="px-3 py-1 border rounded">Refresh</button>
        </div>
      </div>

      {data && data.products && data.products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/30">
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p: any) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button onClick={() => mut.mutate({ id: p._id, stock: (p.stock || 0) + 10 })} className="px-3 py-1 bg-primary text-white rounded">+10</button>
                      <button onClick={() => { const qty = Number(prompt('Set new stock value', String(p.stock || 0))); if (!Number.isNaN(qty)) mut.mutate({ id: p._id, stock: qty }); }} className="px-3 py-1 border rounded">Set</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No low-stock items.</div>
      )}
    </div>
  );
};

export default LowStock;
