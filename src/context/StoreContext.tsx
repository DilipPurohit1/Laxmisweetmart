import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, StoreSettings, User } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';
import { api } from '../services/api';
import {
  subscribeProducts,
  fetchAllFirestoreProducts,
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
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('slsm_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((p: Product) => p.isVisible);
        }
      }
    } catch {}
    return INITIAL_PRODUCTS.filter(p => p.isVisible);
  });

  const [adminProducts, setAdminProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('slsm_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_PRODUCTS;
  });

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

  // Helper to persist in localStorage
  const persistLocally = (list: Product[]) => {
    try {
      localStorage.setItem('slsm_products', JSON.stringify(list));
    } catch {}
  };

  const syncFirestoreToState = (liveProducts: Product[]) => {
    if (Array.isArray(liveProducts) && liveProducts.length > 0) {
      setAdminProducts(liveProducts);
      setProducts(liveProducts.filter(p => p.isVisible));
      persistLocally(liveProducts);
    }
  };

  // Real-Time Cloud Firestore Synchronization
  useEffect(() => {
    const unsubscribe = subscribeProducts((liveProducts) => {
      syncFirestoreToState(liveProducts);
    });

    // Re-fetch on mobile browser focus or app switch
    const handleFocus = () => {
      fetchAllFirestoreProducts().then(syncFirestoreToState);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  const loadProducts = async () => {
    try {
      const live = await fetchAllFirestoreProducts();
      syncFirestoreToState(live);
    } catch {
      const data = await api.getProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setAdminProducts(data);
      }
    }
  };

  const loadAdminProducts = async () => {
    const live = await fetchAllFirestoreProducts();
    syncFirestoreToState(live);
  };

  // Auth Handlers
  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('slsm_token', res.token);
    localStorage.setItem('slsm_user', JSON.stringify(res.user));
    setIsAdminView(true);
    await loadAdminProducts();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('slsm_token');
    localStorage.removeItem('slsm_user');
    setIsAdminView(false);
  };

  // 1. Create Product (Optimistic Instant Update + Firestore + Local Storage)
  const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    if (!token) throw new Error('Admin authentication required');
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
      isPlaceholderSample: false
    };

    // Instant optimistic update
    setAdminProducts(prev => {
      const updated = [newProduct, ...prev.filter(p => p.id !== newId)];
      persistLocally(updated);
      return updated;
    });

    if (newProduct.isVisible) {
      setProducts(prev => [newProduct, ...prev.filter(p => p.id !== newId)]);
    }

    // Cloud Firestore Sync
    try {
      await createProductInFirestore(newProduct);
    } catch (err) {
      console.warn('Firestore write warning:', err);
    }

    // API Sync
    try {
      await api.createProduct(newProduct, token);
    } catch {}

    return newProduct;
  };

  // 2. Update Product (Optimistic Instant Update + Firestore + Local Storage)
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    if (!token) throw new Error('Admin authentication required');

    let updatedItem: Product | null = null;

    setAdminProducts(prev => {
      const nextList = prev.map(p => {
        if (p.id === id) {
          updatedItem = { ...p, ...updates };
          return updatedItem;
        }
        return p;
      });
      persistLocally(nextList);
      return nextList;
    });

    setProducts(prev => {
      return prev
        .map(p => (p.id === id ? { ...p, ...updates } : p))
        .filter(p => p.isVisible);
    });

    try {
      await updateProductInFirestore(id, updates);
    } catch (err) {
      console.warn('Firestore update warning:', err);
    }

    try {
      await api.updateProduct(id, updates, token);
    } catch {}

    return updatedItem || ({ id, ...updates } as Product);
  };

  // 3. Delete Product (Optimistic Instant Update + Firestore + Local Storage)
  const deleteProduct = async (id: string): Promise<void> => {
    if (!token) throw new Error('Admin authentication required');

    setAdminProducts(prev => {
      const nextList = prev.filter(p => p.id !== id);
      persistLocally(nextList);
      return nextList;
    });

    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      await deleteProductInFirestore(id);
    } catch (err) {
      console.warn('Firestore delete warning:', err);
    }

    try {
      await api.deleteProduct(id, token);
    } catch {}
  };

  // 4. Toggle Visibility
  const toggleVisibility = async (id: string, isVisible: boolean) => {
    await updateProduct(id, { isVisible });
  };

  // 5. Toggle Festive
  const toggleFestive = async (id: string, isFestiveSpecial: boolean) => {
    await updateProduct(id, { isFestiveSpecial });
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
