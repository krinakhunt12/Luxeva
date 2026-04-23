import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  Edit2,
  Package,
  Users,
  ShoppingBag,
  LayoutDashboard,
  X,
  Save,
  Loader2,
  Search,
  MessageSquare,
  CheckCircle,
  Eye
} from 'lucide-react';
import { Product, User } from '../types';
import Skeleton from '../components/ui/Skeleton';
import OfferForm from '../features/admin/OfferForm';
import OffersList from '../features/admin/OffersList';
import AbandonedCarts from '../features/admin/AbandonedCarts';
import LowStock from '../features/admin/LowStock';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../features/products/hooks/useProducts';
import { useUsers, useUpdateUser } from '../features/user/hooks/useUser';
import { useAdminStats, useRecentOrders, DashboardStats as DashboardStatsType, RecentOrder, RevenueTrend } from '../features/admin/hooks/useAdminDashboard';
import { useContacts, useDeleteContact, useResolveContact, ContactSubmission } from '../features/contact/hooks/useContact';
import Sidebar from '../features/admin/components/Sidebar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DashboardStats = ({ stats, loading }: { stats?: DashboardStatsType, loading: boolean }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-white border border-accent p-8 space-y-2">
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Total Products</p>
      {loading ? <Skeleton className="h-10 w-20" /> : <p className="text-4xl font-light">{stats?.totalProducts || 0}</p>}
    </div>
    <div className="bg-white border border-accent p-8 space-y-2">
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Total Users</p>
      {loading ? <Skeleton className="h-10 w-20" /> : <p className="text-4xl font-light">{stats?.totalUsers || 0}</p>}
    </div>
    <div className="bg-white border border-accent p-8 space-y-2">
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Total Orders</p>
      {loading ? <Skeleton className="h-10 w-20" /> : <p className="text-4xl font-light">{stats?.totalOrders || 0}</p>}
    </div>
    <div className="bg-white border border-accent p-8 space-y-2">
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Total Revenue</p>
      {loading ? <Skeleton className="h-10 w-32" /> : <p className="text-4xl font-light">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>}
    </div>
  </div>
);

const RevenueChart = ({ data }: { data: RevenueTrend[] }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="bg-white border border-accent p-8 space-y-8">
      <h3 className="text-[10px] uppercase tracking-widest font-bold">Revenue Trend (Last 7 Days)</h3>
      <div className="h-64 flex items-end gap-4">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full relative">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                className="bg-primary/10 group-hover:bg-primary/20 transition-colors w-full"
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ₹{d.revenue.toLocaleString()}
              </div>
            </div>
            <span className="text-[8px] uppercase tracking-widest text-muted">{d.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentInquiries = ({ contacts, loading, onView, onViewAll }: { contacts: ContactSubmission[], loading: boolean, onView: (c: ContactSubmission) => void, onViewAll: () => void }) => (
  <div className="bg-white border border-accent overflow-hidden">
    <div className="p-6 border-b border-accent flex justify-between items-center">
      <h3 className="text-[10px] uppercase tracking-widest font-bold">Recent Inquiries</h3>
      <button
        onClick={onViewAll}
        className="text-[8px] uppercase tracking-widest font-bold text-gold hover:text-primary transition-colors"
      >
        View All
      </button>
    </div>
    <div className="divide-y divide-accent">
      {loading ? (
        [...Array(3)].map((_, i) => (
          <div key={i} className="p-4"><Skeleton className="h-10 w-full" /></div>
        ))
      ) : contacts.length === 0 ? (
        <div className="p-10 text-center text-[10px] uppercase tracking-widest text-muted italic">No inquiries yet</div>
      ) : (
        contacts.slice(0, 5).map((c) => (
          <div key={c._id} className="p-4 flex justify-between items-center hover:bg-accent/10 transition-colors">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest">{c.name}</p>
              <p className="text-[8px] text-muted truncate max-w-[200px]">{c.message}</p>
            </div>
            <button
              onClick={() => onView(c)}
              className="p-2 text-muted hover:text-primary transition-colors"
            >
              <Eye size={14} />
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);

const RecentOrders = ({ orders, loading }: { orders: RecentOrder[], loading: boolean }) => (
  <div className="bg-white border border-accent overflow-hidden">
    <div className="p-6 border-b border-accent flex justify-between items-center">
      <h3 className="text-[10px] uppercase tracking-widest font-bold">Recent Orders</h3>
      <button className="text-[8px] uppercase tracking-widest font-bold text-gold hover:text-primary transition-colors">View All</button>
    </div>
    <table className="w-full text-left">
      <thead className="bg-accent/30 border-b border-accent">
        <tr>
          <th className="p-4 text-[8px] uppercase tracking-widest font-bold">Order ID</th>
          <th className="p-4 text-[8px] uppercase tracking-widest font-bold">Date</th>
          <th className="p-4 text-[8px] uppercase tracking-widest font-bold">Amount</th>
          <th className="p-4 text-[8px] uppercase tracking-widest font-bold">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-accent">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <tr key={i}>
              <td colSpan={4} className="p-4"><Skeleton className="h-4 w-full" /></td>
            </tr>
          ))
        ) : orders.length === 0 ? (
          <tr>
            <td colSpan={4} className="p-12 text-center text-[10px] uppercase tracking-widest text-muted italic">No orders yet</td>
          </tr>
        ) : (
          orders.map((order) => (
            <tr key={order._id} className="hover:bg-accent/10 transition-colors">
              <td className="p-4 text-[10px] font-mono text-muted uppercase">#{order._id.slice(-8)}</td>
              <td className="p-4 text-[10px] text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="p-4 text-[10px] font-bold">₹{order.total.toLocaleString()}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gold/10 text-gold'
                  }`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useShop();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'abandoned' | 'lowstock' | 'contacts'>('dashboard');
  const [offersOpen, setOffersOpen] = useState(false);

  const { data: products = [], isLoading: prodsLoading } = useProducts();
  const { data: users = [], isLoading: usersLoading } = useUsers();

  const createProductMut = useCreateProduct();
  const updateProductMut = useUpdateProduct();
  const deleteProductMut = useDeleteProduct();
  const updateUserMut = useUpdateUser();
  const { data: dashboardData, isLoading: statsLoading } = useAdminStats();
  const { data: recentOrders = [], isLoading: ordersLoading } = useRecentOrders();
  const { data: contacts = [], isLoading: contactsLoading } = useContacts();
  const deleteContactMut = useDeleteContact();
  const resolveContactMut = useResolveContact();
  const [viewingContact, setViewingContact] = useState<ContactSubmission | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: 0,
    category: 'women',
    description: '',
    stock: 10,
    isNewArrival: true,
    isSale: false,
    salePrice: 0,
    images: [''],
    variants: {
      colors: [{ name: 'Black', hex: '#000000' }],
      sizes: ['S', 'M', 'L', 'XL']
    }
  });

  if (authLoading || prodsLoading || usersLoading) return <div className="pt-40"><Skeleton className="max-w-4xl mx-auto px-6" lines={3} /></div>;
  if (!isAdmin) return <div className="pt-40 text-center">Access Denied</div>;

  const handleOpenModal = (product: Product | null = null) => {
    setErrors({});
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        price: product.price,
        category: product.category,
        description: product.description || '',
        stock: product.stock || 10,
        isNewArrival: product.isNewArrival || false,
        isSale: product.isSale || false,
        salePrice: product.salePrice || 0,
        images: product.images || [''],
        variants: product.variants || {
          colors: [{ name: 'Black', hex: '#000000' }],
          sizes: ['S', 'M', 'L', 'XL']
        }
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        slug: '',
        price: 0,
        category: 'women',
        description: '',
        stock: 10,
        isNewArrival: true,
        isSale: false,
        salePrice: 0,
        images: [''],
        variants: {
          colors: [{ name: 'Black', hex: '#000000' }],
          sizes: ['S', 'M', 'L', 'XL']
        }
      });
    }
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleRole = async (targetUser: User) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    updateUserMut.mutate({ id: targetUser.uid, payload: { role: newRole } });
  };

  const addColor = () => {
    setFormData({
      ...formData,
      variants: {
        ...formData.variants,
        colors: [...formData.variants.colors, { name: '', hex: '#000000' }]
      }
    });
  };

  const removeColor = (index: number) => {
    const newColors = formData.variants.colors.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      variants: { ...formData.variants, colors: newColors }
    });
  };

  const updateColor = (index: number, field: 'name' | 'hex', value: string) => {
    const newColors = [...formData.variants.colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setFormData({
      ...formData,
      variants: { ...formData.variants, colors: newColors }
    });
  };

  const toggleSize = (size: string) => {
    const newSizes = formData.variants.sizes.includes(size)
      ? formData.variants.sizes.filter(s => s !== size)
      : [...formData.variants.sizes, size];

    setFormData({
      ...formData,
      variants: { ...formData.variants, sizes: newSizes }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (formData.price <= 0) newErrors.price = 'Price must be a positive number';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.images[0]?.trim()) newErrors.images = 'At least one image URL is required';
    if (formData.variants.colors.some(c => !c.name.trim())) newErrors.colors = 'All colors must have a name';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const mutation = editingProduct ? updateProductMut : createProductMut;
    const payload = editingProduct ? { id: editingProduct._id || editingProduct.id, payload: formData } : formData;

    mutation.mutate(payload as any, {
      onSuccess: () => {
        setIsModalOpen(false);
        setLoading(false);
      },
      onError: (err) => {
        console.error('Error saving product:', err);
        setLoading(false);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    deleteProductMut.mutate(id);
  };

  return (
    <div className="pt-32 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar collapsed={false} onToggle={() => { }} />

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <DashboardStats stats={dashboardData?.stats} loading={statsLoading} />
                <RevenueChart data={dashboardData?.revenueTrend || []} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <RecentOrders orders={recentOrders} loading={ordersLoading} />
                  <RecentInquiries contacts={contacts} loading={contactsLoading} onView={setViewingContact} onViewAll={() => setActiveTab('contacts')} />
                </div>
              </div>
            )}

            {offersOpen && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light">Offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OfferForm onCreated={() => { /* refresh actions can be added */ }} />
                  <OffersList />
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-xl font-light uppercase tracking-widest">Manage Products</h2>
                  <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-accent pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <button
                      onClick={() => handleOpenModal()}
                      className="bg-primary text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Plus size={14} /> Add Product
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-accent overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-accent/30 border-b border-accent">
                      <tr>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Product</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Category</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Price</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Stock</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent">
                      {filteredProducts.map((product) => (
                        <tr key={product._id || product.id} className="hover:bg-accent/10 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover" />
                              <span className="text-xs font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-xs uppercase tracking-widest text-muted">{product.category}</td>
                          <td className="p-4 text-xs font-medium">₹{product.price}</td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full",
                              (product.stock || 0) === 0 ? "bg-red-100 text-red-700" :
                                (product.stock || 0) <= 10 ? "bg-orange-100 text-orange-700" :
                                  "bg-green-100 text-green-700"
                            )}>
                              {product.stock || 0} in stock
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenModal(product)}
                                className="p-2 text-muted hover:text-primary transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id || product.id)}
                                className="p-2 text-muted hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-xl font-light uppercase tracking-widest">Manage Users</h2>
                  <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-accent pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-accent overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-accent/30 border-b border-accent">
                      <tr>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">User</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Email</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Role</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Joined</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent">
                      {filteredUsers.map((u) => (
                        <tr key={u.uid} className="hover:bg-accent/10 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold">
                                {(u.firstName?.[0] || '')}{(u.lastName?.[0] || '')}
                              </div>
                              <span className="text-xs font-medium">{u.firstName || 'Unknown'} {u.lastName || ''}</span>
                            </div>
                          </td>
                          <td className="p-4 text-xs text-muted">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full ${u.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-accent text-muted'}`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-muted">
                            {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleRole(u)}
                              className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-primary transition-colors"
                            >
                              Toggle Role
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'abandoned' && (
              <div className="space-y-6">
                <h2 className="text-xl font-light uppercase tracking-widest">Abandoned Carts</h2>
                <AbandonedCarts />
              </div>
            )}
            {activeTab === 'lowstock' && (
              <div className="space-y-6">
                <h2 className="text-xl font-light uppercase tracking-widest">Low Stock</h2>
                <LowStock />
              </div>
            )}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-xl font-light uppercase tracking-widest">Contact Submissions</h2>
                  <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-accent pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-accent overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-accent/30 border-b border-accent">
                      <tr>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">User</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Subject</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Date</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Status</th>
                        <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent">
                      {contacts.filter(c =>
                        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.message.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((c) => (
                        <tr key={c._id} className="hover:bg-accent/10 transition-colors">
                          <td className="p-4">
                            <div className="space-y-1">
                              <p className="text-xs font-medium">{c.name}</p>
                              <p className="text-[10px] text-muted">{c.email}</p>
                              {c.phone && <p className="text-[10px] text-muted">{c.phone}</p>}
                            </div>
                          </td>
                          <td className="p-4 text-xs font-medium uppercase tracking-widest">{c.subject}</td>
                          <td className="p-4 text-xs text-muted">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-bold rounded-full ${c.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gold/10 text-gold'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setViewingContact(c)}
                                className="p-2 text-muted hover:text-primary transition-colors"
                                title="View Message"
                              >
                                <Eye size={16} />
                              </button>
                              {c.status !== 'resolved' && (
                                <button
                                  onClick={() => resolveContactMut.mutate(c._id)}
                                  className="p-2 text-muted hover:text-green-600 transition-colors"
                                  title="Mark as Resolved"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (window.confirm('Delete this submission?')) {
                                    deleteContactMut.mutate(c._id);
                                  }
                                }}
                                className="p-2 text-muted hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {contacts.length === 0 && (
                    <div className="p-20 text-center text-muted text-xs uppercase tracking-widest">
                      No contact submissions found
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-accent w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-muted hover:text-primary"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-light uppercase tracking-widest mb-8">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 p-4 mb-6">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-red-600 mb-2">Please fix the following errors:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.values(errors).map((err, i) => (
                        <li key={i} className="text-[10px] text-red-500 uppercase tracking-widest">{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Product Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full bg-bg border px-4 py-3 text-xs focus:outline-none focus:border-primary ${errors.name ? 'border-red-500' : 'border-accent'}`}
                    />
                    {errors.name && <p className="text-[8px] text-red-500 uppercase tracking-widest">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Slug</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className={`w-full bg-bg border px-4 py-3 text-xs focus:outline-none focus:border-primary ${errors.slug ? 'border-red-500' : 'border-accent'}`}
                    />
                    {errors.slug && <p className="text-[8px] text-red-500 uppercase tracking-widest">{errors.slug}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className={`w-full bg-bg border px-4 py-3 text-xs focus:outline-none focus:border-primary ${errors.price ? 'border-red-500' : 'border-accent'}`}
                    />
                    {errors.price && <p className="text-[8px] text-red-500 uppercase tracking-widest">{errors.price}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="women">Women</option>
                      <option value="men">Men</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Stock</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className={`w-full bg-bg border px-4 py-3 text-xs focus:outline-none focus:border-primary ${errors.stock ? 'border-red-500' : 'border-accent'}`}
                    />
                    {errors.stock && <p className="text-[8px] text-red-500 uppercase tracking-widest">{errors.stock}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Image URL</label>
                  <input
                    type="text"
                    required
                    value={formData.images[0]}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    className={`w-full bg-bg border px-4 py-3 text-xs focus:outline-none focus:border-primary ${errors.images ? 'border-red-500' : 'border-accent'}`}
                    placeholder="https://images.unsplash.com/..."
                  />
                  {errors.images && <p className="text-[8px] text-red-500 uppercase tracking-widest">{errors.images}</p>}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Colors</label>
                    <button
                      type="button"
                      onClick={addColor}
                      className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-primary flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Color
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {formData.variants.colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Color Name (e.g. Midnight Black)"
                          value={color.name}
                          onChange={(e) => updateColor(index, 'name', e.target.value)}
                          className="flex-1 bg-bg border border-accent px-4 py-2 text-xs focus:outline-none focus:border-primary"
                        />
                        <div className="flex items-center gap-2 bg-bg border border-accent px-2 py-1">
                          <input
                            type="color"
                            value={color.hex}
                            onChange={(e) => updateColor(index, 'hex', e.target.value)}
                            className="w-6 h-6 border-none bg-transparent cursor-pointer"
                          />
                          <span className="text-[10px] font-mono uppercase">{color.hex}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeColor(index)}
                          className="p-2 text-muted hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-colors ${formData.variants.sizes.includes(size)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-muted border-accent hover:border-primary'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="accent-primary"
                    />
                    <span className="text-[10px] uppercase tracking-widest font-bold">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSale}
                      onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                      className="accent-primary"
                    />
                    <span className="text-[10px] uppercase tracking-widest font-bold">On Sale</span>
                  </label>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Product</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact View Modal */}
      <AnimatePresence>
        {viewingContact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingContact(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white border border-accent w-full max-w-lg p-10 shadow-2xl"
            >
              <button
                onClick={() => setViewingContact(null)}
                className="absolute top-6 right-6 text-muted hover:text-primary"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-light uppercase tracking-widest mb-8">
                Message Detail
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">From</p>
                    <p className="text-sm font-medium">{viewingContact.name}</p>
                    <p className="text-xs text-muted">{viewingContact.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Date</p>
                    <p className="text-xs">{new Date(viewingContact.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {viewingContact.phone && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Phone</p>
                    <p className="text-xs">{viewingContact.phone}</p>
                  </div>
                )}

                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Subject</p>
                  <p className="text-sm font-medium uppercase tracking-widest">{viewingContact.subject}</p>
                </div>

                <div className="bg-bg p-6 border border-accent">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-4">Message</p>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{viewingContact.message}</p>
                </div>

                <div className="flex gap-4 pt-4">
                  {viewingContact.status !== 'resolved' && (
                    <button
                      onClick={() => {
                        resolveContactMut.mutate(viewingContact._id);
                        setViewingContact(null);
                      }}
                      className="flex-1 bg-primary text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors"
                    >
                      Mark as Resolved
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this submission?')) {
                        deleteContactMut.mutate(viewingContact._id);
                        setViewingContact(null);
                      }
                    }}
                    className="px-6 border border-accent text-muted hover:text-red-500 hover:border-red-500 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
