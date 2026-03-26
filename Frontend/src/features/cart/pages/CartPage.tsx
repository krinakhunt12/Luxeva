import React from 'react';
import { useCart } from '../hooks/useCart';
import { CartList } from '../components/CartList';

export const CartPage: React.FC = () => {
  const { data: items = [], isLoading, isError, error } = useCart();

  if (isLoading) return <div className="p-6">Loading cart...</div>;
  if (isError) return <div className="p-6 text-red-600">{(error as Error).message}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">Your Cart</h1>
      <CartList items={items} />
    </div>
  );
};

// named export only
