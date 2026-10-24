import { useState, useEffect } from 'react';
import { getProducts } from '../services/products';
import { useProductStore } from '../store/productStore';

/**
 * Custom hook to fetch products.
 * Seamlessly merges Firestore data with local productStore so products always render.
 * Returns { products, loading, error, refetch }
 */
export const useProducts = () => {
  const storeProducts = useProductStore((state) => state.products);
  const [products, setProducts] = useState(storeProducts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(useProductStore.getState().products);
      }
    } catch (err) {
      console.warn('Failed to load products from Firestore, using local store:', err);
      setProducts(useProductStore.getState().products);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync when storeProducts updates (e.g. from Admin additions)
  useEffect(() => {
    if (storeProducts && storeProducts.length > 0) {
      setProducts(storeProducts);
    }
  }, [storeProducts]);

  const activeProducts = products.length > 0 ? products : storeProducts;

  return { products: activeProducts, loading, error, refetch: fetchProducts };
};
