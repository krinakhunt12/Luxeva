import React, { useState } from 'react';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Product } from '../types';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const del = useDeleteProduct();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | undefined>(undefined);

  function handleSave(payload: Partial<Product>) {
    // If it's a new product, we don't need an ID
    if (editing && (editing.id || (editing as any)._id)) {
      const id = editing.id || (editing as any)._id;
      update.mutate({ id, payload });
    } else {
      create.mutate(payload);
    }
    setOpen(false);
    setEditing(undefined);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Products Management</h2>
        <button 
          className="bg-primary hover:bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all rounded shadow-lg shadow-primary/20 active:scale-95" 
          onClick={() => { setEditing(undefined); setOpen(true); }}
        >
          Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl italic font-serif text-gray-400">
          Loading inventory...
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <ProductTable 
            products={products} 
            onEdit={(p) => { setEditing(p); setOpen(true); }} 
            onDelete={(id) => {
              if (window.confirm('Are you sure you want to delete this product?')) {
                del.mutate(id);
              }
            }} 
          />
        </div>
      )}

      <ProductForm 
        open={open} 
        onClose={() => { setOpen(false); setEditing(undefined); }} 
        onSave={handleSave} 
        initial={editing} 
      />
    </div>
  );
}

