import { useState } from 'react';
import { Search, Filter, Diamond, Star, Camera, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import type { JewelryItem } from '../types/jewelry';
import { getSimilarProducts } from '../utils/recommendationEngine';

interface CatalogProps {
  products: JewelryItem[];
  onSelectForTryOn: (item: JewelryItem) => void;
  onAddToCart: (item: JewelryItem) => void;
  onAddToWishlist: (item: JewelryItem) => void;
  wishlistIds: string[];
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  onSelectForTryOn,
  onAddToCart,
  onAddToWishlist,
  wishlistIds,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [selectedGemstone, setSelectedGemstone] = useState<string>('all');
  const [maxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<JewelryItem | null>(null);

  // Filter products based on search & criteria
  const filteredProducts = products
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesMetal = selectedMetal === 'all' || item.metal === selectedMetal;
      const matchesGemstone = selectedGemstone === 'all' || item.gemstone === selectedGemstone;
      const matchesPrice = item.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesMetal && matchesGemstone && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewCount - a.reviewCount; // popular
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Catalog Header Banner */}
      <div className="relative rounded-3xl overflow-hidden mb-10 bg-gradient-to-r from-[#1E1B4B] via-[#0F172A] to-[#1E1B4B] border border-amber-500/30 p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
            <Diamond className="w-3.5 h-3.5" />
            Curated Fine Jewelry
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 leading-tight mb-3">
            Digital Showroom & Fine Collection
          </h1>
          <p className="text-sm text-amber-200/70 leading-relaxed mb-6">
            Explore handcrafted necklaces, solitaires, tiaras, and dangles. Try on any piece live using our AI Virtual AR Engine.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search diamonds, emeralds, 18k gold..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0B0F19]/90 border border-amber-500/30 rounded-2xl text-amber-100 text-sm focus:outline-none focus:border-amber-400 placeholder:text-amber-200/40 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Filter and Sorting Control Strip */}
      <div className="bg-[#131B2E] p-4 rounded-2xl border border-amber-500/20 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Jewelry' },
            { id: 'necklace', label: 'Necklaces' },
            { id: 'earrings', label: 'Earrings' },
            { id: 'ring', label: 'Rings' },
            { id: 'tiara', label: 'Tiaras' },
            { id: 'nosering', label: 'Nose Rings' },
            { id: 'bracelet', label: 'Bracelets' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-[#0B0F19] text-amber-200/70 hover:text-amber-200 border border-amber-500/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Metal Filter */}
          <select
            value={selectedMetal}
            onChange={(e) => setSelectedMetal(e.target.value)}
            className="bg-[#0B0F19] border border-amber-500/20 text-amber-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Metals</option>
            <option value="18K Gold">18K Yellow Gold</option>
            <option value="White Gold">18K White Gold</option>
            <option value="Rose Gold">Rose Gold</option>
            <option value="Platinum">950 Platinum</option>
          </select>

          {/* Gemstone Filter */}
          <select
            value={selectedGemstone}
            onChange={(e) => setSelectedGemstone(e.target.value)}
            className="bg-[#0B0F19] border border-amber-500/20 text-amber-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Gemstones</option>
            <option value="Diamond">Diamond</option>
            <option value="Emerald">Emerald</option>
            <option value="Sapphire">Sapphire</option>
            <option value="Ruby">Ruby</option>
            <option value="Pearl">Pearl</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0B0F19] border border-amber-500/20 text-amber-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#131B2E] rounded-3xl border border-amber-500/20">
          <Filter className="w-12 h-12 text-amber-400/50 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-amber-100">No Matching Jewelry Found</h3>
          <p className="text-xs text-amber-200/60 mt-1">Try adjusting your category, price range, or search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const isWishlisted = wishlistIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-[#131B2E] rounded-3xl border border-amber-500/20 overflow-hidden shadow-xl hover:border-amber-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-[#0B0F19] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {item.isBestSeller && (
                      <span className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                        Best Seller
                      </span>
                    )}
                    {item.isNewArrival && (
                      <span className="bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                        New Arrival
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => onAddToWishlist(item)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[#0B0F19]/80 border border-amber-500/20 text-amber-200 hover:text-rose-400 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Overlay Quick Try-On Button */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => onSelectForTryOn(item)}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs rounded-xl shadow-xl flex items-center justify-center gap-2 hover:brightness-110"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Try On Live AR</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-amber-400/80 mb-1 font-semibold uppercase">
                      <span>{item.category}</span>
                      <span>{item.metal}</span>
                    </div>

                    <h3 
                      onClick={() => setSelectedDetailProduct(item)}
                      className="font-serif font-bold text-amber-100 text-base group-hover:text-amber-300 cursor-pointer transition-colors line-clamp-1"
                    >
                      {item.name}
                    </h3>

                    {/* Rating & Review */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-xs font-bold ml-1 text-amber-200">{item.rating}</span>
                      </div>
                      <span className="text-[11px] text-amber-200/50">({item.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-500/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-200/50 block">Retail Price</span>
                      <span className="text-lg font-bold text-amber-400">${item.price.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setSelectedDetailProduct(item)}
                        className="px-3 py-2 bg-[#0B0F19] text-amber-200 text-xs rounded-xl border border-amber-500/20 hover:border-amber-400 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onAddToCart(item)}
                        className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
                        title="Add to Shopping Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedDetailProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131B2E] border border-amber-500/30 rounded-3xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">{selectedDetailProduct.category}</span>
                <h2 className="text-2xl font-serif font-bold text-amber-100 mt-1">{selectedDetailProduct.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedDetailProduct(null)}
                className="text-amber-200/60 hover:text-amber-100 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl overflow-hidden bg-[#0B0F19] aspect-square border border-amber-500/20">
                <img src={selectedDetailProduct.image} alt={selectedDetailProduct.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-xs text-amber-200/80 leading-relaxed mb-4">{selectedDetailProduct.description}</p>

                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">Specifications</h4>
                  <div className="bg-[#0B0F19] p-3 rounded-2xl border border-amber-500/10 text-xs space-y-1.5 mb-4">
                    <div className="flex justify-between">
                      <span className="text-amber-200/60">Metal Purity:</span>
                      <span className="text-amber-100 font-medium">{selectedDetailProduct.specs.metalPurity}</span>
                    </div>
                    {selectedDetailProduct.specs.caratWeight && (
                      <div className="flex justify-between">
                        <span className="text-amber-200/60">Carat Weight:</span>
                        <span className="text-amber-100 font-medium">{selectedDetailProduct.specs.caratWeight}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-amber-200/60">Clarity / Grade:</span>
                      <span className="text-amber-100 font-medium">{selectedDetailProduct.specs.stoneClarity || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-200/60">Total Weight:</span>
                      <span className="text-amber-100 font-medium">{selectedDetailProduct.specs.totalWeight}</span>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-amber-400">${selectedDetailProduct.price.toLocaleString()}</div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      onSelectForTryOn(selectedDetailProduct);
                      setSelectedDetailProduct(null);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Launch Live AR Try-On</span>
                  </button>

                  <button
                    onClick={() => onAddToCart(selectedDetailProduct)}
                    className="px-4 py-3 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>

            {/* Similar Products Recommendation Bar */}
            <div className="pt-4 border-t border-amber-500/20">
              <h4 className="text-xs font-serif font-bold text-amber-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Recommended Similar Jewelry
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {getSimilarProducts(selectedDetailProduct, products, 3).map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => setSelectedDetailProduct(sim)}
                    className="bg-[#0B0F19] p-2 rounded-xl border border-amber-500/20 cursor-pointer hover:border-amber-400 transition-colors flex items-center gap-3"
                  >
                    <img src={sim.image} alt={sim.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="overflow-hidden">
                      <h5 className="text-xs font-medium text-amber-100 truncate">{sim.name}</h5>
                      <span className="text-[11px] font-bold text-amber-400">${sim.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
