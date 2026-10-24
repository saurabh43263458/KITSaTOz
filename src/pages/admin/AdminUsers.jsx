import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { 
  subscribeToUsers, 
  deleteUserFromFirestore, 
  isDummyUser 
} from '../../services/users';
import { subscribeToOrders } from '../../services/orders';
import { toast } from '../../store/toastStore';
import { 
  Users, 
  Search, 
  Database, 
  Trash2, 
  ShieldCheck, 
  ShoppingBag, 
  IndianRupee,
  UserCheck
} from 'lucide-react';

export const AdminUsers = () => {
  const { users: localUsers, deleteUser: deleteLocalUser } = useUserStore();
  const [firestoreUsers, setFirestoreUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  // Subscribe to live Firestore registered users and live orders
  useEffect(() => {
    const unsubUsers = subscribeToUsers((liveUsers) => {
      setFirestoreUsers(liveUsers || []);
    });

    const unsubOrders = subscribeToOrders((liveOrders) => {
      setOrders(liveOrders || []);
    });

    return () => {
      if (typeof unsubUsers === 'function') unsubUsers();
      if (typeof unsubOrders === 'function') unsubOrders();
    };
  }, []);

  // Merge Firestore users with local userStore (strictly excluding any mock/dummy seeds)
  const combinedUsers = (() => {
    const map = new Map();

    // Add local registered users (excluding dummy seeds)
    (localUsers || []).forEach(u => {
      if (!isDummyUser(u) && u.email) {
        map.set(u.email.toLowerCase(), { ...u });
      }
    });

    // Merge live Firestore registered users (authoritative)
    (firestoreUsers || []).forEach(u => {
      if (!isDummyUser(u) && u.email) {
        const existing = map.get(u.email.toLowerCase()) || {};
        map.set(u.email.toLowerCase(), { ...existing, ...u });
      }
    });

    return Array.from(map.values());
  })();

  // Compute live orders count and total spend per customer
  const enrichedUsers = combinedUsers.map((u) => {
    const userEmail = (u.email || '').toLowerCase();
    const userOrders = orders.filter(o => 
      (o.email || '').toLowerCase() === userEmail || (u.uid && o.userId === u.uid)
    );
    const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total || o.totalAmount) || 0), 0);

    return {
      ...u,
      calculatedOrdersCount: userOrders.length,
      calculatedTotalSpent: totalSpent
    };
  });

  // Filter based on search query and role filter
  const filtered = enrichedUsers.filter((u) => {
    const matchesSearch = 
      (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.city || '').toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (u) => {
    const name = u.displayName || u.email;
    if (!window.confirm(`Are you sure you want to remove customer account "${name}"?`)) {
      return;
    }

    setDeletingId(u.uid);
    try {
      if (u.uid) {
        await deleteUserFromFirestore(u.uid);
        deleteLocalUser(u.uid);
      }
      toast.success('Customer Removed', `Account for ${name} removed from customer registry.`);
    } catch (err) {
      toast.error('Deletion Failed', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Metrics summary
  const totalRegistered = combinedUsers.length;
  const totalOrdersPlaced = enrichedUsers.reduce((sum, u) => sum + u.calculatedOrdersCount, 0);
  const totalCustomerValue = enrichedUsers.reduce((sum, u) => sum + u.calculatedTotalSpent, 0);

  return (
    <div className="space-y-6">
      
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Real Registered Customers Only</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Registered Customers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Displaying only genuine registered accounts from backend authentication. Fake seed data has been removed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            <span>Total Registered:</span>
            <span className="font-extrabold text-white text-sm">{totalRegistered}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Registered Accounts</p>
            <p className="text-xl font-black text-white">{totalRegistered}</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Customer Orders</p>
            <p className="text-xl font-black text-white">{totalOrdersPlaced} orders</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Customer Value</p>
            <p className="text-xl font-black text-brand-400 font-mono">₹{totalCustomerValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or city..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'customer', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                roleFilter === role
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {role === 'all' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No Registered Customers Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {search 
                ? `No registered customer matched "${search}".`
                : 'All mock/dummy accounts have been purged. Real users will appear here automatically when they sign up.'}
            </p>
          </div>
        ) : (
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
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((u) => (
                  <tr key={u.uid || u.email} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-brand-400 font-bold flex items-center justify-center border border-slate-700 uppercase">
                          {u.displayName ? u.displayName[0] : (u.email ? u.email[0] : 'U')}
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.displayName || u.email.split('@')[0]}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' 
                          ? 'bg-purple-950 text-purple-300 border border-purple-800' 
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {u.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {u.city || 'India'}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {u.calculatedOrdersCount} {u.calculatedOrdersCount === 1 ? 'order' : 'orders'}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-brand-400">
                      ₹{u.calculatedTotalSpent.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {u.registeredAt || 'Active'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u)}
                        disabled={deletingId === u.uid}
                        title="Delete customer record"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
