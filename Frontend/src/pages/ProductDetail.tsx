import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Plus, Minus, ChevronRight, ChevronLeft, ChevronDown, Check, Ruler, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductBySlug } from '../features/products/api/productsApi';
import useProducts from '../features/products/hooks/useProducts';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Skeleton from '../components/ui/Skeleton';
import { deriveImagesByColor } from '../utils/productUtils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [selectedImage, setSelectedImage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('description');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const fetchedProduct = await getProductBySlug(slug);
        setError(null);
        setProduct(fetchedProduct);
        setSelectedColor(fetchedProduct.variants?.colors?.[0]?.name || '');
        setSelectedSize(fetchedProduct.variants?.sizes?.[0] || '');
        setSelectedImage(0);
        setDirection(0);
        setQuantity(1);
        window.scrollTo(0, 0);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const { data: products = [] } = useProducts();

  // images currently shown in gallery for selected color (fallback to product.images)
  let currentImages: string[] = [];
  if (product) {
    currentImages = product.imagesByColor?.[selectedColor] || (product as any).variantImages?.[selectedColor] || [];
    // if backend doesn't provide color-specific images, try deriving from filenames
    if ((!currentImages || currentImages.length === 0) && product.images) {
      const derived = deriveImagesByColor(product);
      if (derived[selectedColor] && derived[selectedColor].length) currentImages = derived[selectedColor];
      else if (derived.__default && derived.__default.length) currentImages = derived.__default;
    }
    if (!currentImages || currentImages.length === 0) currentImages = product.images || [];
  }

  // Poll for product changes / deletion while on the page.
  useEffect(() => {
    if (!slug) return;
    const interval = setInterval(async () => {
      try {
        const fetched = await getProductBySlug(slug);
        // if fetch succeeded but there is no product, treat as not found
        if (!fetched) {
          setProduct(null);
          setError('Product not found.');
          return;
        }
        // update product if changed
        setProduct((prev) => {
          try {
            if (!prev) return fetched;
            if ((prev.id || (prev as any)._id) !== (fetched.id || (fetched as any)._id)) return fetched;
            const prevStr = JSON.stringify(prev);
            const newStr = JSON.stringify(fetched);
            return prevStr === newStr ? prev : fetched;
          } catch (e) {
            return fetched;
          }
        });
        setError(null);
      } catch (err) {
        // likely 404 or deleted
        setProduct(null);
        setError('Product not found.');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [slug]);

  if (loading) return (
    <div className="pt-32 pb-20 bg-bg">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <Skeleton count={1} lines={1} className="h-[480px] bg-accent" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Skeleton lines={4} count={1} />
          </div>
        </div>
      </div>
    </div>
  );
  if (error || !product) return <div className="pt-40 text-center">{error || 'Product not found.'}</div>;

  const nextImage = () => {
    setDirection(1);
    setSelectedImage((prev) => (prev + 1) % Math.max(1, currentImages.length));
  };

  const prevImage = () => {
    setDirection(-1);
    setSelectedImage((prev) => (prev - 1 + Math.max(1, currentImages.length)) % Math.max(1, currentImages.length));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    })
  };

  const handleAddToCart = () => {
    const available = product?.stockByVariant?.[selectedColor]?.[selectedSize] ?? product?.stock ?? (product?.inStock ? 1 : 0);
    if (!available || available < 1) return;
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  const availableStock = product?.stockByVariant?.[selectedColor]?.[selectedSize] ?? product?.stock ?? 0;

  const discountPercent = product?.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : (product?.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0);

  const relatedProducts = (products || [])
    .filter((p: any) => p.category === product.category && (p.id || p._id) !== (product.id || product._id))
    .slice(0, 4);

  const accordions = [
    { id: 'description', title: 'Description', content: product.description },
    { id: 'shipping', title: 'Shipping & Returns', content: 'Free standard shipping on all orders over ₹2000. Returns accepted within 30 days of purchase.' },
    { id: 'care', title: 'Care Instructions', content: 'Dry clean only. Store in a cool, dry place. Avoid direct sunlight for extended periods.' },
  ];

  return (
    <div className="pt-32 pb-20 bg-bg">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted mb-12">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to={`/collections/${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={10} />
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar">
              {currentImages.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setDirection(i > selectedImage ? 1 : -1);
                    setSelectedImage(i);
                  }}
                  className={cn(
                    "w-20 aspect-[3/4] flex-shrink-0 border transition-all duration-300",
                    selectedImage === i ? "border-primary opacity-100" : "border-transparent opacity-50"
                  )}
                >
                    <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="order-1 md:order-2 flex-1 aspect-[3/4] bg-accent overflow-hidden relative group">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img 
                  key={selectedImage}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.6 }
                  }}
                  src={currentImages[selectedImage]}
                  alt={product.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Slider Controls */}
              {currentImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {currentImages.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setDirection(i > selectedImage ? 1 : -1);
                      setSelectedImage(i);
                    }}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      selectedImage === i ? "bg-primary w-4" : "bg-primary/30 hover:bg-primary/60"
                    )}
                  />
                ))}
              </div>

              {product.isSale && (
                <span className="absolute top-6 left-6 bg-gold text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 z-10">Sale</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase leading-tight">{product.name}</h1>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    "p-3 rounded-full border border-accent hover:border-gold transition-all duration-300",
                    isInWishlist(product.id) ? "text-red-500 bg-red-50" : "text-primary bg-white"
                  )}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-2xl font-light tracking-tight">₹{product.price}</div>
                  {product.originalPrice && (
                    <div className="text-lg text-muted line-through font-light">MRP ₹{product.originalPrice} • {discountPercent}% off</div>
                  )}
                  {product.salePrice && (
                    <div className="text-sm text-muted">Sale Price: ₹{product.salePrice}</div>
                  )}
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed italic font-serif max-w-md">
                {(product.description || '').split('.')[0]}{product.description ? '.' : ''}
              </p>
            </div>

            {/* Variants */}
            <div className="space-y-8">
              {/* Colors */}
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                  <span>Color: <span className="text-muted">{selectedColor}</span></span>
                </div>
                <div className="flex gap-3">
                  {(product.variants?.colors || []).map(color => (
                    <button 
                      key={color.name}
                      onClick={() => { setSelectedColor(color.name); setSelectedImage(0); }}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 p-1 transition-all duration-300",
                        selectedColor === color.name ? "border-primary scale-110" : "border-transparent"
                      )}
                    >
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                  <span>Size: <span className="text-muted">{selectedSize}</span></span>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1 hover:text-gold transition-colors"
                  >
                    <Ruler size={12} /> Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {(product.variants?.sizes || []).map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[60px] h-12 border text-xs uppercase tracking-widest font-bold transition-all duration-300",
                        selectedSize === size ? "bg-primary text-white border-primary" : "bg-white text-primary border-accent hover:border-primary"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest font-bold">Quantity</span>
                <div className="text-sm text-muted">{availableStock > 0 ? `${availableStock} left in selected color/size` : 'Out of stock for selected color/size'}</div>
                <div className="flex items-center border border-accent w-max">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 hover:bg-accent transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-8 text-sm font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(availableStock || quantity + 1, quantity + 1))}
                    className="p-4 hover:bg-accent transition-colors"
                    disabled={availableStock <= quantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  "w-full py-5 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 flex items-center justify-center gap-3",
                  product.inStock ? "bg-primary text-white hover:bg-gold" : "bg-accent text-muted cursor-not-allowed"
                )}
              >
                <ShoppingBag size={16} />
                {product.inStock ? 'Add to Bag' : 'Out of Stock'}
              </button>
              <button className="w-full border border-primary py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-primary hover:text-white transition-all duration-500">
                Buy It Now
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-accent pt-6 space-y-4">
              {accordions.map(acc => (
                <div key={acc.id} className="border-b border-accent pb-4">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === acc.id ? null : acc.id)}
                    className="w-full flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-left"
                  >
                    {acc.title}
                    <ChevronDown size={14} className={cn("transition-transform duration-300", activeAccordion === acc.id && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {activeAccordion === acc.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-muted leading-relaxed pt-4 italic font-serif">
                          {acc.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recently Viewed / Related */}
        <div className="mt-40">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold mb-4 block">You May Also Like</span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight italic font-serif">Complete The Look</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {relatedProducts.map((p, i) => {
              const key = p.id ?? (p as any)._id ?? p.slug ?? `${p.name}-${i}`;
              return <ProductCard key={key} product={p} />;
            })}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-bg z-[210] p-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl uppercase tracking-[0.2em] font-light">Size Guide</h2>
                <button onClick={() => setIsSizeGuideOpen(false)}>
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] uppercase tracking-widest text-left">
                  <thead>
                    <tr className="border-b border-accent">
                      <th className="py-4 font-bold">Size</th>
                      <th className="py-4 font-bold">Bust (cm)</th>
                      <th className="py-4 font-bold">Waist (cm)</th>
                      <th className="py-4 font-bold">Hips (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    <tr className="border-b border-accent/50">
                      <td className="py-4">XS</td>
                      <td className="py-4">80-84</td>
                      <td className="py-4">62-66</td>
                      <td className="py-4">88-92</td>
                    </tr>
                    <tr className="border-b border-accent/50">
                      <td className="py-4">S</td>
                      <td className="py-4">84-88</td>
                      <td className="py-4">66-70</td>
                      <td className="py-4">92-96</td>
                    </tr>
                    <tr className="border-b border-accent/50">
                      <td className="py-4">M</td>
                      <td className="py-4">88-92</td>
                      <td className="py-4">70-74</td>
                      <td className="py-4">96-100</td>
                    </tr>
                    <tr className="border-b border-accent/50">
                      <td className="py-4">L</td>
                      <td className="py-4">92-96</td>
                      <td className="py-4">74-78</td>
                      <td className="py-4">100-104</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[8px] text-muted mt-8 italic">Measurements are in centimeters. For more help, contact our support team.</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky ATC Bar */}
      <AnimatePresence>
        {product.inStock && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 w-full bg-white border-t border-accent p-4 z-40 lg:hidden"
          >
            <button 
              onClick={handleAddToCart}
              className="w-full bg-primary text-white py-4 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-3"
            >
              <ShoppingBag size={14} /> Add to Bag — ₹{product.price}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const X = ({ size, strokeWidth }: { size: number, strokeWidth: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export default ProductDetail;
