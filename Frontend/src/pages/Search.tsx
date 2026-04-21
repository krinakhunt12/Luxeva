import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';

type Facets = { sizes: string[]; colors: string[]; categories: string[] };

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggest, setSuggest] = useState<string[]>([]);
  const [facets, setFacets] = useState<Facets>({ sizes: [], colors: [], categories: [] });
  const [filters, setFilters] = useState<{ size?: string; color?: string; category?: string }>({});
  const [visualUrl, setVisualUrl] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      const doSearch = async () => {
        if (!query.trim() && !filters.category && !filters.color && !filters.size) {
          setResults([]);
          return;
        }
        setLoading(true);
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (filters.category) params.set('category', filters.category);
        if (filters.color) params.set('color', filters.color);
        if (filters.size) params.set('size', filters.size);
        try {
          const res = await fetch(`/api/products/search?${params.toString()}`);
          const data = await res.json();
          setResults(data.results || []);
          setFacets(data.facets || { sizes: [], colors: [], categories: [] });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      doSearch();
    }, 300);
    return () => clearTimeout(id);
  }, [query, filters]);

  useEffect(() => {
    const doSuggest = async () => {
      if (!query || query.length < 2) return setSuggest([]);
      try {
        const res = await fetch(`/api/products/suggest?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggest(data.map((s: any) => s.name));
      } catch (err) {
        // ignore
      }
    };
    doSuggest();
  }, [query]);

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center space-y-12 mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter uppercase whitespace-nowrap">Discovery</h1>
          <div className="relative border-b border-primary pb-4">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search our collection..."
              className="w-full bg-transparent text-2xl md:text-4xl font-serif italic focus:outline-none placeholder:text-muted/30"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-0 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                <X size={24} />
              </button>
            )}
            {suggest.length > 0 && (
              <div className="absolute left-0 right-0 bg-white border border-accent mt-4 z-50 shadow-2xl py-4">
                {suggest.map(s => (
                  <button 
                    key={s} 
                    onClick={() => { setQuery(s); setSuggest([]); }} 
                    className="w-full px-8 py-3 text-left hover:bg-bg text-sm uppercase tracking-widest transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted">Categories</h4>
                <div className="flex flex-col gap-3">
                  {facets.categories.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setFilters(f => ({ ...f, category: f.category === c ? undefined : c }))} 
                      className={`text-xs text-left uppercase tracking-widest transition-all ${filters.category === c ? 'text-gold font-bold translate-x-2' : 'text-muted hover:text-primary hover:translate-x-1'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted">Sizes</h4>
                <div className="flex flex-wrap gap-2">
                  {facets.sizes.map(s => (
                    <button 
                      key={s} 
                      onClick={() => setFilters(f => ({ ...f, size: f.size === s ? undefined : s }))} 
                      className={`w-10 h-10 flex items-center justify-center border text-[10px] transition-all ${filters.size === s ? 'bg-primary text-white border-primary' : 'border-accent hover:border-primary'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted">Colors</h4>
                <div className="flex gap-3 flex-wrap">
                  {facets.colors.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setFilters(f => ({ ...f, color: f.color === c ? undefined : c }))} 
                      className={`w-6 h-6 rounded-full border transition-all ${filters.color === c ? 'ring-2 ring-gold ring-offset-2' : 'border-accent scale-90 hover:scale-100'}`}
                      style={{ backgroundColor: c.toLowerCase() }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-accent">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted mb-4">Visual Search</h4>
                <div className="space-y-3">
                  <input 
                    value={visualUrl} 
                    onChange={(e) => setVisualUrl(e.target.value)} 
                    placeholder="Enter Image URL" 
                    className="w-full bg-white border border-accent px-4 py-3 text-[10px] uppercase focus:outline-none focus:border-primary"
                  />
                  <button 
                    onClick={async () => {
                      if (!visualUrl) return;
                      setLoading(true);
                      try {
                        const res = await fetch('/api/products/visual', { 
                          method: 'POST', 
                          headers: { 'Content-Type': 'application/json' }, 
                          body: JSON.stringify({ imageUrl: visualUrl }) 
                        });
                        const d = await res.json();
                        setResults(d.products || []);
                      } catch (err) {
                        console.error(err);
                      } finally { 
                        setLoading(false); 
                      }
                    }} 
                    className="w-full bg-primary text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors"
                  >
                    Analyze Image
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-4 animate-pulse">
                    <div className="aspect-[3/4] bg-accent" />
                    <div className="h-4 bg-accent w-3/4" />
                    <div className="h-4 bg-accent w-1/2" />
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {results.map((product: any) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <p className="text-muted text-xl italic font-serif opacity-50">Seek and you shall find.</p>
                {query && <p className="text-xs uppercase tracking-widest">No results for "{query}"</p>}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
