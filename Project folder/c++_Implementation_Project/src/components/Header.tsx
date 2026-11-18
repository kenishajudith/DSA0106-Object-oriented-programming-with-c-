import React from 'react';
import { Camera, Diamond, Sparkles, BarChart3, MessageSquare, ShoppingBag, Heart, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeTab: 'tryon' | 'catalog' | 'recommender' | 'analytics' | 'stylist';
  setActiveTab: (tab: 'tryon' | 'catalog' | 'recommender' | 'analytics' | 'stylist') => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-opacity-80 border-b border-amber-500/20 transition-colors duration-300 bg-[#0B0F19]/90 text-amber-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('tryon')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Diamond className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                AURA LUXE
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider">
                AI AR
              </span>
            </div>
            <p className="text-[10px] text-amber-200/60 tracking-widest uppercase">Virtual Jewelry Try-On</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#131B2E] p-1.5 rounded-2xl border border-amber-500/20 shadow-inner">
          <button
            onClick={() => setActiveTab('tryon')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'tryon'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-semibold shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Live AR Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'catalog'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-semibold shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Diamond className="w-4 h-4" />
            <span>Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('recommender')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'recommender'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-semibold shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Recommender</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-semibold shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Review Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('stylist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'stylist'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-semibold shadow-md shadow-amber-500/30'
                : 'text-amber-200/80 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-cyan-300" />
            <span>AI Stylist</span>
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-xl bg-[#131B2E] border border-amber-500/20 text-amber-300 hover:bg-amber-500/10 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 text-rose-400" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 hover:from-amber-500/30 hover:to-yellow-500/30 transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <span className="hidden sm:inline font-medium text-xs text-amber-200">Bag</span>
            {cartCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-[#131B2E] border border-amber-500/20 text-amber-300 hover:bg-amber-500/10 transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-amber-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
