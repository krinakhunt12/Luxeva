import React from 'react';
import { Product } from '../types';

export const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(p => (
        <div key={(p as any).id || (p as any)._id} className="bg-white border p-4">
          <h4 className="font-medium">{p.name}</h4>
          <p className="text-sm">${p.price}</p>
        </div>
      ))}
    </div>
  );
};
