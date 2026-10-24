import { create } from 'zustand';
import { isDummyUser, syncUserToFirestore } from '../services/users';

const USERS_STORAGE_KEY = 'kitsatoz_registered_users_v2';
const OLD_USERS_STORAGE_KEY = 'kitsatoz_registered_users_v1';

// Clean initial state - strictly NO fake/mock seed users!
const loadCleanUsers = () => {
  let list = [];
  try {
    const v2 = localStorage.getItem(USERS_STORAGE_KEY);
    if (v2) {
      list = JSON.parse(v2);
    } else {
      const v1 = localStorage.getItem(OLD_USERS_STORAGE_KEY);
      if (v1) {
        list = JSON.parse(v1);
      }
    }
  } catch (e) {
    console.error('Error parsing stored users', e);
  }

  // Strictly filter out all mock / dummy seed accounts
  const clean = Array.isArray(list) ? list.filter(u => !isDummyUser(u)) : [];

  // Persist the clean list to v2 and purge old dummy seed v1
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(clean));
    localStorage.removeItem(OLD_USERS_STORAGE_KEY);
  } catch (e) {
    // ignore
  }

  return clean;
};

export const useUserStore = create((set, get) => {
  const initial = loadCleanUsers();

  const persist = (users) => {
    const cleanOnly = users.filter(u => !isDummyUser(u));
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cleanOnly));
    set({ users: cleanOnly });
  };

  return {
    users: initial,

    addUser: (user) => {
      if (!user || !user.email) return;
      if (isDummyUser(user)) return;

      const current = get().users;
      const existingIndex = current.findIndex(
        u => (u.email || '').toLowerCase() === user.email.toLowerCase() || (user.uid && u.uid === user.uid)
      );

      const userRecord = {
        uid: user.uid || 'usr-' + Date.now(),
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        role: user.role || 'customer',
        ordersCount: Number(user.ordersCount || 0),
        totalSpent: Number(user.totalSpent || 0),
        registeredAt: user.registeredAt || new Date().toISOString().split('T')[0],
        city: user.city || 'India'
      };

      let updated;
      if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] = { ...updated[existingIndex], ...userRecord };
      } else {
        updated = [userRecord, ...current];
      }

      persist(updated);

      // Also sync to Firestore
      syncUserToFirestore(userRecord);
    },

    deleteUser: (uid) => {
      const updated = get().users.filter(u => u.uid !== uid);
      persist(updated);
    },

    setUsers: (users) => {
      persist(users);
    }
  };
});
