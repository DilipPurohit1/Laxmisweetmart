import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Category, Allergen } from '../types';
import { Search, Eye } from 'lucide-react';

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
    <section id="catalog" className="py-10 sm:py-16 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 text-left">
      
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="text-[11px] font-bold tracking-widest uppercase text-[#6E1824] block mb-1">
          Full Counter Selection
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#241A17]">
          Explore Our Complete Catalog
        </h2>
        <p className="text-xs sm:text-sm text-[#241A17]/80 mt-1 leading-relaxed">
          Browse through our full range of traditional sweets, savoury snacks, and dairy products. Indicative prices shown for reference — call or visit our Mapusa counter to purchase.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2.5 mb-6 scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === tab.id
                ? 'bg-[#6E1824] text-[#FFFDF8] border-[#6E1824] shadow-sm'
                : 'bg-[#FFFDF8] text-[#241A17]/80 border-[#E9DED0] hover:border-[#6E1824]/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar: Search & Dietary Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 mb-8 rounded-2xl bg-[#FFFDF8] border border-[#E9DED0]">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by sweet name or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F3EA] border border-[#E9DED0] text-xs text-[#241A17] placeholder-stone-400 outline-none focus:border-[#6E1824]"
          />
          <Search className="w-4 h-4 text-[#6E1824] absolute left-3 top-2.5" />
        </div>

        {/* Dietary / Allergen Filter */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-[#241A17]/70">
          <span className="font-semibold text-[11px]">Dietary:</span>
          {['all', 'nuts', 'gluten'].map((alg) => (
            <button
              key={alg}
              onClick={() => setAllergenFilter(alg)}
              className={`px-2.5 py-1 rounded-lg text-[11px] capitalize transition-all ${
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

      {/* Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFDF8] rounded-3xl border border-[#E9DED0] p-8">
          <p className="text-base font-serif font-bold text-[#241A17]">No sweets match your current filter.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const displayImage =
              Array.isArray(product.images) && product.images.length > 0 && product.images[0]
                ? product.images[0]
                : '/products/placeholder.jpg';

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer rounded-2xl bg-[#FFFDF8] border border-[#E9DED0] hover:border-[#C89B3C]/80 p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-md relative overflow-hidden"
              >
                {/* Festive Ribbon if applicable */}
                {product.isFestiveSpecial && (
                  <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full bg-[#B8860B] text-white text-[9px] font-bold tracking-wider uppercase shadow-sm">
                    {product.festivalTag || 'Festive'}
                  </div>
                )}

                {/* Photo Frame */}
                <div className="w-full aspect-[4/3] rounded-xl bg-[#F8F3EA] border border-[#E9DED0] mb-3 overflow-hidden flex items-center justify-center relative">
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-2.5 py-1 rounded-lg bg-white/90 text-[#241A17] text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Eye className="w-3 h-3 text-[#6E1824]" /> View Details
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-[#6E1824]">
                      {product.category.replace('-', ' ')}
                    </div>
                    <h3 className="text-sm font-serif font-bold text-[#241A17] line-clamp-1 group-hover:text-[#6E1824] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-[#241A17]/70 line-clamp-2 mt-0.5 leading-snug">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-2 border-t border-[#E9DED0] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-[#241A17]/60 block leading-none">Ref Price</span>
                      <span className="text-sm font-serif font-black text-[#6E1824]">
                        ₹{product.indicativePrice}{' '}
                        <span className="text-[10px] font-normal text-[#241A17]/60">/{product.unit}</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#B8860B] group-hover:underline">
                      Inquire &rarr;
                    </span>
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
