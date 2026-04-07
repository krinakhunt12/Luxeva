import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User } from '../types';

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => void;
  updateUserProfile?: (updates: Partial<User>) => Promise<void>;
  deleteAccount?: () => Promise<boolean>;
  clearCart: () => void;
  addToCart: (product: Product, color: string, size: string, quantity: number) => void;
  removeFromCart: (id: string, color: string, size: string) => void;
  updateCartQuantity: (id: string, color: string, size: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  cartTotal: number;
  offers: any[];
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('luxeva_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // normalize displayName from various backend shapes
      const displayName = parsed.displayName || parsed.name || `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim();
      return { ...parsed, displayName };
    } catch (e) {
      return null;
    }
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    // Determine admin from stored user role provided by backend
    return user?.role === 'admin';
  });
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('luxeva_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxeva_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);

  useEffect(() => {
    // Listen for local storage changes (login/logout from other tabs or same tab)
    const handleStorage = () => {
      const savedUser = localStorage.getItem('luxeva_user');
      if (!savedUser) {
        setUser(null);
        setIsAdmin(false);
        return;
      }
      try {
        const parsed = JSON.parse(savedUser);
        const displayName = parsed.displayName || parsed.name || `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim();
        const normalized = { ...parsed, displayName };
        setUser(normalized);
        setIsAdmin(normalized?.role === 'admin');
      } catch (e) {
        setUser(null);
        setIsAdmin(false);
      }
    };
    window.addEventListener('storage', handleStorage);
    // Also listen for a custom event dispatched in the same tab when login/signup updates localStorage
    window.addEventListener('luxeva:user-changed', handleStorage as EventListener);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/offers');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setOffers(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem('luxeva_cart', JSON.stringify(cart));
  }, [cart]);

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.setItem('luxeva_cart', JSON.stringify([]));
    } catch (e) {
      // ignore
    }
    // ensure cart drawer is closed when clearing
    setIsCartOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('luxeva_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product, color: string, size: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedColor === color && 
        item.selectedSize === size
      );

      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedColor === color && item.selectedSize === size)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, selectedColor: color, selectedSize: size, quantity }];
    });
    setIsCartOpen(true);
  };

  const logout = () => {
    localStorage.removeItem('luxeva_user');
    localStorage.removeItem('luxeva_token');
    setUser(null);
    setIsAdmin(false);
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    const stored = localStorage.getItem('luxeva_user');
    const current = stored ? JSON.parse(stored) : user;
    if (!current) throw new Error('Not authenticated');
    const id = current.id || current.uid || current._id;
    if (!id) throw new Error('User id not found');
    const token = localStorage.getItem('luxeva_token');
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update profile');
    }
    const updatedRaw = await res.json();
    const displayName = updatedRaw.displayName || updatedRaw.name || `${updatedRaw.firstName || ''} ${updatedRaw.lastName || ''}`.trim();
    const updated = { ...updatedRaw, displayName };
    setUser(updated as User);
    try { localStorage.setItem('luxeva_user', JSON.stringify(updated));
      // notify other parts of the app that user changed
      window.dispatchEvent(new Event('luxeva:user-changed'));
    } catch (e) {}
    setIsAdmin((updated as any).role === 'admin');
  };

  const deleteAccount = async () => {
    const stored = localStorage.getItem('luxeva_user');
    const current = stored ? JSON.parse(stored) : user;
    if (!current) throw new Error('Not authenticated');
    const id = current.id || current.uid || current._id;
    if (!id) throw new Error('User id not found');
    const token = localStorage.getItem('luxeva_token');
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE', headers: { Authorization: token ? `Bearer ${token}` : '' } });
    if (!res.ok) return false;
    // clear local data
    logout();
    return true;
  };

  const removeFromCart = (id: string, color: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedColor === color && item.selectedSize === size)));
  };

  const updateCartQuantity = (id: string, color: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      (item.id === id && item.selectedColor === color && item.selectedSize === size)
        ? { ...item, quantity }
        : item
    ));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  const getBestDiscountForItem = (item: CartItem) => {
    if (!offers || offers.length === 0) return 0;
    const now = Date.now();
    const applicable = offers.filter((o: any) => {
      if (!o.active) return false;
      if (o.startsAt && new Date(o.startsAt).getTime() > now) return false;
      if (o.endsAt && new Date(o.endsAt).getTime() < now) return false;
      if (o.appliesTo === 'all') return true;
      if (o.appliesTo === 'product' && o.productId) return String(o.productId) === String(item.id);
      return false;
    });

    let maxSaving = 0;
    applicable.forEach((o: any) => {
      let saving = 0;
      if (o.discountType === 'percentage') saving = item.price * (Number(o.amount) / 100);
      else saving = Number(o.amount || 0);
      if (saving > maxSaving) maxSaving = saving;
    });
    return Math.min(maxSaving, item.price); // never exceed item price
  };

  const cartTotal = cart.reduce((total, item) => {
    const discount = getBestDiscountForItem(item);
    const priceAfter = Math.max(0, item.price - discount);
    return total + priceAfter * item.quantity;
  }, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider value={{
      cart,
      wishlist,
      user,
      isAdmin,
      loading,
      logout,
      updateUserProfile,
      clearCart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      toggleWishlist,
      isInWishlist,
      cartTotal,
      offers,
      cartCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
