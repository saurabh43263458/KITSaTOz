import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal, getShipping, getTotal, clearCart } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();

  const freeShippingThreshold = 1999;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = freeShippingThreshold - subtotal;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-wood-100 text-wood-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          You haven't added any 3D-printed automata or wooden DIY kits to your cart yet.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft transition-all"
        >
          <span>Explore Kits</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">
          Review Your Order
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
          Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} Items)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-white rounded-2xl border border-wood-200/80 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-600" />
                {remainingForFree <= 0 ? (
                  <strong className="text-emerald-600">🎉 Congratulations! You have unlocked FREE Express Shipping!</strong>
                ) : (
                  <span>Add <strong>₹{remainingForFree.toLocaleString()}</strong> more to get <strong>FREE Shipping</strong></span>
                )}
              </span>
              <span>{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full bg-wood-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              ></div>
            </div>
          </div>

          {/* Cart Table / Card List */}
          <div className="bg-white rounded-2xl border border-wood-200/80 overflow-hidden shadow-xs divide-y divide-wood-100">
            {items.map((item) => (
              <div key={item.itemKey} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-wood-200 shrink-0"
                  />
                  <div>
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-bold text-sm text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    
                    {/* Selected Variations */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 mt-1">
                      {item.selectedMaterial && (
                        <span className="bg-wood-100 px-2 py-0.5 rounded text-wood-800 font-medium">
                          {item.selectedMaterial}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="bg-wood-100 px-2 py-0.5 rounded text-wood-800 font-medium">
                          {item.selectedColor}
                        </span>
                      )}
                      {item.selectedAssembly && (
                        <span className="bg-brand-50 text-brand-800 px-2 py-0.5 rounded font-medium">
                          {item.selectedAssembly}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 sm:hidden font-black text-slate-900 text-sm">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Controls & Price */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                  {/* Quantity buttons */}
                  <div className="flex items-center border border-wood-300 rounded-xl bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.itemKey, -1)}
                      className="p-1.5 px-2.5 text-slate-600 hover:bg-wood-100 text-xs font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.itemKey, 1)}
                      className="p-1.5 px-2.5 text-slate-600 hover:bg-wood-100 text-xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Desktop Item Total */}
                  <div className="hidden sm:block text-right">
                    <span className="font-black text-slate-900 text-base">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-400">₹{item.price.toLocaleString()} each</p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeItem(item.itemKey)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs font-bold text-slate-600 hover:text-brand-600"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={() => clearCart()}
              className="text-xs font-medium text-slate-400 hover:text-rose-600"
            >
              Clear Entire Cart
            </button>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-wood-200/80 p-6 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-wood-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Estimated Shipping</span>
                <span className="font-bold">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 uppercase font-bold text-[11px]">Free</span>
                  ) : (
                    <span>₹{shipping}</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & GST (Included)</span>
                <span className="text-slate-400">₹0.00</span>
              </div>

              <div className="pt-3 border-t border-wood-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Estimated Total</span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-soft transition-all transform hover:-translate-y-0.5"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 bg-wood-50 rounded-xl border border-wood-200/60 text-[11px] text-slate-500 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Orders verified manually on WhatsApp by our engineering team with payment link / UPI before final dispatch.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
