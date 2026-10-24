import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  ArrowLeft, 
  ShieldCheck,
  Hammer
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AdminLayout = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const links = [
    { label: 'Overview Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Product Inventory', path: '/admin/products', icon: Package },
    { label: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Registered Customers', path: '/admin/users', icon: Users }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar - Static Non-scrollable */}
      <aside className="w-full md:w-64 h-auto md:h-screen bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0 select-none overflow-hidden z-20">
        <div className="space-y-6">
          
          {/* Logo & Admin Badge */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-soft">
                <Hammer className="w-5 h-5 -rotate-12" />
              </div>
              <span className="text-xl font-black text-white">
                KITS<span className="text-brand-500">a</span>TOz
              </span>
            </Link>
            <div className="mt-3 flex items-center gap-2 px-2.5 py-1 bg-purple-950/80 border border-purple-800/80 rounded-lg text-purple-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin Control Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-soft'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom User info & Exit */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="text-xs text-slate-400">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Admin Operator</p>
            <p className="font-semibold text-slate-200 truncate">{user?.email || 'admin@kitsatoz.com'}</p>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Customer Storefront
          </Link>
        </div>

      </aside>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 h-screen overflow-y-auto p-6 md:p-10 scroll-smooth">
        <Outlet />
      </main>

    </div>
  );
};
