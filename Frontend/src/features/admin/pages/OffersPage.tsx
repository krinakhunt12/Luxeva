import React from 'react';
import OfferForm from '../OfferForm';
import OffersList from '../OffersList';

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Offers Management</h2>
        <p className="text-sm text-muted">Create, edit or pause promotional offers for products or site-wide discounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="sticky top-24">
            <OfferForm onCreated={() => { /* invalidate queries at parent if needed */ }} />
          </div>
        </div>

        <div className="col-span-2">
          <OffersList />
        </div>
      </div>
    </div>
  );
}
