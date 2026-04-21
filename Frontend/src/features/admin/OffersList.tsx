import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Edit3, Pause, Play, Trash2, Calendar, Tag } from 'lucide-react';
import useOffers from '../offers/hooks/useOffers';
import { useDeleteOffer, useUpdateOffer } from './hooks/useAdminOffers';

type Offer = {
  _id: string;
  title: string;
  appliesTo: 'all' | 'selected';
  productIds?: string[];
  percentage: number;
  status: 'active' | 'inactive';
  startsAt?: string;
  endsAt?: string;
  bank?: string;
  paymentMethods?: string[];
};

const OffersList: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: offers = [], isLoading } = useOffers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<any>({});

  const deleteMut = useDeleteOffer();
  const updateMut = useUpdateOffer();

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
        <p className="text-xs text-muted mb-4">Percentage-based offers are applied to product listings.</p>

        <div className="grid grid-cols-1 gap-4">
          {offers.map(o => (
            <div key={o._id} className="flex flex-col gap-4 p-4 border rounded-lg hover:shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h5 className="font-semibold text-base">{o.title}</h5>
                    <span className={`text-xs px-2 py-1 rounded ${o.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{o.status === 'active' ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted flex items-center gap-4">
                    <div className="flex items-center gap-1"><Tag size={14} /> <span>{o.appliesTo === 'all' ? 'All products' : `Selected Items`}</span></div>
                    <div className="flex items-center gap-1"><Calendar size={14} /> <span>{o.startsAt ? new Date(o.startsAt).toLocaleDateString() : '—'}</span></div>
                    <div className="text-sm font-bold text-primary">{o.percentage}% OFF</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button title="Edit" onClick={() => { setEditingId(o._id); setFormState({ ...o }); }} className="p-2 border rounded hover:bg-accent/50"><Edit3 size={16} /></button>
                  <button title={o.status === 'active' ? 'Pause' : 'Resume'} onClick={() => updateMut.mutate({ id: o._id, payload: { status: o.status === 'active' ? 'inactive' : 'active' } })} className="p-2 border rounded hover:bg-accent/50">{o.status === 'active' ? <Pause size={16} /> : <Play size={16} />}</button>
                  <button title="Delete" onClick={() => { if (confirm('Delete this offer?')) deleteMut.mutate(o._id); }} className="p-2 border rounded text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                </div>
              </div>

              {editingId === o._id && (
                <div className="w-full border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted">Title</label>
                      <input className="w-full border p-2 rounded text-xs" value={formState.title || ''} onChange={e => setFormState((s: any) => ({ ...s, title: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted">Bank</label>
                      <input className="w-full border p-2 rounded text-xs" placeholder="Bank (optional)" value={formState.bank || ''} onChange={e => setFormState((s: any) => ({ ...s, bank: e.target.value }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted">Percentage (%)</label>
                      <input type="number" className="w-full border p-2 rounded text-xs" value={formState.percentage} onChange={e => setFormState((s: any) => ({ ...s, percentage: Number(e.target.value) }))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted">Applies To</label>
                      <select className="w-full border p-2 rounded text-xs" value={formState.appliesTo} onChange={e => setFormState((s: any) => ({ ...s, appliesTo: e.target.value }))}>
                        <option value="all">All</option>
                        <option value="selected">Selected</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-muted">Status</label>
                      <select className="w-full border p-2 rounded text-xs" value={formState.status} onChange={e => setFormState((s: any) => ({ ...s, status: e.target.value }))}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded" onClick={() => { updateMut.mutate({ id: o._id, payload: formState }); setEditingId(null); }}>Update Offer</button>
                    <button className="px-4 py-2 border text-xs font-bold rounded" onClick={() => setEditingId(null)}>Cancel</button>
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
