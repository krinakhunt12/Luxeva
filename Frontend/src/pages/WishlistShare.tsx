import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

export default function WishlistShare() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/wishlists/${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(d => setData(d))
      .catch(err => setError(err.message || 'Error'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="pt-40 text-center">Loading…</div>;
  if (error) return <div className="pt-40 text-center">{error}</div>;

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-light tracking-tighter uppercase mb-8">Shared Wishlist</h1>
        {data?.name && <p className="text-muted mb-6">{data.name}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {data.products && data.products.length > 0 ? (
            data.products.map((p: any) => (
              <div key={p._id} className="relative group">
                <ProductCard product={{ id: p._id, name: p.name, slug: p.slug, images: p.images, price: p.price, category: p.category, subCategory: p.subCategory, variants: p.variants, inStock: p.inStock }} />
              </div>
            ))
          ) : (
            <div className="pt-20 text-center">No products found in this wishlist.</div>
          )}
        </div>
        <div className="mt-12 text-center">
          <Link to="/collections" className="inline-block bg-primary text-white px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
