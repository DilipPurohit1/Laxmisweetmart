import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { FestivalTag } from '../types';
import { Sparkles, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { FestiveCanvas, FestivalCanvasType } from './FestiveCanvas';

interface FestivalConfig {
  tag: FestivalTag;
  name: string;
  badge: string;
  themeBg: string;
  ambientGlow: string;
  tagline: string;
  signatureId: string;
  type: FestivalCanvasType;
}

const FESTIVAL_CONFIGS: FestivalConfig[] = [
  {
    tag: 'Diwali',
    name: 'Diwali (Festival of Lights)',
    badge: 'Deepavali Special',
    themeBg: '#3B0D14',
    ambientGlow: 'from-amber-500/25 via-amber-900/20 to-transparent',
    tagline: 'Illuminating celebrations with pure cashew fudge, assorted dry fruit boxes, and royal mithai.',
    signatureId: 'royal-kaju-katli',
    type: 'diwali'
  },
  {
    tag: 'Ganesh Chaturthi',
    name: 'Ganesh Chaturthi',
    badge: 'Bappa Naivedyam',
    themeBg: '#451A03',
    ambientGlow: 'from-orange-500/25 via-amber-900/20 to-transparent',
    tagline: 'Handcrafted ceremonial mawa and ukadiche modaks prepared with fresh nutmeg and saffron.',
    signatureId: 'ukadiche-mawa-modak',
    type: 'ganesh'
  },
  {
    tag: 'Holi',
    name: 'Holi (Festival of Colors)',
    badge: 'Rangotsav Mithai',
    themeBg: '#380E2B',
    ambientGlow: 'from-pink-500/25 via-purple-900/20 to-transparent',
    tagline: 'Traditional crisp mawa gujiyas, karanji, and chilled saffron-infused sweet lassi.',
    signatureId: 'karanji-mawa-gujiya',
    type: 'holi'
  },
  {
    tag: 'Janmashtami',
    name: 'Shri Krishna Janmashtami',
    badge: 'Dahi Handi Special',
    themeBg: '#0F2042',
    ambientGlow: 'from-sky-500/25 via-blue-900/20 to-transparent',
    tagline: 'Special kesar khoya pedas and fresh sweet makhan delicacies prepared for Kanha.',
    signatureId: 'khoya-mawa-peda',
    type: 'janmashtami'
  },
  {
    tag: 'Makar Sankranti',
    name: 'Makar Sankranti & Pongal',
    badge: 'Uttarayan Special',
    themeBg: '#2A1608',
    ambientGlow: 'from-amber-500/25 via-orange-900/20 to-transparent',
    tagline: 'Traditional til-gul laddoos, crisp peanut chikki, and sweet festive celebration treats.',
    signatureId: 'motichoor-laddoo',
    type: 'makar_sankranti'
  },
  {
    tag: 'Maha Shivratri',
    name: 'Maha Shivratri',
    badge: 'Bholenath Bhog',
    themeBg: '#1B0B2E',
    ambientGlow: 'from-indigo-500/25 via-purple-900/20 to-transparent',
    tagline: 'Pure kesar khoya pedas, badam milk, and authentic phalahari offerings for Lord Shiva.',
    signatureId: 'angoori-ras-malai',
    type: 'maha_shivratri'
  },
  {
    tag: 'Gudi Padwa',
    name: 'Gudi Padwa & Ugadi',
    badge: 'Nav Varsh Special',
    themeBg: '#3D1B04',
    ambientGlow: 'from-yellow-500/25 via-amber-900/20 to-transparent',
    tagline: 'Authentic Maharashtrian & Goan New Year puran poli, saffron shrikhand, and mango barfi.',
    signatureId: 'khoya-mawa-peda',
    type: 'gudi_padwa'
  },
  {
    tag: 'Raksha Bandhan',
    name: 'Raksha Bandhan',
    badge: 'Sibling Celebration',
    themeBg: '#3E0E22',
    ambientGlow: 'from-rose-500/25 via-pink-900/20 to-transparent',
    tagline: 'Cherished sweet hampers, kaju pista rolls, and melt-in-mouth milk cake.',
    signatureId: 'kaju-pista-roll',
    type: 'rakhi'
  },
  {
    tag: 'Navratri',
    name: 'Navratri & Dussehra',
    badge: 'Dandiya Raas Special',
    themeBg: '#421208',
    ambientGlow: 'from-amber-500/25 via-rose-900/20 to-transparent',
    tagline: 'Crisp golden kesar jalebi, spiced fafda, and celebratory festive assortments.',
    signatureId: 'crispy-kesar-jalebi',
    type: 'navratri'
  },
  {
    tag: 'Independence Day',
    name: 'Independence & Republic Day',
    badge: 'Desh Ka Meetha',
    themeBg: '#122B1E',
    ambientGlow: 'from-orange-500/20 via-emerald-800/20 to-transparent',
    tagline: 'Traditional tricolor barfi, motichoor laddoos, and celebratory national sweets.',
    signatureId: 'tiranga-mithai-box',
    type: 'independence'
  },
  {
    tag: 'Goan Festivals',
    name: 'Goan Feasts & Sao Joao',
    badge: 'Goan Heritage Special',
    themeBg: '#0A2624',
    ambientGlow: 'from-emerald-500/25 via-teal-900/20 to-transparent',
    tagline: 'Signature Goan savory farsan, cashew special sweets, and authentic local tea-time delicacies.',
    signatureId: 'goan-farsan-mixture',
    type: 'goan_festivals'
  }
];

export const FestiveSpecials: React.FC = () => {
  const { products, setSelectedProduct } = useStore();
  const [activeFestivalIndex, setActiveFestivalIndex] = useState(0);
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  const tabsContainerRef = useRef<HTMLDivElement | null>(null);

  const activeFestival = FESTIVAL_CONFIGS[activeFestivalIndex];

  // Get festival products with the primary signature sweet ordered first
  const signatureItem = products.find((p) => p.id === activeFestival.signatureId);
  const taggedItems = products.filter(
    (p) => p.isVisible && p.festivalTag === activeFestival.tag && p.id !== activeFestival.signatureId
  );
  
  const displayProducts = [
    signatureItem,
    ...taggedItems
  ].filter(Boolean) as typeof products;

  // Fallback if empty
  const finalProducts = displayProducts.length > 0 ? displayProducts : products.filter(p => p.isFestiveSpecial);

  // Auto-scroll products every 4.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProductIndex((prev) => (prev + 1) % Math.max(1, finalProducts.length));
    }, 4500);
    return () => clearInterval(timer);
  }, [finalProducts.length]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleFestivalClick = (idx: number) => {
    setActiveFestivalIndex(idx);
    setActiveProductIndex(0);
  };

  const currentFeatured = finalProducts[activeProductIndex] || finalProducts[0];

  return (
    <section
      id="festive"
      className="relative py-6 sm:py-12 overflow-hidden border-b border-[#E9DED0] dark:border-[#382B29] transition-colors duration-1000 text-left select-none scroll-mt-16 sm:scroll-mt-20"
      style={{
        backgroundColor: activeFestival.themeBg
      }}
    >
      {/* ========================================================================= */}
      {/* AMBIENT RADIAL LIGHTING & 60FPS CANVAS ENGINE */}
      {/* ========================================================================= */}
      <div className={`absolute inset-0 bg-radial ${activeFestival.ambientGlow} pointer-events-none`} />
      <FestiveCanvas festivalType={activeFestival.type} />

      {/* ========================================================================= */}
      {/* SECTION CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12 text-[#FFFDF8]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/15 border border-white/25 text-[#E5B842] text-[9px] sm:text-[10px] font-bold tracking-wider uppercase mb-1 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Festive Traditions of India</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-serif font-black tracking-tight text-white drop-shadow-xs">
              Celebration Specials
            </h2>
            <p className="text-[11px] sm:text-sm text-white/90 mt-0.5 max-w-xl leading-relaxed">
              Ceremonial modaks, gujiyas, kaju katli gift boxes, and chilled lassi handcrafted fresh for sacred festivals.
            </p>
          </div>

          {/* Festival Switcher Tabs with Left & Right Arrow Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 max-w-full md:max-w-xl">
            {/* Left Scroll Button */}
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/15 hover:bg-[#E5B842] text-white hover:text-[#241A17] border border-white/25 flex items-center justify-center transition-all flex-shrink-0 shadow-xs cursor-pointer active:scale-95"
              title="Previous Festivals"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Scrollable Tabs Row */}
            <div
              ref={tabsContainerRef}
              className="flex items-center gap-1.5 overflow-x-auto touch-pan-x py-1 scrollbar-none overscroll-x-contain select-none scroll-smooth flex-1"
            >
              {FESTIVAL_CONFIGS.map((fest, idx) => {
                const isActive = idx === activeFestivalIndex;
                return (
                  <button
                    key={fest.tag}
                    type="button"
                    onClick={() => handleFestivalClick(idx)}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#E5B842] text-[#241A17] border-[#E5B842] shadow-md font-extrabold scale-105 ring-2 ring-[#E5B842]/40'
                        : 'bg-white/15 text-white border-white/20 hover:bg-white/25 hover:text-white'
                    }`}
                  >
                    {fest.tag}
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Button */}
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/15 hover:bg-[#E5B842] text-white hover:text-[#241A17] border border-white/25 flex items-center justify-center transition-all flex-shrink-0 shadow-xs cursor-pointer active:scale-95"
              title="Next Festivals"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Featured Spotlight Card: Responsive Layout Fitting Phone & Desktop */}
        {currentFeatured && (
          <div
            onClick={() => setSelectedProduct(currentFeatured)}
            className="bg-[#1C1412]/85 backdrop-blur-xl border border-white/25 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 cursor-pointer hover:border-[#E5B842] transition-all duration-300 shadow-xl group"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-7 items-center">
              
              {/* Food Photo Frame */}
              <div className="md:col-span-5 h-44 sm:h-56 md:h-64 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 border border-white/25 relative shadow-inner">
                <img
                  key={currentFeatured.id}
                  src={currentFeatured.images[0]}
                  alt={currentFeatured.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#E5B842] text-[#241A17] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-sans shadow-md">
                  {activeFestival.badge}
                </span>
              </div>

              {/* Sweet Details */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-2.5 sm:space-y-3.5">
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs uppercase text-[#E5B842] font-bold tracking-wider">
                      {activeFestival.name}
                    </span>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProductIndex((prev) => (prev - 1 + finalProducts.length) % finalProducts.length);
                        }}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-[#E5B842] hover:text-[#241A17] text-white flex items-center justify-center transition-colors border border-white/25 cursor-pointer shadow-xs"
                        title="Previous Delicacy"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProductIndex((prev) => (prev + 1) % finalProducts.length);
                        }}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-[#E5B842] hover:text-[#241A17] text-white flex items-center justify-center transition-colors border border-white/25 cursor-pointer shadow-xs"
                        title="Next Delicacy"
                      >
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-white group-hover:text-[#E5B842] transition-colors leading-snug">
                    {currentFeatured.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {currentFeatured.description}
                  </p>

                  <div className="text-[10px] sm:text-[11px] text-[#E5B842] font-medium pt-0.5">
                    {activeFestival.tagline}
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="pt-2.5 sm:pt-3.5 border-t border-white/20 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase text-white/70 font-medium block">Festive Indicative Rate:</span>
                    <span className="text-base sm:text-xl font-serif font-bold text-[#E5B842]">
                      ₹{currentFeatured.indicativePrice} <span className="text-[11px] sm:text-xs font-normal text-white/80">/ {currentFeatured.unit}</span>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-[#E5B842] group-hover:translate-x-1 transition-transform bg-white/15 hover:bg-white/25 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/20 shadow-xs">
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>View Delicacy</span>
                  </span>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEDICATED ORNAMENTAL BANNER (PROMINENT ON BOTH MOBILE & DESKTOP) */}
        {/* ========================================================================= */}
        <div className="mt-3 sm:mt-4 py-1.5 sm:py-2 px-3 sm:px-6 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 flex items-center justify-around overflow-hidden shadow-inner">
          
          {/* 1. DIWALI: Flickering Clay Diyas */}
          {activeFestival.type === 'diwali' && (
            <>
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex flex-col items-center select-none">
                  <svg viewBox="0 0 16 22" className="w-3.5 h-5 sm:w-4 sm:h-6 anim-diya-flame" style={{ animationDelay: `${i * 0.25}s` }}>
                    <path d="M8 0 C10 7 14 12 14 16 C14 20 11 22 8 22 C5 22 2 20 2 16 C2 12 6 7 8 0 Z" fill="url(#diyaGradBar)" />
                    <defs>
                      <linearGradient id="diyaGradBar" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FEF08A" />
                        <stop offset="50%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#DC2626" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <svg viewBox="0 0 32 14" className="w-6 h-3 sm:w-8 sm:h-3.5 -mt-0.5">
                    <ellipse cx="16" cy="4" rx="15" ry="3.5" fill="#B45309" stroke="#F59E0B" strokeWidth="0.8" />
                    <path d="M2 4 Q16 16 30 4 Z" fill="#78350F" stroke="#F59E0B" strokeWidth="0.6" />
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* 2. GANESH CHATURTHI: Golden Modaks */}
          {activeFestival.type === 'ganesh' && (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center anim-modak-pulse select-none" style={{ animationDelay: `${i * 0.3}s` }}>
                  <svg viewBox="0 0 30 36" className="w-5 h-6 sm:w-7 sm:h-8 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                    <ellipse cx="15" cy="32" rx="13" ry="2.5" fill="#D97706" />
                    <path d="M15 2 C8 12 4 24 5 30 C7 32 23 32 25 30 C26 24 22 12 15 2 Z" fill="url(#modakGradBar)" stroke="#FDE68A" strokeWidth="1" />
                    <defs>
                      <linearGradient id="modakGradBar" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FEF08A" />
                        <stop offset="40%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#B45309" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* 3. HOLI: Splatters */}
          {activeFestival.type === 'holi' && (
            <>
              {[
                { col: '#EC4899', name: 'Gulal Pink' },
                { col: '#06B6D4', name: 'Abir Cyan' },
                { col: '#EAB308', name: 'Haldi Gold' },
                { col: '#A855F7', name: 'Kesar Violet' },
                { col: '#10B981', name: 'Mehendi Green' },
                { col: '#F97316', name: 'Saffron Glow' }
              ].map((splash, i) => (
                <div key={i} className="anim-holi-pop" style={{ animationDelay: `${i * 0.2}s` }}>
                  <svg viewBox="0 0 100 100" className="w-6 h-6 sm:w-8 sm:h-8" style={{ filter: `drop-shadow(0 0 8px ${splash.col})` }}>
                    <path
                      d="M50 15 Q65 5 75 25 Q95 35 85 55 Q95 80 70 85 Q50 95 30 85 Q5 80 15 55 Q5 35 25 25 Q35 5 50 15 Z"
                      fill={splash.col}
                      opacity="0.9"
                    />
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* 4. JANMASHTAMI: Dahi Handi */}
          {activeFestival.type === 'janmashtami' && (
            <>
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex flex-col items-center anim-handi-sway" style={{ animationDelay: `${idx * 0.4}s` }}>
                  <div className="w-0.5 h-3 sm:h-4 bg-gradient-to-b from-amber-300 to-amber-500" />
                  <svg viewBox="0 0 40 46" className="w-6 h-7 sm:w-8 sm:h-9 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                    <path d="M6 14 Q20 8 34 14 Q38 34 20 44 Q2 34 6 14 Z" fill="#D97706" stroke="#FEF08A" strokeWidth="1" />
                    <ellipse cx="20" cy="14" rx="14" ry="4" fill="#FFFFFF" />
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* 5. MAKAR SANKRANTI: Kites */}
          {activeFestival.type === 'makar_sankranti' && (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="anim-kite-flutter select-none" style={{ animationDelay: `${i * 0.25}s` }}>
                  <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                    <polygon points="20,2 38,20 20,38 2,20" fill={i % 2 === 0 ? '#F59E0B' : '#EF4444'} stroke="#FFFDF8" strokeWidth="1" />
                    <line x1="20" y1="2" x2="20" y2="38" stroke="#FFFDF8" strokeWidth="0.8" />
                    <line x1="2" y1="20" x2="38" y2="20" stroke="#FFFDF8" strokeWidth="0.8" />
                    <polygon points="20,38 24,44 16,44" fill="#10B981" />
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* 6. MAHA SHIVRATRI: Authentic Lord Shiva Golden Trishul & Damru */}
          {activeFestival.type === 'maha_shivratri' && (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center anim-modak-pulse select-none" style={{ animationDelay: `${i * 0.25}s` }}>
                  <svg viewBox="0 0 40 48" className="w-6 h-7 sm:w-8 sm:h-9 drop-shadow-[0_0_12px_rgba(253,224,71,0.95)]">
                    {/* Golden Trishul Base & Staff */}
                    <line x1="20" y1="14" x2="20" y2="46" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                    
                    {/* Central Sharp Spear Point */}
                    <path
                      d="M20 2 L22.5 14 L20 16 L17.5 14 Z"
                      fill="url(#trishulGradBar)"
                      stroke="#FFFDF8"
                      strokeWidth="0.8"
                    />

                    {/* Symmetrical Left & Right Curved Trishul Blades */}
                    <path
                      d="M20 16 C14 16 9 12 9 6 C11 8 14 11 17 11 C17 14 18.5 15.5 20 16 Z"
                      fill="url(#trishulGradBar)"
                      stroke="#FFFDF8"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M20 16 C26 16 31 12 31 6 C29 8 26 11 23 11 C23 14 21.5 15.5 20 16 Z"
                      fill="url(#trishulGradBar)"
                      stroke="#FFFDF8"
                      strokeWidth="0.8"
                    />

                    {/* Cross Guard Bar */}
                    <rect x="13" y="15" width="14" height="2.5" rx="1" fill="#FBBF24" stroke="#D97706" strokeWidth="0.5" />

                    {/* Damru (Shiva's Hourglass Drum) */}
                    <path
                      d="M15 23 L25 23 L16 30 L24 30 Z"
                      fill="#B45309"
                      stroke="#FEF08A"
                      strokeWidth="0.8"
                    />
                    <circle cx="20" cy="26.5" r="1.5" fill="#FEF08A" />
                    {/* Hanging String & Red Beads */}
                    <path d="M20 26.5 Q12 28 11 32" stroke="#FEF08A" strokeWidth="0.7" fill="none" />
                    <circle cx="11" cy="32" r="1.2" fill="#DC2626" />
                    <path d="M20 26.5 Q28 28 29 32" stroke="#FEF08A" strokeWidth="0.7" fill="none" />
                    <circle cx="29" cy="32" r="1.2" fill="#DC2626" />

                    {/* Sacred Tripundra Vibhuti Lines */}
                    <line x1="17" y1="18.5" x2="23" y2="18.5" stroke="#FFFFFF" strokeWidth="0.8" />
                    <line x1="17.5" y1="19.7" x2="22.5" y2="19.7" stroke="#FFFFFF" strokeWidth="0.8" />
                    <circle cx="20" cy="19.1" r="0.6" fill="#DC2626" />

                    <defs>
                      <linearGradient id="trishulGradBar" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFDF8" />
                        <stop offset="35%" stopColor="#FEF08A" />
                        <stop offset="70%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#D97706" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* 7. GUDI PADWA: Gudi & Mango Blossom */}
          {activeFestival.type === 'gudi_padwa' && (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="anim-modak-pulse select-none" style={{ animationDelay: `${i * 0.25}s` }}>
                  <svg viewBox="0 0 30 36" className="w-5 h-6 sm:w-7 sm:h-8 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                    <line x1="15" y1="36" x2="15" y2="6" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="15" cy="6" r="5" fill="#FBBF24" stroke="#FFFDF8" strokeWidth="0.8" />
                    <path d="M7 12 Q15 8 23 12 L21 24 Q15 28 9 24 Z" fill="#EF4444" stroke="#FDE047" strokeWidth="0.8" />
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* 8. RAKSHA BANDHAN: Floral Rakhis */}
          {activeFestival.type === 'rakhi' && (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="anim-rakhi-float select-none" style={{ animationDelay: `${i * 0.3}s` }}>
                  <svg viewBox="0 0 46 30" className="w-7 h-5 sm:w-9 sm:h-7 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
                    <path d="M4 15 Q14 11 20 15" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    <path d="M26 15 Q32 19 42 15" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    <circle cx="23" cy="15" r="6" fill="#FBBF24" stroke="#FEF08A" strokeWidth="1" />
                    <circle cx="23" cy="15" r="2.8" fill="#BE123C" stroke="#FFFFFF" strokeWidth="0.5" />
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* 9. NAVRATRI: Dandiya */}
          {activeFestival.type === 'navratri' && (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="anim-dandiya-clack select-none" style={{ animationDelay: `${i * 0.3}s` }}>
                  <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                    <line x1="6" y1="34" x2="34" y2="6" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                    <line x1="34" y1="34" x2="6" y2="6" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="20" cy="20" r="3" fill="#FBBF24" stroke="#FFFDF8" strokeWidth="1" />
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* 10. INDEPENDENCE DAY: Tiranga Flag with 24-Spoke Ashoka Chakra */}
          {activeFestival.type === 'independence' && (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="anim-kite-flutter select-none" style={{ animationDelay: `${i * 0.3}s` }}>
                  <svg viewBox="0 0 50 32" className="w-8 h-5 sm:w-11 sm:h-7 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {/* Top Saffron Band */}
                    <rect x="2" y="2" width="46" height="9" fill="#FF9933" rx="1.5" />
                    {/* Middle White Band */}
                    <rect x="2" y="11" width="46" height="10" fill="#FFFFFF" />
                    {/* Bottom India Green Band */}
                    <rect x="2" y="21" width="46" height="9" fill="#138808" rx="1.5" />
                    
                    {/* Navy Blue Ashoka Chakra Circle in Center */}
                    <circle cx="25" cy="16" r="4.2" stroke="#000080" strokeWidth="0.7" fill="none" />
                    <circle cx="25" cy="16" r="0.8" fill="#000080" />
                    
                    {/* Ashoka Chakra 24 Spokes */}
                    <g stroke="#000080" strokeWidth="0.4">
                      {[...Array(12)].map((_, s) => {
                        const angle = (s * 30 * Math.PI) / 180;
                        const x1 = 25 - Math.cos(angle) * 3.8;
                        const y1 = 16 - Math.sin(angle) * 3.8;
                        const x2 = 25 + Math.cos(angle) * 3.8;
                        const y2 = 16 + Math.sin(angle) * 3.8;
                        return <line key={s} x1={x1} y1={y1} x2={x2} y2={y2} />;
                      })}
                    </g>
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* 11. GOAN FESTIVALS: Floral Coronets / Kopel */}
          {activeFestival.type === 'goan_festivals' && (
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="anim-modak-pulse select-none" style={{ animationDelay: `${i * 0.25}s` }}>
                  <svg viewBox="0 0 36 36" className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="3,3" />
                    <circle cx="18" cy="6" r="3" fill="#F59E0B" />
                    <circle cx="29" cy="18" r="3" fill="#EC4899" />
                    <circle cx="18" cy="30" r="3" fill="#FBBF24" />
                    <circle cx="7" cy="18" r="3" fill="#06B6D4" />
                  </svg>
                </div>
              ))}
            </>
          )}

        </div>

      </div>
    </section>
  );
};
