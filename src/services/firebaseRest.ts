import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';

const FIRESTORE_PROJECT_ID = 'laxmi-sweet-mart';
const FIRESTORE_PRODUCTS_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/products`;
const FIRESTORE_AUTH_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/settings/admin_auth`;

export interface AuthorizedOwner {
  name: string;
  phone: string;
  displayPhone: string;
  email: string;
}

// Strictly authorized owners with verified emails
export const AUTHORIZED_OWNERS: AuthorizedOwner[] = [
  {
    name: 'Dilip Purohit',
    phone: '9405152144',
    displayPhone: '+91 94051 52144',
    email: 'imdilippurohit@gmail.com'
  },
  {
    name: 'Mahendra Purohit',
    phone: '9423313875',
    displayPhone: '+91 94233 13875',
    email: 'laxmisweetmart@gmail.com'
  }
];

export interface AdminCredentials {
  ownerName: string;
  password: string;
  phone: string;
  email: string;
  isConfigured: boolean;
  updatedAt: string;
}

/**
 * Fetch Admin Credentials from Cloud Firestore
 */
export async function fetchAdminAuth(): Promise<AdminCredentials | null> {
  try {
    const res = await fetch(FIRESTORE_AUTH_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });

    if (!res.ok) {
      return {
        ownerName: 'Mahendra Purohit',
        password: '123456',
        phone: '9423313875',
        email: 'laxmisweetmart@gmail.com',
        isConfigured: true,
        updatedAt: new Date().toISOString()
      };
    }

    const doc = await res.json();
    if (!doc || !doc.fields) {
      return {
        ownerName: 'Mahendra Purohit',
        password: '123456',
        phone: '9423313875',
        email: 'laxmisweetmart@gmail.com',
        isConfigured: true,
        updatedAt: new Date().toISOString()
      };
    }
    const f = doc.fields;

    return {
      ownerName: f.ownerName?.stringValue || 'Mahendra Purohit',
      password: f.password?.stringValue || '123456',
      phone: f.phone?.stringValue || '9423313875',
      email: f.email?.stringValue || 'laxmisweetmart@gmail.com',
      isConfigured: f.isConfigured?.booleanValue ?? true,
      updatedAt: f.updatedAt?.stringValue || new Date().toISOString()
    };
  } catch (e) {
    console.warn('Could not fetch admin auth from cloud:', e);
    return {
      ownerName: 'Mahendra Purohit',
      password: '123456',
      phone: '9423313875',
      email: 'laxmisweetmart@gmail.com',
      isConfigured: true,
      updatedAt: new Date().toISOString()
    };
  }
}

/**
 * Save / Update Admin Credentials in Cloud Firestore
 */
export async function saveAdminAuth(credentials: AdminCredentials): Promise<void> {
  const payload = {
    fields: {
      ownerName: { stringValue: credentials.ownerName.trim() },
      password: { stringValue: credentials.password.trim() },
      phone: { stringValue: credentials.phone.trim() },
      email: { stringValue: credentials.email.trim() },
      isConfigured: { booleanValue: true },
      updatedAt: { stringValue: new Date().toISOString() }
    }
  };

  const res = await fetch(FIRESTORE_AUTH_URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to save admin credentials in cloud: ${err}`);
  }
}

/**
 * Converts a Product object into Firestore REST API fields JSON
 */
function productToFirestoreFields(p: Product) {
  const fields: Record<string, any> = {};

  fields.id = { stringValue: String(p.id) };
  fields.name = { stringValue: String(p.name || 'Special Sweet') };
  fields.description = { stringValue: String(p.description || '') };
  fields.category = { stringValue: String(p.category || 'khoya-sweets') };
  fields.unit = { stringValue: String(p.unit || 'kg') };
  fields.indicativePrice = { integerValue: Math.round(Number(p.indicativePrice) || 0) };
  fields.isFestiveSpecial = { booleanValue: Boolean(p.isFestiveSpecial) };
  fields.isPerishable = { booleanValue: Boolean(p.isPerishable) };
  fields.isVisible = { booleanValue: p.isVisible !== false };
  fields.isPlaceholderSample = { booleanValue: Boolean(p.isPlaceholderSample) };
  fields.updatedAt = { stringValue: p.updatedAt || new Date().toISOString() };

  if (p.festivalTag) {
    fields.festivalTag = { stringValue: p.festivalTag };
  }

  const allergens = Array.isArray(p.allergens) && p.allergens.length > 0 ? p.allergens : ['milk'];
  fields.allergens = {
    arrayValue: {
      values: allergens.map((a) => ({ stringValue: String(a) }))
    }
  };

  const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : ['/products/placeholder.jpg'];
  fields.images = {
    arrayValue: {
      values: images.map((img) => ({ stringValue: String(img) }))
    }
  };

  return { fields };
}

/**
 * Converts Firestore REST API document JSON into a normalized Product object
 */
function firestoreDocToProduct(doc: any): Product | null {
  if (!doc || !doc.fields) return null;
  const f = doc.fields;

  const getString = (field: any, def = '') => (field && field.stringValue !== undefined ? field.stringValue : def);
  const getNum = (field: any, def = 0) => {
    if (!field) return def;
    if (field.integerValue !== undefined) return Number(field.integerValue);
    if (field.doubleValue !== undefined) return Number(field.doubleValue);
    return def;
  };
  const getBool = (field: any, def = false) => (field && field.booleanValue !== undefined ? field.booleanValue : def);
  const getArray = (field: any, def: string[] = []) => {
    if (!field || !field.arrayValue || !Array.isArray(field.arrayValue.values)) return def;
    return field.arrayValue.values.map((v: any) => v.stringValue || Object.values(v)[0] || '').filter(Boolean);
  };

  const docId = doc.name ? doc.name.split('/').pop() : `item-${Date.now()}`;
  const id = getString(f.id, docId);
  const name = getString(f.name, 'Special Sweet');
  const description = getString(f.description, 'Freshly handcrafted traditional sweet.');
  const category = getString(f.category, 'khoya-sweets') as any;
  const unit = getString(f.unit, 'kg') as any;
  const indicativePrice = getNum(f.indicativePrice, 500);
  const isFestiveSpecial = getBool(f.isFestiveSpecial, false);
  const festivalTag = getString(f.festivalTag, '') || undefined;
  const isPerishable = getBool(f.isPerishable, false);
  const isVisible = getBool(f.isVisible, true);
  const isPlaceholderSample = getBool(f.isPlaceholderSample, false);
  const updatedAt = getString(f.updatedAt, new Date().toISOString());

  const allergens = getArray(f.allergens, ['milk']);
  const images = getArray(f.images, ['/products/placeholder.jpg']);

  return {
    id,
    name,
    description,
    category,
    unit,
    indicativePrice,
    images: images.length > 0 ? images : ['/products/placeholder.jpg'],
    allergens: allergens.length > 0 ? allergens : ['milk'],
    isFestiveSpecial,
    festivalTag,
    isPerishable,
    isVisible,
    isPlaceholderSample,
    updatedAt
  };
}

/**
 * Fetch all live products from Cloud Firestore via standard REST
 */
export async function fetchAllProductsFromFirestore(): Promise<Product[]> {
  try {
    const res = await fetch(`${FIRESTORE_PRODUCTS_URL}?pageSize=100`, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.documents) || data.documents.length === 0) {
      return [];
    }

    const parsed: Product[] = [];
    for (const doc of data.documents) {
      const prod = firestoreDocToProduct(doc);
      if (prod && prod.id && prod.name) {
        parsed.push(prod);
      }
    }

    return parsed;
  } catch (err) {
    console.warn('Firestore REST fetch error:', err);
    return [];
  }
}

/**
 * Save / Update a product directly in Cloud Firestore via REST
 */
export async function saveProductToFirestore(product: Product): Promise<Product> {
  const payload = productToFirestoreFields(product);
  const cleanId = encodeURIComponent(product.id);

  const res = await fetch(`${FIRESTORE_PRODUCTS_URL}/${cleanId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloud Firestore save failed (HTTP ${res.status}): ${errText}`);
  }

  return product;
}

/**
 * Delete a product directly from Cloud Firestore via REST
 */
export async function deleteProductFromFirestore(id: string): Promise<void> {
  const cleanId = encodeURIComponent(id);
  const res = await fetch(`${FIRESTORE_PRODUCTS_URL}/${cleanId}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' }
  });

  if (!res.ok && res.status !== 404) {
    const errText = await res.text();
    throw new Error(`Cloud Firestore delete failed (HTTP ${res.status}): ${errText}`);
  }
}

/**
 * Initialize Cloud Firestore with the 29 verified products if needed
 */
export async function seedFirestoreIfEmpty(): Promise<void> {
  try {
    const existing = await fetchAllProductsFromFirestore();
    if (existing.length < 5) {
      console.log('🌱 Seeding initial 29 products into Firestore via REST...');
      for (const prod of INITIAL_PRODUCTS) {
        await saveProductToFirestore(prod);
      }
      console.log('✅ 29 initial products seeded to Cloud Firestore!');
    }
  } catch (e) {
    console.warn('Seed check note:', e);
  }
}
