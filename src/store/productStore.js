import { create } from 'zustand';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_STORAGE_KEY = 'kitsatoz_products_v5';

export const useProductStore = create((set, get) => {
  const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  let initial = INITIAL_PRODUCTS;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Automatically merge new items from INITIAL_PRODUCTS that are not yet in local storage
        const existingIds = new Set(parsed.map(p => String(p.id)));
        const newProducts = INITIAL_PRODUCTS.filter(p => !existingIds.has(String(p.id)));
        // Refresh default items images and categories
        const updatedParsed = parsed.map(p => {
          const match = INITIAL_PRODUCTS.find(ip => String(ip.id) === String(p.id));
          if (match) {
            return {
              ...match,
              ...p,
              images: match.images,
              category: match.category
            };
          }
          return p;
        });
        initial = [...newProducts, ...updatedParsed];
      }
    } catch (e) {
      console.error('Error parsing stored products', e);
    }
  }
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initial));

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
