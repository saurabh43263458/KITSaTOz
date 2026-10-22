import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { toast } from '../store/toastStore';
import { generateWhatsAppOrderUrl } from '../services/whatsappService';
import { Badge } from '../components/common/Badge';
import { 
  User, 
  Package, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Edit3, 
  Check, 
  ShieldCheck, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const { user, updateUserProfile, toggleAdminRole } = useAuthStore();
  const { getOrdersByUser } = useOrderStore();

  const userOrders = getOrdersByUser(user?.email);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    pincode: user?.pincode || ''
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
    toast.success('Profile Updated', 'Your delivery details have been saved.');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return <Badge variant="warning">New Enquiry</Badge>;
      case 'Verified': return <Badge variant="purple">Verified by Maker</Badge>;
      case 'Paid': return <Badge variant="success">Payment Verified</Badge>;
      case 'Shipped': return <Badge variant="brand">Shipped in Transit</Badge>;
      case 'Delivered': return <Badge variant="success">Delivered</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 mb-8 border-b border-wood-200 gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">
            Maker Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            My Account & Order History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Logged in as <strong>{user?.email}</strong>
          </p>
        </div>

        {/* Demo Admin Toggle helper */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toggleAdminRole();
              toast.info('Role Toggled', `Current role: ${user?.role === 'admin' ? 'Customer' : 'Admin'}`);
            }}
            className="text-xs py-2 px-3.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors"
          >
            {user?.role === 'admin' ? '🛡️ Admin Active (Click to switch Customer)' : 'Switch to Admin Role'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-wood-200/80 p-6 shadow-xs">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-slate-900">Delivery Profile</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileSave} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-wood-50 border border-wood-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    WhatsApp Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-wood-50 border border-wood-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Default Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-wood-50 border border-wood-200 rounded-xl"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-wood-50 border border-wood-200 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Save Profile Changes
                </button>
              </form>
            ) : (
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                    {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{user?.displayName || 'Registered Maker'}</p>
                    <p className="text-[11px] text-slate-400">{user?.email}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-wood-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{user?.phone || 'No phone number saved yet'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {user?.address ? `${user.address}, PIN: ${user.pincode}` : 'No address saved yet'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-wood-100">
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    Role: {user?.role || 'customer'}
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Orders History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-wood-200/80 p-6 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-6 flex items-center gap-2 pb-3 border-b border-wood-100">
              <Package className="w-5 h-5 text-brand-600" />
              <span>Order History & Real-Time Status ({userOrders.length})</span>
            </h3>

            {userOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-wood-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-sm mb-1">No Orders Found</h4>
                <p className="text-xs text-slate-400 mb-4">You have not submitted any kit enquiries yet.</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-600 text-white font-bold text-xs"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => {
                  const orderWhatsAppUrl = generateWhatsAppOrderUrl(order);

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-wood-200/90 hover:border-wood-300 bg-wood-50/50 space-y-4"
                    >
                      {/* Order top bar */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-wood-200/60">
                        <div>
                          <span className="font-mono font-bold text-sm text-brand-700">#{order.id}</span>
                          <span className="text-xs text-slate-400 ml-3">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.status)}
                          <span className="font-black text-sm text-slate-900">
                            ₹{order.totalAmount?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-9 h-9 rounded-lg object-cover border border-wood-200"
                              />
                              <div>
                                <span className="font-semibold text-slate-800">{item.name}</span>
                                <span className="text-slate-400 ml-1.5 font-medium">× {item.quantity}</span>
                                {item.selectedAssembly && (
                                  <span className="text-[10px] text-wood-700 block">
                                    {item.selectedAssembly} • {item.selectedMaterial}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-slate-700">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-wood-200/60 text-xs">
                        <span className="text-[11px] text-slate-500">
                          Destination: {order.address}, PIN {order.pincode}
                        </span>

                        <a
                          href={orderWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Chat Regarding Order</span>
                        </a>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
