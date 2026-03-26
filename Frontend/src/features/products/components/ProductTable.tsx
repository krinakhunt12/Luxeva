import React from 'react';
import { Product } from '../../../../types';

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  if (!products.length) return (
    <div className="bg-white p-12 text-center text-gray-400 italic">No products found in the inventory</div>
  );

  return (
    <table className="w-full text-left">
      <thead className="bg-gray-50 border-b border-gray-100 italic font-serif">
        <tr className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          <th className="p-6">Thumbnail</th>
          <th className="p-6">Product Information</th>
          <th className="p-6">Price</th>
          <th className="p-6">Stock</th>
          <th className="p-6">Category</th>
          <th className="p-6">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {products.map(p => (
          <tr key={p.id || (p as any)._id} className="group hover:bg-gray-50/50 transition-colors">
            <td className="p-6">
              <div className="w-16 h-20 bg-gray-50 rounded overflow-hidden shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                <img src={p.image || '/placeholder.png'} alt={p.name} className="w-full h-full object-cover"/>
              </div>
            </td>
            <td className="p-6">
              <div className="font-bold text-gray-900 tracking-tight">{p.name}</div>
              <div className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">ID: {(p.id || (p as any)._id).slice(-6)}</div>
            </td>
            <td className="p-6 font-black text-primary italic font-serif">${p.price.toFixed(2)}</td>
            <td className="p-6 text-sm">
              <span className={`px-2 py-1 rounded font-bold ${p.stock && p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {p.stock ?? 0}
              </span>
            </td>
            <td className="p-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 bg-gray-100 text-gray-500 rounded">
                {p.category || 'General'}
              </span>
            </td>
            <td className="p-6">
              <div className="flex gap-4">
                <button 
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all" 
                  onClick={() => onEdit(p)}
                >
                  Edit
                </button>
                <button 
                  className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-all" 
                  onClick={() => onDelete(p.id || (p as any)._id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

