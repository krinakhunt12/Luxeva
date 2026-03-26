import React from 'react';
import { CartItem } from '../types';

export const CartList: React.FC<{ items: CartItem[] }> = ({ items }) => {
  if (!items.length) return <div className="p-6">Cart is empty</div>;
  return (
    <div className="space-y-4">
      {items.map(i => (
        <div key={i.productId} className="flex items-center justify-between bg-white border p-4">
          <div>
            <div className="font-medium">{i.name}</div>
            <div className="text-sm">Qty: {i.quantity}</div>
          </div>
          <div>${i.price}</div>
        </div>
      ))}
    </div>
  );
};
