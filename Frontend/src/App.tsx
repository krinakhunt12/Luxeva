import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import { Cart, Wishlist } from './pages/CartWishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import { Search } from './pages/StaticPages';
import { Login, SignUp } from './pages/Auth';
import { Account } from './pages/Account';
import { Admin } from './pages/Admin';

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:category" element={<Collections />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<Account />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </AnimatePresence>
    </Layout>
  );
}
