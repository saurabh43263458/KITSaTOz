import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { toast } from '../store/toastStore';
import { Hammer, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loginWithGoogle, loading } = useAuthStore();
  const { addUser } = useUserStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const res = await register(email, password, name);
    if (res.success) {
      addUser({ displayName: name, email, role: 'customer' });
      toast.success('Account Created!', `Welcome to KITSaTOz, ${name}!`);
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.error || 'Failed to register account.');
      toast.error('Registration Failed', res.error);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    setGoogleLoading(true);
    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (res.success) {
      if (!res.redirecting) {
        toast.success('Welcome to KITSaTOz!', 'Your account has been created & signed in with Google.');
        navigate(from, { replace: true });
      }
    } else {
      setErrorMessage(res.error || 'Google registration was cancelled or failed.');
      toast.error('Google Registration Failed', res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-wood-200/80 p-8 shadow-soft-lg">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-wood-800 text-white flex items-center justify-center mx-auto mb-3 shadow-soft">
            <Hammer className="w-6 h-6 -rotate-12" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Join the Makers Network
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create an account to track kits, customize builds, and order seamlessly
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password (Min 6 chars)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-wood-50 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-soft transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-wood-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold">Or continue with</span>
          </div>
        </div>

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-wood-300 bg-white hover:bg-wood-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors disabled:opacity-60"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{googleLoading ? 'Setting up account with Google...' : 'Sign up with Google'}</span>
        </button>


        <p className="text-center text-xs text-slate-500 mt-6">
          Already registered?{' '}
          <Link
            to="/login"
            state={{ from: location.state?.from }}
            className="text-brand-600 hover:text-brand-700 font-bold"
          >
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
};
