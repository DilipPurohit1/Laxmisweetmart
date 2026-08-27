import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Phone, AlertTriangle, ShieldAlert, MapPin } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, products } = useStore();

  if (!selectedProduct) return null;

  const relatedProducts = products
    .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id && p.isVisible)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FFFDF8] border border-[#E9DED0] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#241A17] text-left">
        
        {/* Modal Header without Hindi */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F8F3EA] border-b border-[#E9DED0]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E1824] bg-[#6E1824]/10 px-2.5 py-0.5 rounded-full capitalize">
              {selectedProduct.category.replace('-', ' ')}
            </span>
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1 rounded-full text-[#241A17]/60 hover:text-[#241A17] hover:bg-[#E9DED0]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left: Product Visual Frame with Real Photography */}
          <div className="md:col-span-5 bg-[#F8F3EA] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E9DED0] space-y-4">
            <div className="flex-1 flex flex-col items-center justify-center min-h-[220px] rounded-2xl bg-[#FFFDF8] border border-[#E9DED0] overflow-hidden group">
              <img
                src={selectedProduct.images[0] || '/products/placeholder.jpg'}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-center max-h-72 group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/products/placeholder.jpg';
                }}
              />
            </div>

            <div className="text-center text-[10px] text-[#241A17]/60 bg-[#FFFDF8] p-2.5 rounded-xl border border-[#E9DED0]">
              Freshly prepared batch · Shri Laxmi Sweet Mart Mapusa
            </div>
          </div>

          {/* Right: Detailed Info & Call to Order */}
          <div className="md:col-span-7 p-6 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#241A17]">
                  {selectedProduct.name}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#241A17]/80 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Indicative Reference Price Notice */}
              <div className="p-4 rounded-2xl bg-[#F8F3EA] border border-[#E9DED0] space-y-1">
                <div className="text-[10px] text-[#6E1824] font-bold uppercase tracking-wider">
                  Indicative Price (Informational Reference):
                </div>
                <div className="text-2xl font-serif font-black text-[#6E1824]">
                  ₹{selectedProduct.indicativePrice} <span className="text-xs font-normal text-[#241A17]/70">/ {selectedProduct.unit}</span>
                </div>
                <div className="text-[10px] text-[#241A17]/60 italic">
                  * Note: Prices are indicative reference only. Daily current prices are confirmed at the shop counter.
                </div>
              </div>

              {/* Perishable Warning */}
              {selectedProduct.isPerishable && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Fresh Daily Batch:</span>
                    Made fresh at Mapusa shop. Best consumed chilled within 24-48 hours.
                  </div>
                </div>
              )}

              {/* Allergen Information */}
              <div className="text-xs text-[#241A17]/80 space-y-1">
                <div className="font-semibold text-[#6E1824] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Allergen Information:
                </div>
                <div className="text-[11px]">
                  Contains: <strong className="capitalize">{selectedProduct.allergens.join(', ')}</strong>. Prepared in a traditional halwai kitchen handling whole milk, dairy, and tree nuts.
                </div>
              </div>

              {/* Related Items */}
              {relatedProducts.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-[#241A17]/60 uppercase tracking-wider mb-2">
                    Related in {selectedProduct.category.replace('-', ' ')}:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {relatedProducts.map(rel => (
                      <button
                        key={rel.id}
                        onClick={() => setSelectedProduct(rel)}
                        className="p-2 rounded-xl bg-[#F8F3EA] hover:bg-[#E9DED0] border border-[#E9DED0] text-left transition-colors flex items-center gap-2"
                      >
                        <img
                          src={rel.images[0]}
                          alt={rel.name}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-[#241A17] truncate">{rel.name}</div>
                          <div className="text-[10px] text-[#6E1824] font-semibold">₹{rel.indicativePrice}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Direct Call to Order Button (NO Checkout / Add to Cart) */}
            <div className="pt-4 border-t border-[#E9DED0] space-y-2">
              <a
                href="tel:09423313875"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold bg-[#6E1824] hover:bg-[#52111A] text-[#FFFDF8] text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                <Phone className="w-4 h-4 text-[#C89B3C]" />
                <span>Call Shop to Order (094233 13875)</span>
              </a>

              <div className="text-[10px] text-center text-[#241A17]/60 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-[#6E1824]" />
                <span>Shop No. 1, Near KTC Bus Stand, Mapusa, Goa</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
