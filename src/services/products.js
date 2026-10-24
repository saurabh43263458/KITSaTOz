import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { useProductStore } from '../store/productStore';

/**
 * Helper to slugify a product title.
 */
export const slugify = (text) => {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Fetches all published products from Firestore.
 * Falls back to local productStore if Firestore is not configured or empty.
 * @returns {Promise<Array>} List of product objects { id, ...data }
 */
export const getProducts = async () => {
  if (!isFirebaseConfigured || !db) {
    return useProductStore.getState().products;
  }
  try {
    const q = query(collection(db, 'products'), where('published', '==', true));
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((docSnap) => {
      products.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (products.length === 0) {
      return useProductStore.getState().products;
    }
    return products;
  } catch (err) {
    console.warn('Firestore fetch failed, falling back to local store:', err);
    return useProductStore.getState().products;
  }
};

/**
 * Subscribes to live products collection in Firestore.
 * Invokes callback with array of product objects whenever Firestore data changes.
 * @param {Function} callback 
 * @returns {Function} Unsubscribe function
 */
export const subscribeToProducts = (callback) => {
  if (!isFirebaseConfigured || !db) {
    callback(useProductStore.getState().products);
    return () => {};
  }

  try {
    const productsCol = collection(db, 'products');
    const unsubscribe = onSnapshot(
      productsCol,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(list);
      },
      (error) => {
        console.warn('Live products listener error, falling back to store:', error);
        callback(useProductStore.getState().products);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to products:', err);
    callback(useProductStore.getState().products);
    return () => {};
  }
};

/**
 * Creates a new product document directly in Firestore.
 * Also keeps local Zustand product store in sync.
 * @param {Object} productData 
 * @returns {Promise<Object>} Created product object
 */
export const createProductInFirestore = async (productData) => {
  const baseSlug = slugify(productData.name) || `prod-${Date.now()}`;
  const docId = productData.id || baseSlug;

  const payload = {
    ...productData,
    id: docId,
    slug: productData.slug || baseSlug,
    category: productData.category || '3D Printed Kits',
    categories: Array.isArray(productData.categories) && productData.categories.length > 0
      ? productData.categories
      : [productData.category || '3D Printed Kits'],
    price: Number(productData.price) || 0,
    comparePrice: productData.comparePrice ? Number(productData.comparePrice) : (productData.originalPrice ? Number(productData.originalPrice) : null),
    stock: Number(productData.stock !== undefined ? productData.stock : (productData.stockCount || 10)),
    stockCount: Number(productData.stockCount !== undefined ? productData.stockCount : (productData.stock || 10)),
    published: productData.published !== undefined ? productData.published : true,
    customizable: Boolean(productData.customizable || productData.isCustomOption),
    badge: productData.badge || '',
    shortDescription: productData.shortDescription || '',
    fullDescription: productData.fullDescription || productData.description || '',
    description: productData.description || productData.shortDescription || productData.fullDescription || '',
    images: Array.isArray(productData.images) && productData.images.length > 0 
      ? productData.images 
      : [productData.imageUrl || '/products/robot-wheels-set-4.jpg'],
    specs: productData.specs || productData.specifications || {},
    createdAt: serverTimestamp()
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'products', docId), payload);
      console.log(`Product created in Firestore: ${docId}`);
    } catch (err) {
      console.error('Failed to save product in Firestore:', err);
      throw err;
    }
  }

  // Sync to local store
  useProductStore.getState().addProduct(payload);
  return payload;
};

/**
 * Updates an existing product document in Firestore.
 * @param {string} productId 
 * @param {Object} updateData 
 */
export const updateProductInFirestore = async (productId, updateData) => {
  const payload = { ...updateData };
  
  if (updateData.stock !== undefined) {
    payload.stock = Number(updateData.stock);
    payload.stockCount = Number(updateData.stock);
  } else if (updateData.stockCount !== undefined) {
    payload.stock = Number(updateData.stockCount);
    payload.stockCount = Number(updateData.stockCount);
  }

  if (updateData.price !== undefined) {
    payload.price = Number(updateData.price);
  }
  if (updateData.comparePrice !== undefined) {
    payload.comparePrice = Number(updateData.comparePrice);
  }

  if (isFirebaseConfigured && db) {
    try {
      const prodRef = doc(db, 'products', productId);
      await setDoc(prodRef, payload, { merge: true });
      console.log(`Product updated in Firestore: ${productId}`);
    } catch (err) {
      console.error('Failed to update product in Firestore:', err);
      throw err;
    }
  }

  // Sync local store
  useProductStore.getState().updateProduct(productId, payload);
};

/**
 * Deletes a product document from Firestore.
 * @param {string} productId 
 */
export const deleteProductFromFirestore = async (productId) => {
  if (isFirebaseConfigured && db) {
    try {
      const prodRef = doc(db, 'products', productId);
      await deleteDoc(prodRef);
      console.log(`Product deleted from Firestore: ${productId}`);
    } catch (err) {
      console.error('Failed to delete product from Firestore:', err);
      throw err;
    }
  }

  // Sync local store
  useProductStore.getState().deleteProduct(productId);
};

/**
 * Fetches a product by its slug (or document ID).
 * Falls back to local productStore if not found in Firestore.
 * @param {string} slug 
 * @returns {Promise<Object|null>}
 */
export const getProductBySlug = async (slug) => {
  if (!slug) return null;

  if (isFirebaseConfigured && db) {
    try {
      // First try direct document lookup by document ID
      const directDocRef = doc(db, 'products', slug);
      const directDocSnap = await getDoc(directDocRef);
      if (directDocSnap.exists()) {
        return { id: directDocSnap.id, ...directDocSnap.data() };
      }

      // Fallback to query by slug field
      const q = query(collection(db, 'products'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const foundDoc = querySnapshot.docs[0];
        return { id: foundDoc.id, ...foundDoc.data() };
      }
    } catch (err) {
      console.warn('Firestore getProductBySlug failed, falling back to local store:', err);
    }
  }

  return useProductStore.getState().getProductById(slug) || null;
};

/**
 * Helper to resolve fallback image paths if Storage bucket has not finished initializing.
 */
export const getProductImageSrc = (imgUrl) => {
  if (!imgUrl) return '/products/robot-wheels-set-4.jpg';
  return imgUrl;
};

