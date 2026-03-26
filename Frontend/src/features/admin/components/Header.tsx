import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  collapsed?: boolean;
}

export default function Header({ collapsed = false }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const routeMap: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/products': 'Products',
    '/admin/users': 'Users',
    '/admin/orders': 'Orders',
    '/admin/add-product': 'Add Product',
  };

  const title = routeMap[location.pathname] || 'Admin Panel';

  function handleLogout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('adminName');
      // clear and invalidate queries
      qc.clear();
      qc.invalidateQueries();
    } catch (e) {
      // ignore
    }
    navigate('/login');
  }

  const adminName = localStorage.getItem('adminName') || 'Admin';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-30 bg-white border-b flex items-center px-6 transition-all" style={{ paddingLeft: `${collapsed ? 80 + 24 : 256 + 24}px` }}>
      <div className="flex-1">
        <h2 className="text-xl font-bold tracking-tight text-gray-800">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <button aria-label="Notifications" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors relative">
          <span>🔔</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3 pr-4 border-r border-gray-100">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 shadow-sm">
            {adminName[0].toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{adminName}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Store Manager</p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 bg-gray-900 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded transition-all shadow-sm active:scale-95"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
