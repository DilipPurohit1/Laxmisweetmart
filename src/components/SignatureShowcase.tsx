import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Sparkles, Eye, MessageCircle, ArrowRight, ShieldCheck, Heart, Award } from 'lucide-react';

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
    highlight: 'Goan Cashews & Pure Chandi Vark'
  },
  {
    id: 'motichoor-laddoo',
    badge: 'Pure Desi Ghee',
    badgeColor: 'bg-[#B45309] text-white',
    highlight: 'Golden Pearls & Saffron Syrup'
  },
  {
    id: 'kesar-ras-malai',
    badge: 'Fresh Daily Batch',
    badgeColor: 'bg-[#6E1824] text-white',
    highlight: 'Kashmiri Kesar & Chilled Rabdi'
  },
  {
    id: 'khoya-mawa-peda',
    badge: 'Slow Caramelized',
    badgeColor: 'bg-[#92400E] text-white',
    highlight: 'Cow Milk Mawa & Cardamom'
  },
  {
    id: 'goan-farsan-mixture',
    badge: 'Mapusa Heritage',
    badgeColor: 'bg-[#DC2626] text-white',
    highlight: 'Coastal Spices & Fried Cashews'
  },
  {
    id: 'khoya-milk-cake',
    badge: 'Artisanal Recipe',
    badgeColor: 'bg-[#78350F] text-white',
    highlight: 'Two-Tone Caramelized Grainy Mawa'
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
    <section id="favourites" className="pt-10 sm:pt-14 pb-8 sm:pb-12 bg-[#FFFDF8] dark:bg-[#181211] border-b border-[#E9DED0] dark:border-[#382B29] text-left scroll-mt-20 sm:scroll-mt-24 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6E1824]/10 dark:bg-[#C89B3C]/15 border border-[#6E1824]/20 dark:border-[#C89B3C]/30 text-[#6E1824] dark:text-[#F0C05A] text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Handcrafted Heritage Delicacies</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#241A17] dark:text-[#FFFDF8] tracking-tight">
              A Few of Our Favourites
            </h2>
            <p className="text-xs sm:text-sm text-[#241A17]/80 dark:text-[#D1C7BD] mt-1 max-w-2xl leading-relaxed">
              For 40 years in Mapusa, these iconic recipes have sweetened celebrations, weddings, and family gatherings across Goa.
            </p>
          </div>

          {/* Full Catalog Link */}
          <a
            href="#catalog"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F8F3EA] dark:bg-[#261E1D] hover:bg-[#6E1824] dark:hover:bg-[#8B1E2E] text-[#6E1824] dark:text-[#F0C05A] hover:text-white dark:hover:text-white border border-[#E9DED0] dark:border-[#382B29] text-xs font-bold transition-all shadow-2xs hover:shadow-xs group shrink-0"
          >
            <span>Explore Full Counter</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto touch-pan-x pb-2 mb-6 scrollbar-none overscroll-x-contain select-none">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#6E1824] text-white border-[#6E1824] dark:bg-[#C89B3C] dark:text-[#181211] dark:border-[#C89B3C] shadow-sm scale-105'
                    : 'bg-[#F8F3EA] dark:bg-[#241C1B] text-[#241A17]/80 dark:text-[#D1C7BD] border-[#E9DED0] dark:border-[#382B29] hover:bg-[#E9DED0] dark:hover:bg-[#332725]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 6-Card Balanced Gourmet Mithai Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayItems.map(({ product, badge, badgeColor, highlight }) => {
            const imageSrc =
              Array.isArray(product.images) && product.images.length > 0 && product.images[0]
                ? product.images[0]
                : '/products/kajukatli.jpg';

            const whatsappMessage = encodeURIComponent(
              `Hello Shri Laxmi Sweet Mart! I would like to inquire about fresh *${product.name}* (₹${product.indicativePrice}/${product.unit}).`
            );
            const whatsappUrl = `https://wa.me/919423313875?text=${whatsappMessage}`;

            return (
              <div
                key={product.id}
                className="group rounded-2xl sm:rounded-3xl bg-[#F8F3EA] dark:bg-[#201817] border border-[#E9DED0] dark:border-[#382B29] hover:border-[#C89B3C] dark:hover:border-[#F0C05A] transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col justify-between overflow-hidden"
              >
                {/* Photo Header with Badge */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#FFFDF8] dark:bg-[#140F0E] cursor-pointer group/img"
                >
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/products/kajukatli.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover/img:opacity-85 transition-opacity" />

                  {/* Heritage Tag */}
                  <span className={`absolute top-3 left-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ${badgeColor}`}>
                    {badge}
                  </span>

                  {/* Quick View Hover Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/20">
                    <span className="px-3 py-1.5 rounded-xl bg-white text-[#241A17] text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-[#6E1824]" /> View Details
                    </span>
                  </div>

                  {/* Highlight Ribbon at Bottom of Image */}
                  <span className="absolute bottom-2.5 left-3 text-[10px] font-medium text-white/90 drop-shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#F0C05A]" />
                    <span>{highlight}</span>
                  </span>
                </div>

                {/* Sweet Content Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-[#6E1824] dark:text-[#F0C05A]">
                        {product.category.replace('-', ' ')}
                      </span>
                      <span className="text-sm sm:text-base font-serif font-black text-[#6E1824] dark:text-[#F0C05A]">
                        ₹{product.indicativePrice} <span className="text-[10px] font-normal text-[#241A17]/60 dark:text-[#D1C7BD]/70">/{product.unit}</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="text-base sm:text-lg font-serif font-bold text-[#241A17] dark:text-[#FFFDF8] group-hover:text-[#6E1824] dark:group-hover:text-[#F0C05A] transition-colors leading-snug cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#241A17]/75 dark:text-[#D1C7BD] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-[#E9DED0] dark:border-[#382B29] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 py-1.5 sm:py-2 px-3 rounded-xl bg-white dark:bg-[#2B2120] hover:bg-[#6E1824] hover:text-white dark:hover:bg-[#8B1E2E] dark:hover:text-white text-[#241A17] dark:text-[#FFFDF8] border border-[#E9DED0] dark:border-[#382B29] text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Sweet</span>
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#166534] dark:text-[#4ADE80] hover:text-white dark:hover:text-white border border-[#25D366]/30 transition-all shadow-2xs cursor-pointer"
                      title={`Order ${product.name} on WhatsApp`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Quality Assurance Trust Ribbon */}
        <div className="mt-8 py-3 px-4 sm:px-8 rounded-2xl bg-[#F8F3EA] dark:bg-[#201817] border border-[#E9DED0] dark:border-[#382B29] grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-left items-center">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#6E1824] dark:text-[#F0C05A] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#241A17] dark:text-[#FFFDF8]">100% Pure Cow Milk Khoya</div>
              <div className="text-[10px] text-[#241A17]/65 dark:text-[#D1C7BD]/70">Slow-caramelized daily in our Mapusa kitchen</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#6E1824] dark:text-[#F0C05A] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#241A17] dark:text-[#FFFDF8]">Premium Goan Cashews</div>
              <div className="text-[10px] text-[#241A17]/65 dark:text-[#D1C7BD]/70">W180 jumbo grade with edible silver vark</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#6E1824] dark:text-[#F0C05A] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#241A17] dark:text-[#FFFDF8]">Zero Artificial Preservatives</div>
              <div className="text-[10px] text-[#241A17]/65 dark:text-[#D1C7BD]/70">Pure natural taste & authentic halwai tradition</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
