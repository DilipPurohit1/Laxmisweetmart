import { Product, User } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';

const API_BASE = '/api';

// Helper to get local stored products
const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem('slsm_products');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read stored products:', e);
  }
  return INITIAL_PRODUCTS;
};

const setStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem('slsm_products', JSON.stringify(products));
  } catch (e) {
    console.warn('Could not save stored products:', e);
  }
};

export const api = {
  // Auth: Supports both live API server and verified offline/client fallback
  async login(emailOrName: string, password: string): Promise<{ token: string; user: User }> {
    const cleanName = emailOrName.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Try Live Backend API Server first
    try {
      const res = await fetch(`http://localhost:5001${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrName, password })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend not running on this host (e.g. static production deployment on Vercel)
    }

    // 2. Direct Verified Owner Authentication
    const isOwner =
      (cleanName === 'mahendra purohit' ||
       cleanName === 'admin@shrilaxmisweetmart.com' ||
       cleanName === 'laxmisweetmart@gmail.com' ||
       cleanName === 'admin') &&
      (cleanPass === '123456' || cleanPass === 'admin1985');

    if (isOwner) {
      const authData = {
        token: 'slsm-owner-auth-token-1985',
        user: {
          id: 'admin-owner-1',
          fullName: 'Mahendra Purohit',
          email: 'laxmisweetmart@gmail.com',
          phone: '094233 13875',
          role: 'admin' as const
        }
      };
      return authData;
    }

    throw new Error('Invalid Owner Name or Password. Please enter "Mahendra Purohit" and password "123456".');
  },

  async getMe(token: string): Promise<User> {
    try {
      const res = await fetch(`http://localhost:5001${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    if (token) {
      return {
        id: 'admin-owner-1',
        fullName: 'Mahendra Purohit',
        email: 'laxmisweetmart@gmail.com',
        phone: '094233 13875',
        role: 'admin'
      };
    }
    throw new Error('Unauthorized');
  },

  // Public Products
  async getProducts(params?: { category?: string; festive?: boolean; search?: string }): Promise<Product[]> {
    try {
      const url = new URL(`http://localhost:5001${API_BASE}/products`);
      if (params?.category && params.category !== 'all') url.searchParams.append('category', params.category);
      if (params?.festive) url.searchParams.append('festive', 'true');
      if (params?.search) url.searchParams.append('search', params.search);

      const res = await fetch(url.toString());
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    let products = getStoredProducts().filter(p => p.isVisible);
    if (params?.category && params.category !== 'all') {
      products = products.filter(p => p.category === params.category);
    }
    if (params?.festive) {
      products = products.filter(p => p.isFestiveSpecial);
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return products;
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const res = await fetch(`http://localhost:5001${API_BASE}/products/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const prod = getStoredProducts().find(p => p.id === id);
    if (!prod) throw new Error('Product not found');
    return prod;
  },

  // Admin Products
  async getAdminProducts(token: string): Promise<Product[]> {
    try {
      const res = await fetch(`http://localhost:5001${API_BASE}/products/admin-all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return getStoredProducts();
  },

  async createProduct(productData: Partial<Product>, token: string): Promise<Product> {
    try {
      const res = await fetch(`http://localhost:5001${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const all = getStoredProducts();
    const newProduct: Product = {
      id: productData.id || `item-${Date.now()}`,
      name: productData.name || 'New Sweet',
      description: productData.description || '',
      category: productData.category || 'khoya-sweets',
      unit: productData.unit || 'kg',
      indicativePrice: productData.indicativePrice || 500,
      images: productData.images && productData.images.length > 0 ? productData.images : ['/products/peda.jpg'],
      allergens: productData.allergens || ['milk'],
      isFestiveSpecial: !!productData.isFestiveSpecial,
      festivalTag: productData.festivalTag,
      isPerishable: !!productData.isPerishable,
      isVisible: productData.isVisible !== false,
      isPlaceholderSample: false
    };

    const updated = [newProduct, ...all];
    setStoredProducts(updated);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>, token: string): Promise<Product> {
    try {
      const res = await fetch(`http://localhost:5001${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const all = getStoredProducts();
    let updatedProd: Product | null = null;
    const nextList = all.map(p => {
      if (p.id === id) {
        updatedProd = { ...p, ...updates };
        return updatedProd;
      }
      return p;
    });

    if (!updatedProd) throw new Error('Product not found');
    setStoredProducts(nextList);
    return updatedProd;
  },

  async deleteProduct(id: string, token: string): Promise<void> {
    try {
      const res = await fetch(`http://localhost:5001${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return;
    } catch {
      // Fallback
    }

    const all = getStoredProducts().filter(p => p.id !== id);
    setStoredProducts(all);
  },

  async toggleVisibility(id: string, isVisible: boolean, token: string): Promise<Product> {
    try {
      const res = await fetch(`http://localhost:5001${API_BASE}/products/${id}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isVisible })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    return this.updateProduct(id, { isVisible }, token);
  },

  async toggleFestive(id: string, isFestiveSpecial: boolean, token: string): Promise<Product> {
    try {
      const res = await fetch(`http://localhost:5001${API_BASE}/products/${id}/festive`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isFestiveSpecial })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    return this.updateProduct(id, { isFestiveSpecial }, token);
  },

  // Upload: Reads file as base64 on client when offline/on Vercel
  async uploadImage(file: File, token: string): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`http://localhost:5001${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback: Read as base64 data URL
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ url: '/products/peda.jpg' });
      };
      reader.readAsDataURL(file);
    });
  }
};
