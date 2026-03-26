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
import { Login, SignUp } from './features/auth/Auth';
import { Account } from './pages/Account';

// Admin Imports
import AdminLayout from './features/admin/layout/AdminLayout';
import AdminDashboard from './features/admin/pages/Dashboard';
import ProductsPage from './features/products/pages/ProductsPage';
import UsersManagement from './features/admin/pages/UsersPage';
import OrdersManagement from './features/admin/pages/OrdersPage';
import AddProduct from './features/admin/pages/AddProduct';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="add-product" element={<AddProduct />} />
        </Route>
      </Routes>
    );
  }

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
          </Routes>
        </div>
      </AnimatePresence>
    </Layout>
  );
}
