import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Category, Allergen } from '../types';
import { Search, Eye, Sparkles, MessageCircle } from 'lucide-react';

const CATEGORY_TABS: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Sweets' },
  { id: 'khoya-sweets', label: 'Khoya Sweets' },
  { id: 'kaju-katli', label: 'Kaju Katli' },
  { id: 'laddoo', label: 'Laddoo' },
  { id: 'ras-malai', label: 'Ras Malai' },
  { id: 'namkeen', label: 'Namkeen' },
  { id: 'dry-fruits', label: 'Dry Fruits' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'dairy-products', label: 'Dairy Products' },
];

export const ProductCatalog: React.FC = () => {
  const { products, activeCategory, setActiveCategory, searchQuery, setSearchQuery, setSelectedProduct } = useStore();
  const [allergenFilter, setAllergenFilter] = useState<string>('all');

  const filteredProducts = (products || []).filter((p) => {
    if (!p || p.isVisible === false) return false;
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    const allergens = Array.isArray(p.allergens) ? p.allergens : [];
    const allergenMatch = allergenFilter === 'all' || !allergens.includes(allergenFilter as Allergen);
    const searchMatch =
      !searchQuery ||
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return catMatch && allergenMatch && searchMatch;
  });

  return (
    <section id="catalog" className="py-8 sm:py-16 max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12 text-left scroll-mt-16 sm:scroll-mt-20">
      
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#6E1824] block mb-1">
          Full Counter Selection
        </span>
        <h2 className="text-xl sm:text-3xl font-serif font-black text-[#241A17]">
          Explore Our Complete Catalog
        </h2>
        <p className="text-xs sm:text-sm text-[#241A17]/80 mt-1 leading-relaxed px-2">
          Browse our traditional sweets, Goan savoury snacks, and fresh dairy. Indicative counter prices shown for reference.
        </p>
      </div>

      {/* Category Tabs (Smooth Horizontal Swipeable on Mobile) */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto touch-pan-x overscroll-x-contain pb-2.5 mb-4 sm:mb-6 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0 select-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-[#6E1824] text-[#FFFDF8] border-[#6E1824] shadow-xs font-bold'
                : 'bg-[#FFFDF8] dark:bg-[#1E1716] text-[#241A17]/80 dark:text-[#E2DACF] border-[#E9DED0] dark:border-[#3D302E] hover:border-[#6E1824]/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar: Search & Dietary Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 mb-6 sm:mb-8 rounded-2xl bg-[#FFFDF8] border border-[#E9DED0]">
        
        {/* Search */}
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search sweets, namkeen, dry fruits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-9 pr-4 py-1.5 sm:py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-xs text-[#241A17] placeholder-stone-400 outline-none focus:border-[#6E1824]"
          />
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6E1824] absolute left-2.5 sm:left-3 top-2 sm:top-2.5" />
        </div>

        {/* Dietary / Allergen Filter */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs text-[#241A17]/70">
          <span className="font-semibold text-[10px] sm:text-[11px]">Dietary:</span>
          {['all', 'nuts', 'gluten'].map((alg) => (
            <button
              key={alg}
              onClick={() => setAllergenFilter(alg)}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] capitalize transition-all ${
                allergenFilter === alg
                  ? 'bg-[#241A17] text-white font-bold'
                  : 'bg-[#F8F3EA] text-[#241A17]/70 border border-[#E9DED0]'
              }`}
            >
              {alg === 'all' ? 'All' : `No ${alg}`}
            </button>
          ))}
        </div>

      </div>

      {/* Catalog Grid: Amazon 2-column Grid on Mobile, 3-4 columns on Desktop */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-[#FFFDF8] rounded-3xl border border-[#E9DED0] p-6 sm:p-8">
          <p className="text-sm sm:text-base font-serif font-bold text-[#241A17]">No sweets match your current filter.</p>
          <p className="text-xs text-[#241A17]/60 mt-1">Try selecting a different category or clearing search.</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setAllergenFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-[#6E1824] text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {filteredProducts.map((product) => {
            const displayImage =
              Array.isArray(product.images) && product.images.length > 0 && product.images[0]
                ? product.images[0]
                : '/products/placeholder.jpg';

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer rounded-xl sm:rounded-2xl bg-[#FFFDF8] border border-[#E9DED0] hover:border-[#C89B3C]/80 p-2 sm:p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-md relative overflow-hidden active:scale-[0.99]"
              >
                {/* Festive Ribbon / Badge */}
                {product.isFestiveSpecial && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-[#B8860B] text-white text-[8px] sm:text-[9px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                    <span>{product.festivalTag || 'Festive'}</span>
                  </div>
                )}

                {/* Photo Frame (Amazon Style Square on Mobile, 4/3 on Desktop) */}
                <div className="w-full aspect-square sm:aspect-[4/3] rounded-lg sm:rounded-xl bg-[#F8F3EA] border border-[#E9DED0] mb-2 sm:mb-3 overflow-hidden flex items-center justify-center relative">
                  <img
                    src={displayImage}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                    }}
                  />
                  <div className="hidden sm:flex absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
                    <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#241A17] text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Eye className="w-3 h-3 text-[#6E1824]" /> View Details
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[8px] sm:text-[10px] uppercase tracking-wider font-bold text-[#6E1824] truncate">
                      {product.category.replace('-', ' ')}
                    </div>
                    <h3 className="text-xs sm:text-sm font-serif font-bold text-[#241A17] line-clamp-2 leading-tight sm:leading-normal group-hover:text-[#6E1824] transition-colors">
                      {product.name}
                    </h3>
                    <p className="hidden sm:block text-[11px] text-[#241A17]/70 line-clamp-2 mt-0.5 leading-snug">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Action Button */}
                  <div className="pt-1.5 sm:pt-2 border-t border-[#E9DED0] mt-1 sm:mt-2">
                    <div className="flex items-baseline justify-between gap-1 mb-1.5">
                      <div>
                        <span className="text-[8px] sm:text-[9px] text-[#241A17]/60 block leading-none">Indicative</span>
                        <span className="text-xs sm:text-sm font-serif font-black text-[#6E1824]">
                          ₹{product.indicativePrice}{' '}
                          <span className="text-[9px] sm:text-[10px] font-normal text-[#241A17]/60">/{product.unit}</span>
                        </span>
                      </div>
                      <span className="hidden sm:inline-block text-[10px] font-semibold text-[#B8860B] group-hover:underline">
                        Inquire &rarr;
                      </span>
                    </div>

                    {/* Amazon-Style Quick Action Button for Mobile */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="sm:hidden w-full py-1.5 rounded-lg bg-[#6E1824] hover:bg-[#52111A] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3 text-[#C89B3C]" />
                      <span>View Sweet</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
