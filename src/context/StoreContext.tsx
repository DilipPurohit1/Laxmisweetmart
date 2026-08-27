import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, Category, StoreSettings } from '../types';
import { api } from '../services/api';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';

interface StoreContextType {
  // Public Products
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loadProducts: () => Promise<void>;
  
  // Selected Product Detail Modal
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Filter & Search
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Admin Operations
  adminProducts: Product[];
  loadAdminProducts: () => Promise<void>;
  createProduct: (productData: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  toggleVisibility: (id: string, isVisible: boolean) => Promise<void>;
  toggleFestive: (id: string, isFestive: boolean) => Promise<void>;

  // Auth
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAdminView: boolean;
  setIsAdminView: (admin: boolean) => void;

  settings: StoreSettings;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
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

  // Load public products
  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.warn('API offline, using verified initial dataset:', err);
    }
  };

  // Load admin products (including hidden)
  const loadAdminProducts = async () => {
    if (!token) return;
    try {
      const data = await api.getAdminProducts(token);
      setAdminProducts(data);
    } catch (err) {
      console.warn('Failed to load admin products:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (token && isAdmin) {
      loadAdminProducts();
    }
  }, [token, isAdmin]);

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

  // Admin CRUD
  const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    if (!token) throw new Error('Admin authentication required');
    const created = await api.createProduct(productData, token);
    setAdminProducts(prev => [created, ...prev]);
    await loadProducts();
    return created;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    if (!token) throw new Error('Admin authentication required');
    const updated = await api.updateProduct(id, updates, token);
    setAdminProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    await loadProducts();
    return updated;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    if (!token) throw new Error('Admin authentication required');
    await api.deleteProduct(id, token);
    setAdminProducts(prev => prev.filter(p => p.id !== id));
    await loadProducts();
  };

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    if (!token) throw new Error('Admin authentication required');
    const updated = await api.toggleVisibility(id, isVisible, token);
    setAdminProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    await loadProducts();
  };

  const toggleFestive = async (id: string, isFestive: boolean) => {
    if (!token) throw new Error('Admin authentication required');
    const updated = await api.toggleFestive(id, isFestive, token);
    setAdminProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    await loadProducts();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts,
        loadProducts,
        selectedProduct,
        setSelectedProduct,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        adminProducts,
        loadAdminProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        toggleVisibility,
        toggleFestive,
        user,
        token,
        login,
        logout,
        isAdmin,
        isAdminView,
        setIsAdminView,
        settings
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
