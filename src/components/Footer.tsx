import React from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { ShopBrandName } from './ShopBrandName';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  const quickLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Favourites', href: '#favourites' },
    { name: 'Categories', href: '#categories' },
    { name: 'Heritage', href: '#heritage' },
    { name: 'Catalog', href: '#catalog' },
    { name: 'Visit Us', href: '#visit' },
  ];

  return (
    <footer className="bg-[#1C1615] dark:bg-[#120E0D] text-[#FFFDF8]/85 text-left select-none font-sans border-t border-white/10 dark:border-[#382B29]">
      
      {/* Compact Top Centerpiece: Logo with Tagline */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-6 border-b border-white/10 dark:border-[#382B29] flex flex-col items-center justify-center text-center space-y-2">
        {/* Brand Name Logo Card seamlessly integrated into dark aesthetic */}
        <div className="p-3 bg-white/5 dark:bg-white/[0.03] backdrop-blur-xs rounded-2xl border border-white/15 dark:border-[#382B29] shadow-xs">
          <ShopBrandName size="sm" variant="footer" />
        </div>

        {/* Tagline directly below */}
        <div className="text-[11px] text-[#F0C05A] dark:text-[#F0C05A] font-semibold tracking-wider uppercase">
          Four Decades of Halwai Tradition in Mapusa, Goa · Established 1985
        </div>
      </div>

      {/* Main 4-Column Grid: Compact & Balanced */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-xs">
        
        {/* Col 1: Our Heritage */}
        <div className="space-y-2.5">
          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#FFFDF8] uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 dark:border-[#382B29] pb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F0C05A]" />
            <span>Our Heritage</span>
          </h4>
          <p className="text-[#FFFDF8]/75 dark:text-[#D1C7BD] leading-relaxed text-[11px]">
            Established in 1985 at Shop No. 1, Mapusa. Specializing in handcrafted khoya mawa sweets, motichoor laddoos, fresh Ras Malai, and authentic Goan farsan snacks prepared fresh every morning.
          </p>
          <span className="inline-block text-[9px] text-[#F0C05A] font-semibold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full border border-white/10 dark:border-[#382B29]">
            GST Registered Halwai
          </span>
        </div>

        {/* Col 2: Shop Location */}
        <div className="space-y-2.5">
          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#FFFDF8] uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 dark:border-[#382B29] pb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#F0C05A]" />
            <span>Shop Location</span>
          </h4>
          <p className="text-[#FFFDF8]/85 dark:text-[#E2DACF] font-medium leading-relaxed text-[11px]">
            {settings.address}
          </p>
          <p className="text-[10px] text-[#FFFDF8]/60 dark:text-[#A89F95] leading-relaxed">
            <strong>Landmark:</strong> Directly beside the Mapusa KTC Bus Stand terminal, Main Road.
          </p>
        </div>

        {/* Col 3: Contact & Inquiries */}
        <div className="space-y-2.5">
          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#FFFDF8] uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 dark:border-[#382B29] pb-1.5">
            <Mail className="w-3.5 h-3.5 text-[#F0C05A]" />
            <span>Contact & Inquiries</span>
          </h4>
          
          <div className="space-y-1">
            <span className="text-[9px] text-[#F0C05A] uppercase font-bold tracking-wider block">
              Email for Queries:
            </span>
            <a
              href="mailto:laxmisweetmart@gmail.com"
              className="inline-flex items-center gap-1.5 text-[11px] text-[#FFFDF8] font-bold hover:text-[#F0C05A] transition-colors py-1 px-2.5 rounded-lg bg-white/5 border border-white/10 dark:border-[#382B29]"
            >
              <Mail className="w-3 h-3 text-[#F0C05A]" />
              <span>laxmisweetmart@gmail.com</span>
            </a>
          </div>

          <div className="space-y-0.5 pt-1">
            <span className="text-[9px] text-[#F0C05A] uppercase font-bold tracking-wider block">
              Mobile Contact:
            </span>
            <a
              href="tel:09423313875"
              className="inline-flex items-center gap-1.5 text-[11px] text-[#FFFDF8] font-semibold hover:text-[#F0C05A] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#F0C05A]" />
              <span>094233 13875</span>
            </a>
          </div>
        </div>

        {/* Col 4: Quick Links in 2-Column Compact Grid */}
        <div className="space-y-2.5">
          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#FFFDF8] uppercase tracking-wider border-b border-white/10 dark:border-[#382B29] pb-1.5">
            Quick Links
          </h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-[#FFFDF8]/75 dark:text-[#D1C7BD]">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-white dark:hover:text-[#F0C05A] transition-colors hover:translate-x-0.5 transform duration-150"
              >
                • {link.name}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 dark:border-[#382B29] py-3 px-4 sm:px-8 lg:px-12 text-center text-[10px] sm:text-[11px] text-[#FFFDF8]/50 dark:text-[#A89F95] flex flex-col sm:flex-row items-center justify-between gap-1.5">
        <span>© 1985 - {new Date().getFullYear()} Shri Laxmi Sweet Mart, Mapusa, Goa. All rights reserved.</span>
        <span className="text-[#F0C05A]">Pure Whole Milk · Authentic Halwai Recipes</span>
      </div>

    </footer>
  );
};
