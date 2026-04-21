import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Share2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { useState } from 'react';
import { getPriceDetails } from '../utils/productUtils';
import { showSuccess, showError } from '../utils/toastService';

export const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal } = useShop();

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-6 text-center space-y-8">
        <h1 className="text-5xl font-light tracking-tighter uppercase">Your Bag is Empty</h1>
        <p className="text-muted text-sm italic font-serif">Looks like you haven't added anything to your bag yet.</p>
        <Link 
          to="/collections" 
          className="inline-block bg-primary text-white px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-light tracking-tighter uppercase mb-20 text-center">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-12">
            {cart.map((item) => (
              <motion.div 
                layout
                key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} 
                className="flex flex-col md:flex-row gap-8 pb-12 border-b border-accent"
              >
                <Link to={`/products/${item.slug}`} className="w-full md:w-40 aspect-[3/4] bg-accent overflow-hidden flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm uppercase tracking-[0.2em] font-bold">{item.name}</h3>
                        <p className="text-[10px] text-muted mt-2 uppercase tracking-widest">{item.category} / {item.subCategory}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{getPriceDetails(item).formattedCurrent}</div>
                        {getPriceDetails(item).hasDiscount && (
                          <div className="text-[10px] text-muted line-through mt-0.5">{getPriceDetails(item).formattedOriginal}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold">
                      <p>Color: <span className="text-muted">{item.selectedColor}</span></p>
                      <p>Size: <span className="text-muted">{item.selectedSize}</span></p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-8">
                    <div className="flex items-center border border-accent">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                        className="p-3 hover:bg-accent transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-6 text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                        className="p-3 hover:bg-accent transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-accent p-10 sticky top-32 space-y-8">
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold pb-6 border-b border-accent">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span className="text-muted">Shipping</span>
                  <span className="text-gold font-bold">Free</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span className="text-muted">Taxes</span>
                  <span>₹0</span>
                </div>
              </div>

              <div className="pt-6 border-t border-accent flex justify-between text-sm uppercase tracking-[0.2em] font-bold">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>

              <div className="space-y-4 pt-4">
                <Link to="/checkout" className="w-full bg-primary text-white py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors inline-block text-center">
                  Checkout Now
                </Link>
                <Link 
                  to="/collections" 
                  className="block w-full text-center border border-primary py-5 text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="pt-6 flex items-center justify-center gap-4 opacity-50 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Wishlist = () => {
  const { wishlist } = useShop();
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  const handleShare = async () => {
    setSharing(true);
    setShareError(null);
    try {
      const token = localStorage.getItem('luxeva_token');
      const res = await fetch('/api/wishlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: 'Wishlist', products: wishlist.map(p => p.id) })
      });
      if (!res.ok) throw new Error('Failed to create share link');
      const data = await res.json();
      const full = `${window.location.origin}${data.url}`;
      setShareUrl(full);
      showSuccess('Share link generated');
    } catch (err: any) {
      setShareError(err.message || 'Error');
      showError(err.message || 'Sharing failed');
    } finally {
      setSharing(false);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="pt-40 pb-20 container mx-auto px-6 text-center space-y-8">
        <h1 className="text-5xl font-light tracking-tighter uppercase">Your Wishlist is Empty</h1>
        <p className="text-muted text-sm italic font-serif">Save your favorite items to view them later.</p>
        <Link 
          to="/collections" 
          className="inline-block bg-primary text-white px-12 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-light tracking-tighter uppercase">Wishlist</h1>
          <div className="flex items-center gap-4">
            {shareUrl ? (
              <div className="flex items-center gap-2">
                <a href={shareUrl} target="_blank" rel="noreferrer" className="text-sm underline">Open Link</a>
                <button onClick={() => navigator.clipboard.writeText(shareUrl)} className="text-sm bg-primary text-white px-4 py-2">Copy</button>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="text-sm bg-sky-600 text-white px-4 py-2">Twitter</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="text-sm bg-blue-700 text-white px-4 py-2">Facebook</a>
              </div>
            ) : (
              <button onClick={handleShare} disabled={sharing || wishlist.length===0} className="flex items-center gap-2 bg-primary text-white px-4 py-2">
                <Share2 size={14} /> Share Wishlist
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {wishlist.map(product => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
