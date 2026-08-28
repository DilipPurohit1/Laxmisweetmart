import React from 'react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';
import { ArrowRight } from 'lucide-react';

interface CategoryTile {
  id: Category;
  title: string;
  description: string;
  image: string;
  size: 'large' | 'medium' | 'small';
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    id: 'khoya-sweets',
    title: 'Khoya Sweets',
    description: 'Slow-caramelized milk mawa pedas, gulab jamun, and traditional layered milk cake.',
    image: '/products/cat-khoya.jpg',
    size: 'large'
  },
  {
    id: 'kaju-katli',
    title: 'Kaju Katli',
    description: 'Silky diamond-cut cashew fudge with edible silver leaf and stuffed pistachio rolls.',
    image: '/products/cat-kajukatli.jpg',
    size: 'medium'
  },
  {
    id: 'laddoo',
    title: 'Laddoo',
    description: 'Fresh motichoor and slow-roasted shahi besan laddoos with saffron and pistachios.',
    image: '/products/cat-laddoo.jpg',
    size: 'medium'
  },
  {
    id: 'ras-malai',
    title: 'Ras Malai',
    description: 'Fresh daily homemade cottage cheese patties immersed in saffron and pistachio rabdi.',
    image: '/products/cat-rasmalai.jpg',
    size: 'small'
  },
  {
    id: 'namkeen',
    title: 'Namkeen',
    description: 'Mapusa special spicy farsan mixtures, crisp bhakarwadi, and savory Goan snacks.',
    image: '/products/cat-namkeen.jpg',
    size: 'small'
  },
  {
    id: 'dry-fruits',
    title: 'Dry Fruits',
    description: 'Directly sourced premium Goan jumbo W180 cashews and hand-sorted California almonds.',
    image: '/products/cat-dryfruits.jpg',
    size: 'small'
  },
  {
    id: 'bakery',
    title: 'Bakery',
    description: 'Traditional Goan coconut bolinhas cookies and cardamom-spiced butter nankhatai.',
    image: '/products/cat-bakery.jpg',
    size: 'small'
  },
  {
    id: 'dairy-products',
    title: 'Dairy Products',
    description: 'Chilled sweet Punjabi malai lassi and daily batch fresh soft malai paneer.',
    image: '/products/cat-dairy.jpg',
    size: 'large'
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
    <section id="categories" className="py-8 sm:py-16 bg-[#F8F3EA] border-b border-[#E9DED0] text-left">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-6 sm:mb-8">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#6E1824] block mb-1">
            Explore the Counter
          </span>
          <h2 className="text-xl sm:text-3xl font-serif font-black text-[#241A17]">
            Our Eight Specialties
          </h2>
          <p className="text-xs sm:text-sm text-[#241A17]/80 mt-1 leading-relaxed">
            From slow-cooked khoya mawa to crisp Mapusa farsan and chilled malai lassi, discover traditional Goan & Indian sweets.
          </p>
        </div>

        {/* Amazon-style 2-Column Mobile Grid, Spacious Responsive Desktop Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {CATEGORY_TILES.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`group rounded-xl sm:rounded-3xl bg-[#FFFDF8] border border-[#E9DED0] hover:border-[#C89B3C] cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden active:scale-[0.99] ${
                  cat.size === 'large' ? 'col-span-2 md:col-span-2' : 'col-span-1'
                }`}
              >
                {/* Image Header */}
                <div className="relative h-32 sm:h-56 lg:h-64 w-full overflow-hidden bg-[#F8F3EA]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-4 text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-wider bg-[#6E1824]/90 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs">
                    {count} Sweets
                  </span>
                </div>

                <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-2.5">
                  <div>
                    <h3 className="text-xs sm:text-xl font-serif font-bold text-[#241A17] group-hover:text-[#6E1824] transition-colors leading-tight">
                      {cat.title}
                    </h3>

                    <p className="hidden sm:block text-xs text-[#241A17]/75 mt-1 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-1.5 sm:pt-3 border-t border-[#E9DED0] flex items-center justify-between text-[10px] sm:text-xs text-[#6E1824] font-semibold">
                    <span>Explore &rarr;</span>
                    <span className="hidden sm:flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
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
