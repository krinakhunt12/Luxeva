import React, { useState, useEffect } from 'react';
import ScrollToTop from './ScrollToTop';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Plus, Minus, Trash2, User, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import useOffers from '../features/offers/hooks/useOffers';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const AnnouncementBar = () => {
  const [bannerText, setBannerText] = useState<string | null>(null);
  const { data: offers = [] } = useOffers();
  useEffect(() => {
    const now = Date.now();
    const soon = (offers || []).find((o: any) => o.active && o.endsAt && (new Date(o.endsAt).getTime() - now) <= 48 * 60 * 60 * 1000 && (new Date(o.endsAt).getTime() - now) > 0);
    if (soon) {
      const msLeft = new Date(soon.endsAt).getTime() - now;
      const hours = Math.ceil(msLeft / (1000 * 60 * 60));
      setBannerText(`${soon.title} — ends in ${hours} hour${hours > 1 ? 's' : ''}! ${soon.discountType === 'percentage' ? soon.amount + '% off' : 'Flat ₹' + soon.amount + ' off'}`);
    }
  }, [offers]);

  const content = bannerText || 'Free shipping on orders over ₹2000 • New Arrivals: The Spring Collection is here • 10% off your first order with code LUXEVA10';

  return (
    <div className="bg-primary text-white py-2 overflow-hidden whitespace-nowrap border-b border-white/10">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="inline-block px-4 text-[10px] uppercase tracking-[0.2em] font-medium"
      >
        {content} • {content}
      </motion.div>
    </div>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, wishlist, setIsCartOpen, user, isAdmin, logout } = useShop();
  const navigate = useNavigate();
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
          
          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm uppercase tracking-widest px-3 py-2 hover:text-gold transition-colors">Login</Link>
              <Link to="/signup" className="text-sm uppercase tracking-widest px-3 py-2 bg-primary text-white rounded hover:bg-gold transition-colors">Sign Up</Link>
            </div>
          ) : (
            <div className="group relative">
              <Link to="/account" className="hover:text-gold transition-colors block">
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
          )}

          <Link to="/wishlist" className="hover:text-gold transition-colors relative">
            <Heart size={18} strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button 
            onClick={() => navigate('/cart')}
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

/* Cart drawer removed — cart now uses a dedicated `/cart` page. */

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
          <li><Link to="/shipping" className="text-xs text-muted hover:text-primary transition-colors">Shipping Policy</Link></li>
          <li><Link to="/returns" className="text-xs text-muted hover:text-primary transition-colors">Returns & Exchanges</Link></li>
          <li><Link to="/size-guide" className="text-xs text-muted hover:text-primary transition-colors">Size Guide</Link></li>
          <li><Link to="/contact" className="text-xs text-muted hover:text-primary transition-colors">Contact Us</Link></li>
          <li><Link to="/faq" className="text-xs text-muted hover:text-primary transition-colors">FAQ</Link></li>
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
    <div className="min-h-screen flex flex-col relative">
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
