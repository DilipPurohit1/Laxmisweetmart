import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Sparkles, Eye, ArrowRight } from 'lucide-react';

interface FavoriteItemConfig {
  id: string;
  badge: string;
  badgeColor: string;
  highlight: string;
}

const FAVORITES_CONFIG: FavoriteItemConfig[] = [
  {
    id: 'royal-kaju-katli',
    badge: '1985 Signature',
    badgeColor: 'bg-[#C89B3C] text-[#241A17]',
    highlight: 'Goan Cashews & Chandi Vark'
  },
  {
    id: 'motichoor-laddoo',
    badge: 'Pure Desi Ghee',
    badgeColor: 'bg-[#B45309] text-white',
    highlight: 'Golden Pearls & Saffron Syrup'
  },
  {
    id: 'kesar-ras-malai',
    badge: 'Fresh Daily',
    badgeColor: 'bg-[#6E1824] text-white',
    highlight: 'Kashmiri Kesar & Chilled Rabdi'
  },
  {
    id: 'khoya-mawa-peda',
    badge: 'Slow Cooked',
    badgeColor: 'bg-[#92400E] text-white',
    highlight: 'Cow Milk Mawa & Cardamom'
  },
  {
    id: 'goan-farsan-mixture',
    badge: 'Mapusa Classic',
    badgeColor: 'bg-[#DC2626] text-white',
    highlight: 'Coastal Spices & Fried Cashews'
  },
  {
    id: 'khoya-milk-cake',
    badge: 'Artisanal Recipe',
    badgeColor: 'bg-[#78350F] text-white',
    highlight: 'Two-Tone Grainy Mawa Fudge'
  }
];

export const SignatureShowcase: React.FC = () => {
  const { products, setSelectedProduct } = useStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const safeProducts = products || [];

  // Map configured favorites to live product data
  const curatedFavorites = FAVORITES_CONFIG.map(cfg => {
    const prod = safeProducts.find(p => p.id === cfg.id);
    if (!prod) return null;
    return {
      product: prod,
      ...cfg
    };
  }).filter((item): item is { product: Product; id: string; badge: string; badgeColor: string; highlight: string } => Boolean(item));

  // Filter items if pill selected
  const displayItems = activeFilter === 'all'
    ? curatedFavorites
    : curatedFavorites.filter(item => item.product.category === activeFilter);

  const filterTabs = [
    { id: 'all', label: 'All Favourites' },
    { id: 'kaju-katli', label: 'Kaju Katli' },
    { id: 'laddoo', label: 'Laddoo' },
    { id: 'ras-malai', label: 'Ras Malai' },
    { id: 'khoya-sweets', label: 'Khoya Sweets' },
    { id: 'namkeen', label: 'Mapusa Farsan' }
  ];

  return (
    <section id="favourites" className="pt-6 sm:pt-9 pb-6 sm:pb-8 bg-[#FFFDF8] dark:bg-[#181211] border-b border-[#E9DED0] dark:border-[#382B29] text-left scroll-mt-20 sm:scroll-mt-24 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6E1824]/10 dark:bg-[#C89B3C]/15 border border-[#6E1824]/20 dark:border-[#C89B3C]/30 text-[#6E1824] dark:text-[#F0C05A] text-[9px] sm:text-[10px] font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3 text-[#C89B3C]" />
              <span>Handcrafted Heritage Delicacies</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-[#241A17] dark:text-[#FFFDF8] tracking-tight">
              A Few of Our Favourites
            </h2>
            <p className="text-xs text-[#241A17]/80 dark:text-[#D1C7BD] mt-0.5 max-w-2xl leading-relaxed">
              Four decades of cherished recipes prepared fresh daily in Mapusa.
            </p>
          </div>

          {/* Full Catalog Link */}
          <a
            href="#catalog"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F8F3EA] dark:bg-[#261E1D] hover:bg-[#6E1824] dark:hover:bg-[#8B1E2E] text-[#6E1824] dark:text-[#F0C05A] hover:text-white dark:hover:text-white border border-[#E9DED0] dark:border-[#382B29] text-xs font-bold transition-all shadow-2xs group shrink-0"
          >
            <span>Full Counter</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto touch-pan-x pb-1.5 mb-4 scrollbar-none overscroll-x-contain select-none">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#6E1824] text-white border-[#6E1824] dark:bg-[#C89B3C] dark:text-[#181211] dark:border-[#C89B3C] shadow-xs scale-102'
                    : 'bg-[#F8F3EA] dark:bg-[#241C1B] text-[#241A17]/80 dark:text-[#D1C7BD] border-[#E9DED0] dark:border-[#382B29] hover:bg-[#E9DED0] dark:hover:bg-[#332725]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Compact, Balanced Gourmet Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {displayItems.map(({ product, badge, badgeColor, highlight }) => {
            const imageSrc =
              Array.isArray(product.images) && product.images.length > 0 && product.images[0]
                ? product.images[0]
                : '/products/kajukatli.jpg';

            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-[#F8F3EA] dark:bg-[#201817] border border-[#E9DED0] dark:border-[#382B29] hover:border-[#C89B3C] dark:hover:border-[#F0C05A] transition-all duration-300 shadow-2xs hover:shadow-sm flex flex-col justify-between overflow-hidden"
              >
                {/* Photo Frame */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="relative h-36 sm:h-44 w-full overflow-hidden bg-[#FFFDF8] dark:bg-[#140F0E] cursor-pointer group/img"
                >
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/products/kajukatli.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover/img:opacity-85 transition-opacity" />

                  {/* Badge */}
                  <span className={`absolute top-2.5 left-2.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs ${badgeColor}`}>
                    {badge}
                  </span>

                  {/* Highlight Ribbon */}
                  <span className="absolute bottom-2 left-2.5 text-[9px] sm:text-[10px] font-medium text-white/95 drop-shadow-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#F0C05A]" />
                    <span>{highlight}</span>
                  </span>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-[#6E1824] dark:text-[#F0C05A]">
                        {product.category.replace('-', ' ')}
                      </span>
                      <span className="text-xs sm:text-sm font-serif font-black text-[#6E1824] dark:text-[#F0C05A]">
                        ₹{product.indicativePrice} <span className="text-[9px] sm:text-[10px] font-normal text-[#241A17]/60 dark:text-[#D1C7BD]/70">/{product.unit}</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="text-sm sm:text-base font-serif font-bold text-[#241A17] dark:text-[#FFFDF8] group-hover:text-[#6E1824] dark:group-hover:text-[#F0C05A] transition-colors leading-snug cursor-pointer truncate"
                    >
                      {product.name}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-[#241A17]/75 dark:text-[#D1C7BD] line-clamp-1 leading-normal">
                      {product.description}
                    </p>
                  </div>

                  {/* Action Button: Explore */}
                  <div className="pt-2 border-t border-[#E9DED0] dark:border-[#382B29]">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="w-full py-1.5 sm:py-2 px-3 rounded-xl bg-white dark:bg-[#2B2120] hover:bg-[#6E1824] hover:text-white dark:hover:bg-[#8B1E2E] dark:hover:text-white text-[#6E1824] dark:text-[#F0C05A] border border-[#E9DED0] dark:border-[#382B29] text-[11px] sm:text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 group-hover:bg-[#6E1824] group-hover:text-white dark:group-hover:bg-[#8B1E2E]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform ml-0.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
