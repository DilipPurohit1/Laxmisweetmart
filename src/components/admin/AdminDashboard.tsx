import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Category, Allergen } from '../../types';
import { 
  Package, 
  Sparkles, 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  ArrowLeft, 
  LogOut, 
  Save, 
  X,
  Upload,
  AlertCircle
} from 'lucide-react';
import { ShopBrandName } from '../ShopBrandName';
import { compressImage } from '../../services/api';

const ALLERGEN_OPTIONS: { id: Allergen; label: string }[] = [
  { id: 'milk', label: 'Milk' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'none', label: 'None' },
];

export const AdminDashboard: React.FC = () => {
  const {
    adminProducts,
    user,
    token,
    login,
    logout,
    setIsAdminView,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleVisibility,
    toggleFestive,
    loadAdminProducts
  } = useStore();

  // Login form state
  const [ownerNameInput, setOwnerNameInput] = useState('Mahendra Purohit');
  const [passwordInput, setPasswordInput] = useState('123456');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Filter & Search
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'khoya-sweets',
    description: '',
    unit: 'kg',
    indicativePrice: 650,
    images: ['/products/peda.jpg'],
    allergens: ['milk'],
    isFestiveSpecial: false,
    isPerishable: false,
    isVisible: true,
    isPlaceholderSample: false
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await login(ownerNameInput, passwordInput);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check owner name and password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'khoya-sweets',
      description: 'Freshly handcrafted at Shri Laxmi Sweet Mart Mapusa.',
      unit: 'kg',
      indicativePrice: 650,
      images: ['/products/peda.jpg'],
      allergens: ['milk'],
      isFestiveSpecial: false,
      isPerishable: false,
      isVisible: true,
      isPlaceholderSample: false
    });
    setUploadedFile(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      allergens: product.allergens || []
    });
    setUploadedFile(null);
    setIsAddModalOpen(true);
  };

  // Handle Save (Create or Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.indicativePrice) return;

    try {
      let finalImages = formData.images && formData.images.length > 0 ? [...formData.images] : ['/products/peda.jpg'];

      // If user uploaded a new image file
      if (uploadedFile) {
        setIsUploading(true);
        try {
          const compressed = await compressImage(uploadedFile);
          if (compressed) {
            finalImages = [compressed];
          }
        } catch (uploadErr) {
          console.warn('Image compression note:', uploadErr);
        } finally {
          setIsUploading(false);
        }
      }

      // Normalize image paths
      finalImages = finalImages.map(img => {
        if (!img || img.trim() === '') return '/products/placeholder.jpg';
        const clean = img.trim();
        if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:') || clean.startsWith('/')) {
          return clean;
        }
        return `/products/${clean}`;
      });

      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          ...formData,
          images: finalImages
        });
      } else {
        const newId = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `item-${Date.now()}`;
        await createProduct({
          ...formData,
          id: newId,
          images: finalImages
        });
      }

      setIsAddModalOpen(false);
      loadAdminProducts();
    } catch (err: any) {
      alert(`Operation failed: ${err.message}`);
    }
  };

  // Handle Delete
  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the live catalog?`)) {
      try {
        await deleteProduct(id);
        loadAdminProducts();
      } catch (err: any) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  // Allergen Toggle
  const handleToggleAllergen = (allergen: Allergen) => {
    const current = formData.allergens || [];
    if (current.includes(allergen)) {
      setFormData({ ...formData, allergens: current.filter(a => a !== allergen) });
    } else {
      setFormData({ ...formData, allergens: [...current, allergen] });
    }
  };

  // Filtered Products
  const filteredProducts = adminProducts.filter(p => {
    const matchesSearch = !searchFilter || 
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 1. LOGIN VIEW IF UNAUTHENTICATED
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] flex items-center justify-center p-4 selection:bg-[#6E1824] selection:text-white">
        <div className="max-w-md w-full bg-[#FFFDF8] border border-[#E9DED0] rounded-3xl p-8 shadow-xl space-y-6 text-left">
          
          <div className="text-center space-y-2">
            <div className="inline-block p-3 bg-[#F8F3EA] rounded-2xl border border-[#E9DED0] mb-1">
              <ShopBrandName size="sm" />
            </div>
            <h1 className="text-2xl font-serif font-black text-[#241A17]">
              Owner Portal Login
            </h1>
            <p className="text-xs text-[#241A17]/70">
              Enter owner name and password to access the catalog management system.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#241A17]">
                Owner Name
              </label>
              <input
                type="text"
                required
                value={ownerNameInput}
                onChange={(e) => setOwnerNameInput(e.target.value)}
                placeholder="Mahendra Purohit"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none focus:border-[#6E1824]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#241A17]">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl font-bold bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] uppercase tracking-wider text-xs shadow-sm transition-all disabled:opacity-50"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In as Owner'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#E9DED0] flex items-center justify-between text-xs">
            <button
              onClick={() => setIsAdminView(false)}
              className="inline-flex items-center gap-1.5 text-[#241A17]/70 hover:text-[#6E1824] font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>

            <span className="text-[10px] text-[#241A17]/50">
              Shri Laxmi Sweet Mart
            </span>
          </div>

        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED OWNER DASHBOARD
  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#241A17] text-left text-xs pb-20 font-sans">
      
      {/* Top Owner Header Bar */}
      <header className="bg-[#FFFDF8] border-b border-[#E9DED0] sticky top-0 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminView(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F3EA] hover:bg-[#E9DED0] text-[#241A17] text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>
            
            <div className="hidden sm:block font-serif font-bold text-sm text-[#6E1824]">
              Shri Laxmi Sweet Mart — Owner Catalog Dashboard
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-[#241A17]/60 block font-medium">Logged in as Owner</span>
              <span className="font-bold text-[#241A17]">Mahendra Purohit</span>
            </div>

            <button
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        {/* Header & New Item Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#E9DED0] p-6 rounded-3xl shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E1824] block mb-0.5">
              Live Counter Items
            </span>
            <h1 className="text-2xl font-serif font-black text-[#241A17]">
              Product & Pricing Management
            </h1>
            <p className="text-xs text-[#241A17]/70 mt-1">
              Currently managing <strong>{adminProducts.length}</strong> items. Edit pricing, toggle visibility, and update festive badges.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C89B3C]" />
            <span>Add New Sweet / Item</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FFFDF8] border border-[#E9DED0] p-3.5 rounded-2xl shadow-sm">
          <div className="relative flex-1 w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search product by name or description..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-xs text-[#241A17] outline-none focus:border-[#6E1824]"
            />
            <Search className="w-4 h-4 text-[#6E1824] absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-xs font-semibold text-[#241A17] outline-none"
            >
              <option value="all">All Categories</option>
              <option value="khoya-sweets">Khoya Sweets</option>
              <option value="kaju-katli">Kaju Katli</option>
              <option value="laddoo">Laddoo</option>
              <option value="ras-malai">Ras Malai</option>
              <option value="namkeen">Namkeen</option>
              <option value="dry-fruits">Dry Fruits</option>
              <option value="bakery">Bakery</option>
              <option value="dairy-products">Dairy Products</option>
            </select>
          </div>
        </div>

        {/* Table of Products */}
        <div className="bg-[#FFFDF8] border border-[#E9DED0] rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F3EA] border-b border-[#E9DED0] text-[10px] font-bold uppercase text-[#6E1824] tracking-wider">
                  <th className="py-3 px-4">Sweet & Visual</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Indicative Rate</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 text-center">Storefront</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9DED0]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F8F3EA]/50 transition-colors">
                    
                    {/* Item */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] overflow-hidden flex-shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm text-[#241A17]">{product.name}</div>
                          <div className="text-[11px] text-[#241A17]/65 line-clamp-1 max-w-xs">{product.description}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="capitalize px-2.5 py-0.5 rounded-lg bg-[#F8F3EA] border border-[#E9DED0] text-[11px] font-semibold text-[#241A17]/80">
                        {product.category.replace('-', ' ')}
                      </span>
                    </td>

                    {/* Rate */}
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#6E1824]">
                      ₹{product.indicativePrice} <span className="text-[10px] font-normal text-[#241A17]/60">/ {product.unit}</span>
                    </td>

                    {/* Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 items-center">
                        <button
                          onClick={() => toggleFestive(product.id, !product.isFestiveSpecial)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors ${
                            product.isFestiveSpecial
                              ? 'bg-[#6E1824] text-white border-[#6E1824]'
                              : 'bg-[#F8F3EA] text-[#241A17]/60 border-[#E9DED0] hover:border-[#6E1824]'
                          }`}
                          title="Click to toggle festive special badge"
                        >
                          Festive
                        </button>

                        {product.isPerishable && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Daily Fresh
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Visibility Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleVisibility(product.id, !product.isVisible)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          product.isVisible
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border border-stone-200'
                        }`}
                        title="Click to toggle storefront visibility"
                      >
                        {product.isVisible ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3" />}
                        <span>{product.isVisible ? 'Live' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#F8F3EA] hover:bg-[#6E1824] text-[#241A17] hover:text-white border border-[#E9DED0] transition-colors text-[11px] font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 transition-colors"
                          title="Delete sweet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-[#FFFDF8] border border-[#E9DED0] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            
            <div className="flex items-center justify-between border-b border-[#E9DED0] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E1824]">Catalog Editor</span>
                <h3 className="text-lg font-serif font-black text-[#241A17]">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Counter Sweet / Item'}
                </h3>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-[#241A17]/60 hover:bg-[#F8F3EA] hover:text-[#241A17]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold text-[#241A17] uppercase tracking-wider mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Special Sweet Malai Lassi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none focus:border-[#6E1824]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-[#241A17] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Craftsmanship, flavor profile, and traditional recipe details..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#241A17] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none"
                  >
                    <option value="khoya-sweets">Khoya Sweets</option>
                    <option value="kaju-katli">Kaju Katli</option>
                    <option value="laddoo">Laddoo</option>
                    <option value="ras-malai">Ras Malai</option>
                    <option value="namkeen">Namkeen</option>
                    <option value="dry-fruits">Dry Fruits</option>
                    <option value="bakery">Bakery</option>
                    <option value="dairy-products">Dairy Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#241A17] uppercase tracking-wider mb-1">
                    Pricing Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none"
                  >
                    <option value="kg">per kg</option>
                    <option value="glass">per glass</option>
                    <option value="piece">per piece</option>
                    <option value="box">per box</option>
                    <option value="pack">per pack</option>
                    <option value="litre">per litre</option>
                  </select>
                </div>
              </div>

              {/* Indicative Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#241A17] uppercase tracking-wider mb-1">
                    Indicative Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.indicativePrice || ''}
                    onChange={(e) => setFormData({ ...formData, indicativePrice: Number(e.target.value) })}
                    placeholder="40"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-bold outline-none focus:border-[#6E1824]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#241A17] uppercase tracking-wider mb-1">
                    Image Path or Upload
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.images ? formData.images[0] : ''}
                      onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                      placeholder="/products/lassi.jpg"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none"
                    />
                    <label className="p-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] hover:bg-[#E9DED0] cursor-pointer flex items-center justify-center" title="Upload local image">
                      <Upload className="w-4 h-4 text-[#6E1824]" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setUploadedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {uploadedFile && (
                    <span className="text-[10px] text-emerald-700 block mt-1">
                      Ready to upload: {uploadedFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Allergens */}
              <div>
                <label className="block text-[11px] font-bold text-[#241A17] uppercase tracking-wider mb-1.5">
                  Allergen Disclosures
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGEN_OPTIONS.map((alg) => {
                    const isSelected = (formData.allergens || []).includes(alg.id);
                    return (
                      <button
                        key={alg.id}
                        type="button"
                        onClick={() => handleToggleAllergen(alg.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                          isSelected
                            ? 'bg-[#6E1824] text-[#FFFDF8] border-[#6E1824]'
                            : 'bg-[#F8F3EA] text-[#241A17]/70 border-[#E9DED0]'
                        }`}
                      >
                        {alg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Festive Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E9DED0]">
                <div>
                  <label className="block text-[11px] font-bold text-[#241A17] uppercase tracking-wider mb-1">
                    Festival Association
                  </label>
                  <select
                    value={formData.festivalTag || 'General'}
                    onChange={(e) => setFormData({ ...formData, festivalTag: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none"
                  >
                    <option value="General">General / All Occasions</option>
                    <option value="Diwali">Diwali (Festival of Lights)</option>
                    <option value="Ganesh Chaturthi">Ganesh Chaturthi</option>
                    <option value="Holi">Holi (Festival of Colors)</option>
                    <option value="Raksha Bandhan">Raksha Bandhan</option>
                    <option value="Janmashtami">Janmashtami</option>
                    <option value="Navratri">Navratri & Dussehra</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFestiveSpecial || false}
                      onChange={(e) => setFormData({ ...formData, isFestiveSpecial: e.target.checked })}
                      className="rounded border-[#E9DED0] text-[#6E1824] focus:ring-0"
                    />
                    <span className="font-semibold text-[11px]">Feature in Festive Showcase</span>
                  </label>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPerishable || false}
                    onChange={(e) => setFormData({ ...formData, isPerishable: e.target.checked })}
                    className="rounded border-[#E9DED0] text-[#6E1824] focus:ring-0"
                  />
                  <span className="font-semibold text-[11px]">Daily Fresh</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible !== false}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="rounded border-[#E9DED0] text-[#6E1824] focus:ring-0"
                  />
                  <span className="font-semibold text-[11px]">Public Live</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#E9DED0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#F8F3EA] hover:bg-[#E9DED0] font-semibold text-[#241A17] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="py-2.5 px-6 rounded-xl bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : editingProduct ? 'Update Sweet' : 'Add Sweet'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
