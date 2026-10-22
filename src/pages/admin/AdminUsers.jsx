import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useOrderStore } from '../../store/orderStore';
import { Users, Search, Mail, MapPin, Calendar, ShoppingBag } from 'lucide-react';

export const AdminUsers = () => {
  const { users } = useUserStore();
  const { orders } = useOrderStore();
  const [search, setSearch] = useState('');

  const enrichedUsers = users.map((u) => {
    const userOrders = orders.filter(o => (o.email || '').toLowerCase() === (u.email || '').toLowerCase());
    const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return {
      ...u,
      calculatedOrdersCount: userOrders.length || u.ordersCount || 0,
      calculatedTotalSpent: totalSpent || u.totalSpent || 0
    };
  });

  const filtered = enrichedUsers.filter((u) => 
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Registered Makers & Customers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View customer accounts, lifetime engagement, and contact profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Registered:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-xs border border-slate-700">
            {users.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Total Value</th>
                <th className="py-3.5 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((u) => (
                <tr key={u.uid} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-brand-400 font-bold flex items-center justify-center border border-slate-700">
                        {u.displayName ? u.displayName[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-white">{u.displayName}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'admin' 
                        ? 'bg-purple-950 text-purple-300 border border-purple-800' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {u.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {u.city || 'India'}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {u.calculatedOrdersCount} orders
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                    ₹{u.calculatedTotalSpent.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {u.registeredAt || '2026-10-01'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
