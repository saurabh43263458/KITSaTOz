import { create } from 'zustand';

const USERS_STORAGE_KEY = 'kitsatoz_registered_users_v1';

const INITIAL_USERS = [
  {
    uid: 'usr-1',
    displayName: 'Rohit Sharma',
    email: 'rohit.s@example.com',
    role: 'customer',
    ordersCount: 3,
    totalSpent: 8740,
    registeredAt: '2026-09-14',
    city: 'Bengaluru, KA'
  },
  {
    uid: 'usr-2',
    displayName: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    role: 'customer',
    ordersCount: 2,
    totalSpent: 5598,
    registeredAt: '2026-09-28',
    city: 'Bengaluru, KA'
  },
  {
    uid: 'usr-3',
    displayName: 'Karthik Menon',
    email: 'karthik.m@example.com',
    role: 'customer',
    ordersCount: 4,
    totalSpent: 11290,
    registeredAt: '2026-10-02',
    city: 'Chennai, TN'
  },
  {
    uid: 'usr-4',
    displayName: 'Pooja Hegde',
    email: 'pooja.h@example.com',
    role: 'customer',
    ordersCount: 1,
    totalSpent: 3899,
    registeredAt: '2026-10-15',
    city: 'Mumbai, MH'
  },
  {
    uid: 'usr-admin',
    displayName: 'KITSaTOz Master Admin',
    email: 'admin@kitsatoz.com',
    role: 'admin',
    ordersCount: 0,
    totalSpent: 0,
    registeredAt: '2026-01-01',
    city: 'Bengaluru (HQ)'
  }
];

export const useUserStore = create((set, get) => {
  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  let initial = INITIAL_USERS;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        initial = parsed;
      }
    } catch (e) {
      console.error('Error parsing stored users', e);
    }
  } else {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  }

  const persist = (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    set({ users });
  };

  return {
    users: initial,

    addUser: (user) => {
      const exists = get().users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (exists) return;

      const newUser = {
        uid: user.uid || 'usr-' + Date.now(),
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        role: user.role || 'customer',
        ordersCount: 0,
        totalSpent: 0,
        registeredAt: new Date().toISOString().split('T')[0],
        city: user.city || 'India'
      };
      const updated = [newUser, ...get().users];
      persist(updated);
    }
  };
});
