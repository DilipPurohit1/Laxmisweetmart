import React, { useEffect } from 'react';
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

export const AppContent: React.FC = () => {
  const { isAdminView } = useStore();

  // Ensure page always starts at the top on load/refresh
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

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
  return <AppContent />;
}
