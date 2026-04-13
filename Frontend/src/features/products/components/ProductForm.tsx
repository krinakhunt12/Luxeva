import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white p-12 w-full max-w-xl shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-10 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">Administration</span>
          <h3 className="text-3xl font-black uppercase tracking-tighter mt-2">
            {initial ? 'Edit' : 'New'} <span className="italic font-serif">Product</span>
          </h3>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Product Name</label>
            <input 
              className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary px-4 py-4 text-xs focus:outline-none transition-all font-bold text-gray-900" 
              placeholder="e.g. Silk Midi Dress" 
              value={form.name || ''} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Price ($)</label>
              <input 
                className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary px-4 py-4 text-xs focus:outline-none transition-all font-bold text-gray-900" 
                placeholder="0.00" 
                type="number" 
                value={form.price ?? ''} 
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Stock Count</label>
              <input 
                className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary px-4 py-4 text-xs focus:outline-none transition-all font-bold text-gray-900" 
                placeholder="0" 
                type="number" 
                value={form.stock ?? ''} 
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Category</label>
            <input 
              className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary px-4 py-4 text-xs focus:outline-none transition-all font-bold text-gray-900" 
              placeholder="e.g. Dresses" 
              value={form.category || ''} 
              onChange={(e) => setForm({ ...form, category: e.target.value })} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Product Photo</label>
            <input 
              className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary px-4 py-4 text-xs focus:outline-none transition-all font-bold text-gray-900" 
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setForm({ ...form, images: [file] as any });
              }} 
            />
          </div>
        </div>

        <div className="mt-12">
          <button 
            className="w-full py-5 bg-gray-900 hover:bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-gray-200" 
            onClick={() => {
              const formData = new FormData();
              Object.entries(form).forEach(([key, value]) => {
                if (key === 'images' && Array.isArray(value)) {
                  value.forEach(v => {
                    if (v instanceof File) formData.append('images', v);
                    else formData.append('images', v);
                  });
                } else if (value !== undefined) {
                  formData.append(key, value as string);
                }
              });
              onSave(formData as any);
            }}
          >
            {initial ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

