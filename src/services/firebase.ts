import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  Unsubscribe
} from 'firebase/firestore';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';

// User's Verified Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlaxSyyEjDrITKjLF0ivw0hqb8o9SeOPY",
  authDomain: "laxmi-sweet-mart.firebaseapp.com",
  projectId: "laxmi-sweet-mart",
  storageBucket: "laxmi-sweet-mart.firebasestorage.app",
  messagingSenderId: "491318692832",
  appId: "1:491318692832:web:e04dad3b4f5db8eeca7985",
  measurementId: "G-DD5R4NT9KX"
};

// Initialize Firebase App & Firestore Database
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const PRODUCTS_COLLECTION = 'products';

/**
 * Fetch all products directly from Firestore
 */
export const fetchAllFirestoreProducts = async (): Promise<Product[]> => {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: Product[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        if (d && d.id && d.name) {
          items.push(d as Product);
        }
      });
      if (items.length > 0) return items;
    }
  } catch (err) {
    console.warn('Firestore fetch error:', err);
  }
  return INITIAL_PRODUCTS;
};

/**
 * Real-Time Products Subscription (WebSockets onSnapshot)
 * Triggers all active clients on mobile, tablet, and desktop within <100ms
 */
export const subscribeProducts = (onUpdate: (products: Product[]) => void): Unsubscribe => {
  const colRef = collection(db, PRODUCTS_COLLECTION);

  // Fetch immediately on init
  fetchAllFirestoreProducts().then((items) => {
    if (items && items.length > 0) {
      onUpdate(items);
    }
  });

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const products: Product[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          if (d && d.id && d.name) {
            products.push(d as Product);
          }
        });

        if (products.length > 0) {
          onUpdate(products);
        }
      }
    },
    (error) => {
      console.warn('Firestore listener notice:', error);
    }
  );

  return unsubscribe;
};

/**
 * Create a new product in Cloud Firestore
 */
export const createProductInFirestore = async (productData: Partial<Product>): Promise<Product> => {
  const newId =
    productData.id ||
    (productData.name ? productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '') ||
    `item-${Date.now()}`;

  const newProduct: Product = {
    id: newId,
    name: productData.name || 'New Sweet',
    description: productData.description || 'Freshly handcrafted at Shri Laxmi Sweet Mart Mapusa.',
    category: productData.category || 'khoya-sweets',
    unit: productData.unit || 'kg',
    indicativePrice: Number(productData.indicativePrice) || 500,
    images: productData.images && productData.images.length > 0 ? productData.images : ['/products/peda.jpg'],
    allergens: productData.allergens || ['milk'],
    isFestiveSpecial: !!productData.isFestiveSpecial,
    festivalTag: productData.festivalTag,
    isPerishable: !!productData.isPerishable,
    isVisible: productData.isVisible !== false,
    isPlaceholderSample: false,
    updatedAt: new Date().toISOString()
  };

  const docRef = doc(db, PRODUCTS_COLLECTION, newId);
  await setDoc(docRef, newProduct, { merge: true });
  return newProduct;
};

/**
 * Update an existing product in Cloud Firestore
 */
export const updateProductInFirestore = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const cleanUpdates = {
    ...updates,
    updatedAt: new Date().toISOString()
  };
  await setDoc(docRef, cleanUpdates, { merge: true });
  return { id, ...cleanUpdates } as Product;
};

/**
 * Delete a product from Cloud Firestore
 */
export const deleteProductInFirestore = async (id: string): Promise<void> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
};

/**
 * Toggle Product Visibility in Cloud Firestore
 */
export const toggleVisibilityInFirestore = async (id: string, isVisible: boolean): Promise<Product> => {
  return updateProductInFirestore(id, { isVisible });
};

/**
 * Toggle Festive Special Status in Cloud Firestore
 */
export const toggleFestiveInFirestore = async (id: string, isFestiveSpecial: boolean): Promise<Product> => {
  return updateProductInFirestore(id, { isFestiveSpecial });
};
