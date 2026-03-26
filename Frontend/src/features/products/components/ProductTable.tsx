import React from 'react';
import { Product } from '../../../../../types';

interface Props {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  if (!products.length) return <div className="bg-white border p-6">No products found</div>;

  return (
    <div className="bg-white border">
      <table className="w-full text-left">
        <thead className="text-xs uppercase text-gray-500">
          <tr><th className="p-3">Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id || (p as any)._id} className="border-t">
              <td className="p-3"><img src={p.image || '/placeholder.png'} alt={p.name} className="w-12 h-12 object-cover"/></td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">${p.price.toFixed(2)}</td>
              <td className="p-3">{p.stock ?? '-'}</td>
              <td className="p-3">{p.category || '-'}</td>
              <td className="p-3">
                <button className="mr-2 text-sm text-primary" onClick={() => onEdit(p)}>Edit</button>
                <button className="text-sm text-red-600" onClick={() => onDelete(p.id || (p as any)._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
