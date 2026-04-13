import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User } from '../types';

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => void;
  addToCart: (product: Product, color: string, size: string, quantity: number) => void;
  removeFromCart: (id: string, color: string, size: string) => void;
  updateCartQuantity: (id: string, color: string, size: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('luxeva_user');
    return saved ? JSON.parse(saved) : null;
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

  useEffect(() => {
    // Listen for local storage changes (login/logout from other tabs or same tab)
    const handleStorage = () => {
      const savedUser = localStorage.getItem('luxeva_user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      setUser(parsedUser);
      setIsAdmin(parsedUser?.role === 'admin');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider value={{
      cart,
      wishlist,
      user,
      isAdmin,
      loading,
      logout,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      toggleWishlist,
      isInWishlist,
      cartTotal,
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
