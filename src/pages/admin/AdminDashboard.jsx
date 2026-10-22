import React from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import { useProductStore } from '../../store/productStore';
import { 
  ShoppingBag, 
  IndianRupee, 
  AlertTriangle, 
  Package, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { orders } = useOrderStore();
  const { products, updateProduct } = useProductStore();

  // Metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'New' || o.status === 'Verified').length;
  
  // Low stock kits: stock <= 10
  const lowStockProducts = products.filter(p => Number(p.stockCount) <= 10);

  const handleQuickRestock = (productId, currentStock) => {
    updateProduct(productId, { stockCount: Number(currentStock) + 10 });
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time workshop production metrics, orders pipeline, and inventory status.
          </p>
        </div>

        <div className="flex gap-2.5">
          <Link
            to="/admin/products"
            className="py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-soft transition-colors"
          >
            + Add New Kit
          </Link>
          <Link
            to="/admin/orders"
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Manage All Orders
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Estimated Revenue</span>
            <span className="p-2 bg-emerald-950/80 text-emerald-400 rounded-xl">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last month
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Orders Placed</span>
            <span className="p-2 bg-brand-950/80 text-brand-400 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white">{totalOrders}</p>
          <p className="text-[11px] text-slate-400">All registered customer enquiries</p>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Pending Verifications</span>
            <span className="p-2 bg-amber-950/80 text-amber-400 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-400">{pendingOrders}</p>
          <p className="text-[11px] text-slate-400">Require WhatsApp UPI confirmation</p>
        </div>

        {/* Low Stock Alert */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Low-Stock Alerts</span>
            <span className="p-2 bg-rose-950/80 text-rose-400 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-400">{lowStockProducts.length}</p>
          <p className="text-[11px] text-rose-300">Models with ≤ 10 units in workshop</p>
        </div>

      </div>

      {/* Grid: Low Stock Warnings + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Low Stock Alerts Table */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Low-Stock Workshop Alerts</span>
            </h3>
            <span className="text-xs text-rose-400 font-bold">{lowStockProducts.length} items</span>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">All models have sufficient workshop inventory.</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((prod) => (
                <div key={prod.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={prod.images?.[0]} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">{prod.name}</p>
                      <span className="text-[10px] text-rose-400 font-semibold">
                        Only {prod.stockCount} remaining
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickRestock(prod.id, prod.stockCount)}
                    className="shrink-0 text-[11px] font-semibold py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white transition-colors"
                  >
                    +10 Units
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Overview */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-400" />
              <span>Recent Customer Orders</span>
            </h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-brand-400 hover:text-brand-300">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-400">#{order.id}</span>
                    <span className="text-slate-300 font-semibold">{order.customerName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {order.items?.length || 1} items • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-black text-white">₹{order.totalAmount?.toLocaleString()}</span>
                  <div className="mt-0.5">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'Verified' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                      order.status === 'Delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
