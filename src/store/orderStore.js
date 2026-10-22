import { create } from 'zustand';

const ORDERS_STORAGE_KEY = 'kitsatoz_orders_v1';

const INITIAL_ORDERS = [
  {
    id: 'KTOZ-7492',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    customerName: 'Rohit Sharma',
    email: 'rohit.s@example.com',
    phone: '+91 98451 22341',
    address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru',
    pincode: '560103',
    customizationNotes: 'Please print the chassis in Matte Charcoal if possible.',
    items: [
      {
        productId: 'prod-1',
        name: 'Precision Tourbillon Desk Automaton',
        price: 3499,
        quantity: 1,
        selectedMaterial: 'Matte PLA+ Composite',
        selectedColor: 'Terracotta & Charcoal',
        selectedAssembly: 'DIY Kit (Unassembled)',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 3499,
    shipping: 0,
    totalAmount: 3499,
    status: 'Verified',
    paymentMethod: 'UPI / WhatsApp Verification'
  },
  {
    id: 'KTOZ-7491',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    customerName: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    phone: '+91 97112 45890',
    address: 'Villa 12, Palm Meadows, Whitefield, Bengaluru',
    pincode: '560066',
    customizationNotes: 'Gift packaging requested with Birthday card note.',
    items: [
      {
        productId: 'prod-3',
        name: 'Artisan Kinetic Marble Rollercoaster',
        price: 2799,
        quantity: 1,
        selectedMaterial: 'Natural Baltic Birch',
        selectedColor: 'Natural Warm Birch',
        selectedAssembly: 'Pre-Assembled Gift Edition (+₹950)',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 2799,
    shipping: 0,
    totalAmount: 2799,
    status: 'Shipped',
    paymentMethod: 'UPI / WhatsApp Verification'
  },
  {
    id: 'KTOZ-7490',
    createdAt: new Date(Date.now() - 3600000 * 52).toISOString(),
    customerName: 'Karthik Menon',
    email: 'karthik.m@example.com',
    phone: '+91 98840 99120',
    address: '88, Lake View Enclave, Anna Nagar, Chennai',
    pincode: '600040',
    customizationNotes: 'Please drill 3.5mm holes for Raspberry Pi 4 mounting.',
    items: [
      {
        productId: 'prod-6',
        name: 'Bespoke IoT Enclosure & Sensor Rig Prototype',
        price: 2199,
        quantity: 2,
        selectedMaterial: 'Tough PETG',
        selectedColor: 'Industrial Light Grey (RAL 7035)',
        selectedAssembly: 'DIY Kit (Enclosure + Hardware)',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 4398,
    shipping: 0,
    totalAmount: 4398,
    status: 'Delivered',
    paymentMethod: 'UPI / WhatsApp Verification'
  }
];

export const useOrderStore = create((set, get) => {
  const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
  let initial = INITIAL_ORDERS;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        initial = parsed;
      }
    } catch (e) {
      console.error('Error parsing stored orders', e);
    }
  } else {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
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
        id: `KTOZ-${randomSuffix}`,
        createdAt: new Date().toISOString(),
        status: 'New',
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
    }
  };
});
