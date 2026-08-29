export type Category = 
  | 'all'
  | 'khoya-sweets'
  | 'kaju-katli'
  | 'laddoo'
  | 'ras-malai'
  | 'namkeen'
  | 'dry-fruits'
  | 'bakery'
  | 'dairy-products';

export type Allergen = 'milk' | 'nuts' | 'gluten' | 'none';

export type FestivalTag = 
  | 'Diwali' 
  | 'Ganesh Chaturthi' 
  | 'Holi' 
  | 'Janmashtami'
  | 'Makar Sankranti'
  | 'Maha Shivratri'
  | 'Gudi Padwa'
  | 'Raksha Bandhan'
  | 'Navratri' 
  | 'Independence Day'
  | 'Goan Festivals'
  | 'General';

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  category: Category;
  unit: 'kg' | 'piece' | 'box' | 'pack' | 'litre' | 'glass';
  indicativePrice: number;
  images: string[];
  allergens: Allergen[];
  isFestiveSpecial: boolean;
  festivalTag?: FestivalTag;
  isPerishable: boolean;
  isVisible: boolean;
  isPlaceholderSample: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'admin';
  token?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  established: number;
  address: string;
  phone: string[];
  specialties: string[];
}
