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
  Sun,
  Moon
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
    loadAdminProducts,
    theme,
    toggleTheme
  } = useStore();

  // Login form state (Empty by default for user entry)
  const [ownerNameInput, setOwnerNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Email OTP & Password Reset State (Email-only, 3 clean stages)
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpStage, setOtpStage] = useState<'request_email' | 'verify_otp' | 'reset_password'>('request_email');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [identifiedOwner, setIdentifiedOwner] = useState<AuthorizedOwner | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(300); // 5 minutes
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

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

  // 5-minute countdown clock
  useEffect(() => {
    let timer: any;
    if (isOtpModalOpen && otpStage === 'verify_otp' && otpSecondsLeft > 0) {
      timer = setInterval(() => {
        setOtpSecondsLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpModalOpen, otpStage, otpSecondsLeft]);

  // Format seconds as MM:SS (e.g. 04:59)
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

  // Open Forgot Password Modal
  const handleOpenForgotPassword = () => {
    setOtpStage('request_email');
    setEnteredEmail('');
    setIdentifiedOwner(null);
    setEnteredOtp('');
    setOtpError('');
    setNewPassword('');
    setConfirmPassword('');
    setOtpSecondsLeft(300);
    setIsOtpModalOpen(true);
  };

  // 1. Send OTP to Owner Email
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setIsSendingOtp(true);

    try {
      const res = await sendEmailOtpToOwner(enteredEmail);
      const owner = AUTHORIZED_OWNERS.find(o => o.email.toLowerCase() === res.email.toLowerCase()) || null;
      setIdentifiedOwner(owner);
      setOtpStage('verify_otp');
      setOtpSecondsLeft(300); // 5-minute fresh timer
    } catch (err: any) {
      setOtpError(err.message || 'Failed to send OTP. Please enter a valid registered owner email.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Resend Email Handler
  const handleResendEmail = async () => {
    if (!enteredEmail) return;
    setOtpError('');
    setIsSendingOtp(true);
    try {
      await sendEmailOtpToOwner(enteredEmail);
      setOtpSecondsLeft(300);
      alert('✅ Fresh 6-digit OTP sent to your email inbox. Valid for 5 minutes.');
    } catch (err: any) {
      setOtpError(err.message || 'Could not resend email. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // 2. Verify 6-Digit OTP (Only moves to Reset Password on success)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setIsVerifyingOtp(true);

    try {
      const result = await verifyEmailOtp(enteredEmail, enteredOtp);
      setIdentifiedOwner(result.owner);
      setOtpStage('reset_password'); // Password reset form appears AFTER verification!
    } catch (err: any) {
      setOtpError(err.message || 'Invalid or expired 6-digit OTP code. Please check your email inbox.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // 3. Save New Password & Synchronize to Cloud Firestore
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (newPassword.length < 4) {
      setOtpError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setOtpError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const activeName = identifiedOwner ? identifiedOwner.name : 'Mahendra Purohit';
      const activePhone = identifiedOwner ? identifiedOwner.phone : '9423313875';
      const activeEmail = identifiedOwner ? identifiedOwner.email : 'laxmisweetmart@gmail.com';

      await updateAdminPassword({
        ownerName: activeName,
        password: newPassword.trim(),
        phone: activePhone,
        email: activeEmail
      });

      setIsOtpModalOpen(false);
      alert(`✅ Password successfully updated for ${activeName}! You can now sign in with your new password.`);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to update password. Please check connection.');
    } finally {
      setIsSubmittingPassword(false);
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

  // 1. LOGIN VIEW (EMPTY BY DEFAULT)
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] flex items-center justify-center p-4 selection:bg-[#6E1824] selection:text-white">
        <div className="max-w-md w-full bg-[#FFFDF8] border border-[#E9DED0] rounded-3xl p-8 shadow-xl space-y-6 text-left">
          
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={() => setIsAdminView(false)}
              className="inline-flex items-center gap-1.5 text-xs text-[#241A17]/70 hover:text-[#6E1824] font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-xl text-[#241A17] hover:bg-[#F8F3EA] border border-[#E9DED0] transition-colors shadow-xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#C89B3C]" />
              ) : (
                <Moon className="w-4 h-4 text-[#6E1824]" />
              )}
            </button>
          </div>

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

        {/* EMAIL OTP & PASSWORD RESET MODAL */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#FFFDF8] rounded-3xl border border-[#E9DED0] shadow-2xl max-w-md w-full p-6 space-y-5 text-left relative max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-[#E9DED0] pb-3">
                <div className="flex items-center gap-2 text-[#6E1824] font-serif font-bold text-base">
                  <KeyRound className="w-5 h-5" />
                  <span>
                    {otpStage === 'reset_password' ? 'Set New Master Password' : 'Owner Password Recovery'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOtpModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F8F3EA] text-[#241A17]/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {otpError && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* STAGE 1: ENTER REGISTERED OWNER EMAIL */}
              {otpStage === 'request_email' && (
                <form onSubmit={handleSendEmailOtp} className="space-y-4 text-xs">
                  <p className="text-[#241A17]/80 leading-relaxed">
                    Enter your registered Owner Email address to receive your 6-digit verification code:
                  </p>

                  <div className="p-3 rounded-2xl bg-[#F8F3EA] border border-[#E9DED0] space-y-1.5 text-[11px]">
                    <span className="font-bold text-[#6E1824] block">Authorized Owners:</span>
                    <div className="text-[#241A17]/80 space-y-0.5">
                      <div>• Dilip Purohit</div>
                      <div>• Mahendra Purohit</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#241A17]">
                      Registered Owner Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={enteredEmail}
                        onChange={(e) => setEnteredEmail(e.target.value)}
                        placeholder="Enter your registered owner email"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] font-medium text-[#241A17] outline-none focus:border-[#6E1824]"
                      />
                      <Mail className="w-4 h-4 text-[#6E1824] absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 px-4 rounded-xl bg-[#6E1824] hover:bg-[#52111A] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#C89B3C]" />
                    <span>{isSendingOtp ? 'Sending OTP to Email...' : 'Send OTP via Email'}</span>
                  </button>
                </form>
              )}

              {/* STAGE 2: ENTER 6-DIGIT OTP FROM EMAIL */}
              {otpStage === 'verify_otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block text-emerald-900">
                        OTP Dispatched to {identifiedOwner?.name}
                      </span>
                      <span className="block text-[11px] text-amber-800 leading-snug">
                        A 6-digit security code was dispatched to your email. Check your Inbox and Spam folder. Valid for <strong>5 minutes</strong>.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0]">
                    <span className="text-[#241A17]/80 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#6E1824]" />
                      <span>Code expires in: <strong className="text-[#6E1824] font-mono">{formatTime(otpSecondsLeft)}</strong></span>
                    </span>

                    <button
                      type="button"
                      onClick={handleResendEmail}
                      disabled={isSendingOtp}
                      className="inline-flex items-center gap-1 text-[#6E1824] font-bold hover:underline disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                      <span>Resend Email</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#241A17]">
                      Enter 6-Digit OTP from Email
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-center font-mono text-xl font-bold tracking-widest text-[#6E1824] outline-none focus:border-[#6E1824]"
                    />
                    <span className="block text-[10px] text-[#241A17]/60 text-center mt-1">
                      Enter the 6-digit code received in your email inbox.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || otpSecondsLeft === 0}
                    className="w-full py-3 px-4 rounded-xl bg-[#6E1824] hover:bg-[#52111A] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
                  >
                    {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP'}
                  </button>
                </form>
              )}

              {/* STAGE 3: SET NEW PASSWORD (APPEARS ONLY AFTER OTP VERIFICATION) */}
              {otpStage === 'reset_password' && (
                <form onSubmit={handleSaveNewPassword} className="space-y-4 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>OTP Verified for <strong>{identifiedOwner?.name}</strong>! Set your new password below.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#241A17]">
                      New Master Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-[#241A17]/60"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#241A17]">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-[#241A17] outline-none focus:border-[#6E1824]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="w-full py-3 px-4 rounded-xl bg-[#6E1824] hover:bg-[#52111A] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4 text-[#C89B3C]" />
                    <span>{isSubmittingPassword ? 'Saving to Cloud Firestore...' : 'Save New Password & Unlock Admin'}</span>
                  </button>
                </form>
              )}

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
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-[#241A17] hover:bg-[#F8F3EA] border border-[#E9DED0] transition-colors shadow-xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#C89B3C]" />
              ) : (
                <Moon className="w-4 h-4 text-[#6E1824]" />
              )}
            </button>

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
            className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-[#6E1824] hover:bg-[#8B1E2E] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4 text-[#F0C05A]" />
            <span>Add New Sweet / Item</span>
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
                          className={`p-2 rounded-xl border transition-all ${
                            product.isFestiveSpecial
                              ? 'bg-amber-400 dark:bg-amber-400 text-stone-950 font-bold border-amber-500 shadow-xs ring-2 ring-amber-400/30'
                              : 'bg-[#F8F3EA] dark:bg-[#2A201E] border-[#E9DED0] dark:border-[#4D3A37] text-stone-400 dark:text-[#E2DACF] hover:text-[#241A17] dark:hover:text-amber-300'
                          }`}
                          title={product.isFestiveSpecial ? 'Active Festive Special (Click to Disable)' : 'Inactive (Click to make Festive Special)'}
                        >
                          <Sparkles className={`w-4 h-4 ${product.isFestiveSpecial ? 'text-stone-950' : 'text-stone-400 dark:text-[#E2DACF]'}`} />
                        </button>
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleVisibility(product.id, !product.isVisible)}
                          className={`p-2 rounded-xl border transition-all ${
                            product.isVisible
                              ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/30'
                              : 'bg-rose-50 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/30'
                          }`}
                          title={product.isVisible ? 'Visible on Counter (Click to Hide)' : 'Hidden from Counter (Click to Show)'}
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
