import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, removeToken } from '../utils/apiClient';
import useOffers from '../features/offers/hooks/useOffers';
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
  const getUserId = (u: User | null | undefined) => {
    const current = u || user;
    return current ? (current.id || (current as any)._id || (current as any).uid) : undefined;
  };

  const storageKey = (base: string, u?: User | null) => {
    const id = getUserId(u);
    return id ? `${base}_${id}` : `${base}_guest`;
  };
  const [isAdmin, setIsAdmin] = useState(() => {
    // Determine admin from stored user role provided by backend
    return user?.role === 'admin';
  });
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const key = storageKey('luxeva_cart');
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const key = storageKey('luxeva_wishlist');
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: offers = [], isLoading: offersLoading } = useOffers();

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

  // When the user changes (login/logout/switch), load their cart and wishlist
  useEffect(() => {
    const cartKey = storageKey('luxeva_cart', user);
    const wishKey = storageKey('luxeva_wishlist', user);
    try {
      const savedCart = localStorage.getItem(cartKey);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } catch (e) {
      setCart([]);
    }
    try {
      const savedWish = localStorage.getItem(wishKey);
      setWishlist(savedWish ? JSON.parse(savedWish) : []);
    } catch (e) {
      setWishlist([]);
    }
  }, [user]);


  useEffect(() => {
    localStorage.setItem('luxeva_cart', JSON.stringify(cart));
    // send cart snapshot for abandoned cart recovery when user is authenticated
    const sendSnapshot = async () => {
      try {
        const token = localStorage.getItem('luxeva_token');
        if (!token) return;
        const payload = { userId: user?.id, email: user?.email, cart: cart.map(i => ({ productId: i.id, name: i.name, slug: i.slug, price: i.price, quantity: i.quantity, selectedColor: i.selectedColor, selectedSize: i.selectedSize })) };
        await fetch('/api/abandoned', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        // ignore
      }
    };
    sendSnapshot();
  }, [cart]);

  useEffect(() => {
    try {
      const key = storageKey('luxeva_wishlist', user);
      localStorage.setItem(key, JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist, user]);

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
  };

  const logout = () => {
    localStorage.removeItem('luxeva_user');
    removeToken();
    setUser(null);
    setIsAdmin(false);
    // clear UI state
    setCart([]);
    setWishlist([]);
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    const stored = localStorage.getItem('luxeva_user');
    const current = stored ? JSON.parse(stored) : user;
    if (!current) throw new Error('Not authenticated');
    const id = current.id || current.uid || current._id;
    if (!id) throw new Error('User id not found');
    const token = localStorage.getItem('luxeva_token');
    const updatedRaw = await apiFetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
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
    const res = await apiFetch(`/api/users/${id}`, { method: 'DELETE' }).catch(() => null);
    if (!res) return false;
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

  const clearCart = () => {
    setCart([]);
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

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.price || 0) * item.quantity;
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
