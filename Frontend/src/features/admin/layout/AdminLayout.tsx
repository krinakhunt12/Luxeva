import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  // pixel sizes matching Sidebar widths and header height
  const sidebarWidth = collapsed ? 80 : 256;
  const headerHeight = 64; // h-16 -> 64px

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((s) => !s)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header collapsed={collapsed} />

        <main 
          style={{ marginLeft: sidebarWidth, marginTop: headerHeight }} 
          className="flex-1 overflow-y-auto p-4 md:p-8 transition-all duration-300"
        >
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
