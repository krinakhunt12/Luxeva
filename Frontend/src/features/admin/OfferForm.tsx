import React, { useState } from 'react';
import { showSuccess, showError } from '../../utils/toastService';
import { useCreateOffer } from './hooks/useAdminOffers';

const OfferForm: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const createMut = useCreateOffer();
  const [title, setTitle] = useState('');
  const [appliesTo, setAppliesTo] = useState<'all' | 'selected'>('all');
  const [productId, setProductId] = useState(''); // Mapping to productIds array
  const [percentage, setPercentage] = useState<number>(10);
  const [bank, setBank] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  const reset = () => {
    setTitle('');
    setAppliesTo('all');
    setProductId('');
    setPercentage(10);
    setBank('');
    setPaymentMethods([]);
  };

  const handleCreate = () => {
    const payload: any = { 
      title, 
      appliesTo, 
      percentage: Number(percentage), 
      status: 'active' 
    };
    if (appliesTo === 'selected' && productId) payload.productIds = [productId];
    if (bank) payload.bank = bank;
    if (paymentMethods && paymentMethods.length) payload.paymentMethods = paymentMethods;
    
    createMut.mutate(payload, {
      onSuccess: () => { reset(); if (onCreated) onCreated(); }
    });
  };

  return (
    <div className="bg-white border p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Create Offer</h3>
          <p className="text-xs text-muted">Quickly create a new percentage-based offer.</p>
        </div>
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
            <option value="selected">Specific Product</option>
          </select>
        </div>

        {appliesTo === 'selected' && (
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
          <label className="block text-xs uppercase text-muted">Discount Percentage (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-xs uppercase text-muted">Bank (optional)</label>
          <input value={bank} onChange={(e) => setBank(e.target.value)} placeholder="e.g. HDFC, ICICI" className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-xs uppercase text-muted">Payment Methods</label>
          <div className="flex gap-3 mt-2">
            {['card','netbanking','upi','emi','wallet'].map(pm => (
              <label key={pm} className="inline-flex items-center gap-2 text-xs">
                <input type="checkbox" checked={paymentMethods.includes(pm)} onChange={(e) => {
                  if (e.target.checked) setPaymentMethods(prev => [...prev, pm]);
                  else setPaymentMethods(prev => prev.filter(x => x !== pm));
                }} />
                <span className="capitalize">{pm}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-accent mt-4 flex items-center justify-between">
          <div className="text-xs text-muted">Tip: Products will be discounted by percentage.</div>
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
