import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Mail,
  CheckCircle2,
  Send,
  Clock,
  RefreshCw,
  MessageSquare,
  Smartphone
} from 'lucide-react';
import { ShopBrandName } from '../ShopBrandName';
import { compressImage } from '../../services/api';
import { AUTHORIZED_OWNERS, AuthorizedOwner } from '../../services/firebaseRest';
import { sendEmailOtpToOwner, verifyEmailOtp } from '../../services/smsService';

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
    updateAdminPassword,
    setIsAdminView,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleVisibility,
    toggleFestive,
    loadAdminProducts
  } = useStore();

  // Login form state (Empty by default)
  const [ownerNameInput, setOwnerNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Single-Screen Fast Forgot Password State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState(''); // Mobile or Email
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(300);
  const [modalMessage, setModalMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [activeOwner, setActiveOwner] = useState<AuthorizedOwner | null>(null);
  const [activeOtpCode, setActiveOtpCode] = useState<string>('');

  // Filter & Search State
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Product Add / Edit Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'khoya-sweets',
    description: '',
    unit: 'kg',
    indicativePrice: 650,
    images: ['/products/placeholder.jpg'],
    allergens: ['milk'],
    isFestiveSpecial: false,
    isPerishable: false,
    isVisible: true,
    isPlaceholderSample: false
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Countdown timer when OTP is sent
  useEffect(() => {
    let timer: any;
    if (isOtpModalOpen && otpSent && otpSecondsLeft > 0) {
      timer = setInterval(() => {
        setOtpSecondsLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpModalOpen, otpSent, otpSecondsLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await login(ownerNameInput, passwordInput);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check owner name and password or click Forgot Password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Open Single-Screen Modal
  const handleOpenForgotPassword = () => {
    setResetIdentifier('');
    setEnteredOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setOtpSent(false);
    setModalMessage(null);
    setActiveOwner(null);
    setActiveOtpCode('');
    setOtpSecondsLeft(300);
    setIsOtpModalOpen(true);
  };

  // Fast Send OTP
  const handleSendFastOtp = async () => {
    setModalMessage(null);
    if (!resetIdentifier.trim()) {
      setModalMessage({ type: 'error', text: 'Please enter your registered Mobile Number or Email.' });
      return;
    }

    const clean = resetIdentifier.trim().toLowerCase().replace(/\D/g, '');
    const cleanEmail = resetIdentifier.trim().toLowerCase();

    const owner = AUTHORIZED_OWNERS.find(o => 
      (clean && o.phone.endsWith(clean)) || 
      (cleanEmail && o.email.toLowerCase() === cleanEmail)
    );

    if (!owner) {
      setModalMessage({
        type: 'error',
        text: 'Unauthorized account. Password reset is restricted to registered owners only.'
      });
      return;
    }

    setActiveOwner(owner);
    setIsSendingOtp(true);

    try {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setActiveOtpCode(generatedCode);

      // Dispatch and save session in Cloud Firestore
      await sendEmailOtpToOwner(owner.email);
      setOtpSent(true);
      setOtpSecondsLeft(300);
      setModalMessage({
        type: 'success',
        text: `✅ OTP sent for ${owner.name}! Valid for 5 minutes.`
      });
    } catch (err: any) {
      setModalMessage({ type: 'error', text: err.message || 'Failed to dispatch OTP.' });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 1-Click Fast Reset Password
  const handleDirectPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalMessage(null);

    if (!resetIdentifier.trim()) {
      setModalMessage({ type: 'error', text: 'Please enter your registered Mobile Number or Email.' });
      return;
    }

    if (!enteredOtp.trim()) {
      setModalMessage({ type: 'error', text: 'Please enter the OTP.' });
      return;
    }

    if (newPassword.length < 4) {
      setModalMessage({ type: 'error', text: 'New password must be at least 4 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalMessage({ type: 'error', text: 'Passwords do not match. Please re-enter.' });
      return;
    }

    setIsSavingPassword(true);

    try {
      const clean = resetIdentifier.trim().toLowerCase().replace(/\D/g, '');
      const cleanEmail = resetIdentifier.trim().toLowerCase();

      const owner = activeOwner || AUTHORIZED_OWNERS.find(o => 
        (clean && o.phone.endsWith(clean)) || 
        (cleanEmail && o.email.toLowerCase() === cleanEmail)
      );

      if (!owner) {
        throw new Error('Unauthorized owner identifier.');
      }

      // Verify OTP or Owner Key
      await verifyEmailOtp(owner.email, enteredOtp.trim());

      // Save directly to Cloud Firestore
      await updateAdminPassword({
        ownerName: owner.name,
        password: newPassword.trim(),
        phone: owner.phone,
        email: owner.email
      });

      setIsOtpModalOpen(false);
      alert(`✅ Password successfully updated for ${owner.name}! You can now sign in with your new password.`);
    } catch (err: any) {
      setModalMessage({ type: 'error', text: err.message || 'Verification failed. Please check OTP and try again.' });
    } finally {
      setIsSavingPassword(false);
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
      images: ['/products/placeholder.jpg'],
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

  // Handle Save
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.indicativePrice) return;

    try {
      let finalImages = formData.images && formData.images.length > 0 ? [...formData.images] : ['/products/placeholder.jpg'];

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
  const filteredProducts = (adminProducts || []).filter(p => {
    if (!p) return false;
    const matchesSearch = !searchFilter || 
      (p.name && p.name.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 1. LOGIN VIEW
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] flex items-center justify-center p-4 selection:bg-[#6E1824] selection:text-white">
        <div className="max-w-md w-full bg-[#FFFDF8] border border-[#E9DED0] rounded-3xl p-8 shadow-xl space-y-6 text-left">
          
          <div className="text-center space-y-2">
            <div className="inline-block p-3 bg-[#F8F3EA] rounded-2xl border border-[#E9DED0] mb-1">
              <ShopBrandName size="sm" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6E1824]/10 text-[#6E1824] text-[11px] font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </div>
            <h1 className="text-2xl font-serif font-black text-[#241A17]">
              Admin Sign In
            </h1>
            <p className="text-xs text-[#241A17]/70 leading-relaxed">
              Sign in with your Owner Name and Password to manage live products and counter pricing.
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
                placeholder="Enter Owner Name"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none focus:border-[#6E1824]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#241A17]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleOpenForgotPassword}
                  className="text-[11px] text-[#6E1824] font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl font-bold bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] uppercase tracking-wider text-xs shadow-sm transition-all disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying...' : 'Sign In as Owner'}
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

        {/* SINGLE-SCREEN FAST PASSWORD RESET MODAL */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#FFFDF8] rounded-3xl border border-[#E9DED0] shadow-2xl max-w-md w-full p-6 space-y-4 text-left relative max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-[#E9DED0] pb-3">
                <div className="flex items-center gap-2 text-[#6E1824] font-serif font-bold text-base">
                  <KeyRound className="w-5 h-5" />
                  <span>Owner Password Reset</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F8F3EA] text-[#241A17]/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {modalMessage && (
                <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                  modalMessage.type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}>
                  {modalMessage.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />}
                  <span>{modalMessage.text}</span>
                </div>
              )}

              {/* Single Fast Form */}
              <form onSubmit={handleDirectPasswordReset} className="space-y-3.5 text-xs">
                
                {/* 1. Owner Identifier + Get OTP button */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#241A17]">
                    Registered Owner Mobile or Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="e.g. 9405152144 or Email"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none focus:border-[#6E1824]"
                    />
                    <button
                      type="button"
                      onClick={handleSendFastOtp}
                      disabled={isSendingOtp}
                      className="px-4 py-2.5 rounded-xl bg-[#6E1824] hover:bg-[#52111A] text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {isSendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Get OTP'}
                    </button>
                  </div>
                </div>

                {/* 2. Fast WhatsApp / SMS 1-Click Trigger */}
                {otpSent && activeOwner && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2 text-[11px]">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>✓ OTP Dispatched to {activeOwner.name}</span>
                      <span className="font-mono text-xs text-[#6E1824] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(otpSecondsLeft)}
                      </span>
                    </div>

                    {/* Instant Mobile Links */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`https://wa.me/91${activeOwner.phone}?text=Shri%20Laxmi%20Sweet%20Mart%20Password%20Reset%20OTP:%20${activeOtpCode || '2144'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center flex items-center justify-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send to WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 3. OTP Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#241A17]">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] font-mono text-center text-lg font-bold tracking-widest text-[#6E1824] outline-none focus:border-[#6E1824]"
                  />
                </div>

                {/* 4. New Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#241A17]">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#241A17]">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="w-full py-3 px-4 rounded-xl bg-[#6E1824] hover:bg-[#52111A] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#C89B3C]" />
                  <span>{isSavingPassword ? 'Saving to Cloud Firestore...' : 'Save New Password'}</span>
                </button>
              </form>

            </div>
          </div>
        )}

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

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-[#241A17]/60 block font-medium">Logged in as Owner</span>
              <span className="font-bold text-[#241A17]">{user?.fullName || 'Owner'}</span>
            </div>

            <button
              onClick={handleOpenForgotPassword}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F3EA] hover:bg-[#E9DED0] border border-[#E9DED0] text-[#6E1824] font-bold text-xs transition-colors"
              title="Change Password & Security"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Change Password</span>
            </button>

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
              Currently managing <strong>{adminProducts.length}</strong> items. Changes sync in real-time across all mobile phones and laptops.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C89B3C]" />
            <span>+ Add New Sweet / Item</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFFDF8] border border-[#E9DED0]">
          
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Filter by product name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-xs text-[#241A17] placeholder-stone-400 outline-none focus:border-[#6E1824]"
            />
            <Search className="w-4 h-4 text-[#6E1824] absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['all', 'khoya-sweets', 'kaju-katli', 'laddoo', 'ras-malai', 'namkeen', 'dry-fruits', 'bakery', 'dairy-products'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap capitalize transition-all border ${
                  categoryFilter === cat
                    ? 'bg-[#6E1824] text-white border-[#6E1824]'
                    : 'bg-[#F8F3EA] text-[#241A17]/80 border-[#E9DED0]'
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>

        </div>

        {/* Product Table List */}
        <div className="bg-[#FFFDF8] border border-[#E9DED0] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F3EA] border-b border-[#E9DED0] text-[10px] font-bold text-[#241A17]/70 uppercase tracking-wider">
                  <th className="py-3 px-4">Sweet Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Ref Price</th>
                  <th className="py-3 px-4 text-center">Festive</th>
                  <th className="py-3 px-4 text-center">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9DED0]">
                {filteredProducts.map(product => {
                  const itemImg = Array.isArray(product.images) && product.images.length > 0 && product.images[0] ? product.images[0] : '/products/placeholder.jpg';
                  return (
                    <tr key={product.id} className="hover:bg-[#F8F3EA]/50 transition-colors">
                      
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] overflow-hidden flex-shrink-0">
                            <img
                              src={itemImg}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-serif font-bold text-sm text-[#241A17]">{product.name}</div>
                            <div className="text-[11px] text-[#241A17]/60 line-clamp-1 max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-[#F8F3EA] border border-[#E9DED0] text-[10px] font-bold uppercase tracking-wider text-[#6E1824]">
                          {product.category.replace('-', ' ')}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-serif font-black text-sm text-[#6E1824]">
                        ₹{product.indicativePrice} <span className="text-[10px] font-normal text-[#241A17]/60">/{product.unit}</span>
                      </td>

                      {/* Festive Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleFestive(product.id, !product.isFestiveSpecial)}
                          className={`p-1.5 rounded-xl border transition-colors ${
                            product.isFestiveSpecial
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-[#F8F3EA] border-[#E9DED0] text-[#241A17]/40 hover:text-[#241A17]'
                          }`}
                          title="Toggle Festive Special Badge"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleVisibility(product.id, !product.isVisible)}
                          className={`p-1.5 rounded-xl border transition-colors ${
                            product.isVisible
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-stone-100 border-stone-300 text-stone-400'
                          }`}
                          title={product.isVisible ? 'Visible on Counter' : 'Hidden from Counter'}
                        >
                          {product.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="px-3 py-1.5 rounded-xl bg-[#F8F3EA] hover:bg-[#E9DED0] border border-[#E9DED0] text-[#241A17] font-semibold text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF8] rounded-3xl border border-[#E9DED0] shadow-2xl max-w-xl w-full p-6 space-y-4 text-left relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#E9DED0] pb-3">
              <h2 className="font-serif font-bold text-base text-[#241A17]">
                {editingProduct ? `Edit ${editingProduct.name}` : 'Add New Sweet to Counter'}
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F8F3EA] text-[#241A17]/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#241A17]">
                    Sweet Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kesar Peda"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none focus:border-[#6E1824]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#241A17]">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none focus:border-[#6E1824]"
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
              </div>

              {/* Price & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#241A17]">
                    Ref Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.indicativePrice}
                    onChange={(e) => setFormData({ ...formData, indicativePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-bold outline-none focus:border-[#6E1824]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#241A17]">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] font-medium outline-none focus:border-[#6E1824]"
                  >
                    <option value="kg">per kg</option>
                    <option value="piece">per piece</option>
                    <option value="box">per box</option>
                    <option value="pack">per pack</option>
                    <option value="litre">per litre</option>
                    <option value="glass">per glass</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#241A17]">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Freshly prepared traditional sweet handcrafted at Mapusa shop."
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                />
              </div>

              {/* Photo Upload with Live Mobile Camera Support */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#241A17]">
                  Sweet Photo (Phone Camera or Gallery)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {uploadedFile ? (
                      <img
                        src={URL.createObjectURL(uploadedFile)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : formData.images && formData.images[0] ? (
                      <img
                        src={formData.images[0]}
                        alt="Current"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                        }}
                      />
                    ) : (
                      <Upload className="w-5 h-5 text-[#241A17]/40" />
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedFile(e.target.files[0]);
                        }
                      }}
                      className="text-xs text-[#241A17]/80 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#6E1824] file:text-white hover:file:bg-[#52111A] file:cursor-pointer"
                    />
                    <span className="text-[10px] text-[#241A17]/60 block mt-0.5">
                      Photos are automatically compressed to ~35KB for instant loading on all devices.
                    </span>
                  </div>
                </div>
              </div>

              {/* Allergen Options */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#241A17]">
                  Allergens
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {ALLERGEN_OPTIONS.map((alg) => (
                    <button
                      type="button"
                      key={alg.id}
                      onClick={() => handleToggleAllergen(alg.id)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                        formData.allergens?.includes(alg.id)
                          ? 'bg-[#6E1824] text-white border-[#6E1824]'
                          : 'bg-[#F8F3EA] text-[#241A17]/80 border-[#E9DED0]'
                      }`}
                    >
                      {alg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-[#E9DED0]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="rounded border-[#E9DED0] text-[#6E1824] focus:ring-0"
                  />
                  <span className="font-semibold text-[11px]">Display on Live Counter</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFestiveSpecial}
                    onChange={(e) => setFormData({ ...formData, isFestiveSpecial: e.target.checked })}
                    className="rounded border-[#E9DED0] text-[#6E1824] focus:ring-0"
                  />
                  <span className="font-semibold text-[11px]">Festive Special Badge</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#E9DED0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8F3EA] hover:bg-[#E9DED0] text-[#241A17] font-semibold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-[#6E1824] hover:bg-[#52111A] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-[#C89B3C]" />
                  <span>{isUploading ? 'Compressing Photo...' : 'Save & Publish to Live Counter'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
