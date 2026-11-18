import { useState } from 'react';
import { ArrowLeftRight, X, Camera } from 'lucide-react';
import type { JewelryItem } from '../types/jewelry';
import { getJewelrySvgOverlay } from '../utils/jewelryOverlays';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryItem: JewelryItem;
  catalog: JewelryItem[];
  onSelectForTryOn: (item: JewelryItem) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  primaryItem,
  catalog,
  onSelectForTryOn,
}) => {
  const [secondaryItem, setSecondaryItem] = useState<JewelryItem>(
    catalog.find((i) => i.id !== primaryItem.id) || catalog[0]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#131B2E] border border-amber-500/30 rounded-3xl max-w-4xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-6">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-amber-100 text-lg">Side-by-Side Comparative Try-On</h2>
          </div>
          <button onClick={onClose} className="p-1 text-amber-200/60 hover:text-amber-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparative Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Left Item */}
          <div className="bg-[#0B0F19] p-4 rounded-2xl border border-amber-500/20 space-y-3">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img src={primaryItem.image} alt={primaryItem.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div 
                  dangerouslySetInnerHTML={{ __html: getJewelrySvgOverlay(primaryItem.id) }}
                  className="w-44 h-44"
                />
              </div>
            </div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">{primaryItem.category}</span>
            <h3 className="font-serif font-bold text-amber-100 text-sm">{primaryItem.name}</h3>
            <span className="text-base font-bold text-amber-400 block">${primaryItem.price.toLocaleString()}</span>
            <button
              onClick={() => {
                onSelectForTryOn(primaryItem);
                onClose();
              }}
              className="w-full py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Select Look A in AR Studio</span>
            </button>
          </div>

          {/* Right Item */}
          <div className="bg-[#0B0F19] p-4 rounded-2xl border border-amber-500/20 space-y-3">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img src={secondaryItem.image} alt={secondaryItem.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div 
                  dangerouslySetInnerHTML={{ __html: getJewelrySvgOverlay(secondaryItem.id) }}
                  className="w-44 h-44"
                />
              </div>
            </div>
            
            <select
              value={secondaryItem.id}
              onChange={(e) => {
                const found = catalog.find((i) => i.id === e.target.value);
                if (found) setSecondaryItem(found);
              }}
              className="w-full bg-[#131B2E] border border-amber-500/30 text-amber-200 text-xs p-2 rounded-xl"
            >
              {catalog.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} (${cat.price})
                </option>
              ))}
            </select>

            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">{secondaryItem.category}</span>
            <h3 className="font-serif font-bold text-amber-100 text-sm">{secondaryItem.name}</h3>
            <span className="text-base font-bold text-amber-400 block">${secondaryItem.price.toLocaleString()}</span>
            <button
              onClick={() => {
                onSelectForTryOn(secondaryItem);
                onClose();
              }}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Switch to Look B in AR Studio</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
