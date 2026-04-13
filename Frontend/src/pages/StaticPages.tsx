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

export const ShippingPolicy = () => (
  <div className="pt-32 pb-20 bg-bg">
    <div className="container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-light mb-6">Shipping Policy</h1>
      <p className="text-muted mb-4">We ship domestically across India and to select international destinations. This page explains timelines, costs, tracking, and what to expect after you place an order.</p>

      <h3 className="text-lg font-bold mt-6">Order processing</h3>
      <p className="text-muted">Orders are usually processed within 1–3 business days. Processing includes order verification, quality checks, and packing. During sale periods processing may take longer.</p>

      <h3 className="text-lg font-bold mt-6">Domestic Shipping</h3>
      <ul className="list-disc pl-6 text-muted">
        <li><strong>Standard:</strong> 3–7 business days (free over ₹2000).</li>
        <li><strong>Express:</strong> 1–3 business days (additional fee applies).</li>
      </ul>

      <h3 className="text-lg font-bold mt-6">International Shipping</h3>
      <p className="text-muted">We ship to selected countries. Transit times and rates vary by destination. Import duties and taxes are not included and are the recipient's responsibility.</p>

      <h3 className="text-lg font-bold mt-6">Tracking & delivery</h3>
      <p className="text-muted">Once your order ships you will receive an email with a tracking number. Use the carrier link to track delivery status. If a delivery attempt fails, the carrier will follow their retry policy — please contact support if you don't receive your parcel within the expected timeframe.</p>

      <h3 className="text-lg font-bold mt-6">Lost or damaged items</h3>
      <p className="text-muted">If your order arrives damaged or is lost in transit, contact support with photos and your order number. We will investigate and work with the carrier to resolve the issue, offering a replacement or refund where appropriate.</p>
    </div>
  </div>
);

export const ReturnsPolicy = () => (
  <div className="pt-32 pb-20 bg-bg">
    <div className="container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-light mb-6">Returns & Exchanges</h1>
      <p className="text-muted mb-4">We want you to be happy with your purchase. If a product doesn't meet your expectations you can return or exchange it under the conditions below.</p>

      <h3 className="text-lg font-bold mt-6">Eligibility</h3>
      <ul className="list-disc pl-6 text-muted">
        <li>Returns accepted within 14 days of delivery.</li>
        <li>Items must be unworn, unwashed, and with original tags and packaging.</li>
        <li>Final-sale and intimate items (where hygiene is a concern) are non-returnable — these will be marked on the product page.</li>
      </ul>

      <h3 className="text-lg font-bold mt-6">How to return</h3>
      <ol className="list-decimal pl-6 text-muted">
        <li>Contact support@luxeva.com with your order number and reason for return.</li>
        <li>We will provide a returns authorization and instructions.</li>
        <li>Ship the item back using a tracked service and retain the proof of shipment.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6">Refunds & timelines</h3>
      <p className="text-muted">Once we receive and inspect the return, refunds are processed within 5–7 business days. Refunds are issued to the original payment method. Shipping costs are refundable only for items returned due to our error.</p>

      <h3 className="text-lg font-bold mt-6">Exchanges</h3>
      <p className="text-muted">If you need a different size and stock is available we will help facilitate an exchange. Exchanges depend on inventory — if the requested item is unavailable we will issue a refund or offer store credit.</p>
    </div>
  </div>
);

export const SizeGuidePage = () => (
  <div className="pt-32 pb-20 bg-bg">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl font-light mb-6">Size Guide</h1>
      <p className="text-muted mb-6">Use this guide to find your best fit. Measurements are in centimeters. For the most accurate fit, measure a similar garment that fits you well or measure your body following the instructions below.</p>

      <h3 className="text-lg font-bold mt-6">How to measure</h3>
      <ul className="list-disc pl-6 text-muted">
        <li><strong>Bust:</strong> Measure around the fullest part of your chest, keeping the tape level.</li>
        <li><strong>Waist:</strong> Measure around the narrowest part of your waist, usually above the belly button.</li>
        <li><strong>Hip:</strong> Measure around the fullest part of your hips, about 20cm below the waist depending on height.</li>
      </ul>

      <div className="overflow-x-auto mt-6">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3 font-bold">Size</th>
              <th className="py-3 font-bold">Bust (cm)</th>
              <th className="py-3 font-bold">Waist (cm)</th>
              <th className="py-3 font-bold">Hip (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-3">XS</td><td className="py-3">80–84</td><td className="py-3">60–64</td><td className="py-3">86–90</td></tr>
            <tr className="border-b"><td className="py-3">S</td><td className="py-3">85–89</td><td className="py-3">65–69</td><td className="py-3">91–95</td></tr>
            <tr className="border-b"><td className="py-3">M</td><td className="py-3">90–94</td><td className="py-3">70–74</td><td className="py-3">96–100</td></tr>
            <tr className="border-b"><td className="py-3">L</td><td className="py-3">95–99</td><td className="py-3">75–79</td><td className="py-3">101–105</td></tr>
          </tbody>
        </table>
      </div>

      <p className="text-muted mt-6">If you're between sizes we recommend sizing up for comfort or contacting customer care for personalised advice.</p>
    </div>
  </div>
);

export const FAQ = () => (
  <div className="pt-32 pb-20 bg-bg">
    <div className="container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-light mb-6">Frequently Asked Questions</h1>
      <div className="space-y-6 text-muted">
        <div>
          <h4 className="font-bold">How long will my order take to arrive?</h4>
          <p>Orders are processed within 1–3 business days; domestic delivery typically takes 3–7 business days for standard shipping. Express shipping is 1–3 business days. International delivery times vary.</p>
        </div>
        <div>
          <h4 className="font-bold">Can I change or cancel my order?</h4>
          <p>Contact support immediately with your order number. If your order hasn't been shipped we may be able to cancel or update it. Once shipped, you'll need to follow the returns process.</p>
        </div>
        <div>
          <h4 className="font-bold">What payment methods do you accept?</h4>
          <p>We accept major credit/debit cards, UPI, netbanking and popular wallets. All payments are processed securely.</p>
        </div>
        <div>
          <h4 className="font-bold">How do I care for my items?</h4>
          <p>Care instructions vary by item — check the product page and garment label. When in doubt, we recommend gentle machine wash or dry clean as specified on the label.</p>
        </div>
        <div>
          <h4 className="font-bold">How do promotions and discount codes work?</h4>
          <p>Only one promotion can be applied per order unless stated otherwise. Discounts cannot be combined with store credit unless specified.</p>
        </div>
      </div>
    </div>
  </div>
);
