import React from 'react';
import { Sparkles, Eye, Phone, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const FestiveSection: React.FC = () => {
  const { products, setSelectedProduct } = useStore();

  const festiveProducts = products.filter(p => p.isFestiveSpecial && p.isVisible);

  if (festiveProducts.length === 0) return null;

  return (
    <section id="festive" className="py-16 sm:py-20 bg-gradient-to-b from-maroon-950 via-stone-950 to-maroon-950 text-white border-t border-b border-gold-500/30 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Festive & Celebratory Specials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-serif text-gold-100">
              Curated for Occasions & Gifting
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md">
            Handcrafted traditional sweets and dry fruits packaged for festivals, family celebrations, and celebrations across Goa.
          </p>
        </div>

        {/* Festive Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {festiveProducts.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-3xl bg-stone-900/90 border border-gold-500/40 hover:border-gold-400 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300"
            >
              {/* Top Visual */}
              <div className="relative h-48 w-full bg-stone-950 flex items-center justify-center overflow-hidden">
                <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                  {product.category === 'kaju-katli' && '👑'}
                  {product.category === 'laddoo' && '🟡'}
                  {product.category === 'ras-malai' && '🍨'}
                  {product.category === 'khoya-sweets' && '🥛'}
                  {product.category === 'dry-fruits' && '🥜'}
                  {product.category === 'dairy-products' && '🧈'}
                  {product.category === 'bakery' && '🍪'}
                  {product.category === 'namkeen' && '🌶️'}
                </div>

                <div className="absolute top-3 left-3 bg-maroon-900/90 text-gold-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gold-500/40 shadow">
                  ✨ Festive Feature
                </div>

                <div className="absolute bottom-2 left-3 text-[9px] text-stone-400 bg-black/60 px-2 py-0.5 rounded">
                  Sample Image — Replace with shop photo
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {product.hindiName && (
                    <div className="text-[11px] font-devanagari font-bold text-amber-400">
                      {product.hindiName}
                    </div>
                  )}
                  <h3 className="text-base font-bold font-serif text-white group-hover:text-gold-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400 text-[11px]">Indicative Price:</span>
                    <span className="text-base font-serif font-black text-gold-300">
                      ₹{product.indicativePrice} <span className="text-xs font-normal text-stone-400">/ {product.unit}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gold-500/20 hover:bg-gold-500 hover:text-stone-950 text-gold-300 border border-gold-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Product Details</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
