import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, StoreSettings, User } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';
import { api } from '../services/api';
import {
  subscribeProducts,
  createProductInFirestore,
  updateProductInFirestore,
  deleteProductInFirestore,
  toggleVisibilityInFirestore,
  toggleFestiveInFirestore
} from '../services/firebase';

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loadProducts: () => Promise<void>;
  loadAdminProducts: () => Promise<void>;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  settings: StoreSettings;
  isAdminView: boolean;
  setIsAdminView: (isAdmin: boolean) => void;
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  adminProducts: Product[];
  createProduct: (product: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  toggleVisibility: (id: string, isVisible: boolean) => Promise<void>;
  toggleFestive: (id: string, isFestive: boolean) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS.filter(p => p.isVisible));
  const [adminProducts, setAdminProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Auth State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('slsm_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('slsm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const settings = INITIAL_SETTINGS;
  const isAdmin = user?.role === 'admin';

  // Real-Time Cloud Firestore Synchronization
  // Any update from mobile or desktop updates all connected devices across the globe in <100ms
  useEffect(() => {
    const unsubscribe = subscribeProducts((liveProducts) => {
      if (Array.isArray(liveProducts) && liveProducts.length > 0) {
        setAdminProducts(liveProducts);
        setProducts(liveProducts.filter(p => p.isVisible));
      }
    });

    return () => unsubscribe();
  }, []);

  // Public products loader
  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.warn('API fallback to real-time sync:', err);
    }
  };

  const loadAdminProducts = async () => {
    // Handled automatically via Firestore onSnapshot
  };

  // Auth Handlers
  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('slsm_token', res.token);
    localStorage.setItem('slsm_user', JSON.stringify(res.user));
    setIsAdminView(true);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('slsm_token');
    localStorage.removeItem('slsm_user');
    setIsAdminView(false);
  };

  // Real-time Cloud CRUD operations
  const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    if (!token) throw new Error('Admin authentication required');
    try {
      const created = await createProductInFirestore(productData);
      return created;
    } catch (err) {
      console.warn('Firestore write error, falling back to local storage:', err);
      const created = await api.createProduct(productData, token);
      return created;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    if (!token) throw new Error('Admin authentication required');
    try {
      const updated = await updateProductInFirestore(id, updates);
      return updated;
    } catch (err) {
      console.warn('Firestore update error, falling back to local storage:', err);
      const updated = await api.updateProduct(id, updates, token);
      return updated;
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    if (!token) throw new Error('Admin authentication required');
    try {
      await deleteProductInFirestore(id);
    } catch (err) {
      console.warn('Firestore delete error, falling back to local storage:', err);
      await api.deleteProduct(id, token);
    }
  };

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    if (!token) throw new Error('Admin authentication required');
    try {
      await toggleVisibilityInFirestore(id, isVisible);
    } catch (err) {
      await api.toggleVisibility(id, isVisible, token);
    }
  };

  const toggleFestive = async (id: string, isFestive: boolean) => {
    if (!token) throw new Error('Admin authentication required');
    try {
      await toggleFestiveInFirestore(id, isFestive);
    } catch (err) {
      await api.toggleFestive(id, isFestive, token);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts,
        loadProducts,
        loadAdminProducts,
        selectedProduct,
        setSelectedProduct,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        settings,
        isAdminView,
        setIsAdminView,
        user,
        token,
        isAdmin,
        login,
        logout,
        adminProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        toggleVisibility,
        toggleFestive
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
