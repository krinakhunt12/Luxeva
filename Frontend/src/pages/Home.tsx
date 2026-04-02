import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { getProducts } from '../features/products/api/productsApi';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      <motion.div 
        style={{ opacity }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-center text-white px-6"
      >
        <span className="text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">The New Standard</span>
        <h1 className="text-5xl md:text-8xl font-light tracking-tighter mb-10 leading-[0.9] max-w-4xl mx-auto">
          Elegance in <br /> <span className="italic font-serif">Simplicity</span>
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link 
            to="/collections/women" 
            className="bg-white text-primary px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-white transition-all duration-500 min-w-[200px]"
          >
            Shop Women
          </Link>
          <Link 
            to="/collections/men" 
            className="bg-transparent border border-white text-white px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-primary transition-all duration-500 min-w-[200px]"
          >
            Shop Men
          </Link>
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/60">
        <span className="text-[8px] uppercase tracking-widest font-bold">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-4 bg-white"
          />
        </div>
      </div>
    </section>
  );
};

const CategoryPills = () => {
  const categories = [
    { name: 'Women', path: '/collections/women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop' },
    { name: 'Men', path: '/collections/men', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=400&auto=format&fit=crop' },
    { name: 'Accessories', path: '/collections/accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop' },
    { name: 'Sale', path: '/collections/sale', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <section className="py-20 container mx-auto px-6">
      <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            to={cat.path}
            className="group flex-shrink-0 relative w-64 aspect-[4/5] overflow-hidden bg-accent"
          >
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-white text-2xl font-light tracking-widest uppercase mb-2">{cat.name}</h3>
              <div className="flex items-center gap-2 text-white/80 text-[10px] uppercase tracking-widest font-bold">
                Explore <ArrowRight size={12} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const newProducts = products.filter(p => p.isNew || p.isSale).slice(0, 4);

  if (loading) return <div className="py-20 text-center">Loading products...</div>;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold mb-4 block">New Arrivals</span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">The Season's <span className="italic font-serif">Essentials</span></h2>
          </div>
          <Link to="/collections" className="text-[10px] uppercase tracking-widest font-bold border-b border-primary pb-1 hover:text-gold hover:border-gold transition-all">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {newProducts.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandStory = () => (
  <section className="py-20 bg-bg overflow-hidden">
    <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative aspect-[4/5] bg-accent overflow-hidden"
      >
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000&auto=format&fit=crop" 
          alt="Brand Story" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center rounded-full">
          <Play size={24} className="text-white fill-white" />
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted">Our Philosophy</span>
        <h2 className="text-5xl md:text-6xl font-light tracking-tighter leading-tight">
          Crafted for the <br /> <span className="italic font-serif">Conscious Mind</span>
        </h2>
        <p className="text-muted text-lg leading-relaxed max-w-lg">
          We believe in the power of minimalism. Our collections are designed to transcend trends, focusing on quality materials and ethical craftsmanship that lasts a lifetime.
        </p>
        <div className="grid grid-cols-2 gap-8 pt-8">
          <div>
            <h4 className="text-2xl font-serif italic mb-2">Sustainable</h4>
            <p className="text-xs text-muted leading-relaxed">100% organic and recycled materials sourced ethically.</p>
          </div>
          <div>
            <h4 className="text-2xl font-serif italic mb-2">Timeless</h4>
            <p className="text-xs text-muted leading-relaxed">Designed to be worn season after season, year after year.</p>
          </div>
        </div>
        <Link to="/about" className="inline-block bg-primary text-white px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors">
          Discover Our Story
        </Link>
      </motion.div>
    </div>
  </section>
);

const ShopByLook = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold mb-4 block">Editorial</span>
        <h2 className="text-4xl md:text-5xl font-light tracking-tight italic font-serif">Shop By Look</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[1000px] md:h-[800px]">
        <div className="md:col-span-4 h-full relative group overflow-hidden bg-accent">
          <img src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop" alt="Look 1" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <div className="absolute bottom-10 left-10">
            <h3 className="text-white text-xl tracking-widest uppercase font-light mb-4">The Minimalist</h3>
            <button className="text-white text-[10px] uppercase tracking-widest font-bold border-b border-white pb-1">Shop The Look</button>
          </div>
        </div>
        
        <div className="md:col-span-8 grid grid-rows-2 gap-6 h-full">
          <div className="grid grid-cols-2 gap-6">
            <div className="relative group overflow-hidden bg-accent">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" alt="Look 2" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-sm tracking-widest uppercase font-light mb-2">Urban Chic</h3>
                <button className="text-white text-[8px] uppercase tracking-widest font-bold border-b border-white pb-1">Shop Now</button>
              </div>
            </div>
            <div className="relative group overflow-hidden bg-accent">
              <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop" alt="Look 3" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-sm tracking-widest uppercase font-light mb-2">Evening Luxe</h3>
                <button className="text-white text-[8px] uppercase tracking-widest font-bold border-b border-white pb-1">Shop Now</button>
              </div>
            </div>
          </div>
          <div className="relative group overflow-hidden bg-accent">
            <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop" alt="Look 4" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-10 left-10">
              <h3 className="text-white text-2xl tracking-widest uppercase font-light mb-4">Summer Breeze</h3>
              <button className="text-white text-[10px] uppercase tracking-widest font-bold border-b border-white pb-1">Explore Collection</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => {
  const testimonials = [
    { name: 'Sarah J.', text: 'The quality of the silk skirt is unmatched. It drapes perfectly and feels so luxurious.', role: 'Verified Buyer' },
    { name: 'Michael R.', text: 'Finally, a brand that understands minimal fashion. The fit of the linen shirt is spot on.', role: 'Verified Buyer' },
    { name: 'Elena K.', text: 'Obsessed with the leather tote. It is my daily essential now. Beautiful craftsmanship.', role: 'Verified Buyer' },
  ];

  return (
    <section className="py-20 bg-bg">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-full snap-center text-center space-y-8 px-4">
                <div className="flex justify-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-2xl md:text-3xl font-serif italic leading-relaxed">"{t.text}"</p>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">{t.name}</h4>
                  <p className="text-[8px] text-muted uppercase tracking-widest mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Home = () => {
  return (
    <div className="space-y-0">
      <Hero />
      <CategoryPills />
      <NewArrivals />
      <BrandStory />
      <ShopByLook />
      <Testimonials />
      <section className="py-20 bg-white border-t border-accent">
        <div className="container mx-auto px-6 max-w-2xl text-center space-y-8">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold">Newsletter</span>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">Join the <span className="italic font-serif">Luxeva Circle</span></h2>
          <p className="text-muted text-sm leading-relaxed">
            Subscribe to receive updates on new collections, editorial stories, and exclusive event invitations.
          </p>
          <form className="flex flex-col md:flex-row gap-4 pt-4">
            <input 
              type="email" 
              placeholder="Your Email Address" 
              className="flex-1 bg-bg border border-accent px-6 py-4 text-xs focus:outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary text-white px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors">
              Subscribe
            </button>
          </form>
          <p className="text-[8px] text-muted uppercase tracking-widest">By subscribing, you agree to our Privacy Policy.</p>
        </div>
      </section>
    </div>
  );
};
