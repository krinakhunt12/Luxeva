import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, PlusSquare } from 'lucide-react';

interface Props {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: Props) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-3 rounded transition-colors ${isActive ? 'bg-primary text-white border-l-4 border-primary' : 'text-gray-700 hover:bg-gray-100'}`;

  // widths in pixels matching Tailwind w-64 (256px) and w-20 (80px)
  const width = collapsed ? 80 : 256;

  return (
    <aside className="fixed left-0 top-0 h-screen z-40 bg-white border-r flex flex-col transition-all" style={{ width }}>
      <div className="h-16 flex items-center px-4 border-b shrink-0">
        <div className="font-bold text-primary">{collapsed ? 'L' : 'Lume Admin'}</div>
        <button className="ml-auto md:hidden" onClick={onToggle} aria-label="Toggle sidebar">☰</button>
        <button className="ml-auto hidden md:inline-block" onClick={onToggle} aria-label="Toggle sidebar">{collapsed ? '→' : '←'}</button>
      </div>

      <nav className="p-4 space-y-1 overflow-auto flex-1">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={18} />
          <span className={`${collapsed ? 'hidden' : 'block'} text-sm font-medium`}>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/products" className={linkClass}>
          <Package size={18} />
          <span className={`${collapsed ? 'hidden' : 'block'} text-sm font-medium`}>Products</span>
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <Users size={18} />
          <span className={`${collapsed ? 'hidden' : 'block'} text-sm font-medium`}>Users</span>
        </NavLink>

        <NavLink to="/admin/orders" className={linkClass}>
          <ShoppingCart size={18} />
          <span className={`${collapsed ? 'hidden' : 'block'} text-sm font-medium`}>Orders</span>
        </NavLink>

        <NavLink to="/admin/offers" className={linkClass}>
          <Package size={18} />
          <span className={`${collapsed ? 'hidden' : 'block'} text-sm font-medium`}>Offers</span>
        </NavLink>

        <div className="pt-4 mt-4 border-t border-gray-100">
          <NavLink to="/admin/add-product" className={linkClass}>
            <PlusSquare size={18} />
            <span className={`${collapsed ? 'hidden' : 'block'} text-sm font-medium`}>Add Product</span>
          </NavLink>
        </div>
      </nav>
      
      {!collapsed && (
        <div className="p-4 border-t border-gray-50 text-[10px] text-gray-400 uppercase tracking-widest text-center">
          v1.0.0
        </div>
      )}
    </aside>
  );
}
