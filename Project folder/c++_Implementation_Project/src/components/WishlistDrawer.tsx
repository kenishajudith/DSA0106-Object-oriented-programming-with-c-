import { Heart, X, Camera, ShoppingBag, Trash2 } from 'lucide-react';
import type { JewelryItem } from '../types/jewelry';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: JewelryItem[];
  onRemoveFromWishlist: (id: string) => void;
  onSelectForTryOn: (item: JewelryItem) => void;
  onAddToCart: (item: JewelryItem) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onSelectForTryOn,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="bg-[#131B2E] border-l border-amber-500/30 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              <h2 className="font-serif font-bold text-amber-100 text-lg">Saved Wishlist ({wishlistItems.length})</h2>
            </div>
            <button onClick={onClose} className="p-1 text-amber-200/60 hover:text-amber-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Heart className="w-12 h-12 text-rose-400/30 mx-auto" />
              <h3 className="text-base font-serif font-bold text-amber-100">No Wishlist Favorites</h3>
              <p className="text-xs text-amber-200/60">Click the heart icon on any jewelry piece to save it for quick AR try-on.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-[#0B0F19] p-3.5 rounded-2xl border border-amber-500/20 flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-serif font-bold text-amber-100 text-xs truncate">{item.name}</h4>
                    <span className="text-[11px] text-amber-400 font-bold">${item.price.toLocaleString()}</span>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          onSelectForTryOn(item);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-lg flex items-center gap-1"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Try On</span>
                      </button>

                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-lg flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add Bag</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
