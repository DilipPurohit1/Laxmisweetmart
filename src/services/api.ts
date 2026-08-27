import { Product, User } from '../types';

const API_BASE = 'http://localhost:5001/api';

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }
    return res.json();
  },

  async getMe(token: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Public Products
  async getProducts(params?: { category?: string; festive?: boolean; search?: string }): Promise<Product[]> {
    const url = new URL(`${API_BASE}/products`);
    if (params?.category && params.category !== 'all') url.searchParams.append('category', params.category);
    if (params?.festive) url.searchParams.append('festive', 'true');
    if (params?.search) url.searchParams.append('search', params.search);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  // Admin Products
  async getAdminProducts(token: string): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products/admin-all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch admin products');
    return res.json();
  },

  async createProduct(productData: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create product');
    }
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async deleteProduct(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  async toggleVisibility(id: string, isVisible: boolean, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}/visibility`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isVisible })
    });
    if (!res.ok) throw new Error('Failed to toggle visibility');
    return res.json();
  },

  async toggleFestive(id: string, isFestiveSpecial: boolean, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}/festive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isFestiveSpecial })
    });
    if (!res.ok) throw new Error('Failed to toggle festive special');
    return res.json();
  },

  // Upload
  async uploadImage(file: File, token: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload image');
    return res.json();
  }
};
