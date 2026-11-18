import { useState } from 'react';
import { Sparkles, Camera, CheckCircle2, Sliders, Diamond, RefreshCw } from 'lucide-react';
import type { FaceShape, JewelryItem, SkinTone } from '../types/jewelry';
import { getAIRecommendations } from '../utils/recommendationEngine';

interface AIRecommenderProps {
  products: JewelryItem[];
  onSelectForTryOn: (item: JewelryItem) => void;
  onAddToCart: (item: JewelryItem) => void;
}

export const AIRecommender: React.FC<AIRecommenderProps> = ({
  products,
  onSelectForTryOn,
  onAddToCart,
}) => {
  const [selectedFaceShape, setSelectedFaceShape] = useState<FaceShape>('Oval');
  const [selectedSkinTone, setSelectedSkinTone] = useState<SkinTone>('Warm Gold');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const recommendations = getAIRecommendations(products, selectedFaceShape, selectedSkinTone);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#131B2E] via-[#1E1B4B] to-[#131B2E] rounded-3xl p-8 border border-amber-500/30 shadow-2xl mb-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Computer Vision Stylist
          </div>
          <h1 className="text-3xl font-serif font-bold text-amber-100 mb-2">
            Personalized Face Shape & Skin Tone Analyzer
          </h1>
          <p className="text-xs text-amber-200/70 leading-relaxed">
            Our AI recommendation engine computes your facial geometry, cheekbone structure, and undertone temperature to curate jewelry pieces that enhance your natural features.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Profiler Controls (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#131B2E] p-6 rounded-3xl border border-amber-500/20 shadow-xl">
            <h3 className="text-sm font-serif font-bold text-amber-100 mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Facial Profile Parameters
            </h3>

            {/* Face Shape Picker */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-amber-200/80 block mb-2">Select Your Face Shape:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Oval', 'Round', 'Heart', 'Square', 'Diamond'] as FaceShape[]).map((shape) => (
                  <button
                    key={shape}
                    onClick={() => setSelectedFaceShape(shape)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      selectedFaceShape === shape
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : 'bg-[#0B0F19] text-amber-200/70 hover:text-amber-200 border border-amber-500/20'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Tone Undertone Picker */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-amber-200/80 block mb-2">Skin Undertone Temperature:</label>
              <div className="space-y-2">
                {[
                  { id: 'Warm Gold', label: 'Warm Gold / Honey (Best with 18k Yellow Gold, Emeralds, Rubies)' },
                  { id: 'Cool Silver', label: 'Cool Platinum (Best with Platinum, White Gold, Sapphires, Diamonds)' },
                  { id: 'Neutral Rosé', label: 'Neutral Rosé (Complements Rose Gold, Pearls, All Metals)' },
                ].map((tone) => (
                  <div
                    key={tone.id}
                    onClick={() => setSelectedSkinTone(tone.id as SkinTone)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-3 ${
                      selectedSkinTone === tone.id
                        ? 'border-amber-400 bg-amber-500/10 text-amber-100 font-medium'
                        : 'border-amber-500/20 bg-[#0B0F19] text-amber-200/60 hover:text-amber-200'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full ${
                      tone.id === 'Warm Gold' ? 'bg-amber-400' : tone.id === 'Cool Silver' ? 'bg-slate-200' : 'bg-rose-300'
                    }`} />
                    <span>{tone.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trigger Re-Scan */}
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Analyzing Geometry...' : 'Run AI Face Re-Scan'}</span>
            </button>
          </div>

          {/* AI Analysis Insight Summary */}
          <div className="bg-[#131B2E] p-6 rounded-3xl border border-amber-500/20 shadow-xl">
            <h4 className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Style Advice Report
            </h4>
            <p className="text-xs text-amber-200/80 leading-relaxed mb-4">
              {selectedFaceShape === 'Heart' && 'Heart face shapes look sublime with chandelier earrings and tear-drop pendants that add soft width to the chin line.'}
              {selectedFaceShape === 'Oval' && 'Oval face shapes possess ideal symmetry. Almost any necklace length or earring drop harmonizes effortlessly.'}
              {selectedFaceShape === 'Round' && 'Round face shapes benefit from elongated drop earrings and angular pendants that visually lengthen the jaw.'}
              {selectedFaceShape === 'Square' && 'Square jawlines pair beautifully with hoop earrings and curved necklaces that soften facial angles.'}
              {selectedFaceShape === 'Diamond' && 'Diamond face shapes shine with short chokers and bold tiaras that highlight high cheekbones.'}
            </p>

            <div className="p-3 bg-[#0B0F19] rounded-2xl border border-amber-500/10 text-[11px] space-y-2">
              <div className="flex justify-between">
                <span className="text-amber-200/50">Primary Metal Recommendation:</span>
                <span className="text-amber-300 font-bold">
                  {selectedSkinTone === 'Warm Gold' ? '18K Yellow Gold' : selectedSkinTone === 'Cool Silver' ? 'Platinum / White Gold' : '18K Rose Gold'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200/50">Complementary Gemstones:</span>
                <span className="text-amber-300 font-bold">
                  {selectedSkinTone === 'Warm Gold' ? 'Emeralds & Rubies' : 'Diamonds & Sapphires'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: AI Curated Recommendations Grid (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
              <Diamond className="w-5 h-5 text-amber-400" />
              AI Match Curations ({recommendations.length} items)
            </h2>
            <span className="text-xs text-amber-200/60">Sorted by AI Proportional Score</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map(({ item, matchScore, reason }) => (
              <div
                key={item.id}
                className="bg-[#131B2E] rounded-3xl border border-amber-500/20 p-5 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      {matchScore}% AI Match
                    </span>
                    <span className="text-[11px] text-amber-400 font-semibold">{item.category}</span>
                  </div>

                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#0B0F19] mb-4 border border-amber-500/10">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <h3 className="font-serif font-bold text-amber-100 text-base mb-1">{item.name}</h3>
                  <p className="text-xs font-bold text-amber-400 mb-2">${item.price.toLocaleString()}</p>

                  <div className="p-2.5 bg-[#0B0F19] rounded-xl border border-amber-500/10 text-[11px] text-amber-200/70 mb-4">
                    <span className="font-semibold text-amber-300">Why it matches: </span>
                    {reason}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectForTryOn(item)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Try On Live AR</span>
                  </button>

                  <button
                    onClick={() => onAddToCart(item)}
                    className="px-3 py-2.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold"
                  >
                    Add to Bag
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
