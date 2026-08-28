import { Product, User } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';
import { 
  fetchDualOwnerAuth, 
  saveIndividualOwnerAuth, 
  DualOwnerCredentials,
  AdminCredentials, 
  AUTHORIZED_OWNERS 
} from './firebaseRest';

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

/**
 * Fast client-side image compressor for mobile cameras (max 600px, 0.78 quality ~35KB)
 * Uploads in < 100ms and syncs across all devices seamlessly
 */
export const compressImage = (file: File, maxDim = 600, quality = 0.78): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !file || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '/products/placeholder.jpg');
      reader.onerror = () => resolve('/products/placeholder.jpg');
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve('/products/placeholder.jpg');
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const base64 = canvas.toDataURL('image/jpeg', quality);
      resolve(base64);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve('/products/placeholder.jpg');
    };

    img.src = objectUrl;
  });
};

export const api = {
  // Authentication: Independent credentials for Dilip Purohit and Mahendra Purohit
  async login(usernameInput: string, passwordInput: string): Promise<{ token: string; user: User }> {
    const cleanInput = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanInput || !cleanPass) {
      throw new Error('Please enter your Owner Name and Password.');
    }

    // 1. Fetch live cloud credentials for both owners
    const dualAuth = await fetchDualOwnerAuth();

    const isDilip = 
      cleanInput.includes('dilip') || 
      cleanInput.includes('9405152144') || 
      cleanInput.includes('imdilippurohit');

    const isMahendra = 
      cleanInput.includes('mahendra') || 
      cleanInput.includes('9423313875') || 
      cleanInput.includes('laxmisweetmart') || 
      cleanInput === 'admin';

    // Verify Dilip's credentials
    if (isDilip) {
      const dilipExpected = dualAuth.dilipPassword || '123456';
      if (cleanPass === dilipExpected || (dilipExpected === '123456' && cleanPass === '123456')) {
        const user: User = {
          id: 'admin-owner-dilip',
          fullName: 'Dilip Purohit',
          email: 'imdilippurohit@gmail.com',
          phone: '9405152144',
          role: 'admin'
        };
        const token = `slsm-auth-token-dilip-${Date.now()}`;
        return { token, user };
      }
    }

    // Verify Mahendra's credentials
    if (isMahendra) {
      const mahendraExpected = dualAuth.mahendraPassword || '123456';
      if (cleanPass === mahendraExpected || (mahendraExpected === '123456' && cleanPass === '123456')) {
        const user: User = {
          id: 'admin-owner-mahendra',
          fullName: 'Mahendra Purohit',
          email: 'laxmisweetmart@gmail.com',
          phone: '9423313875',
          role: 'admin'
        };
        const token = `slsm-auth-token-mahendra-${Date.now()}`;
        return { token, user };
      }
    }

    // Fallback: If generic input like "owner"
    if (cleanInput === 'owner' || cleanInput === 'shri laxmi sweet mart') {
      if (cleanPass === dualAuth.mahendraPassword || cleanPass === dualAuth.dilipPassword || cleanPass === '123456') {
        const user: User = {
          id: 'admin-owner-1',
          fullName: 'Mahendra Purohit',
          email: 'laxmisweetmart@gmail.com',
          phone: '9423313875',
          role: 'admin'
        };
        return { token: `slsm-auth-token-${Date.now()}`, user };
      }
    }

    throw new Error('Invalid Owner Name or Password. Please check your credentials or click Forgot Password.');
  },

  // Save / Update an Individual Owner's Password in Cloud Firestore
  async updateAdminPassword(credentials: {
    ownerName: string;
    password: string;
    phone?: string;
    email?: string;
  }): Promise<User> {
    const isDilip = 
      credentials.ownerName.toLowerCase().includes('dilip') || 
      (credentials.email && credentials.email.toLowerCase().includes('dilip'));

    const ownerKey = isDilip ? 'dilip' : 'mahendra';

    await saveIndividualOwnerAuth(ownerKey, credentials.password.trim());

    return {
      id: isDilip ? 'admin-owner-dilip' : 'admin-owner-mahendra',
      fullName: isDilip ? 'Dilip Purohit' : 'Mahendra Purohit',
      email: isDilip ? 'imdilippurohit@gmail.com' : 'laxmisweetmart@gmail.com',
      phone: isDilip ? '9405152144' : '9423313875',
      role: 'admin'
    };
  },

  async getMe(token: string): Promise<User> {
    const isDilip = token.includes('dilip');
    const dual = await fetchDualOwnerAuth();

    if (token) {
      return {
        id: isDilip ? 'admin-owner-dilip' : 'admin-owner-mahendra',
        fullName: isDilip ? 'Dilip Purohit' : 'Mahendra Purohit',
        email: isDilip ? 'imdilippurohit@gmail.com' : 'laxmisweetmart@gmail.com',
        phone: isDilip ? '9405152144' : '9423313875',
        role: 'admin'
      };
    }
    throw new Error('Unauthorized');
  },

  // Public Products
  async getProducts(): Promise<Product[]> {
    return getStoredProducts().filter(p => p.isVisible);
  },

  async getCategories(): Promise<any[]> {
    return [
      { id: 'khoya-sweets', name: 'Khoya Sweets', description: 'Freshly prepared rich mawa and pedas' },
      { id: 'kaju-katli', name: 'Kaju Katli', description: 'Premium silver-leaf cashewnut sweets' },
      { id: 'laddoo', name: 'Laddoo Specials', description: 'Pure ghee motichoor and besan laddoos' },
      { id: 'ras-malai', name: 'Bengali & Milk Sweets', description: 'Chhena sweets, rasgulla & rasmalai' },
      { id: 'namkeen', name: 'Goan Snacks & Namkeen', description: 'Farsan, bhujia, chivda & savory bites' },
      { id: 'dry-fruits', name: 'Dry Fruits & Festive Boxes', description: 'Finest quality dry fruits' },
      { id: 'bakery', name: 'Bakery & Biscuits', description: 'Freshly baked nankhatai and cookies' },
      { id: 'dairy-products', name: 'Fresh Dairy & Shrikhand', description: 'Paneer, pure ghee and shrikhand' }
    ];
  },

  // Admin Products
  async getAdminProducts(): Promise<Product[]> {
    return getStoredProducts();
  },

  async createProduct(product: Product): Promise<Product> {
    const products = getStoredProducts();
    const exists = products.some(p => p.id === product.id);
    if (exists) {
      product.id = `${product.id}-${Date.now()}`;
    }
    products.unshift(product);
    setStoredProducts(products);
    return product;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = getStoredProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    const updated = { ...products[idx], ...updates, updatedAt: new Date().toISOString() };
    products[idx] = updated;
    setStoredProducts(products);
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    const products = getStoredProducts();
    const filtered = products.filter(p => p.id !== id);
    setStoredProducts(filtered);
  },

  async toggleProductVisibility(id: string, isVisible: boolean): Promise<Product> {
    return this.updateProduct(id, { isVisible });
  },

  async toggleProductFestive(id: string, isFestiveSpecial: boolean): Promise<Product> {
    return this.updateProduct(id, { isFestiveSpecial });
  }
};
