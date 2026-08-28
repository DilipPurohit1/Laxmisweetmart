import React from 'react';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const HeritageStory: React.FC = () => {
  return (
    <section id="heritage" className="py-12 sm:py-18 bg-[#FFFDF8] dark:bg-[#1C1615] border-b border-[#E9DED0] dark:border-[#382B29] text-left relative overflow-hidden transition-colors duration-300">
      
      {/* Subtle Classical Decorative Line at Top */}
      <div className="flex items-center justify-center gap-3 max-w-xs mx-auto mb-10 opacity-60">
        <span className="h-px flex-1 bg-[#C89B3C] dark:bg-[#F0C05A]" />
        <span className="text-[#6E1824] dark:text-[#F0C05A] text-xs font-serif font-bold tracking-wider">ESTD. 1985</span>
        <span className="h-px flex-1 bg-[#C89B3C] dark:bg-[#F0C05A]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Oversized "Since 1985" Brand Plaque */}
          <div className="lg:col-span-5 space-y-5">
            
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#6E1824] dark:text-[#F0C05A] block">
              Heritage & Authenticity
            </span>

            <div className="space-y-1">
              <div className="text-5xl sm:text-6xl font-serif font-black text-[#6E1824] dark:text-[#F0C05A] tracking-tight leading-none">
                1985
              </div>
              <div className="text-lg font-serif italic text-[#241A17]/80 dark:text-[#E2DACF]">
                Four decades of halwai tradition in Mapusa
              </div>
            </div>

            {/* Core Values Pillars */}
            <div className="p-5 rounded-2xl bg-[#F8F3EA] dark:bg-[#141010] border border-[#E9DED0] dark:border-[#382B29] space-y-4 text-xs text-[#241A17]/85 dark:text-[#D1C7BD] leading-relaxed">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#6E1824] dark:text-[#F0C05A] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm font-serif text-[#241A17] dark:text-[#FFFFFF]">Pure Ingredients & Craft</strong>
                  <span className="text-[#241A17]/80 dark:text-[#D1C7BD]">Prepared with fresh whole milk khoya, rich cream, and premium whole Goan cashews.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="w-4 h-4 text-[#6E1824] dark:text-[#F0C05A] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm font-serif text-[#241A17] dark:text-[#FFFFFF]">Daily Morning Batches</strong>
                  <span className="text-[#241A17]/80 dark:text-[#D1C7BD]">Fresh cottage cheese Ras Malai, chilled sweet lassi, paneer, and hot milk sweets crafted each morning.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm font-serif text-[#241A17] dark:text-[#FFFFFF]">Trusted Local Institution</strong>
                  <span className="text-[#241A17]/80 dark:text-[#D1C7BD]">A registered proprietorship enterprise with an unwavering commitment to quality.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Professional Narrative */}
          <div className="lg:col-span-7 space-y-5 text-[#241A17]/85 dark:text-[#E2DACF] text-xs sm:text-sm leading-relaxed font-normal">
            
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#241A17] dark:text-[#FFFFFF] leading-snug">
              Crafting traditional Indian sweets with timeless authenticity and uncompromised purity.
            </h3>

            <p className="dark:text-[#E2DACF] leading-relaxed">
              Since <strong className="text-[#241A17] dark:text-[#FFFFFF]">1985</strong>, <strong className="text-[#241A17] dark:text-[#FFFFFF]">Shri Laxmi Sweet Mart</strong> has stood as a hallmark of quality and festive celebration for generations of families, travelers, and patrons in Mapusa, Goa. What began as a dedicated local halwai has grown into an enduring tradition, bringing the warmth of authentic Indian confectionery to every household occasion.
            </p>

            <p className="dark:text-[#E2DACF] leading-relaxed">
              Our confectioners uphold time-honoured techniques: slow-caramelizing pure cow milk mawa over simmering kadhais, delicately layering hand-rolled cashew paste with chandi vark, crafting golden gram flour motichoor pearls in aromatic saffron syrup, and blending ground coastal spices for signature savoury mixtures.
            </p>

            <p className="dark:text-[#E2DACF] leading-relaxed">
              Whether it is a family wedding, a religious puja, seasonal festival gifting, or simply an afternoon glass of chilled malai lassi, every recipe represents four decades of consistent flavour, uncompromising hygiene, and heartfelt hospitality.
            </p>

            <div className="pt-2">
              <a
                href="#catalog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E1824] dark:text-[#F0C05A] uppercase tracking-wider hover:underline"
              >
                <span>Explore our sweets collection →</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
