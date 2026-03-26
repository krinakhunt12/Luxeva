import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, product.variants.colors[0].name, product.variants.sizes[0], 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
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
          src={product.images[0]} 
          alt={product.name} 
          className={cn(
            "w-full h-full object-cover transition-all duration-1000 ease-out",
            isHovered && product.images[1] ? "opacity-0 scale-110" : "opacity-100 scale-100"
          )}
        />
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={`${product.name} alternate`} 
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out",
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
            )}
          />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-white text-primary text-[8px] uppercase tracking-widest font-bold px-2 py-1">New</span>
          )}
          {product.isSale && (
            <span className="bg-gold text-white text-[8px] uppercase tracking-widest font-bold px-2 py-1">Sale</span>
          )}
        </div>

        {/* Wishlist Toggle */}
        <button 
          onClick={handleWishlist}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300",
            inWishlist ? "text-red-500 scale-110" : "text-primary hover:text-gold"
          )}
        >
          <Heart size={16} fill={inWishlist ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>

        {/* Quick Add Button */}
        <AnimatePresence>
          {isHovered && product.inStock && (
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={handleQuickAdd}
              className="absolute bottom-4 left-4 right-4 bg-white text-primary py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} />
              Quick Add
            </motion.button>
          )}
        </AnimatePresence>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold border border-primary px-4 py-2 bg-white">Sold Out</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-start">
          <Link to={`/products/${product.slug}`} className="text-[11px] uppercase tracking-widest font-bold hover:text-gold transition-colors">
            {product.name}
          </Link>
        </div>
        <p className="text-[10px] text-muted uppercase tracking-widest">{product.subCategory}</p>
        <div className="flex gap-2 items-center">
          <span className={cn("text-xs font-medium", product.originalPrice && "text-gold")}>
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] text-muted line-through">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
