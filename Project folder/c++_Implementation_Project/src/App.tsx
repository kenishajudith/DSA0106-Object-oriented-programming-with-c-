import { useState } from 'react';
import { Header } from './components/Header';
import { ARTryOnStudio } from './components/ARTryOnStudio';
import { Catalog } from './components/Catalog';
import { AIRecommender } from './components/AIRecommender';
import { ReviewAnalytics } from './components/ReviewAnalytics';
import { AIStylistChat } from './components/AIStylistChat';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CompareModal } from './components/CompareModal';
import { CATALOG_PRODUCTS, INITIAL_REVIEWS } from './data/products';
import type { CartItem, JewelryItem, Review, SessionTryOnLog } from './types/jewelry';

export function App() {
  const [activeTab, setActiveTab] = useState<'tryon' | 'catalog' | 'recommender' | 'analytics' | 'stylist'>('tryon');
  const [products] = useState<JewelryItem[]>(CATALOG_PRODUCTS);
  const [selectedItem, setSelectedItem] = useState<JewelryItem>(CATALOG_PRODUCTS[0]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['necklace-1', 'earrings-1']);
  const [, setSessionLogs] = useState<SessionTryOnLog[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Cart operations
  const handleAddToCart = (item: JewelryItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) => ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) => ci.item.id === id ? { ...ci, quantity: ci.quantity + delta } : ci)
        .filter((ci) => ci.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== id));
  };

  // Wishlist operations
  const handleToggleWishlist = (item: JewelryItem) => {
    setWishlistIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };

  const handleRemoveWishlistId = (id: string) => {
    setWishlistIds((prev) => prev.filter((i) => i !== id));
  };

  // Select item for try-on & switch tab
  const handleSelectForTryOn = (item: JewelryItem) => {
    setSelectedItem(item);
    setActiveTab('tryon');
  };

  // Log Try-On Session
  const handleLogTryOnSession = (log: SessionTryOnLog) => {
    setSessionLogs((prev) => [log, ...prev]);
  };

  // Add review
  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#080B11] text-amber-50' : 'bg-slate-900 text-slate-100'} font-sans selection:bg-amber-500 selection:text-slate-950`}>
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main View Container */}
      <main className="pb-16">
        {activeTab === 'tryon' && (
          <ARTryOnStudio
            selectedItem={selectedItem}
            catalog={products}
            onSelectItem={setSelectedItem}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleToggleWishlist}
            onOpenCompare={(item) => {
              setSelectedItem(item);
              setIsCompareOpen(true);
            }}
            onLogTryOnSession={handleLogTryOnSession}
          />
        )}

        {activeTab === 'catalog' && (
          <Catalog
            products={products}
            onSelectForTryOn={handleSelectForTryOn}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        )}

        {activeTab === 'recommender' && (
          <AIRecommender
            products={products}
            onSelectForTryOn={handleSelectForTryOn}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'analytics' && (
          <ReviewAnalytics
            products={products}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        )}

        {activeTab === 'stylist' && (
          <AIStylistChat
            products={products}
            onSelectForTryOn={handleSelectForTryOn}
          />
        )}
      </main>

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistProducts}
        onRemoveFromWishlist={handleRemoveWishlistId}
        onSelectForTryOn={handleSelectForTryOn}
        onAddToCart={handleAddToCart}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        primaryItem={selectedItem}
        catalog={products}
        onSelectForTryOn={handleSelectForTryOn}
      />

    </div>
  );
}

export default App;
