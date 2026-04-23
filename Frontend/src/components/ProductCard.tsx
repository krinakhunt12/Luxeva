import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getOfferLabel, getPriceDetails } from '../utils/productUtils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const inWishlist = isInWishlist((product as any).id || (product as any)._id);
  const navigate = useNavigate();
  const stock = product.stock ?? 0;
  const available = stock > 0;
  const isLowStock = stock > 0 && stock <= 10;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!available) return;
    const colors = (product as any).variants?.colors;
    const sizes = (product as any).variants?.sizes;
    if (!colors?.length || !sizes?.length) return;
    addToCart(product, colors[0].name, sizes[0], 1);
    navigate('/cart');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!available) return;
    const colors = (product as any).variants?.colors;
    const sizes = (product as any).variants?.sizes;
    if (!colors?.length || !sizes?.length) {
      addToCart(product, undefined as any, undefined as any, 1);
      return;
    }
    addToCart(product, colors[0].name, sizes[0], 1);
    navigate('/cart');
  };

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const closeQuickView = () => setShowQuickView(false);

  // derive image sources safely (support data URLs, full URLs, or image hash)
  const getImageSrc = (src: any) => {
    if (!src) return null;
    if (typeof src !== 'string') return null;
    if (src.startsWith('data:') || src.startsWith('http')) return src;
    // assume hash
    return `/api/images/${src}`;
  };

  const mainSrc = getImageSrc((product as any).image || (product as any).images?.[0]);
  const altSrc = getImageSrc((product as any).images?.[1]);

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link to={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-accent">
        <img 
          src={mainSrc || '/placeholder.png'}
          alt={product.name} 
          className={cn(
            "w-full h-full object-cover transition-all duration-1000 ease-out",
            isHovered && altSrc ? "opacity-0 scale-110" : "opacity-100 scale-100"
          )}
        />
        {altSrc && (
          <img 
            src={altSrc} 
            alt={`${product.name} alternate`} 
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out",
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
            )}
          />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-white text-primary text-[8px] uppercase tracking-widest font-bold px-2 py-1 shadow-sm">New</span>
          )}
          {getOfferLabel(product) && (
            <span className="bg-gold text-white text-[8px] uppercase tracking-widest font-bold px-2 py-1 shadow-sm">
              {getOfferLabel(product)}
            </span>
          )}
          {product.isSale && !getOfferLabel(product) && (
            <span className="bg-gold text-white text-[8px] uppercase tracking-widest font-bold px-2 py-1 shadow-sm">Sale</span>
          )}
          {isLowStock && (
            <span className="bg-red-500 text-white text-[8px] uppercase tracking-widest font-bold px-2 py-1 shadow-sm">Only {stock} Left</span>
          )}
        </div>

        {/* Quick View Toggle (right-most) */}
        <button
          onClick={openQuickView}
          aria-label="Quick view"
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 text-primary hover:text-gold"
        >
          <Eye size={16} strokeWidth={1.5} />
        </button>

        {/* Wishlist Toggle (left of quick view) */}
        <button 
          onClick={handleWishlist}
          className={cn(
            "absolute top-4 right-13 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300",
            inWishlist ? "text-red-500 scale-110" : "text-primary hover:text-gold"
          )}
        >
          <Heart size={16} fill={inWishlist ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>

        {/* Quick Add Button */}
        <AnimatePresence>
          {isHovered && available && (
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={handleAddToCart}
              className="absolute bottom-4 left-4 right-4 bg-white text-primary py-3 text-[12px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} />
              Add to cart
            </motion.button>
          )}
        </AnimatePresence>

        {/* Out of Stock Overlay */}
        {!available && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold border border-primary px-4 py-2 bg-white">Sold Out</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-start">
          <Link to={`/products/${product.slug}`} className="text-sm md:text-lg font-semibold hover:text-gold transition-colors">
            {product.name}
          </Link>
        </div>
        <p className="text-[10px] text-muted uppercase tracking-widest">{product.subCategory}</p>
        <p
          className="text-sm text-muted"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2 as any,
            WebkitBoxOrient: 'vertical' as any,
            overflow: 'hidden',
          }}
        >
          {(product as any).description || ''}
        </p>
        <div className="flex gap-2 items-center flex-wrap">
          <span className={cn("text-lg font-semibold", getPriceDetails(product).hasDiscount && "text-gold")}>
            {getPriceDetails(product).formattedCurrent}
          </span>
          {getPriceDetails(product).hasDiscount && (
            <span className="text-sm text-muted line-through">
              {getPriceDetails(product).formattedOriginal}
            </span>
          )}
        </div>

      </div>
    </motion.div>

    {/* Quick View Modal */}
    <AnimatePresence>
      {showQuickView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-3xl bg-white rounded shadow-xl overflow-hidden"
          >
            <div className="flex justify-between items-start p-4 border-b">
              <h3 className="text-lg font-bold">{product.name}</h3>
              <button onClick={closeQuickView} className="p-2 text-muted">
                <X />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <img src={mainSrc || '/placeholder.png'} alt={product.name} className="w-full h-96 object-cover rounded" />
              </div>
              <div>
                <p className="text-sm text-muted mb-4">{product.subCategory}</p>
                <div className="flex gap-3 items-center mb-4">
                  <p className="text-2xl font-semibold">{getPriceDetails(product).formattedCurrent}</p>
                  {getPriceDetails(product).hasDiscount && (
                    <p className="text-lg text-muted line-through">{getPriceDetails(product).formattedOriginal}</p>
                  )}
                </div>
                <p className="text-sm text-muted mb-6">{(product as any).description || 'No description available.'}</p>
                <div className="flex gap-2">
                  <button onClick={handleAddToCart} disabled={!available} className="bg-primary text-white px-4 py-2 rounded">
                    Add to cart
                  </button>
                  <button onClick={handleWishlist} className="border px-4 py-2 rounded">{inWishlist ? 'Remove' : 'Wishlist'}</button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};
