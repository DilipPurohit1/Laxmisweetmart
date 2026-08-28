import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Menu, X, Lock, Sun, Moon } from 'lucide-react';
import { ShopBrandName } from './ShopBrandName';

export const Navbar: React.FC = () => {
  const { setIsAdminView, theme, toggleTheme } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Favourites', href: '#favourites' },
    { name: 'Categories', href: '#categories' },
    { name: 'Heritage', href: '#heritage' },
    { name: 'Catalog', href: '#catalog' },
    { name: 'Visit Us', href: '#visit' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFDF8]/95 dark:bg-[#161211]/95 backdrop-blur-md shadow-md border-b border-[#E9DED0] dark:border-[#382B29] py-1.5'
          : 'bg-[#FFFDF8] dark:bg-[#161211] border-b border-[#E9DED0] dark:border-[#382B29] py-2'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 lg:px-12 flex items-center justify-between">
        
        {/* Left: Brand Identity matching shop photo precisely */}
        <a href="#hero" className="flex items-center py-0.5" title="Shri Laxmi Sweet Mart - Mapusa">
          <ShopBrandName size="sm" />
        </a>

        {/* Center: Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-wider font-semibold text-[#241A17]/80 dark:text-[#E8DFD3] hover:text-[#6E1824] dark:hover:text-[#F0C05A] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Theme Toggle & Owner Admin Portal Button */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-[#241A17] dark:text-[#F5EFEB] bg-[#F8F3EA] dark:bg-[#221A19] hover:bg-[#E9DED0] dark:hover:bg-[#332725] border border-[#E9DED0] dark:border-[#382B29] transition-colors shadow-xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F0C05A] animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-[#6E1824] animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Desktop Admin Portal Button */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => setIsAdminView(true)}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F8F3EA] dark:bg-[#221A19] hover:bg-[#6E1824] dark:hover:bg-[#8B1E2E] text-[#241A17] dark:text-[#E8DFD3] hover:text-[#FFFDF8] border border-[#E9DED0] dark:border-[#382B29] transition-all shadow-xs"
              title="Owner Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#6E1824] dark:text-[#F0C05A] group-hover:text-[#FFFDF8] transition-colors" />
              <span>Admin</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-[#241A17] dark:text-[#E8DFD3] hover:bg-[#F8F3EA] dark:hover:bg-[#221A19] border border-[#E9DED0] dark:border-[#382B29] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF8] dark:bg-[#161211] border-b border-[#E9DED0] dark:border-[#382B29] px-4 pt-2 pb-4 space-y-2 text-left animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-xs uppercase tracking-wider font-bold text-[#241A17] dark:text-[#F5EFEB] hover:text-[#6E1824] dark:hover:text-[#F0C05A] border-b border-[#F8F3EA] dark:border-[#221A19]"
            >
              {link.name}
            </a>
          ))}

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAdminView(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-[#F8F3EA] dark:bg-[#221A19] text-[#6E1824] dark:text-[#F0C05A] border border-[#E9DED0] dark:border-[#382B29]"
            >
              <Lock className="w-3.5 h-3.5 text-[#6E1824] dark:text-[#F0C05A]" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
