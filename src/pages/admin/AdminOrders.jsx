import React, { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { toast } from '../../store/toastStore';
import { generateWhatsAppOrderUrl } from '../../services/whatsappService';
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
  MapPin
} from 'lucide-react';

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useOrderStore();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');

  const statusOptions = ['New', 'Verified', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success('Status Updated', `Order #${orderId} marked as ${newStatus}`);
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'All' && o.status !== selectedStatus) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.phone?.toLowerCase().includes(q);
      const matchEmail = o.email?.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Customer Orders Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verify payment, update shipping courier tracking, and coordinate directly via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Orders:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-xs border border-slate-700">
            {orders.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
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
            const count = orders.filter(o => o.status === status).length;
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
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No orders found under this status filter.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const whatsAppUrl = generateWhatsAppOrderUrl(order);

            return (
              <div
                key={order.id}
                className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-brand-400">#{order.id}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-xl px-2.5 py-1 focus:outline-none border ${
                          order.status === 'New' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                          order.status === 'Verified' ? 'bg-purple-950 text-purple-300 border-purple-800' :
                          order.status === 'Paid' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                          order.status === 'Shipped' ? 'bg-indigo-950 text-indigo-300 border-indigo-800' :
                          order.status === 'Delivered' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
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

                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </div>
                </div>

                {/* Customer Details & Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs text-slate-300">
                  
                  {/* Customer Info */}
                  <div className="md:col-span-5 space-y-2">
                    <p className="font-bold text-white text-sm">{order.customerName}</p>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{order.address}, PIN: {order.pincode}</span>
                    </div>
                    {order.customizationNotes && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-brand-300">
                        <strong className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                          Maker Customization Notes:
                        </strong>
                        {order.customizationNotes}
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
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <span className="font-semibold text-slate-200">{item.name}</span>
                              <span className="text-slate-500 ml-1">× {item.quantity}</span>
                              <span className="text-[10px] text-slate-500 block">
                                {item.selectedMaterial} • {item.selectedAssembly}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-slate-300">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-between items-baseline border-t border-slate-800 font-bold">
                      <span className="text-slate-400">Total Order Amount:</span>
                      <span className="text-base text-brand-400 font-black">
                        ₹{order.totalAmount?.toLocaleString()}
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
