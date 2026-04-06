import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit3, Pause, Play, Trash2, Calendar, Tag } from 'lucide-react';

type Offer = {
  _id: string;
  title: string;
  appliesTo: 'all' | 'product';
  productId?: string;
  discountType: 'percentage' | 'fixed';
  amount: number;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
};

const fetchOffers = async (): Promise<Offer[]> => {
  const res = await fetch('/api/offers');
  if (!res.ok) throw new Error('Failed to load offers');
  return res.json();
};

const OffersList: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: offers = [], isLoading } = useQuery({ queryKey: ['offers'], queryFn: fetchOffers });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<any>({});

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('luxeva_token');
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE', headers: { Authorization: token ? `Bearer ${token}` : '' } });
      if (!res.ok) throw new Error('Delete failed');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, payload }: any) => {
      const token = localStorage.getItem('luxeva_token');
      const res = await fetch(`/api/offers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
  });

  if (isLoading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => (
        <div key={i} className="animate-pulse border rounded-lg p-4 bg-white shadow-sm">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mt-4" />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="bg-white border p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-medium">Manage Offers</h4>
          <div className="text-sm text-muted">{offers.length} offers</div>
        </div>
        <p className="text-xs text-muted mb-4">Active offers will be applied to product listings automatically.</p>

        <div className="grid grid-cols-1 gap-4">
          {offers.map(o => (
            <div key={o._id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h5 className="font-semibold text-base">{o.title}</h5>
                  <span className={`text-xs px-2 py-1 rounded ${o.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{o.active ? 'Active' : 'Paused'}</span>
                </div>
                <div className="mt-2 text-sm text-muted flex items-center gap-4">
                  <div className="flex items-center gap-1"><Tag size={14} /> <span>{o.appliesTo === 'all' ? 'All products' : `Product: ${o.productId || '—'}`}</span></div>
                  <div className="flex items-center gap-1"><Calendar size={14} /> <span>{o.startsAt ? new Date(o.startsAt).toLocaleDateString() : '—'} → {o.endsAt ? new Date(o.endsAt).toLocaleDateString() : '—'}</span></div>
                  <div className="text-sm font-medium">{o.discountType === 'percentage' ? `${o.amount}% off` : `₹${o.amount} off`}</div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <button title="Edit" onClick={() => { setEditingId(o._id); setFormState({ title: o.title, appliesTo: o.appliesTo, productId: o.productId || '', discountType: o.discountType, amount: o.amount, active: o.active }); }} className="p-2 border rounded hover:bg-accent/50"><Edit3 size={16} /></button>
                  <button title={o.active ? 'Pause' : 'Resume'} onClick={() => updateMut.mutate({ id: o._id, payload: { active: !o.active } })} className="p-2 border rounded hover:bg-accent/50">{o.active ? <Pause size={16} /> : <Play size={16} />}</button>
                  <button title="Delete" onClick={() => { if (confirm('Delete this offer?')) deleteMut.mutate(o._id); }} className="p-2 border rounded text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                </div>
                <div className="text-xs text-muted">ID: {o._id.slice(0,8)}</div>
              </div>

              {editingId === o._id && (
                <div className="w-full mt-4 col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 w-full">
                    <input className="border p-2 rounded" value={formState.title || ''} onChange={e => setFormState((s: any) => ({ ...s, title: e.target.value }))} />
                    <select className="border p-2 rounded" value={formState.appliesTo} onChange={e => setFormState((s: any) => ({ ...s, appliesTo: e.target.value }))}>
                      <option value="all">All</option>
                      <option value="product">Product</option>
                    </select>
                    {formState.appliesTo === 'product' && <input className="border p-2 rounded" placeholder="Product ID" value={formState.productId || ''} onChange={e => setFormState((s: any) => ({ ...s, productId: e.target.value }))} />}
                    <select className="border p-2 rounded" value={formState.discountType} onChange={e => setFormState((s: any) => ({ ...s, discountType: e.target.value }))}>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                    <input type="number" className="border p-2 rounded" value={formState.amount} onChange={e => setFormState((s: any) => ({ ...s, amount: Number(e.target.value) }))} />
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Active</label>
                      <input type="checkbox" checked={!!formState.active} onChange={e => setFormState((s: any) => ({ ...s, active: e.target.checked }))} />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 bg-primary text-white rounded" onClick={() => { updateMut.mutate({ id: o._id, payload: formState }); setEditingId(null); }}>Save</button>
                    <button className="px-3 py-1 border rounded" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersList;
