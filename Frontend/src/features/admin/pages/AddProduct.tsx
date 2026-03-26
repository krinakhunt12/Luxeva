import React from 'react';
import { useCreateProduct } from '../../products/hooks/useProducts';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());
    
    createProduct.mutate(payload as any, {
      onSuccess: () => navigate('/admin/products')
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center space-y-4">
        <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-primary">Administration</span>
        <h3 className="text-5xl font-black tracking-tighter uppercase leading-[0.8] text-gray-900">Add New <br /> <span className="italic font-serif">Product</span></h3>
      </div>
      
      <div className="bg-white border border-gray-100 rounded-3xl p-12 shadow-xl shadow-gray-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-primary/10 select-none pointer-events-none">
          <span className="text-9xl font-black uppercase tracking-tighter">New Item</span>
        </div>
        
        <form className="space-y-10 relative z-10" onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Product Name</label>
              <input name="name" className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary px-4 py-4 text-xs focus:outline-none transition-all font-bold text-gray-900" placeholder="e.g. Silk Midi Dress" required />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Category</label>
               <input name="category" className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary px-4 py-4 text-xs focus:outline-none transition-all font-bold text-gray-900" placeholder="e.g. Dresses" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Price ($)</label>
              <input name="price" type="number" step="0.01" className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary px-4 py-4 text-xs focus:outline-none transition-all font-bold text-gray-900" placeholder="0.00" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Stock Count</label>
              <input name="stock" type="number" className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary px-4 py-4 text-xs focus:outline-none transition-all font-bold text-gray-900" placeholder="0" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Image URL</label>
            <input name="image" className="w-full bg-gray-50 border-b-2 border-transparent focus:border-primary px-4 py-4 text-xs focus:outline-none transition-all font-bold text-gray-900" placeholder="https://..." required />
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={createProduct.isLoading}
              className="w-full py-5 bg-gray-900 hover:bg-primary text-white text-xs font-black uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-gray-200"
            >
              {createProduct.isLoading ? 'Processing...' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
