import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../components/ProductList';

export const ProductsPage: React.FC = () => {
  const { data: products = [], isLoading, isError, error } = useProducts();

  if (isLoading) return <div className="p-6">Loading products...</div>;
  if (isError) return <div className="p-6 text-red-600">{(error as Error).message}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">Products</h1>
      <ProductList products={products} />
    </div>
  );
};

// named export only
