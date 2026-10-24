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
import { syncUserToFirestore } from '../services/users';
import { useUserStore } from './userStore';

const STORAGE_KEY = 'kitsatoz_auth_user';

// Check if email matches configured admin email(s)
const checkIsAdmin = (email) => {
  if (!email) return false;
  const rawAdmins = import.meta.env.VITE_ADMIN_EMAIL || 'sm427878@gmail.com,admin@kitsatoz.com';
  const adminEmails = rawAdmins.split(',').map(e => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
};

export const useAuthStore = create((set, get) => {
  // Read cached session from localStorage
  const savedUser = localStorage.getItem(STORAGE_KEY);
  const initialUser = savedUser ? JSON.parse(savedUser) : null;

  return {
    user: initialUser,
    loading: false,
    authInitialized: false,

    // Initialize Auth Listener with Firebase
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

            // Automatically record real registered user in userStore and Firestore
            try {
              useUserStore.getState().addUser(userObj);
              syncUserToFirestore(userObj);
            } catch (e) {
              // ignore
            }
          } else {
            localStorage.removeItem(STORAGE_KEY);
            set({ user: null, authInitialized: true });
          }
        });
      } else {
        set({ authInitialized: true });
      }
    },

    login: async (email, password) => {
      set({ loading: true });
      try {
        if (!isFirebaseConfigured || !auth) {
          throw new Error('Firebase Authentication is not configured.');
        }

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
      } catch (err) {
        set({ loading: false });
        let friendlyMsg = err.message;
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          friendlyMsg = 'Invalid email or password. Please verify credentials or create an account.';
        } else if (err.code === 'auth/wrong-password') {
          friendlyMsg = 'Incorrect password.';
        } else if (err.code === 'auth/too-many-requests') {
          friendlyMsg = 'Too many attempts. Please try again later or reset password.';
        }
        return { success: false, error: friendlyMsg };
      }
    },

    register: async (email, password, displayName) => {
      set({ loading: true });
      try {
        if (!isFirebaseConfigured || !auth) {
          throw new Error('Firebase Authentication is not configured.');
        }

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
      } catch (err) {
        set({ loading: false });
        let friendlyMsg = err.message;
        if (err.code === 'auth/email-already-in-use') {
          friendlyMsg = 'An account with this email already exists. Please sign in instead.';
        } else if (err.code === 'auth/weak-password') {
          friendlyMsg = 'Password should be at least 6 characters.';
        }
        return { success: false, error: friendlyMsg };
      }
    },

    loginWithGoogle: async () => {
      set({ loading: true });
      try {
        if (!isFirebaseConfigured || !auth || !googleProvider) {
          throw new Error('Firebase Authentication is not configured.');
        }

        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
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
      } catch (err) {
        set({ loading: false });
        let friendlyMsg = err.message;
        if (err.code === 'auth/popup-closed-by-user') {
          friendlyMsg = 'Sign in popup was closed before completing.';
        }
        return { success: false, error: friendlyMsg };
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
    }
  };
});

