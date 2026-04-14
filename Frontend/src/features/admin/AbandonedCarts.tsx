import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAbandoned, sendAbandonedNow, previewAbandonedTemplate } from '../abandoned/api/abandonedApi';

const AbandonedCarts: React.FC = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(['abandoned', { status: 'pending' }], () => fetchAbandoned({ status: 'pending', limit: 50 }));
  const sendMut = useMutation((id: string) => sendAbandonedNow(id), { onSuccess: () => qc.invalidateQueries(['abandoned']) });

  if (isLoading) return <div className="p-6">Loading abandoned carts…</div>;

  return (
    <div className="bg-white border p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Abandoned Carts</h3>
      {data && data.items && data.items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/30">
              <tr>
                <th className="p-2">Email</th>
                <th className="p-2">Items</th>
                <th className="p-2">Last Updated</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((c: any) => (
                <tr key={c._id} className="border-b">
                  <td className="p-2">{c.email || '—'}</td>
                  <td className="p-2">{(c.cart || []).length}</td>
                  <td className="p-2">{new Date(c.lastUpdated).toLocaleString()}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button onClick={() => sendMut.mutate(c._id)} className="px-3 py-1 bg-primary text-white rounded">Send Now</button>
                      <a className="px-3 py-1 border rounded" href={`/wishlists/${c.token}`} target="_blank">Preview</a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No pending abandoned carts.</div>
      )}
    </div>
  );
};

export default AbandonedCarts;
