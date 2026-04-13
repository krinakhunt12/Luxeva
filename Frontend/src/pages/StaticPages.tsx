import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';

type Facets = { sizes: string[]; colors: string[]; categories: string[] };

export const Search = () => {
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
        const res = await fetch(`/api/products/search?${params.toString()}`);
        const data = await res.json();
        setResults(data.results || []);
        setFacets(data.facets || { sizes: [], colors: [], categories: [] });
        setLoading(false);
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
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <h1 className="text-5xl font-light tracking-tighter uppercase">Search</h1>
          <div className="relative border-b border-primary pb-4">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search our collection..."
              className="w-full bg-transparent text-2xl font-serif italic focus:outline-none placeholder:text-muted"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-0 top-1/2 -translate-y-1/2">
                <X size={20} />
              </button>
            )}
            {suggest.length > 0 && (
              <div className="absolute left-0 right-0 bg-white border mt-2 z-50">
                {suggest.map(s => (
                  <div key={s} onClick={() => setQuery(s)} className="px-4 py-2 hover:bg-accent cursor-pointer">{s}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div>
              <h4 className="text-xs uppercase text-muted mb-2">Categories</h4>
              <div className="flex flex-col gap-2">
                {facets.categories.map(c => (
                  <button key={c} onClick={() => setFilters(f => ({ ...f, category: f.category === c ? undefined : c }))} className={`text-sm text-left ${filters.category === c ? 'font-bold' : ''}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase text-muted mb-2">Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {facets.sizes.map(s => (
                  <button key={s} onClick={() => setFilters(f => ({ ...f, size: f.size === s ? undefined : s }))} className={`px-3 py-2 border ${filters.size === s ? 'bg-primary text-white' : ''}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase text-muted mb-2">Colors</h4>
              <div className="flex gap-2 flex-wrap">
                {facets.colors.map(c => (
                  <button key={c} onClick={() => setFilters(f => ({ ...f, color: f.color === c ? undefined : c }))} className={`px-3 py-2 border ${filters.color === c ? 'ring-2 ring-gold' : ''}`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase text-muted mb-2">Visual Search</h4>
              <div className="space-y-2">
                <input value={visualUrl} onChange={(e) => setVisualUrl(e.target.value)} placeholder="Image URL" className="w-full px-3 py-2 border"/>
                <button onClick={async () => {
                  if (!visualUrl) return;
                  setLoading(true);
                  try {
                    const res = await fetch('/api/products/visual', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: visualUrl }) });
                    const d = await res.json();
                    setResults(d.products || []);
                  } catch (err) {
                    // ignore
                  } finally { setLoading(false); }
                }} className="w-full bg-primary text-white py-2">Search by image</button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">Searching…</div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {results.map((product: any) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted text-lg italic font-serif">No results found.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export const About = () => (
  <div className="pt-32 pb-20 bg-bg">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto space-y-20">
        <div className="text-center space-y-8">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold">Our Story</span>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter uppercase leading-[0.8]">The Art of <br /> <span className="italic font-serif">Minimalism</span></h1>
        </div>

        <div className="aspect-[16/9] bg-accent overflow-hidden">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop" alt="About" className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-light tracking-tight italic font-serif leading-tight">Founded on the principle that quality matters more than quantity.</h2>
            <p className="text-muted text-lg leading-relaxed">
              Luxeva was born in 2020 with a simple mission: to create a wardrobe of essentials that are as beautiful as they are sustainable. We believe that fashion should be slow, thoughtful, and enduring.
            </p>
          </div>
          <div className="aspect-[3/4] bg-accent overflow-hidden">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop" alt="About 2" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-accent">
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold">Ethical Sourcing</h4>
            <p className="text-xs text-muted leading-relaxed">We partner with family-owned mills in Italy and Portugal that share our commitment to fair labor and environmental stewardship.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold">Timeless Design</h4>
            <p className="text-xs text-muted leading-relaxed">Our design process starts with the fabric. We create silhouettes that are modern yet classic, ensuring they never go out of style.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold">Radical Transparency</h4>
            <p className="text-xs text-muted leading-relaxed">We believe you have the right to know where your clothes come from and how much they cost to make.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Contact = () => (
  <div className="pt-32 pb-20 bg-bg">
    <div className="container mx-auto px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold">Contact Us</span>
            <h1 className="text-6xl font-light tracking-tighter uppercase leading-[0.8]">Get in <br /> <span className="italic font-serif">Touch</span></h1>
            <p className="text-muted text-lg leading-relaxed max-w-md">
              Whether you have a question about sizing, shipping, or just want to say hello, we'd love to hear from you.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Customer Care</h4>
              <p className="text-sm text-muted">support@luxeva.com</p>
              <p className="text-sm text-muted">+91 98765 43210</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Press & Wholesale</h4>
              <p className="text-sm text-muted">press@luxeva.com</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Our Studio</h4>
              <p className="text-sm text-muted">123 Minimalist Way, Design District</p>
              <p className="text-sm text-muted">Mumbai, MH 400001</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-accent p-12 shadow-sm">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">First Name</label>
                <input type="text" className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Last Name</label>
                <input type="text" className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Email Address</label>
              <input type="email" className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Subject</label>
              <select className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors">
                <option>General Inquiry</option>
                <option>Order Support</option>
                <option>Returns & Exchanges</option>
                <option>Wholesale</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold">Message</label>
              <textarea rows={6} className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
            </div>
            <button className="w-full bg-primary text-white py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
