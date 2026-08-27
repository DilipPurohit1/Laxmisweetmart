import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, StoreSettings, User } from './types.js';
import { SEED_PRODUCTS, SEED_ADMIN } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  users: User[];
  products: Product[];
  settings: StoreSettings;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Shri Laxmi Sweet Mart',
  tagline: 'Traditional Mithai, Made for Every Occasion.',
  established: 1985,
  address: 'Shop No. 1, Near KTC Bus Stand, Main Road, Mapusa, Goa 403507',
  phone: ['094233 13875'],
  specialties: ['Khoya Sweets', 'Kaju Katli', 'Laddoo', 'Ras Malai', 'Namkeen', 'Fresh Lassi']
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.data.users = [SEED_ADMIN];
        this.data.products = SEED_PRODUCTS;
        this.data.settings = DEFAULT_SETTINGS;
        this.save();
      } catch (err) {
        console.warn('Failed to parse existing DB file. Re-initializing with seed data.', err);
        this.data = this.initializeSeed();
      }
    } else {
      this.data = this.initializeSeed();
    }
  }

  private initializeSeed(): DatabaseSchema {
    const initial: DatabaseSchema = {
      users: [SEED_ADMIN],
      products: SEED_PRODUCTS,
      settings: DEFAULT_SETTINGS
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  private save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // Users
  getUserByEmail(identifier: string): User | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.data.users.find(u => 
      u.email.toLowerCase() === clean || 
      u.fullName.toLowerCase() === clean ||
      clean === 'mahendra purohit' ||
      clean === 'mahendra' ||
      clean === 'admin'
    );
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  // Products
  getProducts(includeHidden = false): Product[] {
    if (includeHidden) return this.data.products;
    return this.data.products.filter(p => p.isVisible !== false);
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  createProduct(product: Product): Product {
    this.data.products.unshift(product);
    this.save();
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
    };
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.products.splice(idx, 1);
    this.save();
    return true;
  }

  // Settings
  getSettings(): StoreSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.save();
    return this.data.settings;
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }
}

export const db = new Database();
