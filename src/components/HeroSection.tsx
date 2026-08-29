import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const HERO_SLIDES = [
  {
    title: 'Signature Kaju Katli',
    subtitle: 'Silky diamond-cut cashew fudge made with premium Goan cashews & edible silver leaf.',
    image: '/products/kajukatli.jpg',
    category: 'Kaju Katli'
  },
  {
    title: 'Special Kesar Khoya Peda',
    subtitle: 'Slow-caramelized milk mawa pedas steeped in authentic saffron & green cardamom.',
    image: '/products/peda.jpg',
    category: 'Khoya Sweets'
  },
  {
    title: 'Motichoor Laddoo',
    subtitle: 'Golden gram flour pearls steeped in saffron cardamom syrup with pistachios.',
    image: '/products/motichoor.jpg',
    category: 'Laddoo'
  },
  {
    title: 'Special Sweet Malai Lassi',
    subtitle: 'Chilled thick sweet curd lassi served fresh daily, topped with rich malai and cardamom.',
    image: '/products/lassi.jpg',
    category: 'Fresh Lassi'
  },
  {
    title: 'Kesar Pista Ras Malai',
    subtitle: 'Fresh morning batch chenna patties immersed in chilled saffron pistachio milk.',
    image: '/products/rasmalai.jpg',
    category: 'Ras Malai'
  }
];

export const HeroSection: React.FC = () => {
  const { setSelectedProduct, products } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-scroll hero slide every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleSlideClick = () => {
    const matched = products.find(p => p.name.toLowerCase().includes(slide.title.toLowerCase().slice(0, 8)));
    if (matched) setSelectedProduct(matched);
  };

  return (
    <section id="hero" className="bg-[#FFFDF8] border-b border-[#E9DED0] pt-6 sm:pt-10 pb-10 sm:pb-14 text-left scroll-mt-16 sm:scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Brand & Story */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            
            {/* Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F3EA] border border-[#E9DED0] text-[#6E1824] text-xs font-bold tracking-wider uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Since 1985 · Mapusa, Goa</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#241A17] tracking-tight leading-[1.15]">
              Traditional Mithai, <br className="hidden sm:inline" />
              <span className="text-[#6E1824] italic font-normal">Made for Every Occasion.</span>
            </h1>

            {/* Clean Value Proposition Narrative (No address clutter) */}
            <p className="text-xs sm:text-sm text-[#241A17]/80 leading-relaxed max-w-xl font-normal">
              For four decades, our halwais have crafted authentic Indian sweets, slow-cooked khoya mawa, and signature Mapusa farsan. Prepared fresh every morning with pure whole milk and premium coastal ingredients.
            </p>

            {/* Quick Feature Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-1 border-t border-[#E9DED0] text-[11px] text-[#241A17]/75">
              <div className="space-y-0.5">
                <strong className="block text-xs font-bold text-[#6E1824] font-serif">100% Pure</strong>
                <span>Whole Milk & Fresh Ingredients</span>
              </div>
              <div className="space-y-0.5">
                <strong className="block text-xs font-bold text-[#6E1824] font-serif">Daily Batches</strong>
                <span>Fresh Ras Malai, Lassi & Paneer</span>
              </div>
              <div className="space-y-0.5">
                <strong className="block text-xs font-bold text-[#6E1824] font-serif">40 Years</strong>
                <span>Trusted Halwai Craft</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="#catalog"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] text-xs shadow-sm transition-all duration-300 uppercase tracking-wider"
              >
                <span>Explore Counter Sweets</span>
                <ArrowRight className="w-4 h-4 text-[#C89B3C]" />
              </a>
            </div>

          </div>

          {/* Right Column: Auto-Scrolling Sweet Photograph Showcase */}
          <div className="lg:col-span-6 relative">
            <div
              onClick={handleSlideClick}
              className="group cursor-pointer rounded-3xl bg-[#F8F3EA] border border-[#E9DED0] hover:border-[#C89B3C] p-4 sm:p-5 transition-all duration-500 shadow-sm hover:shadow-md relative overflow-hidden"
            >
              {/* Product Visual Container with Aspect Ratio */}
              <div className="aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl overflow-hidden bg-[#FFFDF8] border border-[#E9DED0] relative shadow-inner">
                <img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out animate-in fade-in"
                  loading="eager"
                />

                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-[#6E1824] text-[#FFFDF8] px-2.5 py-1 rounded-full shadow">
                  {slide.category}
                </span>
              </div>

              {/* Slide Meta Card */}
              <div className="mt-3.5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#241A17] group-hover:text-[#6E1824] transition-colors">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-[#241A17]/70 line-clamp-1">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Next / Prev Controls */}
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
                    }}
                    className="w-7 h-7 rounded-full bg-[#FFFDF8] border border-[#E9DED0] hover:bg-[#6E1824] hover:text-white flex items-center justify-center transition-colors text-xs"
                    title="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
                    }}
                    className="w-7 h-7 rounded-full bg-[#FFFDF8] border border-[#E9DED0] hover:bg-[#6E1824] hover:text-white flex items-center justify-center transition-colors text-xs"
                    title="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-[#E9DED0]">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? 'w-6 bg-[#6E1824]' : 'w-1.5 bg-[#E9DED0] hover:bg-[#C89B3C]'
                    }`}
                    title={`Slide ${i + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
