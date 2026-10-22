import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { generateWhatsAppOrderUrl } from '../services/whatsappService';
import { CheckCircle2, MessageCircle, Package, ArrowRight, Home, Calendar, Clock } from 'lucide-react';

export const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // Fire celebratory confetti explosion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-wood-200 text-center shadow-xs">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
        <p className="text-sm text-slate-500 mb-6">
          Thank you for choosing KITSaTOz. Your maker order is being processed by our team.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-full"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const whatsAppUrl = generateWhatsAppOrderUrl(order);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-wood-200/80 p-8 shadow-soft-lg text-center relative overflow-hidden">
        
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order Enquiry Recorded
        </span>

        <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
          Thank You, {order.customerName}!
        </h1>

        <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
          Your order has been registered as <span className="font-mono font-bold text-brand-600">#{order.id}</span>. We've sent a confirmation summary to <strong>{order.email}</strong>.
        </p>

        {/* Action Button for WhatsApp */}
        <div className="mt-6 p-4 rounded-2xl bg-wood-50 border border-wood-200 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Didn't see WhatsApp open automatically?</p>
              <p className="text-[11px] text-slate-500">Click below to send your order directly to our sales desk.</p>
            </div>
          </div>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 text-center"
          >
            Open WhatsApp Chat
          </a>
        </div>

      </div>

      {/* Order Breakdown Card */}
      <div className="mt-8 bg-white rounded-3xl border border-wood-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-wood-100 gap-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Order Details</h3>
            <p className="text-xs text-slate-400">Order ID: #{order.id}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-wood-700 bg-wood-100 px-3 py-1 rounded-full font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Status: {order.status}</span>
          </div>
        </div>

        {/* Items */}
        <div className="divide-y divide-wood-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-wood-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-wood-700">
                    {item.selectedMaterial} • {item.selectedColor} • {item.selectedAssembly}
                  </p>
                </div>
              </div>
              <span className="font-black text-xs text-slate-900">
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-wood-100 text-xs text-slate-600">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Delivery Destination</h4>
            <p>{order.address}</p>
            <p>PIN: {order.pincode}</p>
            <p className="mt-1 font-semibold text-slate-800">Phone: {order.phone}</p>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <div className="flex justify-between sm:justify-end sm:gap-6">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">₹{order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between sm:justify-end sm:gap-6">
              <span>Shipping:</span>
              <span className="font-bold text-slate-900">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between sm:justify-end sm:gap-6 pt-2 border-t border-wood-100 text-sm">
              <span className="font-bold text-slate-900">Total:</span>
              <span className="font-black text-slate-900">₹{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-wood-100">
          <Link
            to="/profile"
            className="w-full sm:w-auto text-center py-2.5 px-5 bg-wood-100 hover:bg-wood-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
          >
            Track in My Orders
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto text-center py-2.5 px-5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Explore More Kits →
          </Link>
        </div>

      </div>

    </div>
  );
};
