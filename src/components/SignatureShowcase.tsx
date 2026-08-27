import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Eye, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const SignatureShowcase: React.FC = () => {
  const { products, setSelectedProduct } = useStore();
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  // Top 5 Curated Signature Items
  const signatureList = [
    products.find(p => p.id === 'royal-kaju-katli') || products[0],
    products.find(p => p.id === 'motichoor-laddoo') || products[1],
    products.find(p => p.id === 'kesar-ras-malai') || products[2],
    products.find(p => p.id === 'khoya-mawa-peda') || products[3],
    products.find(p => p.id === 'goan-farsan-mixture') || products[4],
  ].filter(Boolean);

  // Auto-scroll featured item every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % signatureList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [signatureList.length]);

  const activeItem = signatureList[activeFeatureIndex];
  const nextItem = () => setActiveFeatureIndex((prev) => (prev + 1) % signatureList.length);
  const prevItem = () => setActiveFeatureIndex((prev) => (prev - 1 + signatureList.length) % signatureList.length);

  // Other side items excluding current active
  const sideItems = signatureList.filter((_, i) => i !== activeFeatureIndex).slice(0, 3);

  return (
    <section id="favourites" className="py-10 sm:py-16 bg-[#FFFDF8] border-b border-[#E9DED0] text-left">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#6E1824] block mb-1">
              Handcrafted Specialties
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#241A17]">
              A Few of Our Favourites
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#241A17]/60 pr-3 border-r border-[#E9DED0]">
              <span>Featuring {activeFeatureIndex + 1} of {signatureList.length}</span>
            </div>
            <a
              href="#catalog"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#6E1824] hover:underline"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Auto-Rotating Featured Magazine Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">
          
          {/* Main Auto-Scrolling Spotlight Card with Taller & Clear Photo Frame */}
          {activeItem && (
            <div
              className="lg:col-span-7 group rounded-3xl bg-[#F8F3EA] border border-[#E9DED0] hover:border-[#C89B3C]/70 p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#6E1824] bg-[#6E1824]/10 px-3 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C89B3C]" />
                    <span>Signature Spotlight</span>
                  </span>
                  
                  {/* Manual Arrow Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); prevItem(); }}
                      className="w-7 h-7 rounded-full bg-white border border-[#E9DED0] hover:bg-[#6E1824] hover:text-white flex items-center justify-center text-xs transition-colors"
                      title="Previous sweet"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextItem(); }}
                      className="w-7 h-7 rounded-full bg-white border border-[#E9DED0] hover:bg-[#6E1824] hover:text-white flex items-center justify-center text-xs transition-colors"
                      title="Next sweet"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3
                  onClick={() => setSelectedProduct(activeItem)}
                  className="text-xl sm:text-2xl font-serif font-bold text-[#241A17] group-hover:text-[#6E1824] transition-colors cursor-pointer"
                >
                  {activeItem.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#241A17]/80 max-w-lg leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              {/* Real Photo Visual Area: Taller, properly centered & perfectly visible */}
              <div
                onClick={() => setSelectedProduct(activeItem)}
                className="my-5 h-72 sm:h-80 rounded-2xl bg-[#FFFDF8] border border-[#E9DED0] relative overflow-hidden cursor-pointer shadow-inner"
              >
                <img
                  key={activeItem.id}
                  src={activeItem.images[0] || '/products/placeholder.jpg'}
                  alt={activeItem.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out animate-in fade-in"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                  }}
                />
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-[#E9DED0] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-[#241A17]/60 font-semibold">Indicative Price:</div>
                  <div className="text-base font-serif font-black text-[#6E1824]">
                    ₹{activeItem.indicativePrice} <span className="text-xs font-normal text-[#241A17]/70">/ {activeItem.unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProduct(activeItem)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E1824] hover:underline"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>

              {/* Progress indicator bar */}
              <div className="flex items-center gap-1.5 mt-3 pt-1">
                {signatureList.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveFeatureIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeFeatureIndex ? 'w-7 bg-[#6E1824]' : 'w-1.5 bg-[#E9DED0] hover:bg-[#C89B3C]'
                    }`}
                    title={item.name}
                  />
                ))}
              </div>

            </div>
          )}

          {/* Side Companions with generous thumbnail frames */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {sideItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="group rounded-3xl bg-[#F8F3EA] border border-[#E9DED0] hover:border-[#C89B3C]/70 p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex-1"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#FFFDF8] border border-[#E9DED0] flex-shrink-0">
                    <img
                      src={item.images[0] || '/products/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#6E1824] bg-[#6E1824]/10 px-2 py-0.5 rounded-full capitalize">
                      {item.category.replace('-', ' ')}
                    </span>

                    <h4 className="text-sm sm:text-base font-serif font-bold text-[#241A17] group-hover:text-[#6E1824] transition-colors truncate mt-1">
                      {item.name}
                    </h4>

                    <p className="text-xs text-[#241A17]/75 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="text-xs font-serif font-bold text-[#6E1824] mt-1.5">
                      Indicative: ₹{item.indicativePrice} / {item.unit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
