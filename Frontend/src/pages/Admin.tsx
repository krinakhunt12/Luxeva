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
  Search
} from 'lucide-react';
import { Product, User } from '../types';
import Skeleton from '../components/ui/Skeleton';
import OfferForm from '../features/admin/OfferForm';
import OffersList from '../features/admin/OffersList';
import AbandonedCarts from '../features/admin/AbandonedCarts';
import LowStock from '../features/admin/LowStock';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../features/products/hooks/useProducts';
import { useUsers, useUpdateUser } from '../features/user/hooks/useUser';

// Sub-components for Admin Panel
const Sidebar = ({ activeTab, setActiveTab, offersOpen, setOffersOpen }: { activeTab: string, setActiveTab: (tab: 'dashboard' | 'products' | 'users' | 'abandoned' | 'lowstock') => void, offersOpen: boolean, setOffersOpen: (v: boolean) => void }) => (
  <aside className="lg:w-64 space-y-2">
    <button 
      onClick={() => setActiveTab('dashboard')}
      className={`w-full flex items-center gap-3 p-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'bg-white border border-accent hover:border-primary'}`}
    >
      <LayoutDashboard size={16} /> Dashboard
    </button>
    <button 
      onClick={() => setActiveTab('products')}
      className={`w-full flex items-center gap-3 p-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'products' ? 'bg-primary text-white' : 'bg-white border border-accent hover:border-primary'}`}
    >
      <Package size={16} /> Products
    </button>
    <button 
      onClick={() => setActiveTab('users')}
      className={`w-full flex items-center gap-3 p-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'users' ? 'bg-primary text-white' : 'bg-white border border-accent hover:border-primary'}`}
    >
      <Users size={16} /> Users
    </button>
    <button 
      onClick={() => setOffersOpen(!offersOpen)}
      className={`w-full flex items-center gap-3 p-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${offersOpen ? 'bg-primary text-white' : 'bg-white border border-accent hover:border-primary'}`}
    >
      Offers
    </button>
    <button 
      onClick={() => setActiveTab('abandoned')}
      className={`w-full flex items-center gap-3 p-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'abandoned' ? 'bg-primary text-white' : 'bg-white border border-accent hover:border-primary'}`}
    >
      Abandoned Carts
    </button>
    <button 
      onClick={() => setActiveTab('lowstock')}
      className={`w-full flex items-center gap-3 p-4 text-[10px] uppercase tracking-widest font-bold transition-colors ${activeTab === 'lowstock' ? 'bg-primary text-white' : 'bg-white border border-accent hover:border-primary'}`}
    >
      Low Stock
    </button>
  </aside>
);

const DashboardStats = ({ productsCount, usersCount }: { productsCount: number, usersCount: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-white border border-accent p-8 space-y-2">
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Total Products</p>
      <p className="text-4xl font-light">{productsCount}</p>
    </div>
    <div className="bg-white border border-accent p-8 space-y-2">
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Total Users</p>
      <p className="text-4xl font-light">{usersCount}</p>
    </div>
    <div className="bg-white border border-accent p-8 space-y-2">
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Total Orders</p>
      <p className="text-4xl font-light">0</p>
    </div>
    <div className="bg-white border border-accent p-8 space-y-2">
      <p className="text-[10px] uppercase tracking-widest font-bold text-muted">Total Revenue</p>
      <p className="text-4xl font-light">₹0</p>
    </div>
  </div>
);

export const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useShop();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'abandoned' | 'lowstock'>('dashboard');
  const [offersOpen, setOffersOpen] = useState(false);
  
  const { data: products = [], isLoading: prodsLoading } = useProducts();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  
  const createProductMut = useCreateProduct();
  const updateProductMut = useUpdateProduct();
  const deleteProductMut = useDeleteProduct();
  const updateUserMut = useUpdateUser();

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
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} offersOpen={offersOpen} setOffersOpen={setOffersOpen} />

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'dashboard' && (
              <DashboardStats productsCount={products.length} usersCount={users.length} />
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
                          <td className="p-4 text-xs">{product.stock}</td>
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
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className={`w-full bg-bg border px-4 py-3 text-xs focus:outline-none focus:border-primary ${errors.price ? 'border-red-500' : 'border-accent'}`}
                    />
                    {errors.price && <p className="text-[8px] text-red-500 uppercase tracking-widest">{errors.price}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                      className={`w-full bg-bg border px-4 py-3 text-xs focus:outline-none focus:border-primary ${errors.stock ? 'border-red-500' : 'border-accent'}`}
                    />
                    {errors.stock && <p className="text-[8px] text-red-500 uppercase tracking-widest">{errors.stock}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, images: [e.target.value]})}
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
                        className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-colors ${
                          formData.variants.sizes.includes(size)
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
                      onChange={(e) => setFormData({...formData, isNewArrival: e.target.checked})}
                      className="accent-primary"
                    />
                    <span className="text-[10px] uppercase tracking-widest font-bold">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isSale}
                      onChange={(e) => setFormData({...formData, isSale: e.target.checked})}
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
    </div>
  );
};
