import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { FestivalTag } from '../types';
import { Sparkles, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { FestiveCanvas } from './FestiveCanvas';

interface FestivalConfig {
  tag: FestivalTag;
  name: string;
  badge: string;
  themeBg: string;
  ambientGlow: string;
  tagline: string;
  signatureId: string;
  type: 'diwali' | 'ganesh' | 'holi' | 'janmashtami' | 'independence' | 'navratri' | 'rakhi';
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
    tagline: 'Special kesar khoya pedas and fresh sweet makhan delicacies.',
    signatureId: 'khoya-mawa-peda',
    type: 'janmashtami'
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
    tag: 'Navratri',
    name: 'Navratri & Dussehra',
    badge: 'Dandiya Raas Special',
    themeBg: '#421208',
    ambientGlow: 'from-amber-500/25 via-rose-900/20 to-transparent',
    tagline: 'Crisp golden kesar jalebi and celebratory festive assortments.',
    signatureId: 'crispy-kesar-jalebi',
    type: 'navratri'
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
  }
];

export const FestiveSpecials: React.FC = () => {
  const { products, setSelectedProduct } = useStore();
  const [activeFestivalIndex, setActiveFestivalIndex] = useState(0);
  const [activeProductIndex, setActiveProductIndex] = useState(0);

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

  // Auto-scroll items every 4.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProductIndex((prev) => (prev + 1) % Math.max(1, finalProducts.length));
    }, 4500);
    return () => clearInterval(timer);
  }, [finalProducts.length]);

  const currentFeatured = finalProducts[activeProductIndex] || finalProducts[0];

  return (
    <section
      id="festive"
      className="relative py-10 sm:py-14 overflow-hidden border-b border-[#E9DED0] transition-colors duration-1000 text-left select-none"
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
      {/* COMPACT & ELEGANT SVG ELEMENTS (PERFECTLY PROPORTIONED, NO CLIPPING) */}
      {/* ========================================================================= */}

      {/* 1. DIWALI: Miniature Flickering Clay Diyas */}
      {activeFestival.type === 'diwali' && (
        <div className="absolute bottom-2.5 inset-x-0 flex justify-around px-6 opacity-85 pointer-events-none z-1">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <svg viewBox="0 0 16 22" className="w-3.5 h-5 anim-diya-flame" style={{ animationDelay: `${i * 0.35}s` }}>
                <path d="M8 0 C10 7 14 12 14 16 C14 20 11 22 8 22 C5 22 2 20 2 16 C2 12 6 7 8 0 Z" fill="url(#diyaGradMini)" />
                <defs>
                  <linearGradient id="diyaGradMini" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="50%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                </defs>
              </svg>
              <svg viewBox="0 0 32 14" className="w-7 h-3 -mt-0.5">
                <ellipse cx="16" cy="4" rx="15" ry="3.5" fill="#B45309" stroke="#F59E0B" strokeWidth="0.8" />
                <path d="M2 4 Q16 16 30 4 Z" fill="#78350F" stroke="#F59E0B" strokeWidth="0.6" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 2. GANESH CHATURTHI: Compact Golden Modaks with Lotus Pedestals */}
      {activeFestival.type === 'ganesh' && (
        <div className="absolute bottom-2.5 inset-x-0 flex justify-around px-6 opacity-85 pointer-events-none z-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center anim-modak-pulse" style={{ animationDelay: `${i * 0.35}s` }}>
              <svg viewBox="0 0 30 36" className="w-6 h-8 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                <ellipse cx="15" cy="32" rx="13" ry="2.5" fill="#D97706" />
                <path d="M15 2 C8 12 4 24 5 30 C7 32 23 32 25 30 C26 24 22 12 15 2 Z" fill="url(#modakGradMini)" stroke="#FDE68A" strokeWidth="1" />
                <defs>
                  <linearGradient id="modakGradMini" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="40%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 3. HOLI: Compact Popping Gulal Splatters */}
      {activeFestival.type === 'holi' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
          {[
            { col: '#EC4899', x: '6%', y: '16%', size: 'w-20 h-20', delay: '0s' },
            { col: '#06B6D4', x: '88%', y: '20%', size: 'w-22 h-22', delay: '1s' },
            { col: '#EAB308', x: '16%', y: '68%', size: 'w-20 h-20', delay: '1.8s' },
            { col: '#A855F7', x: '82%', y: '65%', size: 'w-22 h-22', delay: '0.6s' }
          ].map((splash, i) => (
            <div
              key={i}
              className={`absolute ${splash.size} anim-holi-pop`}
              style={{
                left: splash.x,
                top: splash.y,
                animationDelay: splash.delay
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: `drop-shadow(0 0 12px ${splash.col})` }}>
                <path
                  d="M50 15 Q65 5 75 25 Q95 35 85 55 Q95 80 70 85 Q50 95 30 85 Q5 80 15 55 Q5 35 25 25 Q35 5 50 15 Z"
                  fill={splash.col}
                  opacity="0.8"
                />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 4. JANMASHTAMI: Compact Hanging Dahi Handi */}
      {activeFestival.type === 'janmashtami' && (
        <div className="absolute top-2 inset-x-0 flex justify-around px-8 pointer-events-none z-1">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="flex flex-col items-center anim-handi-sway" style={{ animationDelay: `${idx * 0.6}s` }}>
              <div className="w-0.5 h-8 bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-500" />
              <svg viewBox="0 0 40 36" className="w-9 h-8 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]">
                <path d="M10 10 Q4 20 12 32 Q20 36 28 32 Q36 20 30 10 Z" fill="#9A3412" stroke="#FDE68A" strokeWidth="1" />
                <ellipse cx="20" cy="10" rx="11" ry="3" fill="#C2410C" stroke="#FEF08A" strokeWidth="1" />
                <ellipse cx="20" cy="9" rx="8.5" ry="2.5" fill="#FFFDF8" />
              </svg>
              <div className="w-1.5 h-1.5 rounded-full bg-white anim-butter-drip -mt-0.5 shadow-[0_0_6px_white]" />
            </div>
          ))}
        </div>
      )}

      {/* 5. INDEPENDENCE DAY: Self-Contained Miniature Brass Stand Tiranga Table Flags */}
      {activeFestival.type === 'independence' && (
        <div className="absolute bottom-2.5 inset-x-0 flex justify-around px-6 opacity-95 pointer-events-none z-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-center" style={{ animationDelay: `${i * 0.35}s` }}>
              <svg viewBox="0 0 44 48" className="w-9 h-11 drop-shadow-md">
                <ellipse cx="14" cy="45" rx="9" ry="2.5" fill="#B45309" stroke="#FDE68A" strokeWidth="0.8" />
                <ellipse cx="14" cy="43.5" rx="6.5" ry="1.8" fill="#D97706" />
                <ellipse cx="14" cy="42" rx="4" ry="1.2" fill="#FBBF24" />
                <line x1="14" y1="4" x2="14" y2="42" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="14" cy="3.5" r="1.8" fill="#FEF08A" stroke="#D97706" strokeWidth="0.5" />
                
                <g className="anim-flag-wave">
                  <path d="M14 4 Q23 6 32 4 L32 10 Q23 12 14 10 Z" fill="#FF9933" />
                  <path d="M14 10 Q23 12 32 10 L32 16 Q23 18 14 16 Z" fill="#FFFFFF" />
                  <path d="M14 16 Q23 18 32 16 L32 22 Q23 24 14 22 Z" fill="#138808" />
                  <circle cx="23" cy="13" r="2.2" stroke="#000088" strokeWidth="0.6" fill="none" />
                  <circle cx="23" cy="13" r="0.6" fill="#000088" />
                  <line x1="23" y1="11" x2="23" y2="15" stroke="#000088" strokeWidth="0.3" />
                  <line x1="21" y1="13" x2="25" y2="13" stroke="#000088" strokeWidth="0.3" />
                </g>
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 6. NAVRATRI: Compact Crossed Dandiya Sticks */}
      {activeFestival.type === 'navratri' && (
        <div className="absolute bottom-2.5 inset-x-0 flex justify-around px-6 opacity-85 pointer-events-none z-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="anim-dandiya-clack" style={{ animationDelay: `${i * 0.35}s` }}>
              <svg viewBox="0 0 40 40" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                <line x1="6" y1="34" x2="34" y2="6" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="34" y1="34" x2="6" y2="6" stroke="#06B6D4" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3.5" fill="#FBBF24" stroke="#FFFDF8" strokeWidth="1" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 7. RAKSHA BANDHAN: Compact Golden Floral Rakhis */}
      {activeFestival.type === 'rakhi' && (
        <div className="absolute bottom-2.5 inset-x-0 flex justify-around px-6 opacity-85 pointer-events-none z-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="anim-rakhi-float" style={{ animationDelay: `${i * 0.35}s` }}>
              <svg viewBox="0 0 46 30" className="w-10 h-7 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]">
                <path d="M4 15 Q14 11 20 15" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M26 15 Q32 19 42 15" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="23" cy="15" r="7" fill="#FBBF24" stroke="#FEF08A" strokeWidth="1" />
                <circle cx="23" cy="15" r="3.2" fill="#BE123C" stroke="#FFFFFF" strokeWidth="0.6" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION CONTENT: COMPACT, PROPORTIONED, HIGH IMPACT */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 text-[#FFFDF8]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[#E5B842] text-[10px] font-bold tracking-wider uppercase mb-1.5 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Festive Traditions of India</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white drop-shadow-sm">
              Celebration Specials
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-0.5 max-w-xl leading-relaxed">
              Ceremonial modaks, gujiyas, kaju katli gift boxes, and chilled lassi handcrafted fresh for sacred festivals.
            </p>
          </div>

          {/* Festival Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {FESTIVAL_CONFIGS.map((fest, idx) => (
              <button
                key={fest.tag}
                onClick={() => {
                  setActiveFestivalIndex(idx);
                  setActiveProductIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  idx === activeFestivalIndex
                    ? 'bg-[#E5B842] text-[#241A17] border-[#E5B842] shadow-xl scale-105'
                    : 'bg-white/15 text-white border-white/20 hover:bg-white/25 hover:text-white'
                }`}
              >
                {fest.tag}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Spotlight Card: Clean, Proportioned, Uncropped */}
        {currentFeatured && (
          <div
            onClick={() => setSelectedProduct(currentFeatured)}
            className="bg-[#1C1412]/80 backdrop-blur-xl border border-white/25 rounded-3xl p-5 sm:p-7 cursor-pointer hover:border-[#E5B842] transition-all duration-300 shadow-2xl group"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              
              {/* Food Photo Frame */}
              <div className="md:col-span-5 aspect-[4/3] sm:aspect-[16/10] md:h-64 w-full rounded-2xl overflow-hidden bg-black/40 border border-white/25 relative shadow-inner">
                <img
                  key={currentFeatured.id}
                  src={currentFeatured.images[0]}
                  alt={currentFeatured.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-[#E5B842] text-[#241A17] px-3 py-1 rounded-full font-sans shadow-md">
                  {activeFestival.badge}
                </span>
              </div>

              {/* Sweet Details */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-3.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase text-[#E5B842] font-bold tracking-wider">
                      {activeFestival.name}
                    </span>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProductIndex((prev) => (prev - 1 + finalProducts.length) % finalProducts.length);
                        }}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-[#E5B842] hover:text-[#241A17] text-white flex items-center justify-center transition-colors border border-white/25 cursor-pointer shadow-sm"
                        title="Previous Delicacy"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveProductIndex((prev) => (prev + 1) % finalProducts.length);
                        }}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-[#E5B842] hover:text-[#241A17] text-white flex items-center justify-center transition-colors border border-white/25 cursor-pointer shadow-sm"
                        title="Next Delicacy"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-[#E5B842] transition-colors">
                    {currentFeatured.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    {currentFeatured.description}
                  </p>

                  <div className="text-[11px] text-[#E5B842] font-medium pt-0.5">
                    {activeFestival.tagline}
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="pt-3.5 border-t border-white/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-white/70 font-medium block">Festive Indicative Rate:</span>
                    <span className="text-lg sm:text-xl font-serif font-bold text-[#E5B842]">
                      ₹{currentFeatured.indicativePrice} <span className="text-xs font-normal text-white/80">/ {currentFeatured.unit}</span>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#E5B842] group-hover:translate-x-1 transition-transform bg-white/15 hover:bg-white/25 px-4 py-2 rounded-xl border border-white/20 shadow-sm">
                    <Eye className="w-4 h-4" />
                    <span>View Delicacy</span>
                  </span>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
