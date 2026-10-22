import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { toast } from '../store/toastStore';
import { sendOrderEmailNotification } from '../services/emailService';
import { generateWhatsAppOrderUrl } from '../services/whatsappService';
import { 
  ShieldCheck, 
  Truck, 
  MessageCircle, 
  Lock, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full Name is required (at least 3 characters)'),
  phone: z.string().min(10, 'Valid 10-digit WhatsApp phone number is required'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().min(10, 'Complete shipping address is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Must be a valid 6-digit Indian PIN code'),
  customizationNotes: z.string().optional()
});

export const Checkout = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuthStore();
  const { items, getSubtotal, getShipping, getTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();

  const [submitting, setSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.displayName || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: user?.address || '',
      pincode: user?.pincode || '',
      customizationNotes: ''
    }
  });

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-wood-200 text-center shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Items In Cart</h2>
        <p className="text-sm text-slate-500 mb-6">Please add kits to your cart before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-full"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const onOrderSubmit = async (data) => {
    setSubmitting(true);

    try {
      // 1. Build order payload
      const orderData = {
        customerName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        pincode: data.pincode,
        customizationNotes: data.customizationNotes || '',
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selectedMaterial: item.selectedMaterial,
          selectedColor: item.selectedColor,
          selectedAssembly: item.selectedAssembly
        })),
        subtotal,
        shipping,
        totalAmount: total,
        userUid: user?.uid || null
      };

      // 2. Persist order in store (and database)
      const createdOrder = addOrder(orderData);

      // Save user profile details for next time
      updateUserProfile({
        phone: data.phone,
        address: data.address,
        pincode: data.pincode
      });

      // 3. Send email notification
      await sendOrderEmailNotification(createdOrder);

      // 4. Construct WhatsApp pre-filled order URL
      const whatsAppUrl = generateWhatsAppOrderUrl(createdOrder);

      // Open WhatsApp in a popup/new window
      window.open(whatsAppUrl, '_blank');

      // 5. Clear cart
      clearCart();

      toast.success('Order Recorded Successfully!', 'WhatsApp inquiry generated and email dispatched.');

      // 6. Navigate to confirmation page
      navigate('/order-success', { state: { order: createdOrder } });

    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Order Submission Failed', err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">
          Finalize Order
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Express Checkout & WhatsApp Verification
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Signed in as <strong>{user?.email}</strong>. Please confirm your delivery destination.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Delivery Details Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-wood-200/80 p-6 sm:p-8 shadow-xs">
            
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 pb-3 border-b border-wood-100">
              <MapPin className="w-5 h-5 text-brand-600" />
              <span>Shipping & Customer Details</span>
            </h2>

            <form onSubmit={handleSubmit(onOrderSubmit)} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="e.g. Rahul Verma"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-rose-600 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3 py-2.5 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Complete Delivery Address *
                </label>
                <textarea
                  rows={3}
                  {...register('address')}
                  placeholder="Apartment/House No, Street, Landmark, City, State"
                  className="w-full p-3 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                ></textarea>
                {errors.address && (
                  <p className="text-xs text-rose-600 mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  6-Digit Postal Pincode *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  {...register('pincode')}
                  placeholder="e.g. 560001"
                  className="w-full sm:w-1/2 px-3 py-2.5 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
                {errors.pincode && (
                  <p className="text-xs text-rose-600 mt-1">{errors.pincode.message}</p>
                )}
              </div>

              {/* Customization Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Customization Notes & Instructions (Optional)
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    {...register('customizationNotes')}
                    placeholder="Specific color requests, custom mounting holes, gift wrap notes, or laser engraving letters..."
                    className="w-full p-3 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  ></textarea>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Our CAD designers and assemblers review these notes before dispatch.</p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-soft transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5 text-brand-200" />
                  <span>{submitting ? 'Creating Order & Pre-filling WhatsApp...' : 'Submit Order & Open WhatsApp'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

          </div>
        </div>

        {/* Right Column: Order Summary & Workflow Notice */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-wood-200/80 p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-wood-100">
              Items In Your Order ({items.length})
            </h3>

            {/* Compact Item list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-wood-100">
              {items.map((item) => (
                <div key={item.itemKey} className="pt-2 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-wood-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-brand-700 truncate">
                      {item.selectedMaterial} • {item.selectedAssembly}
                    </p>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-wood-200 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Pan-India Shipping</span>
                <span className="font-bold text-slate-900">
                  {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="pt-3 border-t border-wood-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Payable</span>
                <span className="text-2xl font-black text-slate-900">₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Process Box */}
            <div className="p-4 rounded-2xl bg-wood-50 border border-wood-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Manual Verification & UPI Link</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Upon submitting, a pre-filled WhatsApp message opens with your order ID. A maker sales agent checks kit availability and sends a direct payment link / UPI QR code. No upfront cards required.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
