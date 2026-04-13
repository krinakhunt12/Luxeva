import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, User } from '../../types';
import { ProductCard } from '../../components/ProductCard';
import { LayoutDashboard, Package, Users } from 'lucide-react';
import { getProductsPaged, createProduct as apiCreateProduct } from '../products/api/productsApi';
import { useUsers } from '../user/hooks/useUser';
import OfferForm from './OfferForm';
import OffersList from './OffersList';

// users are loaded via useUsers hook

export const Admin = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users'>('dashboard');
  const [offersTab, setOffersTab] = useState(false);

  // pagination state for admin products
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: paged, isLoading: prodsLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => getProductsPaged(page, limit),
    keepPreviousData: true
  });
  const products: Product[] = (paged && (paged as any).products) || [];
  const { data: users = [], isLoading: usersLoading } = useUsers();

  // Example mutation to create product (requires auth token on backend)
  const createProduct = useMutation({ mutationFn: (payload: Partial<Product>) => apiCreateProduct(payload as any), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }) });

  return (
    <div className="pt-32 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <aside className="col-span-1 space-y-4">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full p-4 text-left ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'bg-white border border-accent'}`}>
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('products')} className={`w-full p-4 text-left ${activeTab === 'products' ? 'bg-primary text-white' : 'bg-white border border-accent'}`}>
              <Package size={16} /> Products
            </button>
            <button onClick={() => setActiveTab('users')} className={`w-full p-4 text-left ${activeTab === 'users' ? 'bg-primary text-white' : 'bg-white border border-accent'}`}>
              <Users size={16} /> Users
            </button>
            <button onClick={() => setOffersTab(o => !o)} className={`w-full p-4 text-left ${offersTab ? 'bg-primary text-white' : 'bg-white border border-accent'}`}>
              Offers
            </button>
          </aside>

          <main className="col-span-5">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-light">Admin Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {prodsLoading ? (
                    // skeleton cards
                    <>
                      <div className="bg-white border p-6 animate-pulse"> <div className="h-4 bg-gray-200 w-1/3 mb-4 rounded" /> <div className="h-8 bg-gray-100 w-full rounded" /> </div>
                      <div className="bg-white border p-6 animate-pulse"> <div className="h-4 bg-gray-200 w-1/3 mb-4 rounded" /> <div className="h-8 bg-gray-100 w-full rounded" /> </div>
                      <div className="bg-white border p-6 animate-pulse"> <div className="h-4 bg-gray-200 w-1/3 mb-4 rounded" /> <div className="h-8 bg-gray-100 w-full rounded" /> </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white border p-6"> <p className="text-sm uppercase">Products</p> <p className="text-2xl">{products.length}</p> </div>
                      <div className="bg-white border p-6"> <p className="text-sm uppercase">Users</p> <p className="text-2xl">{users.length}</p> </div>
                      <div className="bg-white border p-6"> <p className="text-sm uppercase">Orders</p> <p className="text-2xl">0</p> </div>
                    </>
                  )}
                </div>
                  <div className="mt-6">
                    <h3 className="text-2xl font-light mb-4">Quick Create Offer</h3>
                    <OfferForm onCreated={() => queryClient.invalidateQueries({ queryKey: ['products'] })} />
                  </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-light">Products</h3>
                  <button className="bg-primary text-white px-4 py-2 uppercase text-xs" onClick={() => createProduct.mutate({ name: 'New Product', slug: `new-${Date.now()}`, price: 0 })}>Create</button>
                </div>

                  {prodsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="bg-white border p-6 animate-pulse">
                          <div className="h-48 bg-gray-100 mb-4 rounded" />
                          <div className="h-4 bg-gray-200 w-3/4 mb-2 rounded" />
                          <div className="h-3 bg-gray-200 w-1/2 rounded" />
                        </div>
                      ))}
                    </div>
                  ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {products.map(p => <ProductCard key={p.id || (p as any)._id} product={p} />)}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-2 border">
                        Prev
                      </button>
                      <span className="text-sm">Page {paged?.page} of {paged?.pages}</span>
                      <button disabled={page >= (paged?.pages || 1)} onClick={() => setPage(p => p + 1)} className="px-3 py-2 border">
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {offersTab && (
              <div className="space-y-6">
                <h3 className="text-2xl font-light">Offers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OfferForm onCreated={() => queryClient.invalidateQueries({ queryKey: ['products'] })} />
                  <OffersList />
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-2xl font-light mb-4">Users</h3>
                {usersLoading ? (
                  <div className="bg-white border">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="p-4 border-b animate-pulse">
                        <div className="h-4 bg-gray-200 w-1/3 mb-2 rounded" />
                        <div className="h-3 bg-gray-100 w-1/2 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs uppercase"><th className="p-4">Name</th><th>Email</th><th>Mobile</th></tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={(u as any).id || (u as any)._id} className="border-t"><td className="p-4">{u.name}</td><td>{u.email}</td><td>{u.mobile}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// use named export `Admin` only
