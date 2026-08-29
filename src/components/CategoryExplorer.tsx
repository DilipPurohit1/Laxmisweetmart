import React from 'react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';
import { ArrowRight } from 'lucide-react';

interface CategoryTile {
  id: Category;
  title: string;
  description: string;
  image: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    id: 'khoya-sweets',
    title: 'Khoya Sweets',
    description: 'Slow-caramelized milk mawa pedas, gulab jamun, and traditional layered milk cake.',
    image: '/products/peda.jpg',
  },
  {
    id: 'kaju-katli',
    title: 'Kaju Katli',
    description: 'Silky diamond-cut cashew fudge with edible silver leaf and stuffed pistachio rolls.',
    image: '/products/kajukatli.jpg',
  },
  {
    id: 'laddoo',
    title: 'Laddoo & Modak',
    description: 'Motichoor, shahi besan laddoos, and ceremonial mawa modaks.',
    image: '/products/motichoor.jpg',
  },
  {
    id: 'ras-malai',
    title: 'Ras Malai & Chenna',
    description: 'Fresh homemade cottage cheese patties in saffron-pistachio rabdi and rasgullas.',
    image: '/products/rasmalai.jpg',
  },
  {
    id: 'namkeen',
    title: 'Namkeen & Savouries',
    description: 'Mapusa special spicy farsan mixtures, crisp bhakarwadi, and tikha sev.',
    image: '/products/mixture.jpg',
  },
  {
    id: 'dry-fruits',
    title: 'Dry Fruits',
    description: 'Premium Goan W180 cashews, California almonds, and roasted pistachios.',
    image: '/products/cashews.jpg',
  },
  {
    id: 'bakery',
    title: 'Bakery & Goan Delicacies',
    description: 'Traditional 7-layer Goan Bebinca, rich Dodol, and butter nankhatai cookies.',
    image: '/products/bebinca.svg',
  },
  {
    id: 'dairy-products',
    title: 'Dairy Specialties',
    description: 'Chilled sweet Punjabi malai lassi and daily batch fresh soft malai paneer.',
    image: '/products/lassi.svg',
  }
];

export const CategoryExplorer: React.FC = () => {
  const { setActiveCategory, products } = useStore();

  const handleSelectCategory = (catId: Category) => {
    setActiveCategory(catId);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="pt-10 sm:pt-14 pb-8 sm:pb-12 bg-[#F8F3EA] border-b border-[#E9DED0] text-left scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-5 sm:mb-7">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#6E1824] block mb-1">
            Explore the Counter
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#241A17]">
            Our Specialties
          </h2>
          <p className="text-xs sm:text-sm text-[#241A17]/80 mt-1 leading-relaxed">
            From slow-cooked khoya mawa to Goan Bebinca and Mapusa farsan, discover our handcrafted range.
          </p>
        </div>

        {/* Compact, Uniform Grid (4 cols on desktop, 2 cols on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORY_TILES.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="group rounded-xl sm:rounded-2xl bg-[#FFFDF8] border border-[#E9DED0] hover:border-[#C89B3C] cursor-pointer transition-all duration-300 shadow-2xs hover:shadow-sm flex flex-col justify-between overflow-hidden active:scale-[0.99]"
              >
                {/* Compact Image Header */}
                <div className="relative h-28 sm:h-36 lg:h-40 w-full overflow-hidden bg-[#F8F3EA]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-2 left-2.5 text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-wider bg-[#6E1824]/90 px-2.5 py-0.5 rounded-full shadow-xs">
                    {count} Items
                  </span>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-1.5">
                  <div>
                    <h3 className="text-xs sm:text-sm font-serif font-bold text-[#241A17] group-hover:text-[#6E1824] transition-colors leading-tight truncate">
                      {cat.title}
                    </h3>

                    <p className="hidden sm:block text-[11px] text-[#241A17]/70 mt-1 leading-normal line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E9DED0] flex items-center justify-between text-[10px] sm:text-[11px] text-[#6E1824] font-semibold">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
