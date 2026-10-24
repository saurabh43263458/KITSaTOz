import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const DUMMY_EMAILS = [
  'rohit.s@example.com',
  'ananya.d@example.com',
  'karthik.m@example.com',
  'pooja.h@example.com',
  'admin@kitsatoz.com'
];

const DUMMY_UIDS = ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-admin'];

/**
 * Check if a user is a mock/dummy seed
 */
export const isDummyUser = (user) => {
  if (!user) return true;
  if (DUMMY_UIDS.includes(user.uid)) return true;
  const email = (user.email || '').toLowerCase().trim();
  if (DUMMY_EMAILS.includes(email)) return true;
  if (email.endsWith('@example.com')) return true;
  return false;
};

/**
 * Sync user profile to Firestore `users` collection upon registration / login
 * @param {Object} userData 
 */
export const syncUserToFirestore = async (userData) => {
  if (!isFirebaseConfigured || !db || !userData?.uid) return;
  if (isDummyUser(userData)) return;

  try {
    const userRef = doc(db, 'users', userData.uid);
    const payload = {
      uid: userData.uid,
      displayName: userData.displayName || userData.email?.split('@')[0] || 'Customer',
      email: userData.email,
      role: userData.role || 'customer',
      city: userData.city || 'India',
      registeredAt: userData.registeredAt || new Date().toISOString().split('T')[0],
      updatedAt: serverTimestamp()
    };
    await setDoc(userRef, payload, { merge: true });
    console.log(`Synced user ${userData.email} to Firestore`);
  } catch (err) {
    console.warn('Failed to sync user to Firestore:', err);
  }
};

/**
 * Subscribe to registered users collection in Firestore in real-time.
 * Automatically filters out any dummy seed accounts.
 * @param {Function} callback 
 * @returns {Function} Unsubscribe function
 */
export const subscribeToUsers = (callback) => {
  if (!isFirebaseConfigured || !db) {
    callback([]);
    return () => {};
  }

  try {
    const usersCol = collection(db, 'users');
    const unsubscribe = onSnapshot(
      usersCol,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.id === '_schema') return;
          const data = docSnap.data();
          if (isDummyUser(data)) return;
          list.push({ uid: docSnap.id, ...data });
        });
        callback(list);
      },
      (error) => {
        console.warn('Firestore users subscription warning:', error);
        callback([]);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error initiating subscribeToUsers:', err);
    callback([]);
    return () => {};
  }
};

/**
 * Delete a user profile document from Firestore
 * @param {string} uid 
 */
export const deleteUserFromFirestore = async (uid) => {
  if (!isFirebaseConfigured || !db || !uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
    console.log(`Deleted user ${uid} from Firestore`);
  } catch (err) {
    console.error('Failed to delete user from Firestore:', err);
    throw err;
  }
};
