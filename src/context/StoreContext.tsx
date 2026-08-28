import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Category, StoreSettings, User } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';
import { api } from '../services/api';
import {
  fetchAllProductsFromFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  seedFirestoreIfEmpty
} from '../services/firebaseRest';

/**
 * Defensive Normalizer: Guarantees every product has valid fields
 */
export const normalizeProduct = (p: any): Product => {
  if (!p || typeof p !== 'object') {
    return {
      id: `item-${Date.now()}`,
      name: 'Special Sweet',
      description: 'Handcrafted traditional sweet at Shri Laxmi Sweet Mart.',
      category: 'khoya-sweets',
      unit: 'kg',
      indicativePrice: 500,
      images: ['/products/placeholder.jpg'],
      allergens: ['milk'],
      isFestiveSpecial: false,
      isPerishable: false,
      isVisible: true,
      isPlaceholderSample: false
    };
  }

  const rawImages = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []);
  const validImages = rawImages.filter((img: any) => typeof img === 'string' && img.trim().length > 0);

  return {
    id: String(p.id || `item-${Date.now()}`),
    name: String(p.name || 'Special Sweet'),
    description: String(p.description || 'Freshly prepared at Shri Laxmi Sweet Mart Mapusa.'),
    category: (p.category || 'khoya-sweets') as Category,
    unit: (p.unit || 'kg') as Product['unit'],
    indicativePrice: typeof p.indicativePrice === 'number' ? p.indicativePrice : (Number(p.indicativePrice) || 500),
    images: validImages.length > 0 ? validImages : ['/products/placeholder.jpg'],
    allergens: Array.isArray(p.allergens) && p.allergens.length > 0 ? p.allergens : ['milk'],
    isFestiveSpecial: Boolean(p.isFestiveSpecial),
    festivalTag: p.festivalTag,
    isPerishable: Boolean(p.isPerishable),
    isVisible: p.isVisible !== false,
    isPlaceholderSample: Boolean(p.isPlaceholderSample),
    updatedAt: p.updatedAt || new Date().toISOString()
  };
};

const normalizeList = (list: any[]): Product[] => {
  if (!Array.isArray(list)) return INITIAL_PRODUCTS;
  return list.map(normalizeProduct);
};

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
  updateAdminPassword: (credentials: {
    ownerName: string;
    password: string;
    phone?: string;
    email?: string;
  }) => Promise<void>;
  adminProducts: Product[];
  createProduct: (product: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  toggleVisibility: (id: string, isVisible: boolean) => Promise<void>;
  toggleFestive: (id: string, isFestive: boolean) => Promise<void>;
  syncNow: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('slsm_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeList(parsed).filter((p) => p.isVisible);
        }
      }
    } catch {}
    return INITIAL_PRODUCTS.filter((p) => p.isVisible);
  });

  const [adminProducts, setAdminProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('slsm_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeList(parsed);
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
    try {
      const saved = localStorage.getItem('slsm_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const settings = INITIAL_SETTINGS;
  const isAdmin = user?.role === 'admin';

  // Helper to persist in localStorage safely
  const persistLocally = (list: Product[]) => {
    try {
      localStorage.setItem('slsm_products', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage quota notice:', e);
    }
  };

  const applyCloudList = useCallback((cloudList: Product[]) => {
    if (!Array.isArray(cloudList) || cloudList.length === 0) return;
    const clean = normalizeList(cloudList);

    setAdminProducts((prev) => {
      // Check if data actually changed to avoid unnecessary re-renders
      if (
        prev.length === clean.length &&
        JSON.stringify(prev.map(p => ({ id: p.id, p: p.indicativePrice, v: p.isVisible, u: p.updatedAt }))) ===
        JSON.stringify(clean.map(p => ({ id: p.id, p: p.indicativePrice, v: p.isVisible, u: p.updatedAt })))
      ) {
        return prev;
      }
      persistLocally(clean);
      return clean;
    });

    setProducts((prev) => {
      const visible = clean.filter((p) => p.isVisible);
      if (
        prev.length === visible.length &&
        JSON.stringify(prev.map(p => ({ id: p.id, p: p.indicativePrice, u: p.updatedAt }))) ===
        JSON.stringify(visible.map(p => ({ id: p.id, p: p.indicativePrice, u: p.updatedAt })))
      ) {
        return prev;
      }
      return visible;
    });
  }, []);

  // Sync with Cloud Firestore
  const syncNow = useCallback(async () => {
    try {
      const live = await fetchAllProductsFromFirestore();
      if (live && live.length > 0) {
        applyCloudList(live);
      }
    } catch (err) {
      console.warn('Cloud sync note:', err);
    }
  }, [applyCloudList]);

  // Real-Time Auto-Polling (Every 2.5 seconds) + Focus/Tab Listeners
  useEffect(() => {
    // 1. Initial Cloud Sync & Seed
    syncNow();
    seedFirestoreIfEmpty().then(syncNow);

    // 2. Continuous Background Poll (every 2.5 seconds)
    const pollInterval = setInterval(() => {
      syncNow();
    }, 2500);

    // 3. Instant sync when browser tab gains focus or app is opened on mobile
    const handleFocus = () => {
      syncNow();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, [syncNow]);

  const loadProducts = async () => {
    await syncNow();
  };

  const loadAdminProducts = async () => {
    await syncNow();
  };

  // Auth Handlers
  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('slsm_token', res.token);
    localStorage.setItem('slsm_user', JSON.stringify(res.user));
    setIsAdminView(true);
    await syncNow();
  };

  const updateAdminPassword = async (credentials: {
    ownerName: string;
    password: string;
    phone?: string;
    email?: string;
  }) => {
    const updatedUser = await api.updateAdminPassword(credentials);
    const newToken = `slsm-auth-token-${Date.now()}`;
    setToken(newToken);
    setUser(updatedUser);
    localStorage.setItem('slsm_token', newToken);
    localStorage.setItem('slsm_user', JSON.stringify(updatedUser));
    setIsAdminView(true);
    await syncNow();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('slsm_token');
    localStorage.removeItem('slsm_user');
    setIsAdminView(false);
  };

  // 1. Create Product (Instant Optimistic Local + Instant Cloud REST Broadcast)
  const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    if (!token) throw new Error('Admin authentication required');
    const newProduct = normalizeProduct({
      ...productData,
      updatedAt: new Date().toISOString()
    });

    // Instant local state update
    setAdminProducts((prev) => {
      const updated = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)];
      persistLocally(updated);
      return updated;
    });

    if (newProduct.isVisible) {
      setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
    }

    // Instant Cloud Firestore REST Write
    try {
      await saveProductToFirestore(newProduct);
    } catch (err) {
      console.error('Cloud Firestore write failed:', err);
    }

    // Background verification
    setTimeout(syncNow, 1000);

    return newProduct;
  };

  // 2. Update Product (Instant Optimistic Local + Instant Cloud REST Broadcast)
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    if (!token) throw new Error('Admin authentication required');

    let updatedItem: Product | null = null;

    setAdminProducts((prev) => {
      const nextList = prev.map((p) => {
        if (p.id === id) {
          updatedItem = normalizeProduct({
            ...p,
            ...updates,
            updatedAt: new Date().toISOString()
          });
          return updatedItem;
        }
        return p;
      });
      persistLocally(nextList);
      return nextList;
    });

    setProducts((prev) => {
      return prev
        .map((p) => (p.id === id ? normalizeProduct({ ...p, ...updates, updatedAt: new Date().toISOString() }) : p))
        .filter((p) => p.isVisible);
    });

    const finalProduct = updatedItem || normalizeProduct({ id, ...updates, updatedAt: new Date().toISOString() });

    try {
      await saveProductToFirestore(finalProduct);
    } catch (err) {
      console.error('Cloud Firestore update failed:', err);
    }

    setTimeout(syncNow, 1000);
    return finalProduct;
  };

  // 3. Delete Product (Instant Optimistic Local + Instant Cloud REST Broadcast)
  const deleteProduct = async (id: string): Promise<void> => {
    if (!token) throw new Error('Admin authentication required');

    setAdminProducts((prev) => {
      const nextList = prev.filter((p) => p.id !== id);
      persistLocally(nextList);
      return nextList;
    });

    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteProductFromFirestore(id);
    } catch (err) {
      console.error('Cloud Firestore delete failed:', err);
    }

    setTimeout(syncNow, 1000);
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
        updateAdminPassword,
        adminProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        toggleVisibility,
        toggleFestive,
        syncNow
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
