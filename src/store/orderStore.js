import { create } from 'zustand';

const ORDERS_STORAGE_KEY = 'kitsatoz_orders_v2';

// Clear legacy dummy orders from old storage key if present
try {
  localStorage.removeItem('kitsatoz_orders_v1');
} catch (e) {}

const INITIAL_ORDERS = [];

export const useOrderStore = create((set, get) => {
  const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
  let initial = INITIAL_ORDERS;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        initial = parsed;
      }
    } catch (e) {
      console.error('Error parsing stored orders', e);
    }
  }

  const persist = (orders) => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    set({ orders });
  };

  return {
    orders: initial,

    addOrder: (orderData) => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newOrder = {
        ...orderData,
        id: orderData.id || `KTOZ-${randomSuffix}`,
        createdAt: new Date().toISOString(),
        status: orderData.status || 'New',
        paymentMethod: 'UPI / WhatsApp Verification'
      };
      const updated = [newOrder, ...get().orders];
      persist(updated);
      return newOrder;
    },

    updateOrderStatus: (orderId, newStatus) => {
      const updated = get().orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      persist(updated);
    },

    getOrdersByUser: (email) => {
      if (!email) return [];
      return get().orders.filter(order => 
        (order.email || '').toLowerCase() === email.toLowerCase()
      );
    },

    getOrderById: (orderId) => {
      return get().orders.find(order => order.id === orderId);
    },

    clearAllOrders: () => {
      persist([]);
    }
  };
});
