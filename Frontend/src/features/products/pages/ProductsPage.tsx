import React, { useState } from 'react';
import AdminLayout from '../../admin/layout/AdminLayout';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Product } from '../../../../../types';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const del = useDeleteProduct();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | undefined>(undefined);

  function handleSave(payload: Partial<Product>) {
    if (editing && editing.id) update.mutate({ id: editing.id, payload });
    else create.mutate(payload);
    setOpen(false);
    setEditing(undefined);
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light">Products</h2>
        <div>
          <button className="bg-primary text-white px-4 py-2" onClick={() => { setEditing(undefined); setOpen(true); }}>Add Product</button>
        </div>
      </div>

      {isLoading ? <div>Loading...</div> : (
        <ProductTable products={products} onEdit={(p) => { setEditing(p); setOpen(true); }} onDelete={(id) => del.mutate(id)} />
      )}

      <ProductForm open={open} onClose={() => setOpen(false)} onSave={handleSave} initial={editing} />
    </AdminLayout>
  );
}
