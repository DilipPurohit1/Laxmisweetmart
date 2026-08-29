import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export const SignatureShowcase: React.FC = () => {
  const { products, setSelectedProduct } = useStore();
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const safeProducts = products || [];

  // Top Curated Signature Items
  const signatureList = [
    safeProducts.find(p => p.id === 'royal-kaju-katli') || safeProducts[0],
    safeProducts.find(p => p.id === 'motichoor-laddoo') || safeProducts[1],
    safeProducts.find(p => p.id === 'kesar-ras-malai') || safeProducts[2],
    safeProducts.find(p => p.id === 'khoya-mawa-peda') || safeProducts[3],
    safeProducts.find(p => p.id === 'goan-farsan-mixture') || safeProducts[4],
  ].filter((item): item is NonNullable<typeof item> => Boolean(item && item.id));

  // Auto-scroll featured item every 4 seconds
  useEffect(() => {
    if (signatureList.length === 0) return;
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % signatureList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [signatureList.length]);

  if (signatureList.length === 0) return null;

  const validIndex = activeFeatureIndex < signatureList.length ? activeFeatureIndex : 0;
  const activeItem = signatureList[validIndex];
  const nextItem = () => setActiveFeatureIndex((prev) => (prev + 1) % signatureList.length);
  const prevItem = () => setActiveFeatureIndex((prev) => (prev - 1 + signatureList.length) % signatureList.length);

  const sideItems = signatureList.filter((_, i) => i !== validIndex).slice(0, 3);

  const activeImage =
    Array.isArray(activeItem.images) && activeItem.images.length > 0 && activeItem.images[0]
      ? activeItem.images[0]
      : '/products/placeholder.jpg';

  return (
    <section id="favourites" className="pt-10 sm:pt-14 pb-8 sm:pb-12 bg-[#FFFDF8] border-b border-[#E9DED0] text-left scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5 sm:mb-7">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#6E1824] block mb-1">
              Handcrafted Specialties
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#241A17]">
              A Few of Our Favourites
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#241A17]/60 pr-3 border-r border-[#E9DED0]">
              <span>Featuring {validIndex + 1} of {signatureList.length}</span>
            </div>
            <a
              href="#catalog"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#6E1824] hover:underline"
            >
              <span>Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Compact Balanced Magazine Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Main Spotlight Card */}
          <div className="lg:col-span-7 group rounded-2xl bg-[#F8F3EA] border border-[#E9DED0] hover:border-[#C89B3C]/70 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-sm">
            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#6E1824]/10 text-[#6E1824] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                  Featured Specialty
                </span>
                <span className="text-sm sm:text-base font-serif font-bold text-[#6E1824]">
                  ₹{activeItem.indicativePrice} <span className="text-[10px] sm:text-xs font-normal text-[#241A17]/70">/{activeItem.unit}</span>
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-black text-[#241A17]">
                {activeItem.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#241A17]/80 line-clamp-2 leading-relaxed">
                {activeItem.description}
              </p>
            </div>

            {/* Photo Frame */}
            <div 
              onClick={() => setSelectedProduct(activeItem)}
              className="my-3 w-full h-48 sm:h-56 rounded-xl bg-[#FFFDF8] border border-[#E9DED0] overflow-hidden flex items-center justify-center relative cursor-pointer group/img shadow-inner"
            >
              <img
                src={activeImage}
                alt={activeItem.name}
                className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/15 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-2.5 py-1 rounded-lg bg-white text-[#241A17] text-[11px] font-bold flex items-center gap-1 shadow-md">
                  <Eye className="w-3 h-3 text-[#6E1824]" /> View Details
                </span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E9DED0]">
              <div className="flex items-center gap-1.5">
                {signatureList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFeatureIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === validIndex ? 'w-5 bg-[#6E1824]' : 'w-1.5 bg-[#E9DED0] hover:bg-[#6E1824]/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevItem}
                  className="p-1.5 rounded-lg bg-[#FFFDF8] border border-[#E9DED0] hover:bg-[#E9DED0] text-[#241A17] transition-colors cursor-pointer"
                  title="Previous item"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextItem}
                  className="p-1.5 rounded-lg bg-[#FFFDF8] border border-[#E9DED0] hover:bg-[#E9DED0] text-[#241A17] transition-colors cursor-pointer"
                  title="Next item"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Curated Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-3.5">
            {sideItems.map((item) => {
              const itemImg =
                Array.isArray(item.images) && item.images.length > 0 && item.images[0]
                  ? item.images[0]
                  : '/products/placeholder.jpg';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedProduct(item)}
                  className="group cursor-pointer p-3 sm:p-3.5 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] hover:border-[#C89B3C]/70 transition-all flex items-center gap-3 shadow-2xs hover:shadow-xs"
                >
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg bg-[#FFFDF8] border border-[#E9DED0] overflow-hidden flex-shrink-0">
                    <img
                      src={itemImg}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="text-[9px] uppercase tracking-wider font-bold text-[#6E1824]">
                      {item.category.replace('-', ' ')}
                    </div>
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-[#241A17] group-hover:text-[#6E1824] transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#241A17]/70 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                    <div className="text-xs font-serif font-bold text-[#6E1824] mt-0.5">
                      ₹{item.indicativePrice} <span className="text-[9px] font-normal text-[#241A17]/60">/{item.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
