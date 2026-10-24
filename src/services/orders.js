import { 
  collection, 
  setDoc,
  doc, 
  deleteDoc,
  onSnapshot, 
  serverTimestamp
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './firebase';

/**
 * Creates a new order document in Firestore.
 * 
 * @param {Object} orderData 
 * @returns {Promise<Object>} Created order document reference
 */
export const createOrder = async (orderData) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firestore is not configured.');
  }

  const currentUser = auth?.currentUser;
  const uid = currentUser?.uid || orderData.userUid || 'guest-' + Date.now();
  const orderId = orderData.id || `KTOZ-${Math.floor(1000 + Math.random() * 9000)}`;

  // Format line items
  const formattedItems = (orderData.items || []).map(item => ({
    id: item.productId || item.id || '',
    name: item.name || '',
    price: Number(item.price) || 0,
    quantity: Number(item.quantity || item.qty || 1),
    qty: Number(item.quantity || item.qty || 1),
    image: item.image || item.images?.[0] || '/products/robot-wheels-set-4.jpg',
    selectedMaterial: item.selectedMaterial || 'Standard',
    selectedColor: item.selectedColor || 'Standard',
    selectedAssembly: item.selectedAssembly || 'Standard'
  }));

  const orderPayload = {
    id: orderId,
    userId: uid,
    customerName: orderData.customerName || orderData.name || 'Customer',
    name: orderData.customerName || orderData.name || 'Customer',
    phone: orderData.phone || '',
    email: orderData.email || currentUser?.email || '',
    address: orderData.address || '',
    pincode: orderData.pincode || '',
    customizationNotes: orderData.customizationNotes || orderData.notes || '',
    notes: orderData.customizationNotes || orderData.notes || '',
    items: formattedItems,
    subtotal: Number(orderData.subtotal || orderData.total || 0),
    shipping: Number(orderData.shipping || 0),
    total: Number(orderData.totalAmount || orderData.total || 0),
    totalAmount: Number(orderData.totalAmount || orderData.total || 0),
    status: orderData.status || 'New',
    paymentStatus: orderData.paymentStatus || 'pending',
    createdAt: serverTimestamp()
  };

  await setDoc(doc(db, 'orders', orderId), orderPayload);
  return { id: orderId, ...orderPayload };
};

/**
 * Subscribes to live orders collection in Firestore.
 * Automatically filters out system/schema documents.
 * Returns ONLY real orders present in Firestore.
 * @param {Function} callback 
 * @returns {Function} Unsubscribe function
 */
export const subscribeToOrders = (callback) => {
  if (!isFirebaseConfigured || !db) {
    callback([]);
    return () => {};
  }

  try {
    const ordersCol = collection(db, 'orders');
    const unsubscribe = onSnapshot(
      ordersCol,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.id === '_schema') return;
          const data = docSnap.data();
          if (data.isPlaceholder) return;
          list.push({ id: docSnap.id, ...data });
        });

        // Sort latest orders first
        list.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });

        callback(list);
      },
      (error) => {
        console.warn('Live orders subscription error:', error);
        callback([]);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to orders:', err);
    callback([]);
    return () => {};
  }
};

/**
 * Updates an order status in Firestore.
 * @param {string} orderId 
 * @param {string} status 
 */
export const updateOrderStatusInFirestore = async (orderId, status) => {
  if (isFirebaseConfigured && db) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await setDoc(orderRef, { status }, { merge: true });
      console.log(`Order ${orderId} updated to ${status} in Firestore`);
    } catch (err) {
      console.error('Failed to update order status in Firestore:', err);
      throw err;
    }
  }
};

/**
 * Deletes an order from Firestore.
 * @param {string} orderId 
 */
export const deleteOrderFromFirestore = async (orderId) => {
  if (isFirebaseConfigured && db) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
      console.log(`Order ${orderId} deleted from Firestore`);
    } catch (err) {
      console.error('Failed to delete order from Firestore:', err);
      throw err;
    }
  }
};
