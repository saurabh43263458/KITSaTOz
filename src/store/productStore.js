import { create } from 'zustand';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_STORAGE_KEY = 'kitsatoz_products_v1';

export const useProductStore = create((set, get) => {
  const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  let initial = INITIAL_PRODUCTS;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        initial = parsed;
      }
    } catch (e) {
      console.error('Error parsing stored products', e);
    }
  } else {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }

  const persist = (products) => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    set({ products });
  };

  return {
    products: initial,

    getProductById: (id) => {
      return get().products.find(p => String(p.id) === String(id));
    },

    addProduct: (product) => {
      const newProduct = {
        ...product,
        id: 'prod-' + Date.now(),
        rating: 5.0,
        reviewCount: 1,
        inStock: Number(product.stockCount) > 0
      };
      const updated = [newProduct, ...get().products];
      persist(updated);
      return newProduct;
    },

    updateProduct: (id, fields) => {
      const updated = get().products.map(p => {
        if (String(p.id) === String(id)) {
          const merged = { ...p, ...fields };
          merged.inStock = Number(merged.stockCount) > 0;
          return merged;
        }
        return p;
      });
      persist(updated);
    },

    deleteProduct: (id) => {
      const updated = get().products.filter(p => String(p.id) !== String(id));
      persist(updated);
    },

    resetToDefaults: () => {
      persist(INITIAL_PRODUCTS);
    }
  };
});
