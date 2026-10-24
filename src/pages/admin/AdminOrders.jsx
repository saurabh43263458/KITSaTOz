import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { toast } from '../../store/toastStore';
import { generateWhatsAppOrderUrl } from '../../services/whatsappService';
import { 
  subscribeToOrders, 
  updateOrderStatusInFirestore, 
  deleteOrderFromFirestore 
} from '../../services/orders';
import { 
  ShoppingBag, 
  Search, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  Truck, 
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  Database,
  Trash2,
  RefreshCw
} from 'lucide-react';

export const AdminOrders = () => {
  const updateLocalOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Subscribe strictly to live Firestore orders
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToOrders((liveOrders) => {
      setOrders(liveOrders || []);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const statusOptions = ['New', 'Verified', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusInFirestore(orderId, newStatus);
      updateLocalOrderStatus(orderId, newStatus);
      toast.success('Status Updated in Firebase', `Order #${orderId} marked as ${newStatus}`);
    } catch (e) {
      updateLocalOrderStatus(orderId, newStatus);
      toast.info('Status Updated Locally', `Order #${orderId} updated.`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to permanently delete order #${orderId} from Firebase Firestore?`)) {
      try {
        await deleteOrderFromFirestore(orderId);
        toast.warning('Order Deleted', `Order #${orderId} was removed from Firebase Firestore.`);
      } catch (err) {
        toast.error('Delete Failed', 'Could not delete order: ' + err.message);
      }
    }
  };

  const filteredOrders = orders.filter((o) => {
    const oStatus = o.status || 'New';
    if (selectedStatus !== 'All' && oStatus.toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = (o.id || '').toLowerCase().includes(q);
      const matchName = (o.name || o.customerName || '').toLowerCase().includes(q);
      const matchPhone = (o.phone || '').toLowerCase().includes(q);
      const matchEmail = (o.email || '').toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Firebase Cloud Pipeline</span>
            </span>
            <span className="text-xs text-slate-400">
              ({orders.length} real Firestore {orders.length === 1 ? 'order' : 'orders'})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Orders Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing only verified customer orders loaded directly from Firebase Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Firestore Orders:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-xs border border-slate-700">
            {orders.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
          <button
            onClick={() => setSelectedStatus('All')}
            className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors ${
              selectedStatus === 'All'
                ? 'bg-brand-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            All ({orders.length})
          </button>
          {statusOptions.map((status) => {
            const count = orders.filter(o => (o.status || '').toLowerCase() === status.toLowerCase()).length;
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer name, phone or email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-16 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-semibold text-slate-300">Retrieving live orders from Firebase Firestore...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-3 shadow-sm">
            <ShoppingBag className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-sm font-bold text-slate-200">
              {orders.length === 0 ? 'No Orders in Firebase Firestore' : 'No matching orders found'}
            </p>
            <p className="text-slate-500 max-w-sm mx-auto">
              {orders.length === 0 
                ? 'Faulty mock orders have been removed. Any customer order submitted via checkout will appear here in real-time.'
                : 'Try selecting "All" or clearing the search bar.'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const orderName = order.name || order.customerName || 'Customer';
            const orderTotal = Number(order.total || order.totalAmount || 0);
            const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt || Date.now());
            const currentStatus = order.status || 'New';
            const whatsAppUrl = generateWhatsAppOrderUrl({
              ...order,
              id: order.id,
              customerName: orderName,
              totalAmount: orderTotal
            });

            return (
              <div
                key={order.id}
                className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-sm hover:border-slate-700 transition-colors"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-brand-400">#{order.id.slice(0, 10)}</span>
                    <span className="text-xs text-slate-400">
                      {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Status:</span>
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-xl px-2.5 py-1 focus:outline-none border ${
                          currentStatus.toLowerCase() === 'new' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                          currentStatus.toLowerCase() === 'verified' ? 'bg-purple-950 text-purple-300 border-purple-800' :
                          currentStatus.toLowerCase() === 'paid' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                          currentStatus.toLowerCase() === 'shipped' ? 'bg-indigo-950 text-indigo-300 border-indigo-800' :
                          currentStatus.toLowerCase() === 'delivered' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                          'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st} className="bg-slate-900 text-slate-200">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Customer</span>
                      </a>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 transition-colors"
                        title="Delete Order from Firestore"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Details & Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-slate-300">
                  
                  {/* Customer Info */}
                  <div className="md:col-span-5 space-y-2">
                    <p className="font-bold text-white text-sm">{orderName}</p>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.phone || 'No phone provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{order.address || 'Address on file'}{order.pincode ? `, PIN: ${order.pincode}` : ''}</span>
                    </div>
                    {(order.notes || order.customizationNotes) && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-brand-300">
                        <strong className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                          Maker Customization Notes:
                        </strong>
                        {order.notes || order.customizationNotes}
                      </div>
                    )}
                  </div>

                  {/* Items Ordered */}
                  <div className="md:col-span-7 space-y-2 border-t md:border-t-0 md:border-l border-slate-800/80 md:pl-6 pt-3 md:pt-0">
                    <p className="font-bold text-white text-xs mb-2">Ordered Kits:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-900">
                          <div className="flex items-center gap-2">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                            )}
                            <div>
                              <span className="font-semibold text-slate-200">{item.name}</span>
                              <span className="text-slate-500 ml-1">× {item.quantity || item.qty || 1}</span>
                              {(item.selectedMaterial || item.selectedAssembly) && (
                                <span className="text-[10px] text-slate-500 block">
                                  {[item.selectedMaterial, item.selectedAssembly].filter(Boolean).join(' • ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-mono font-bold text-slate-300">
                            ₹{((Number(item.price) || 0) * (Number(item.quantity || item.qty) || 1)).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-between items-baseline border-t border-slate-800 font-bold">
                      <span className="text-slate-400">Total Order Amount:</span>
                      <span className="text-base text-brand-400 font-black">
                        ₹{orderTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
