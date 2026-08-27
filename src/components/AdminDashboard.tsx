import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category, Allergen } from '../types';
import { Lock, Plus, Edit2, Trash2, ArrowLeft, AlertCircle, LogOut } from 'lucide-react';
import { ShopBrandName } from './ShopBrandName';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'khoya-sweets', label: 'Khoya Sweets' },
  { id: 'kaju-katli', label: 'Kaju Katli' },
  { id: 'laddoo', label: 'Laddoo' },
  { id: 'ras-malai', label: 'Ras Malai' },
  { id: 'namkeen', label: 'Namkeen' },
  { id: 'dry-fruits', label: 'Dry Fruits' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'dairy-products', label: 'Dairy Products' },
];

const ALLERGEN_OPTIONS: { id: Allergen; label: string }[] = [
  { id: 'milk', label: 'Milk' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'none', label: 'None' },
];

export const AdminDashboard: React.FC = () => {
  const {
    products,
    user,
    token,
    login,
    logout,
    setIsAdminView,
    createProduct,
    updateProduct,
    deleteProduct
  } = useStore();

  const [ownerName, setOwnerName] = useState('Mahendra Purohit');
  const [password, setPassword] = useState('123456');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit / Add modal state
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: 'khoya-sweets',
    unit: 'kg',
    indicativePrice: 500,
    images: ['/products/peda.jpg'],
    allergens: ['milk'],
    isFestiveSpecial: false,
    isPerishable: false,
    isVisible: true,
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      await login(ownerName, password);
    } catch {
      setLoginError('Invalid owner name or password. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAdd = () => {
    setCurrentProduct({
      name: '',
      description: '',
      category: 'khoya-sweets',
      unit: 'kg',
      indicativePrice: 500,
      images: ['/products/peda.jpg'],
      allergens: ['milk'],
      isFestiveSpecial: false,
      isPerishable: false,
      isVisible: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (p: Product) => {
    setCurrentProduct({ ...p });
    setIsEditing(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.indicativePrice) return;

    if (currentProduct.id) {
      await updateProduct(currentProduct.id, currentProduct);
    } else {
      const newId = currentProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `item-${Date.now()}`;
      await createProduct({
        ...currentProduct,
        id: newId,
        images: currentProduct.images && currentProduct.images.length > 0 ? currentProduct.images : ['/products/peda.jpg'],
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the counter catalog?`)) {
      await deleteProduct(id);
    }
  };

  // If not logged in, render Owner Login Form
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] flex items-center justify-center p-4 text-left">
        <div className="max-w-md w-full bg-[#FFFDF8] rounded-3xl border border-[#E9DED0] p-8 shadow-md">
          
          <div className="text-center space-y-2 mb-6">
            <div className="inline-block p-3 bg-[#F8F3EA] rounded-2xl border border-[#E9DED0] mb-1">
              <ShopBrandName size="sm" />
            </div>
            <h2 className="text-xl font-serif font-black text-[#241A17]">
              Owner Portal Login
            </h2>
            <p className="text-xs text-[#241A17]/70">
              Enter owner name & password to manage products, categories, and prices.
            </p>
          </div>

          {loginError && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#241A17] uppercase tracking-wider mb-1">
                Owner Name
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Mahendra Purohit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none focus:border-[#6E1824]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#241A17] uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm mt-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In as Owner'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E9DED0] flex items-center justify-between text-xs">
            <button
              onClick={() => setIsAdminView(false)}
              className="inline-flex items-center gap-1.5 text-[#241A17]/70 hover:text-[#6E1824]"
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

  // Admin Catalog Dashboard View
  return (
    <div className="min-h-screen bg-[#F8F3EA] text-left text-xs pb-16 font-sans">
      
      {/* Top Admin Bar */}
      <header className="bg-[#FFFDF8] border-b border-[#E9DED0] sticky top-0 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminView(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F3EA] hover:bg-[#E9DED0] text-[#241A17] text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>
            <div className="hidden sm:block text-xs font-serif font-bold text-[#6E1824]">
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

      {/* Main Admin Area */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#E9DED0] p-5 rounded-3xl shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-[#241A17]">
              Product & Pricing Management
            </h1>
            <p className="text-xs text-[#241A17]/70 mt-0.5">
              Manage your 17 live counter sweets, snacks, and dairy products.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Sweet / Item</span>
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-[#FFFDF8] border border-[#E9DED0] rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F3EA] border-b border-[#E9DED0] text-[10px] font-bold uppercase text-[#6E1824] tracking-wider">
                  <th className="py-3 px-4">Item & Visual</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Indicative Rate</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9DED0]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8F3EA]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] overflow-hidden flex-shrink-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-serif font-bold text-sm text-[#241A17]">{p.name}</div>
                          <div className="text-[11px] text-[#241A17]/65 line-clamp-1 max-w-xs">{p.description}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-[#F8F3EA] border border-[#E9DED0] text-[11px] font-semibold text-[#241A17]/80">
                        {p.category.replace('-', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-serif font-bold text-sm text-[#6E1824]">
                      ₹{p.indicativePrice} <span className="text-[10px] font-normal text-[#241A17]/60">/ {p.unit}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isFestiveSpecial && (
                          <span className="px-1.5 py-0.5 rounded bg-[#6E1824]/10 text-[#6E1824] font-bold text-[9px]">
                            Festive
                          </span>
                        )}
                        {p.isPerishable && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[9px] border border-amber-200">
                            Daily Fresh
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.isVisible ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.isVisible ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                        {p.isVisible ? 'Live' : 'Hidden'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-[#F8F3EA] hover:bg-[#6E1824] text-[#241A17] hover:text-white transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-700 hover:text-white transition-colors"
                          title="Delete Item"
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

      {/* Edit / Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full bg-[#FFFDF8] border border-[#E9DED0] rounded-3xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E9DED0] pb-3">
              <h3 className="text-base font-serif font-black text-[#241A17]">
                {currentProduct.id ? `Edit: ${currentProduct.name}` : 'Add New Counter Sweet'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#241A17] mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={currentProduct.name || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  placeholder="e.g. Special Sweet Malai Lassi"
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#241A17] mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={currentProduct.description || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  placeholder="Traditional flavor notes, ingredients, and texture..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#241A17] mb-1">Category</label>
                  <select
                    value={currentProduct.category}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value as Category })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#241A17] mb-1">Unit</label>
                  <select
                    value={currentProduct.unit}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, unit: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                  >
                    <option value="kg">per kg</option>
                    <option value="glass">per glass</option>
                    <option value="piece">per piece</option>
                    <option value="box">per box</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#241A17] mb-1">Indicative Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={currentProduct.indicativePrice || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, indicativePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#241A17] mb-1">Image Path / URL</label>
                  <input
                    type="text"
                    value={currentProduct.images ? currentProduct.images[0] : ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, images: [e.target.value] })}
                    placeholder="/products/lassi.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProduct.isFestiveSpecial || false}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isFestiveSpecial: e.target.checked })}
                    className="rounded border-[#E9DED0] text-[#6E1824] focus:ring-0"
                  />
                  <span>Festive Special</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProduct.isPerishable || false}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isPerishable: e.target.checked })}
                    className="rounded border-[#E9DED0] text-[#6E1824] focus:ring-0"
                  />
                  <span>Daily Fresh Batch</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProduct.isVisible !== false}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, isVisible: e.target.checked })}
                    className="rounded border-[#E9DED0] text-[#6E1824] focus:ring-0"
                  />
                  <span>Visible on Storefront</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E9DED0]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F3EA] hover:bg-[#E9DED0] text-[#241A17] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] font-bold shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
