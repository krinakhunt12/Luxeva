import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import { getProducts } from '../features/products/api/productsApi';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';

// map URL collection slugs to backend category values
const CATEGORY_MAP: Record<string, string[]> = {
  women: ['Dress', 'Top', 'Skirt', 'Saree', 'Kurta', 'Blouse'],
  men: ['Shirt', 'Tshirt', 'Pants', 'Jacket'],
};

const Collections = () => {
  const { category } = useParams<{ category?: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        console.log('fetchedProducts count:', fetchedProducts?.length);
        console.log('sample product:', fetchedProducts?.[0]);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (category && category !== 'sale') {
      const slug = category.toLowerCase();
      const mapped = CATEGORY_MAP[slug];
      if (mapped) {
        result = result.filter((p: any) => mapped.includes(p.category));
      } else {
        result = result.filter((p: any) => (
          (p.category || '').toLowerCase() === slug ||
          ((p.category || '').replace(/\s+/g, '-').toLowerCase() === slug)
        ));
      }
    } else if (category === 'sale') {
      result = result.filter((p: any) => p.isSale);
    }

    if (selectedSubCategory) {
      result = result.filter(p => p.subCategory === selectedSubCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-high': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'newest': result = [...result].sort((a, b) => (a.isNew ? -1 : 1)); break;
      default: break;
    }

    return result;
  }, [category, selectedSubCategory, priceRange, sortBy, products]);

  const subCategories = useMemo(() => {
    const cats = products
      .filter(p => !category || p.category === category)
      .map(p => p.subCategory);
    return Array.from(new Set(cats));
  }, [category, products]);

  if (loading) return <div className="pt-32 text-center">Loading products...</div>;

  return (
    <div className="pt-32 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold mb-4 block">Collection</span>
          <h1 className="text-5xl md:text-6xl font-light tracking-tighter uppercase">
            {category ? category.replace('-', ' ') : 'All Collections'}
          </h1>
          <p className="text-muted text-sm mt-6 max-w-xl mx-auto italic font-serif">
            Curated pieces designed for longevity and effortless style.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center border-y border-accent py-6 mb-12">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:text-gold transition-colors"
          >
            <Filter size={14} /> Filter
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted">{filteredProducts.length} Products</span>
            <div className="relative group">
              <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                Sort By: {sortBy.replace('-', ' ')} <ChevronDown size={12} />
              </button>
              <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                <div className="bg-white border border-accent p-4 w-48 shadow-xl space-y-2">
                  {['featured', 'newest', 'price-low', 'price-high'].map(option => (
                    <button 
                      key={option}
                      onClick={() => setSortBy(option)}
                      className="block w-full text-left text-[10px] uppercase tracking-widest font-bold hover:text-gold transition-colors"
                    >
                      {option.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
            <p className="text-muted text-lg italic font-serif">No products found matching your criteria.</p>
            <button 
              onClick={() => { setSelectedSubCategory(null); setPriceRange([0, 20000]); }}
              className="text-[10px] uppercase tracking-widest font-bold border-b border-primary pb-1"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full max-w-sm bg-bg z-[110] p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-sm uppercase tracking-[0.2em] font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 space-y-12 overflow-y-auto pr-4 no-scrollbar">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-muted">Category</h4>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setSelectedSubCategory(null)}
                      className={`block text-xs uppercase tracking-widest ${!selectedSubCategory ? 'text-gold font-bold' : 'text-primary'}`}
                    >
                      All
                    </button>
                    {subCategories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedSubCategory(cat)}
                        className={`block text-xs uppercase tracking-widest ${selectedSubCategory === cat ? 'text-gold font-bold' : 'text-primary'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-muted">Price Range</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="20000" 
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-muted">Color</h4>
                  <div className="flex flex-wrap gap-3">
                    {['#111111', '#FFFFFF', '#E5D3B3', '#9CAF88', '#D2B48C', '#556B2F'].map(color => (
                      <button 
                        key={color}
                        className="w-8 h-8 rounded-full border border-accent hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-accent mt-auto">
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-primary text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collections;
