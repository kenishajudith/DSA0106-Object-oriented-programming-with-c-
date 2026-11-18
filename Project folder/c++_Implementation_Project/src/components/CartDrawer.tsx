import { useState } from 'react';
import { ShoppingBag, Trash2, X, Plus, Minus, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CartItem } from '../types/jewelry';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'AURALUXE10') {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else {
      alert('Invalid Promo Code. Try using AURALUXE10 for 10% Off!');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="bg-[#131B2E] border-l border-amber-500/30 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif font-bold text-amber-100 text-lg">Your Luxury Bag ({cartItems.length})</h2>
            </div>
            <button onClick={onClose} className="p-1 text-amber-200/60 hover:text-amber-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {orderComplete ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                ✓
              </div>
              <h3 className="text-xl font-serif font-bold text-amber-100">Order Confirmed!</h3>
              <p className="text-xs text-amber-200/70">Thank you for shopping at Aura Luxe Fine Jewelry. Your order details have been dispatched to your email.</p>
              <button
                onClick={() => {
                  setOrderComplete(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Continue Shopping
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-amber-400/40 mx-auto" />
              <h3 className="text-base font-serif font-bold text-amber-100">Your Bag is Empty</h3>
              <p className="text-xs text-amber-200/60">Explore our digital catalog and try on pieces in live AR.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {cartItems.map(({ item, quantity }) => (
                <div key={item.id} className="bg-[#0B0F19] p-3.5 rounded-2xl border border-amber-500/20 flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-serif font-bold text-amber-100 text-xs truncate">{item.name}</h4>
                    <span className="text-[11px] text-amber-400 font-bold">${item.price.toLocaleString()}</span>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-5 h-5 bg-slate-800 text-amber-200 rounded flex items-center justify-center text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-amber-100">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-5 h-5 bg-slate-800 text-amber-200 rounded flex items-center justify-center text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {!orderComplete && cartItems.length > 0 && (
          <div className="pt-4 border-t border-amber-500/20 space-y-4">
            
            {/* Promo code */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (e.g. AURALUXE10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#0B0F19] border border-amber-500/30 rounded-xl text-amber-100 text-xs"
              />
              <button
                onClick={handleApplyPromo}
                className="px-3 py-2 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30"
              >
                Apply
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-amber-200/70">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-amber-100 font-medium">${subtotal.toLocaleString()}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount (10% Off):</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-amber-400 pt-2 border-t border-amber-500/10">
                <span>Total:</span>
                <span>${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110"
            >
              <span>{isCheckingOut ? 'Processing Order...' : 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
