import { create } from 'zustand';

const CART_STORAGE_KEY = 'kitsatoz_cart_v1';

export const useCartStore = create((set, get) => {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  const initialItems = savedCart ? JSON.parse(savedCart) : [];

  const persist = (items) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    set({ items });
  };

  return {
    items: initialItems,
    isCartOpen: false,

    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),

    addItem: (product, { quantity = 1, selectedMaterial = '', selectedColor = '', selectedAssembly = '' } = {}) => {
      const items = get().items;
      const itemKey = `${product.id}-${selectedMaterial}-${selectedColor}-${selectedAssembly}`;
      const existingIndex = items.findIndex(item => item.itemKey === itemKey);

      let newItems;
      if (existingIndex > -1) {
        newItems = [...items];
        newItems[existingIndex].quantity += quantity;
      } else {
        newItems = [
          ...items,
          {
            itemKey,
            productId: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.images?.[0] || '',
            quantity,
            selectedMaterial: selectedMaterial || product.materials?.[0] || 'Standard',
            selectedColor: selectedColor || product.colors?.[0] || 'Standard',
            selectedAssembly: selectedAssembly || product.assemblyOptions?.[0] || 'DIY Kit'
          }
        ];
      }
      persist(newItems);
    },

    updateQuantity: (itemKey, delta) => {
      const items = get().items;
      const newItems = items
        .map(item => {
          if (item.itemKey === itemKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
      persist(newItems);
    },

    setQuantity: (itemKey, quantity) => {
      const items = get().items;
      if (quantity <= 0) {
        get().removeItem(itemKey);
        return;
      }
      const newItems = items.map(item => 
        item.itemKey === itemKey ? { ...item, quantity } : item
      );
      persist(newItems);
    },

    removeItem: (itemKey) => {
      const items = get().items.filter(item => item.itemKey !== itemKey);
      persist(items);
    },

    clearCart: () => {
      persist([]);
    },

    // Getters
    getTotalItems: () => {
      return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },

    getSubtotal: () => {
      return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getShipping: () => {
      const subtotal = get().getSubtotal();
      if (subtotal === 0) return 0;
      return subtotal > 1999 ? 0 : 150; // Free shipping over ₹1999
    },

    getTotal: () => {
      return get().getSubtotal() + get().getShipping();
    }
  };
});
