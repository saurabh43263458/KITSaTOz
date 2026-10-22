import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const ProtectedRoute = ({ children }) => {
  const { user, authInitialized } = useAuthStore();
  const location = useLocation();

  if (!authInitialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login while preserving target route in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
