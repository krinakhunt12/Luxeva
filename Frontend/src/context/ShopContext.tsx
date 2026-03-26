import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface ShopContextType {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.role === 'admin' || currentUser.email === 'khuntkrina7@gmail.com');
          } else {
            setIsAdmin(currentUser.email === 'khuntkrina7@gmail.com');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setIsAdmin(currentUser.email === 'khuntkrina7@gmail.com');
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('luxeva_cart', JSON.stringify(cart));
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

  const removeFromCart = (id: string, color: string, size: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === id && item.selectedColor === color && item.selectedSize === size)
    ));
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

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
