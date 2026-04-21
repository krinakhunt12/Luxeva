import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './pages/ErrorPage';
import AdminLogin from './features/admin/AdminLogin';
import { AnimatePresence } from 'motion/react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import { Cart, Wishlist } from './pages/CartWishlist';
import WishlistShare from './pages/WishlistShare';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import { Search, ShippingPolicy, ReturnsPolicy, SizeGuidePage, FAQ, PrivacyPolicy, RefundPolicy, Locations, TermsPage } from './pages/StaticPages';
import { Login, SignUp } from './features/auth/Auth';
import { Account } from './pages/Account';
import { OrdersPage } from './features/orders/pages/OrdersPage';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './pages/Settings';

// Admin Imports
import AdminLayout from './features/admin/layout/AdminLayout';
import AdminDashboard from './features/admin/pages/Dashboard';
import ProductsPage from './features/products/pages/ProductsPage';
import OffersPage from './features/admin/pages/OffersPage';
import UsersManagement from './features/admin/pages/UsersPage';
import OrdersManagement from './features/admin/pages/OrdersPage';
import AddProduct from './features/admin/pages/AddProduct';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const currentUser = JSON.parse(localStorage.getItem('luxeva_user') || 'null');
  const isAdmin = currentUser && currentUser.role === 'admin';

  if (isAdminRoute && !isAdmin) {
    // Allow access to admin login page; otherwise redirect to admin-specific login
    if (location.pathname === '/admin/login') {
      return (
        <ErrorBoundary>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </ErrorBoundary>
      );
    }
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (isAdminRoute) {
    return (
      <ErrorBoundary>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="add-product" element={<AddProduct />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    );
  }

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthRoute) {
    return (
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            <Routes location={location}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AnimatePresence>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Layout>
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:category" element={<Collections />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/wishlists/:token" element={<WishlistShare />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping" element={<ShippingPolicy />} />
            <Route path="/returns" element={<ReturnsPolicy />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<ErrorPage message="Page not found." />} />
          </Routes>
        </div>
      </AnimatePresence>
    </Layout>
    </ErrorBoundary>
  );
}
