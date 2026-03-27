import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Plus, Minus, Trash2, User, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AnnouncementBar = () => (
  <div className="bg-primary text-white py-2 overflow-hidden whitespace-nowrap border-b border-white/10">
    <motion.div 
      animate={{ x: [0, -1000] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="inline-block px-4 text-[10px] uppercase tracking-[0.2em] font-medium"
    >
      Free shipping on orders over ₹2000 • New Arrivals: The Spring Collection is here • 10% off your first order with code LUXEVA10 • Free shipping on orders over ₹2000 • New Arrivals: The Spring Collection is here • 10% off your first order with code LUXEVA10
    </motion.div>
  </div>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, wishlist, setIsCartOpen, user, isAdmin, logout } = useShop();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections', hasMegaMenu: true },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={cn(
      "sticky top-0 left-0 w-full z-50 transition-all duration-500",
      (isScrolled || !isHome) ? "bg-bg/95 backdrop-blur-md border-b border-accent py-4" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Left: Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="group relative">
              <Link 
                to={link.path}
                className="text-[11px] uppercase tracking-[0.2em] font-medium hover:text-gold transition-colors relative"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
              
              {link.hasMegaMenu && (
                <div className="absolute top-full left-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-bg border border-accent p-8 w-[600px] shadow-xl grid grid-cols-3 gap-8">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-muted">Shop By Category</h4>
                      <ul className="space-y-2">
                        <li><Link to="/collections/women" className="text-xs hover:text-gold">Women</Link></li>
                        <li><Link to="/collections/men" className="text-xs hover:text-gold">Men</Link></li>
                        <li><Link to="/collections/accessories" className="text-xs hover:text-gold">Accessories</Link></li>
                        <li><Link to="/collections/sale" className="text-xs text-gold font-medium">Sale</Link></li>
                      </ul>
                    </div>
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      <Link to="/collections/women" className="group/img relative aspect-[4/5] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop" alt="Women" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-[10px] uppercase tracking-widest font-bold">Women</span>
                        </div>
                      </Link>
                      <Link to="/collections/men" className="group/img relative aspect-[4/5] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=400&auto=format&fit=crop" alt="Men" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-[10px] uppercase tracking-widest font-bold">Men</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={20} />
        </button>

        {/* Center: Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2" aria-label="Luxeva home">
          <h1 className="text-2xl tracking-[0.3em] font-light uppercase">Luxeva</h1>
        </Link>

        {/* Right: Icons */}
        <div className="flex items-center gap-6">
          <Link to="/search" className="hover:text-gold transition-colors">
            <Search size={18} strokeWidth={1.5} />
          </Link>
          
          <div className="group relative">
            <Link to={user ? "/account" : "/login"} className="hover:text-gold transition-colors block">
              <User size={18} strokeWidth={1.5} />
            </Link>
            {user && (
              <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-bg border border-accent p-4 w-48 shadow-xl space-y-3">
                  <div className="pb-2 border-b border-accent">
                    <p className="text-[10px] uppercase tracking-widest font-bold truncate">{user.displayName || 'Account'}</p>
                    <p className="text-[8px] text-muted truncate">{user.email}</p>
                  </div>
                  <ul className="space-y-2">
                    {isAdmin && (
                      <li><Link to="/admin" className="text-[10px] uppercase tracking-widest text-gold font-bold hover:text-primary block">Admin Panel</Link></li>
                    )}
                    <li><Link to="/account" className="text-[10px] uppercase tracking-widest hover:text-gold block">Profile</Link></li>
                    <li><Link to="/orders" className="text-[10px] uppercase tracking-widest hover:text-gold block">Orders</Link></li>
                    <li>
                      <button 
                        onClick={() => logout()}
                        className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-600 block w-full text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <Link to="/wishlist" className="hover:text-gold transition-colors relative">
            <Heart size={18} strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="hover:text-gold transition-colors relative"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && (
              <motion.span 
                key={cartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-2 -right-2 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-bg z-[70] p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-xl tracking-widest uppercase font-light">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg uppercase tracking-widest font-light border-b border-accent pb-2"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateCartQuantity, cartTotal } = useShop();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-bg z-[110] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-accent flex justify-between items-center">
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={48} strokeWidth={1} className="text-muted" />
                  <p className="text-muted text-sm italic">Your cart is currently empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="bg-primary text-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4">
                    <div className="w-24 aspect-[3/4] bg-accent overflow-hidden">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xs uppercase tracking-wider font-bold">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                            className="text-muted hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] text-muted mt-1 uppercase tracking-widest">
                          {item.selectedColor} / {item.selectedSize}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-accent">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                            className="p-1 hover:bg-accent"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                            className="p-1 hover:bg-accent"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-xs font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-accent space-y-4">
                <div className="flex justify-between text-sm uppercase tracking-widest font-bold">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <p className="text-[10px] text-muted italic">Shipping and taxes calculated at checkout.</p>
                <Link 
                  to="/cart" 
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full text-center border border-primary py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all"
                >
                  View Full Cart
                </Link>
                <button className="w-full bg-primary text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer className="bg-bg border-t border-accent pt-20 pb-10">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
      <div className="space-y-6">
        <h2 className="text-2xl tracking-[0.3em] font-light uppercase">Luxeva</h2>
        <p className="text-muted text-sm leading-relaxed max-w-xs">
          Luxury-minimal fashion for the modern individual. Quality craftsmanship meets timeless design.
        </p>
        <div className="flex gap-4">
          {['Instagram', 'Pinterest', 'TikTok'].map(social => (
            <a key={social} href="#" className="text-[10px] uppercase tracking-widest font-bold hover:text-gold transition-colors">{social}</a>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8">Shop</h4>
        <ul className="space-y-4">
          {['New Arrivals', 'Women', 'Men', 'Accessories', 'Sale'].map(link => (
            <li key={link}><Link to="/collections" className="text-xs text-muted hover:text-primary transition-colors">{link}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8">Support</h4>
        <ul className="space-y-4">
          {['Shipping Policy', 'Returns & Exchanges', 'Size Guide', 'Contact Us', 'FAQ'].map(link => (
            <li key={link}><Link to="/contact" className="text-xs text-muted hover:text-primary transition-colors">{link}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8">Newsletter</h4>
        <p className="text-xs text-muted mb-6">Join our list for early access to new collections and exclusive offers.</p>
        <form className="flex border-b border-primary pb-2">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="bg-transparent text-xs w-full focus:outline-none"
          />
          <button type="submit" className="text-[10px] uppercase tracking-widest font-bold">Join</button>
        </form>
      </div>
    </div>
    
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-accent/50">
      <p className="text-[10px] text-muted uppercase tracking-widest">© 2026 Luxeva. All rights reserved.</p>
      <div className="flex gap-4 opacity-50 grayscale">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
      </div>
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <CartDrawer />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
