import React, { useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SignatureShowcase } from './components/SignatureShowcase';
import { CategoryExplorer } from './components/CategoryExplorer';
import { HeritageStory } from './components/HeritageStory';
import { FestiveSpecials } from './components/FestiveSpecials';
import { ProductCatalog } from './components/ProductCatalog';
import { VisitUsSection } from './components/VisitUsSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Error Boundary Component to prevent any blank screen crashes
class GlobalErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App runtime error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F3EA] text-[#241A17] p-6 text-center">
          <h1 className="text-2xl font-serif font-black text-[#6E1824] mb-2">Shri Laxmi Sweet Mart</h1>
          <p className="text-xs text-[#241A17]/80 mb-4">Reloading latest fresh counter catalog...</p>
          <button
            onClick={() => {
              localStorage.removeItem('slsm_products');
              window.location.reload();
            }}
            className="px-4 py-2 bg-[#6E1824] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#58131D]"
          >
            Refresh Catalog
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { startAnimatedSweetFavicon } from './utils/animatedFavicon';

export const AppContent: React.FC = () => {
  const { isAdminView } = useStore();

  // Initialize animated sweets favicon and scroll reset
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Start cycling animated sweet icons in browser tab (1.6s interval)
    startAnimatedSweetFavicon(1600);
  }, []);

  useEffect(() => {
    document.title = isAdminView 
      ? '🔒 Owner Portal | श्री Laxmi Sweet Mart' 
      : 'श्री Laxmi Sweet Mart';
  }, [isAdminView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EA] text-[#241A17] font-sans selection:bg-[#C89B3C] selection:text-white">
      
      {/* Admin SaaS Dashboard Mode */}
      {isAdminView ? (
        <AdminDashboard />
      ) : (
        <>
          {/* Customer-Facing Luxury Editorial Brand Website */}
          <Navbar />
          
          <main className="flex-1">
            <HeroSection />
            <SignatureShowcase />
            <CategoryExplorer />
            <HeritageStory />
            <FestiveSpecials />
            <ProductCatalog />
            <VisitUsSection />
          </main>

          <Footer />

          {/* Clean Product Detail Modal */}
          <ProductDetailModal />
        </>
      )}

    </div>
  );
};

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppContent />
    </GlobalErrorBoundary>
  );
}
