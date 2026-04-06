import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const OfferForm: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [appliesTo, setAppliesTo] = useState<'all' | 'product'>('all');
  const [productId, setProductId] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [amount, setAmount] = useState<number>(10);

  const reset = () => {
    setTitle('');
    setAppliesTo('all');
    setProductId('');
    setDiscountType('percentage');
    setAmount(10);
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('luxeva_token');
    const payload: any = { title, appliesTo, discountType, amount: Number(amount), active: true };
    if (appliesTo === 'product' && productId) payload.productId = productId;

    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Failed to create offer');
      return;
    }

    try {
      await queryClient.invalidateQueries({ queryKey: ['offers'] });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (e) {
      // ignore
    }

    reset();
    if (onCreated) onCreated();
    alert('Offer created');
  };

  return (
    <div className="bg-white border p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Create Offer</h3>
          <p className="text-xs text-muted">Quickly create a new offer and apply to a product or all products.</p>
        </div>

        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs uppercase text-muted">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-xs uppercase text-muted">Applies To</label>
          <select
            value={appliesTo}
            onChange={(e) => setAppliesTo(e.target.value as any)}
            className="w-full border p-2 rounded"
          >
            <option value="all">All Products</option>
            <option value="product">Specific Product</option>
          </select>
        </div>

        {appliesTo === 'product' && (
          <div>
            <label className="block text-xs uppercase text-muted">Product ID</label>
            <input
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        <div>
          <label className="block text-xs uppercase text-muted">Discount Type</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as any)}
            className="w-full border p-2 rounded"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase text-muted">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="pt-4 border-t border-accent mt-4 flex items-center justify-between">
          <div className="text-xs text-muted">Tip: use product ID for product-specific offers.</div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="bg-primary text-white px-4 py-2 rounded">Create Offer</button>
            <button onClick={reset} className="px-4 py-2 border rounded">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferForm;
