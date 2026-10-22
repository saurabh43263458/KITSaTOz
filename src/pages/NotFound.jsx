import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Home, ArrowRight } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md bg-white rounded-3xl border border-wood-200/80 p-8 sm:p-12 shadow-soft space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-wood-100 text-brand-600 flex items-center justify-center mx-auto mb-2">
          <Hammer className="w-8 h-8 -rotate-45" />
        </div>
        <span className="font-mono text-4xl font-black text-brand-600 block">404</span>
        <h1 className="text-2xl font-bold text-slate-900">Blueprint Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The page or model you are seeking has been moved, disassembled, or never existed in our maker index.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-wood-100 hover:bg-wood-200 text-slate-800 font-semibold text-xs transition-colors"
          >
            <span>Explore Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
