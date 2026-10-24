import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AdminRoute = ({ children }) => {
  const { user, authInitialized } = useAuthStore();
  const location = useLocation();

  if (!authInitialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in -> go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not admin -> show unauthorized screen
  if (user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 shadow-soft text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Access Restricted</h2>
        <p className="text-slate-600 mb-6 text-sm">
          You are currently signed in as <strong>{user.email}</strong> with role: <code className="bg-slate-100 px-2 py-0.5 rounded text-rose-600 font-semibold">{user.role}</code>. This area is reserved for store administrators.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 py-2 px-5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Store
        </Link>
      </div>
    );
  }

  return children;
};

