import React, { useState, useEffect } from 'react';
import { Product } from '../../../../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Partial<Product>) => void;
  initial?: Partial<Product>;
}

export default function ProductForm({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<Partial<Product>>(initial || {});

  useEffect(() => setForm(initial || {}), [initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 w-full max-w-lg">
        <h3 className="text-lg mb-4">{initial ? 'Edit Product' : 'Add Product'}</h3>
        <div className="space-y-3">
          <input className="w-full border p-2" placeholder="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full border p-2" placeholder="Price" type="number" value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <input className="w-full border p-2" placeholder="Stock" type="number" value={form.stock ?? ''} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          <input className="w-full border p-2" placeholder="Category" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="w-full border p-2" placeholder="Image URL" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>

        <div className="mt-4 flex gap-2 justify-end">
          <button className="px-4 py-2" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-primary text-white" onClick={() => { onSave(form); }}>Save</button>
        </div>
      </div>
    </div>
  );
}
