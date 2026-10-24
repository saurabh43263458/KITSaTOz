import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import { useProductStore } from '../../store/productStore';
import { subscribeToProducts, updateProductInFirestore } from '../../services/products';
import { subscribeToOrders } from '../../services/orders';
import { toast } from '../../store/toastStore';
import { 
  ShoppingBag, 
  IndianRupee, 
  AlertTriangle, 
  Package, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Database
} from 'lucide-react';

export const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Subscribe strictly to live Firestore data
  useEffect(() => {
    const unsubProducts = subscribeToProducts((live) => {
      setProducts(live || []);
    });

    const unsubOrders = subscribeToOrders((liveOrders) => {
      setOrders(liveOrders || []);
    });

    return () => {
      if (typeof unsubProducts === 'function') unsubProducts();
      if (typeof unsubOrders === 'function') unsubOrders();
    };
  }, []);

  // Metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total || o.totalAmount) || 0), 0);
  const pendingOrders = orders.filter(o => {
    const s = (o.status || '').toLowerCase();
    return s === 'new' || s === 'verified';
  }).length;
  
  // Low stock kits: stock <= 10
  const lowStockProducts = products.filter(p => {
    const stock = p.stock !== undefined ? Number(p.stock) : Number(p.stockCount || 0);
    return stock <= 10;
  });

  const handleQuickRestock = async (productId, currentStock) => {
    const newStock = Number(currentStock || 0) + 10;
    try {
      await updateProductInFirestore(productId, {
        stock: newStock,
        stockCount: newStock
      });
      toast.success('Restocked', `Added 10 units in Firestore (${newStock} total)`);
    } catch (e) {
      toast.error('Restock Failed', e.message);
    }
  };

  const handleImageError = (e) => {
    const src = e.target.src || '';
    if (src.includes('products%2F')) {
      const match = src.match(/products%2F([^?]+)/);
      if (match && match[1]) {
        e.target.src = '/products/' + decodeURIComponent(match[1]);
        return;
      }
    }
    e.target.src = '/products/robot-wheels-set-4.jpg';
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Real-time Firebase Firestore Sync</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time workshop production metrics, orders pipeline, and live Firestore inventory.
          </p>
        </div>

        <div className="flex gap-2.5">
          <Link
            to="/admin/products"
            className="py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-soft transition-colors"
          >
            + Add New Kit
          </Link>
          <Link
            to="/admin/orders"
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
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
            <TrendingUp className="w-3.5 h-3.5" /> Live Firestore orders total
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
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Low-Stock Workshop Alerts</span>
            </h3>
            <span className="text-xs text-rose-400 font-bold">{lowStockProducts.length} items</span>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">All kits have sufficient inventory in Firestore.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {lowStockProducts.map((prod) => {
                const stock = prod.stock !== undefined ? Number(prod.stock) : Number(prod.stockCount || 0);
                const displayImg = prod.images?.[0] || prod.imageUrl || '/products/robot-wheels-set-4.jpg';

                return (
                  <div key={prod.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={displayImg} 
                        alt={prod.name} 
                        onError={handleImageError}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0" 
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">{prod.name}</p>
                        <span className="text-[10px] text-rose-400 font-semibold">
                          Only {stock} remaining
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickRestock(prod.id, stock)}
                      className="shrink-0 text-[11px] font-semibold py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white transition-colors"
                    >
                      +10 Units
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Orders Overview */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-400" />
              <span>Recent Customer Orders</span>
            </h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-brand-400 hover:text-brand-300">
              View All →
            </Link>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-400">No orders in Firebase Firestore yet</p>
                <p>Orders placed by customers will automatically synchronize here in real time.</p>
              </div>
            ) : (
              orders.slice(0, 5).map((order) => {
              const orderTotal = Number(order.total || order.totalAmount || 0);
              const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt || Date.now());

              return (
                <div key={order.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-400">#{order.id.slice(0, 8)}</span>
                      <span className="text-slate-300 font-semibold">{order.name || order.customerName || 'Customer'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {order.items?.length || 1} items • {orderDate.toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-white">₹{orderTotal.toLocaleString()}</span>
                    <div className="mt-0.5">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        (order.status || '').toLowerCase() === 'verified' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                        (order.status || '').toLowerCase() === 'delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {order.status || 'New'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        </div>

      </div>

    </div>
  );
};
