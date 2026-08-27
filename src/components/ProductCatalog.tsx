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

  const filteredProducts = products.filter(p => {
    if (!p.isVisible) return false;
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    const allergenMatch = allergenFilter === 'all' || !p.allergens.includes(allergenFilter as Allergen);
    const searchMatch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

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

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-[#FFFDF8] rounded-3xl border border-dashed border-[#E9DED0]">
          <div className="text-3xl mb-2">🪔</div>
          <h3 className="text-base font-serif font-bold text-[#241A17]">No items found</h3>
          <p className="text-xs text-[#241A17]/60 mt-1">Try resetting the category filter or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group rounded-3xl bg-[#FFFDF8] border border-[#E9DED0] hover:border-[#C89B3C] p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Product Visual Container with Aspect Ratio */}
              <div>
                <div className="aspect-[4/3] w-full rounded-2xl bg-[#F8F3EA] border border-[#E9DED0] relative overflow-hidden mb-3">
                  <img
                    src={product.images[0] || '/products/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                    }}
                  />

                  {product.isFestiveSpecial && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-[#6E1824] text-[#FFFDF8] px-2 py-0.5 rounded-full shadow">
                      Festive Special
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-serif font-bold text-[#241A17] group-hover:text-[#6E1824] transition-colors mt-0.5 line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-xs text-[#241A17]/70 mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Allergen List */}
                <div className="flex items-center gap-1 mt-2 flex-wrap text-[10px] text-[#241A17]/60">
                  <span className="font-semibold">Contains:</span>
                  {product.allergens.map((alg) => (
                    <span key={alg} className="px-1.5 py-0.2 rounded bg-[#F8F3EA] text-[#241A17]/70 capitalize border border-[#E9DED0]">
                      {alg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3 mt-3 border-t border-[#E9DED0] flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#241A17]/60 block uppercase font-medium">Indicative:</span>
                  <span className="text-xs sm:text-sm font-serif font-bold text-[#6E1824]">
                    ₹{product.indicativePrice} / {product.unit}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#6E1824] group-hover:translate-x-1 transition-transform">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
};
