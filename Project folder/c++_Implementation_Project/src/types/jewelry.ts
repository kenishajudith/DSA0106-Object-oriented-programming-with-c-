export type JewelryCategory = 'necklace' | 'earrings' | 'ring' | 'tiara' | 'bracelet' | 'nosering';
export type MetalType = '18K Gold' | 'White Gold' | 'Rose Gold' | 'Platinum' | 'Sterling Silver';
export type GemstoneType = 'Diamond' | 'Emerald' | 'Sapphire' | 'Ruby' | 'Pearl' | 'Opal' | 'Topaz' | 'Amethyst' | 'None';
export type StyleType = 'Bridal' | 'Modern' | 'Vintage' | 'Minimalist' | 'Royal';
export type FaceShape = 'Oval' | 'Round' | 'Heart' | 'Square' | 'Diamond';
export type SkinTone = 'Warm Gold' | 'Cool Silver' | 'Neutral Rosé';
export type OccasionTag = 'bridal' | 'everyday' | 'festive' | 'office';
export type SelectedFinger = 'index' | 'middle' | 'ring' | 'pinky';

export interface JewelryItem {
  id: string;
  name: string;
  category: JewelryCategory;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  metal: MetalType;
  gemstone: GemstoneType;
  caratWeight?: string;
  totalWeightGrams: number;
  style: StyleType;
  description: string;
  occasionTags: OccasionTag[];
  overlayAssetId: string;
  pngOverlayAsset?: string;
  anchorPoints: string[];
  styleVector: number[]; // [formality, warmth, boldness, gemIndex, scaleFactor]
  specs: {
    caratWeight?: string;
    metalPurity: string;
    stoneClarity?: string;
    totalWeight: string;
    dimensions: string;
  };
  skinToneSuitability: SkinTone[];
  faceShapeSuitability: FaceShape[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  tags: string[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // 0 - 100
  verified: boolean;
  pros: string[];
  cons: string[];
  helpfulCount: number;
}

export interface ARPlacement {
  positionX: number; // Percentage or offset (-100 to 100)
  positionY: number; // Percentage or offset (-100 to 100)
  scale: number; // 0.2 to 3.0
  rotation: number; // -180 to 180 deg
  opacity: number; // 0.1 to 1.0
  flipHorizontal: boolean;
  metalToneShift: number; // Hue shift slider (-50 to 50)
  isAutoTracked: boolean;
}

export interface FaceAnalysisResult {
  faceShape: FaceShape;
  skinTone: SkinTone;
  confidence: number;
  skinToneHex: string;
  recommendedMetals: MetalType[];
  recommendedStyles: StyleType[];
  explanation: string;
  landmarksDetected: number;
}

export interface CartItem {
  item: JewelryItem;
  quantity: number;
  selectedSize?: string;
}

export interface ProductSentimentSummary {
  overallScore: number; // 0 - 100
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  keyPros: string[];
  keyCons: string[];
  aiSummary: string;
  aspectRatings: {
    quality: number;
    fitAndComfort: number;
    visualShine: number;
    valueForMoney: number;
  };
}

export interface MultiAngleSnapshots {
  front?: string;
  threeQuarter?: string;
  side?: string;
}

export interface SessionTryOnLog {
  itemId: string;
  itemName: string;
  category: JewelryCategory;
  timestamp: string;
  durationSec: number;
  matchScore: number;
}

export interface TransparentMatchBreakdown {
  totalScore: number;
  compliment: string;
  factors: {
    name: string;
    score: number;
    reason: string;
  }[];
}
