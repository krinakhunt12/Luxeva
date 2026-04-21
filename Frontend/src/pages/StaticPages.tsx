import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

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

export const ShippingPolicy = () => (
  <div className="pt-40 pb-24 bg-bg">
    <div className="container mx-auto px-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold">Logistics</span>
          <h1 className="text-5xl md:text-7xl font-light uppercase tracking-tighter">Shipping <br /> & Handling</h1>
        </div>

        <div className="prose prose-sm max-w-none text-muted leading-loose space-y-12 font-light">
          <section className="space-y-6">
            <h2 className="text-primary text-lg uppercase tracking-widest font-bold border-b border-accent pb-2">Overview</h2>
            <p>At Luxeva, we believe the experience of luxury begins the moment you click 'Order'. Each package is meticulously wrapped in our sustainable signature packaging and handled with the utmost care to ensure it reaches you in pristine condition.</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-widest font-bold text-primary">Domestic Pacing (India)</h3>
              <p>We partner with premium couriers to ensure secure delivery across all pin codes.</p>
              <ul className="space-y-2 list-none p-0">
                <li className="flex justify-between border-b border-accent py-2"><span>Standard (Free over ₹2000)</span> <span>5–7 Days</span></li>
                <li className="flex justify-between border-b border-accent py-2"><span>Express (Major Cities)</span> <span>2–3 Days</span></li>
                <li className="flex justify-between border-b border-accent py-2"><span>Mumbai Same Day</span> <span>Order by 10am</span></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-widest font-bold text-primary">International reach</h3>
              <p>We ship to 40+ countries. Timelines vary based on customs clearing processes.</p>
              <ul className="space-y-2 list-none p-0">
                <li className="flex justify-between border-b border-accent py-2"><span>UAE & SE Asia</span> <span>7–10 Days</span></li>
                <li className="flex justify-between border-b border-accent py-2"><span>Europe & USA</span> <span>10–14 Days</span></li>
              </ul>
            </div>
          </section>

          <section className="bg-white p-10 border border-accent space-y-6">
            <h3 className="text-sm uppercase tracking-widest font-bold text-primary">Duty & Taxes</h3>
            <p className="text-xs italic">For international orders, import duties and local taxes are determined by the destination country and are the sole responsibility of the customer. These must be paid for the courier to release the package.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-primary text-sm uppercase tracking-widest font-bold">Failed Delivery Attempts</h2>
            <p>Our couriers will attempt delivery exactly three times. If you are unavailable, the package will be held at the local hub for 48 hours before being returned to our warehouse. Redelivery fees may apply for returned shipments.</p>
          </section>
        </div>
      </motion.div>
    </div>
  </div>
);

export const ReturnsPolicy = () => (
  <div className="pt-40 pb-24 bg-bg">
    <div className="container mx-auto px-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold">Concierge Service</span>
          <h1 className="text-5xl md:text-7xl font-light uppercase tracking-tighter">Returns <br /> & Exchanges</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 border border-accent">
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Quick Stats</h4>
              <ul className="space-y-4 text-xs font-light">
                <li className="flex justify-between"><span className="text-muted">Return Window</span> <span className="font-bold">14 Days</span></li>
                <li className="flex justify-between"><span className="text-muted">Processing Time</span> <span className="font-bold">7 Days</span></li>
                <li className="flex justify-between"><span className="text-muted">Restocking Fee</span> <span className="font-bold">₹0</span></li>
              </ul>
            </div>
            <div className="p-8 border border-gold/20 bg-gold/5">
              <p className="text-xs italic text-muted">"Our aim is 100% satisfaction. If it doesn't fit your life, it shouldn't be in your closet."</p>
            </div>
          </aside>

          <main className="lg:col-span-2 space-y-10 font-light leading-loose text-muted">
            <section className="space-y-4">
              <h3 className="text-primary text-sm uppercase tracking-widest font-bold">The Return Condition</h3>
              <p>Items must be returned in their original, unused state—unwashed, with all security tags attached, and in our signature box. We cannot accept returns of pieces showing any signs of wear, including makeup stains, perfume odors, or alterations.</p>
            </section>

            <section className="space-y-6">
              <h3 className="text-primary text-sm uppercase tracking-widest font-bold">The 3-Step Process</h3>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Initiate Request", desc: "Contact our concierge at support@luxeva.com with your order number. A return authorization will be sent within 24 hours." },
                  { step: "02", title: "Secure Packing", desc: "Place the items back in their original protective wrap. Ensure the return ID is written clearly on the outer box." },
                  { step: "03", title: "Courier Pickup", desc: "We will schedule a complimentary pickup for domestic orders. For international returns, shipping costs are the customer's responsibility." }
                ].map(item => (
                  <div key={item.step} className="flex gap-6 items-start">
                    <span className="text-2xl font-serif text-gold italic">{item.step}</span>
                    <div>
                      <h4 className="text-primary text-xs uppercase tracking-widest font-black mb-2">{item.title}</h4>
                      <p className="text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-8 bg-primary text-white space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gold">Final Sale Items</h4>
              <p className="text-xs font-light">Customized pieces, personalized monogramming, and select delicate evening wear marked as 'Final Sale' are ineligible for return or exchange unless a manufacturing defect is verified by our quality team.</p>
            </section>
          </main>
        </div>
      </motion.div>
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
  <div className="pt-40 pb-24 bg-bg">
    <div className="container mx-auto px-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold">Assistance</span>
          <h1 className="text-5xl md:text-7xl font-light uppercase tracking-tighter">Common <br /> Inquiries</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          <div className="space-y-8">
            <h3 className="text-primary text-xs uppercase tracking-widest font-bold border-b border-accent pb-2">Orders & Delivery</h3>
            {[
              { q: "How do I track my Luxeva package?", a: "Once dispatched, you will receive an SMS and email with a unique tracking link from our premium logistics partner." },
              { q: "Can I redirect a package in transit?", a: "To ensure absolute security, address changes are not permitted once the package has physically left our warehouse." },
              { q: "What if my item arrives with a defect?", a: "Contact our quality team within 48 hours for immediate replacement under our 'Pristine Guarantee'." }
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <p className="text-primary font-medium text-sm">{item.q}</p>
                <p className="text-muted text-xs font-light leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-primary text-xs uppercase tracking-widest font-bold border-b border-accent pb-2">Product & Styling</h3>
            {[
              { q: "Are your materials sustainable?", a: "Yes. 90% of our textiles are GOTS certified organic or recycled from luxury post-consumer waste." },
              { q: "How do I ensure the perfect fit?", a: "Each product page features exact garment measurements. You can also book a virtual styling session via our contact page." },
              { q: "Do you offer bespoke tailoring?", a: "We offer complimentary hems and sleeves shortening for our 'Signature' range at our flagship boutiques." }
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <p className="text-primary font-medium text-sm">{item.q}</p>
                <p className="text-muted text-xs font-light leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <div className="pt-40 pb-24 bg-bg">
    <div className="container mx-auto px-6 max-w-3xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
        <div className="space-y-6">
          <h1 className="text-5xl font-light uppercase tracking-tighter">Your Privacy</h1>
          <p className="text-muted font-light leading-loose">At Luxeva, we hold your trust in high regard. This document elucidates the meticulous care we take in managing your digital identity.</p>
        </div>

        <div className="space-y-12 text-muted font-light leading-loose text-sm">
          <div className="space-y-4">
            <h4 className="text-primary font-bold uppercase tracking-widest text-[10px]">1. Information Stewardship</h4>
            <p>We collect essential data—name, email, and biometric sizing (if provided)—to curate a seamless shopping journey. We act as sole guardians of this data; we never sell or trade your details for third-party marketing.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary font-bold uppercase tracking-widest text-[10px]">2. Digital Footprints</h4>
            <p>Web 'cookies' are utilized purely to enhance site performance and remember your preferences. This includes language selection, saved items in your wishlist, and recent search history.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary font-bold uppercase tracking-widest text-[10px]">3. Secure Transactions</h4>
            <p>Financial data is never stored on our servers. All payments are routed through PCI-compliant gateways (Stripe, Razorpay) featuring 256-bit SSL encryption.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary font-bold uppercase tracking-widest text-[10px]">4. Your Legal Rights</h4>
            <p>You reserve the right to access, rectify, or demand the erasure of your personal records at any point. To do so, please contact our Data Protection Officer at privacy@luxeva.com.</p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export const RefundPolicy = () => (
  <div className="pt-40 pb-24 bg-bg">
    <div className="container mx-auto px-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
        <div className="space-y-6">
          <h1 className="text-5xl font-light uppercase tracking-tighter">Refund <br /> Framework</h1>
          <p className="text-muted font-light leading-loose">The Luxeva approach to refunds is built on transparency and speed. We recognize that sometimes a piece isn't the right fit, and we ensure the transition back is effortless.</p>
        </div>

        <div className="space-y-12 text-muted font-light leading-loose text-sm">
          <div className="space-y-4">
            <h4 className="text-primary font-bold uppercase tracking-widest text-[10px]">Quality Inspection</h4>
            <p>Upon arrival at our distribution center, each return undergoes a 12-point quality check by our master tailors. Once the item is verified as pristine, your refund is approved instantly.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary font-bold uppercase tracking-widest text-[10px]">Payment Methods</h4>
            <p>Refunds are always issued to the original source of payment. For Credit/Debit card transactions, the credit typically reflects within 5–7 business days, depending on your banking institution's processing cycles.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary font-bold uppercase tracking-widest text-[10px]">Store Credit Option</h4>
            <p>Should you prefer, we can issue an immediate digital Luxeva Gift Card for 110% of the return value—providing an additional 10% toward your next purchase.</p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export const Locations = () => (
  <div className="pt-40 pb-24 bg-bg">
    <div className="container mx-auto px-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold">Our Boutiques</span>
          <h1 className="text-5xl md:text-7xl font-light uppercase tracking-tighter">Visit Our <br /> Spaces</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {[
            { 
              city: "Mumbai", 
              name: "Flagship Atelier", 
              address: "123 Minimalist Way, Design District, MH 400001",
              services: ["Personal Styling", "Made-to-Measure", "Heritage Archive"],
              image: "https://images.unsplash.com/photo-1582037928869-676554628ec3?q=80&w=800&auto=format&fit=crop"
            },
            { 
              city: "New Delhi", 
              name: "Capital Emporium", 
              address: "Square 45, DLF Phase V, DL 110001",
              services: ["Styling Lounge", "Alteration Studio", "Click & Collect"],
              image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop"
            }
          ].map((loc, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="space-y-8 group">
              <div className="aspect-[16/9] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src={loc.image} alt={loc.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[8px] uppercase tracking-widest font-black text-gold">{loc.city}</span>
                    <h3 className="text-2xl font-light uppercase tracking-widest">{loc.name}</h3>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed max-w-xs">{loc.address}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {loc.services.map(s => (
                    <span key={s} className="px-3 py-1 border border-accent text-[8px] uppercase tracking-widest text-muted">{s}</span>
                  ))}
                </div>
                <button className="pt-4 text-[9px] uppercase tracking-[0.3em] font-bold border-b border-primary hover:text-gold hover:border-gold transition-colors">Get Directions</button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export const TermsPage = () => (
  <div className="pt-40 pb-24 bg-bg">
    <div className="container mx-auto px-6 max-w-3xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
        <div className="space-y-6">
          <h1 className="text-5xl font-light uppercase tracking-tighter">Terms of Service</h1>
          <p className="text-muted font-light leading-loose">Engagement with the Luxeva platform denotes acceptance of the following legal stipulations. We advice a thorough reading of these conditions to ensure a mutual understanding of our partnership.</p>
        </div>

        <div className="space-y-12 text-muted font-light leading-loose text-sm">
          <div className="space-y-4">
            <h4 className="text-primary font-bold uppercase tracking-widest text-[10px]">I. Intellectual Assets</h4>
            <p>All creative assets—including but not limited to photography, bespoke silhouettes, and brand narratives—remain the exclusive intellectual property of Luxeva Pvt. Ltd. Unauthorized commercial use is strictly prohibited.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary font-bold uppercase tracking-widest text-[10px]">II. Order Acceptance</h4>
            <p>An order receipt email does not constitute a legal contract. We reserve the right to decline orders due to stock discrepancies, pricing errors, or suspected fraudulent activity.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-primary font-bold uppercase tracking-widest text-[10px]">III. Ethical Use</h4>
            <p>Our platform is designed for the enjoyment of individual collectors. We reserve the right to limit quantities or suspend accounts identified as bulk resellers or bots.</p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);
