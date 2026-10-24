import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, MessageCircle, Mail, MapPin, Clock, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { getWhatsAppNumber } from '../../services/whatsappService';

export const Footer = () => {
  const whatsAppPhone = getWhatsAppNumber();

  return (
    <footer className="bg-wood-950 text-wood-200 mt-20 pt-16 pb-12 border-t border-wood-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Value props banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-wood-800/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Verified Pan-India Delivery</h4>
              <p className="text-xs text-wood-400 mt-0.5">Custom protective foam packaging for every 3D and wooden kit.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Precision Guaranteed</h4>
              <p className="text-xs text-wood-400 mt-0.5">0.12mm CNC & 3D tolerances with replacement parts guarantee.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Dedicated WhatsApp Support</h4>
              <p className="text-xs text-wood-400 mt-0.5">Direct chat with maker engineers for assembly guidance.</p>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-wood-700 flex items-center justify-center text-white">
                <Hammer className="w-5 h-5 -rotate-12" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                KITS<span className="text-brand-500">a</span>TOz
              </span>
            </Link>
            <p className="text-sm text-wood-300 leading-relaxed max-w-sm">
              We engineer tactile wonder. Premium additive manufactured mechanical automata, artisan laser-cut wooden kinetic kits, and bespoke engineering prototyping.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsAppPhone}?text=Hi%20KITSaTOz!%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop Kits</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop?category=3D+Printed+Kits" className="text-wood-300 hover:text-brand-400 transition-colors">
                  3D Printed Kits
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Wooden+DIY+Kits" className="text-wood-300 hover:text-brand-400 transition-colors">
                  Wooden DIY Kits
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Robotics+%26+Components" className="text-wood-300 hover:text-brand-400 transition-colors">
                  Robotics & Components
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Custom+Prototypes" className="text-wood-300 hover:text-brand-400 transition-colors">
                  Custom Prototyping
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
                  Shop All Kits →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-wood-300 hover:text-brand-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-wood-300 hover:text-brand-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-wood-300 hover:text-brand-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-wood-300 hover:text-brand-400 transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Makers HQ</h5>
            <ul className="space-y-3 text-xs text-wood-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Ghaziabad,Uttar Pradesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span>24*7</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:support@kitsatoz.com" className="hover:text-brand-400">
                  kitsatoz@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-wood-900 flex flex-col sm:flex-row items-center justify-between text-xs text-wood-500 gap-4">
          <p>© {new Date().getFullYear()} KITSaTOz Inc. All rights reserved. Designed for Makers & Dreamers. By Saurabh Mishra</p>
          <div className="flex gap-6">
            <span className="hover:text-wood-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-wood-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-wood-300 cursor-pointer">Assembly Guide Portal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
