import React from 'react';
import { useShop } from '../context/ShopContext';
import { motion } from 'motion/react';
import { User, Package, Heart, LogOut, Settings, ChevronRight, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Account = () => {
  const { user, isAdmin, logout, updateUserProfile, deleteAccount } = useShop();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="pt-40 pb-20 bg-bg min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-light uppercase tracking-widest">Please login to view your account</h2>
          <Link to="/login" className="inline-block bg-primary text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    name: user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    email: user?.email || '',
    mobile: (user as any)?.mobile || ''
  });

  React.useEffect(() => {
    setForm({
      name: user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      email: user?.email || '',
      mobile: (user as any)?.mobile || ''
    });
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const payload: any = {};
      if (form.name) payload.name = form.name;
      if (form.email) payload.email = form.email;
      if (form.mobile) payload.mobile = form.mobile;
      await (updateUserProfile ? updateUserProfile(payload) : Promise.reject(new Error('No update handler')));
      alert('Profile updated');
      setEditing(false);
    } catch (err: any) {
      alert(err.message || 'Update failed');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      const ok = await (deleteAccount ? deleteAccount() : Promise.reject(new Error('No delete handler')));
      if (ok) {
        alert('Account deleted');
        navigate('/');
      } else {
        alert('Failed to delete account');
      }
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const menuItems = [
    ...(isAdmin ? [{ icon: <LayoutDashboard size={20} />, label: 'Admin Panel', path: '/admin', desc: 'Manage store and users' }] : []),
    { icon: <Package size={20} />, label: 'My Orders', path: '/orders', desc: 'Track, return or buy things again' },
    { icon: <Heart size={20} />, label: 'Wishlist', path: '/wishlist', desc: 'Your saved luxury items' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings', desc: 'Edit your profile and preferences' },
  ];

  return (
    <div className="pt-40 pb-20 bg-bg min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar */}
            <aside className="w-full md:w-64 space-y-8">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
                  <User size={40} className="text-muted" strokeWidth={1} />
                </div>
                <div>
                  <h1 className="text-xl font-light uppercase tracking-tight">{user.displayName || 'User'}</h1>
                  <p className="text-[10px] text-muted uppercase tracking-widest">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link 
                    key={item.label}
                    to={item.path}
                    className="flex items-center justify-between p-4 bg-white border border-accent hover:border-primary transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-muted group-hover:text-primary transition-colors">{item.icon}</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-muted group-hover:text-primary transition-colors" />
                  </Link>
                ))}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 bg-white border border-accent text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Logout</span>
                </button>
              </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 space-y-8">
              <section className="bg-white border border-accent p-8">
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold mb-6">Recent Activity</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-center h-40 border border-dashed border-accent rounded-lg">
                    <p className="text-xs text-muted italic font-serif">No recent activity to show.</p>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-accent p-8 space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold">Shipping Address</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    No address saved yet. Add a shipping address for faster checkout.
                  </p>
                  <button className="text-[10px] uppercase tracking-widest font-bold border-b border-primary pb-1 hover:text-gold hover:border-gold transition-all">
                    Add Address
                  </button>
                </div>
                <div className="bg-white border border-accent p-8 space-y-4">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold">Payment Methods</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    No payment methods saved. Securely add a card for future purchases.
                  </p>
                  <button className="text-[10px] uppercase tracking-widest font-bold border-b border-primary pb-1 hover:text-gold hover:border-gold transition-all">
                    Add Card
                  </button>
                </div>
              </section>
              
              <section className="bg-white border border-accent p-8">
                <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4">Edit Profile</h3>
                <div className="space-y-4 max-w-md">
                  <label className="text-xs uppercase text-muted">Name</label>
                  <input value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} className="w-full border p-2" />

                  <label className="text-xs uppercase text-muted">Email</label>
                  <input value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} className="w-full border p-2" />

                  <label className="text-xs uppercase text-muted">Mobile</label>
                  <input value={form.mobile} onChange={e => setForm(s => ({ ...s, mobile: e.target.value }))} className="w-full border p-2" />

                  <div className="flex gap-3">
                    {editing ? (
                      <>
                        <button onClick={handleSaveProfile} className="bg-primary text-white px-4 py-2">Save</button>
                        <button onClick={() => { setEditing(false); setForm({ name: user?.displayName || '', email: user?.email || '', mobile: (user as any)?.mobile || '' }); }} className="px-4 py-2 border">Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setEditing(true)} className="px-4 py-2 border">Edit Profile</button>
                    )}
                    <button onClick={handleDeleteAccount} className="px-4 py-2 border text-red-600">Delete Account</button>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
