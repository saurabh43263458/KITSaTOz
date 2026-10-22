import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';

const STORAGE_KEY = 'kitsatoz_auth_user';

// Check if email matches configured admin email or default admin
const checkIsAdmin = (email) => {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@kitsatoz.com';
  return (email || '').toLowerCase() === adminEmail.toLowerCase();
};

export const useAuthStore = create((set, get) => {
  // Read cached session from localStorage
  const savedUser = localStorage.getItem(STORAGE_KEY);
  const initialUser = savedUser ? JSON.parse(savedUser) : null;

  return {
    user: initialUser,
    loading: false,
    authInitialized: false,

    // Initialize Auth Listener (Firebase or Local)
    initializeAuth: () => {
      if (isFirebaseConfigured && auth) {
        onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            const role = checkIsAdmin(firebaseUser.email) ? 'admin' : 'customer';
            const userObj = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              photoURL: firebaseUser.photoURL || null,
              role: role,
              isFirebase: true
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
            set({ user: userObj, authInitialized: true });
          } else {
            localStorage.removeItem(STORAGE_KEY);
            set({ user: null, authInitialized: true });
          }
        });
      } else {
        // Fallback local persistence
        set({ authInitialized: true });
      }
    },

    login: async (email, password) => {
      set({ loading: true });
      try {
        if (isFirebaseConfigured && auth) {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          const role = checkIsAdmin(firebaseUser.email) ? 'admin' : 'customer';
          const userObj = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL,
            role: role,
            isFirebase: true
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
          set({ user: userObj, loading: false });
          return { success: true };
        } else {
          // Local demo authentication simulation
          await new Promise(res => setTimeout(res, 400));
          const role = checkIsAdmin(email) ? 'admin' : 'customer';
          const mockUser = {
            uid: 'demo-' + Date.now(),
            email: email,
            displayName: email.split('@')[0],
            photoURL: null,
            role: role,
            isFirebase: false,
            phone: '9876543210',
            address: '221B Baker Street, Maker Quarter',
            pincode: '560001'
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
          set({ user: mockUser, loading: false });
          return { success: true };
        }
      } catch (err) {
        set({ loading: false });
        return { success: false, error: err.message };
      }
    },

    register: async (email, password, displayName) => {
      set({ loading: true });
      try {
        if (isFirebaseConfigured && auth) {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          if (displayName) {
            await updateFirebaseProfile(userCredential.user, { displayName });
          }
          const firebaseUser = userCredential.user;
          const role = checkIsAdmin(firebaseUser.email) ? 'admin' : 'customer';
          const userObj = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: displayName || firebaseUser.email.split('@')[0],
            photoURL: null,
            role: role,
            isFirebase: true
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
          set({ user: userObj, loading: false });
          return { success: true };
        } else {
          await new Promise(res => setTimeout(res, 400));
          const role = checkIsAdmin(email) ? 'admin' : 'customer';
          const mockUser = {
            uid: 'demo-' + Date.now(),
            email: email,
            displayName: displayName || email.split('@')[0],
            photoURL: null,
            role: role,
            isFirebase: false,
            phone: '',
            address: '',
            pincode: ''
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
          set({ user: mockUser, loading: false });
          return { success: true };
        }
      } catch (err) {
        set({ loading: false });
        return { success: false, error: err.message };
      }
    },

    loginWithGoogle: async () => {
      set({ loading: true });
      try {
        if (isFirebaseConfigured && auth && googleProvider) {
          const result = await signInWithPopup(auth, googleProvider);
          const firebaseUser = result.user;
          const role = checkIsAdmin(firebaseUser.email) ? 'admin' : 'customer';
          const userObj = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: role,
            isFirebase: true
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
          set({ user: userObj, loading: false });
          return { success: true };
        } else {
          // Local demo Google login simulation
          await new Promise(res => setTimeout(res, 400));
          const mockUser = {
            uid: 'google-demo-' + Date.now(),
            email: 'maker@gmail.com',
            displayName: 'Alex Maker (Google)',
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            role: 'customer',
            isFirebase: false,
            phone: '9876543210',
            address: '42 Artisan Way',
            pincode: '560002'
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
          set({ user: mockUser, loading: false });
          return { success: true };
        }
      } catch (err) {
        set({ loading: false });
        return { success: false, error: err.message };
      }
    },

    logout: async () => {
      if (isFirebaseConfigured && auth) {
        try {
          await signOut(auth);
        } catch (e) {
          console.error(e);
        }
      }
      localStorage.removeItem(STORAGE_KEY);
      set({ user: null });
    },

    updateUserProfile: (data) => {
      const current = get().user;
      if (!current) return;
      const updated = { ...current, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ user: updated });
    },

    // Developer / tester role switcher for immediate admin verification
    toggleAdminRole: () => {
      const current = get().user;
      if (!current) return;
      const newRole = current.role === 'admin' ? 'customer' : 'admin';
      const updated = { ...current, role: newRole };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ user: updated });
    }
  };
});
