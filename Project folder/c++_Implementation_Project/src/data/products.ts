import type { JewelryItem, MetalType, Review } from '../types/jewelry';

export const INITIAL_PRODUCTS: JewelryItem[] = [
  // NECKLACES (1 - 5)
  {
    id: 'necklace-1',
    name: 'Celestia Diamond Tear Drop Necklace',
    category: 'necklace',
    price: 3490,
    rating: 4.9,
    reviewCount: 42,
    image: '/jewelry/diamond_necklace.png',
    pngOverlayAsset: '/overlays/necklace_diamond_teardrop.png',
    metal: 'White Gold',
    gemstone: 'Diamond',
    caratWeight: '2.5 ct',
    totalWeightGrams: 18.5,
    style: 'Bridal',
    description: 'An ethereal tear-drop solitare pendant crafted in 18k White Gold, suspended from a diamond-accented collarbone chain.',
    occasionTags: ['bridal', 'festive'],
    overlayAssetId: 'necklace_pendant_1',
    anchorPoints: ['neckBase', 'shoulders'],
    styleVector: [0.95, 0.2, 0.9, 1, 1.0],
    specs: {
      caratWeight: '2.5 ct',
      metalPurity: '18K (750 Gold)',
      stoneClarity: 'VVS1 / Color D',
      totalWeight: '18.5g',
      dimensions: '42cm Chain Length'
    },
    skinToneSuitability: ['Cool Silver', 'Neutral Rosé'],
    faceShapeSuitability: ['Round', 'Square', 'Oval'],
    isBestSeller: true,
    tags: ['bridal', 'diamond', 'necklace', 'luxury']
  },
  {
    id: 'necklace-2',
    name: 'Imperial Emerald Royal Choker',
    category: 'necklace',
    price: 4850,
    rating: 4.95,
    reviewCount: 31,
    image: '/jewelry/emerald_necklace.png',
    pngOverlayAsset: '/overlays/necklace_emerald_royal.png',
    metal: '18K Gold',
    gemstone: 'Emerald',
    caratWeight: '3.8 ct',
    totalWeightGrams: 26.2,
    style: 'Royal',
    description: 'A regal choker set with Colombian emeralds and brilliant-cut diamond halos in warm 18k Yellow Gold.',
    occasionTags: ['bridal', 'festive'],
    overlayAssetId: 'necklace_choker_1',
    anchorPoints: ['neckBase', 'shoulders'],
    styleVector: [0.98, 0.9, 0.95, 2, 1.1],
    specs: {
      caratWeight: '3.8 ct',
      metalPurity: '18K (750 Gold)',
      stoneClarity: 'AAA Natural Emerald',
      totalWeight: '26.2g',
      dimensions: '38cm Choker Width'
    },
    skinToneSuitability: ['Warm Gold', 'Neutral Rosé'],
    faceShapeSuitability: ['Oval', 'Heart', 'Diamond'],
    isBestSeller: true,
    tags: ['emerald', 'royal', 'gold', 'choker']
  },
  {
    id: 'necklace-3',
    name: 'Aura Radiant Solitaire Diamond Pendant',
    category: 'necklace',
    price: 1850,
    rating: 4.85,
    reviewCount: 56,
    image: '/jewelry/diamond_pendant.png',
    pngOverlayAsset: '/overlays/necklace_sapphire_pendant.png',
    metal: 'Platinum',
    gemstone: 'Diamond',
    caratWeight: '1.2 ct',
    totalWeightGrams: 9.8,
    style: 'Minimalist',
    description: 'A floating solitaire diamond pendant suspended on a fine platinum link chain for timeless elegance.',
    occasionTags: ['everyday', 'office'],
    overlayAssetId: 'necklace_pendant_2',
    anchorPoints: ['neckBase', 'shoulders'],
    styleVector: [0.4, 0.1, 0.3, 1, 0.85],
    specs: {
      caratWeight: '1.2 ct',
      metalPurity: '950 Platinum',
      stoneClarity: 'VVS2 / Color E',
      totalWeight: '9.8g',
      dimensions: '45cm Adjustable Chain'
    },
    skinToneSuitability: ['Cool Silver', 'Neutral Rosé'],
    faceShapeSuitability: ['Oval', 'Round', 'Square', 'Heart'],
    isNewArrival: true,
    tags: ['minimalist', 'platinum', 'diamond', 'everyday']
  },
  {
    id: 'necklace-4',
    name: 'Rose Gold Ruby Sunset Cascade',
    category: 'necklace',
    price: 2950,
    rating: 4.8,
    reviewCount: 22,
    image: '/jewelry/ruby_necklace.png',
    pngOverlayAsset: '/overlays/necklace_diamond_teardrop.png',
    metal: 'Rose Gold',
    gemstone: 'Ruby',
    caratWeight: '2.1 ct',
    totalWeightGrams: 14.5,
    style: 'Vintage',
    description: 'Deep pigeon-blood natural rubies cascading down an 18k Rose Gold filigree lattice.',
    occasionTags: ['festive', 'bridal'],
    overlayAssetId: 'necklace_cascade_1',
    anchorPoints: ['neckBase', 'shoulders'],
    styleVector: [0.85, 0.8, 0.8, 4, 1.0],
    specs: {
      caratWeight: '2.1 ct',
      metalPurity: '18K Rose Gold',
      stoneClarity: 'Natural Burmese Ruby',
      totalWeight: '14.5g',
      dimensions: '42cm Length'
    },
    skinToneSuitability: ['Warm Gold', 'Neutral Rosé'],
    faceShapeSuitability: ['Heart', 'Square', 'Oval'],
    tags: ['ruby', 'rosegold', 'vintage']
  },
  {
    id: 'necklace-5',
    name: 'Oceanic Sapphire Royal Halo Pendant',
    category: 'necklace',
    price: 3200,
    rating: 4.9,
    reviewCount: 38,
    image: '/jewelry/sapphire_pendant.png',
    pngOverlayAsset: '/overlays/necklace_sapphire_pendant.png',
    metal: 'White Gold',
    gemstone: 'Sapphire',
    caratWeight: '2.8 ct',
    totalWeightGrams: 16.0,
    style: 'Royal',
    description: 'Deep velvety Ceylon blue sapphire surrounded by a double halo of micro-pave diamonds.',
    occasionTags: ['festive', 'bridal'],
    overlayAssetId: 'necklace_pendant_3',
    anchorPoints: ['neckBase', 'shoulders'],
    styleVector: [0.9, 0.3, 0.85, 3, 1.0],
    specs: {
      caratWeight: '2.8 ct',
      metalPurity: '18K White Gold',
      stoneClarity: 'Royal Blue Ceylon',
      totalWeight: '16.0g',
      dimensions: '40cm Chain'
    },
    skinToneSuitability: ['Cool Silver', 'Neutral Rosé'],
    faceShapeSuitability: ['Round', 'Square', 'Oval'],
    tags: ['sapphire', 'whitegold', 'royal']
  },

  // EARRINGS (6 - 8)
  {
    id: 'earrings-1',
    name: 'Emerald Royal Chandelier Earrings',
    category: 'earrings',
    price: 2850,
    rating: 4.88,
    reviewCount: 29,
    image: '/jewelry/emerald_earrings.png',
    pngOverlayAsset: '/overlays/earring_emerald_chandelier.png',
    metal: '18K Gold',
    gemstone: 'Emerald',
    caratWeight: '3.2 ct',
    totalWeightGrams: 14.8,
    style: 'Royal',
    description: 'Statement chandelier dangles featuring pear-cut emeralds and diamond pave lattice work.',
    occasionTags: ['bridal', 'festive'],
    overlayAssetId: 'earrings_chandelier_1',
    anchorPoints: ['leftEarlobe', 'rightEarlobe'],
    styleVector: [0.9, 0.85, 0.92, 2, 1.0],
    specs: {
      caratWeight: '3.2 ct',
      metalPurity: '18K (750 Gold)',
      stoneClarity: 'AAA Emerald',
      totalWeight: '14.8g',
      dimensions: '5.2cm Drop Length'
    },
    skinToneSuitability: ['Warm Gold', 'Neutral Rosé'],
    faceShapeSuitability: ['Oval', 'Heart', 'Square'],
    isBestSeller: true,
    tags: ['earrings', 'emerald', 'gold', 'chandelier']
  },
  {
    id: 'earrings-2',
    name: 'Diamond Solitaire Huggie Hoops',
    category: 'earrings',
    price: 1250,
    rating: 4.92,
    reviewCount: 78,
    image: '/jewelry/diamond_hoops.png',
    pngOverlayAsset: '/overlays/earring_diamond_hoops.png',
    metal: 'Platinum',
    gemstone: 'Diamond',
    caratWeight: '1.0 ct',
    totalWeightGrams: 7.2,
    style: 'Minimalist',
    description: 'Sleek platinum huggie hoops with inside-out pave diamonds for effortless daily brilliance.',
    occasionTags: ['everyday', 'office'],
    overlayAssetId: 'earrings_hoops_1',
    anchorPoints: ['leftEarlobe', 'rightEarlobe'],
    styleVector: [0.3, 0.1, 0.2, 1, 0.75],
    specs: {
      caratWeight: '1.0 ct',
      metalPurity: '950 Platinum',
      stoneClarity: 'VS1 / Color F',
      totalWeight: '7.2g',
      dimensions: '1.4cm Outer Diameter'
    },
    skinToneSuitability: ['Cool Silver', 'Neutral Rosé', 'Warm Gold'],
    faceShapeSuitability: ['Oval', 'Round', 'Heart', 'Square', 'Diamond'],
    isBestSeller: true,
    tags: ['hoops', 'diamond', 'platinum', 'everyday']
  },

  // RINGS (9 - 12)
  {
    id: 'ring-1',
    name: 'Sapphire Royal Solitaire Ring',
    category: 'ring',
    price: 1980,
    rating: 4.95,
    reviewCount: 64,
    image: '/jewelry/sapphire_ring.png',
    pngOverlayAsset: '/overlays/ring_solitaire_sapphire.png',
    metal: 'Platinum',
    gemstone: 'Sapphire',
    caratWeight: '2.0 ct',
    totalWeightGrams: 8.5,
    style: 'Royal',
    description: 'Cushion-cut royal blue sapphire framed with diamond halo in polished 950 Platinum.',
    occasionTags: ['bridal', 'everyday', 'festive'],
    overlayAssetId: 'ring_solitaire_1',
    anchorPoints: ['selectedFingerBase'],
    styleVector: [0.8, 0.2, 0.7, 3, 0.8],
    specs: {
      caratWeight: '2.0 ct',
      metalPurity: '950 Platinum',
      stoneClarity: 'Royal Blue Ceylon',
      totalWeight: '8.5g',
      dimensions: 'Standard Band (US 5-10)'
    },
    skinToneSuitability: ['Cool Silver', 'Neutral Rosé'],
    faceShapeSuitability: ['Oval', 'Round', 'Heart', 'Square', 'Diamond'],
    isBestSeller: true,
    tags: ['ring', 'sapphire', 'platinum', 'royal']
  },
  {
    id: 'ring-2',
    name: 'Radiant Diamond Halo Eternity Ring',
    category: 'ring',
    price: 2450,
    rating: 4.9,
    reviewCount: 45,
    image: '/jewelry/diamond_ring.png',
    pngOverlayAsset: '/overlays/ring_solitaire_diamond.png',
    metal: 'White Gold',
    gemstone: 'Diamond',
    caratWeight: '1.8 ct',
    totalWeightGrams: 6.8,
    style: 'Modern',
    description: 'An oval-cut diamond central solitaire framed by an eternity band of micro-pave diamonds.',
    occasionTags: ['bridal', 'everyday'],
    overlayAssetId: 'ring_solitaire_2',
    anchorPoints: ['selectedFingerBase'],
    styleVector: [0.75, 0.15, 0.65, 1, 0.8],
    specs: {
      caratWeight: '1.8 ct',
      metalPurity: '18K White Gold',
      stoneClarity: 'VVS1 / Color D',
      totalWeight: '6.8g',
      dimensions: 'Band US Size 5-10'
    },
    skinToneSuitability: ['Cool Silver', 'Neutral Rosé'],
    faceShapeSuitability: ['Oval', 'Round', 'Heart', 'Square'],
    isNewArrival: true,
    tags: ['diamond', 'ring', 'whitegold']
  },

  // TIARAS (13)
  {
    id: 'tiara-1',
    name: 'Imperial Empress Pearl & Diamond Tiara',
    category: 'tiara',
    price: 5200,
    rating: 4.98,
    reviewCount: 15,
    image: '/jewelry/gold_tiara.png',
    pngOverlayAsset: '/overlays/tiara_empress_pearl.png',
    metal: '18K Gold',
    gemstone: 'Pearl',
    caratWeight: '4.5 ct',
    totalWeightGrams: 45.0,
    style: 'Royal',
    description: 'A regal royal tiara with diamond arches and luminous South Sea pearl peaks.',
    occasionTags: ['bridal', 'festive'],
    overlayAssetId: 'tiara_crown_1',
    anchorPoints: ['foreheadCenter'],
    styleVector: [0.99, 0.9, 0.99, 5, 1.2],
    specs: {
      caratWeight: '4.5 ct',
      metalPurity: '18K Yellow Gold',
      stoneClarity: 'Natural Pearls & VVS Diamonds',
      totalWeight: '45.0g',
      dimensions: 'Crown Width 14cm'
    },
    skinToneSuitability: ['Warm Gold', 'Neutral Rosé', 'Cool Silver'],
    faceShapeSuitability: ['Oval', 'Round', 'Square', 'Heart'],
    isBestSeller: true,
    tags: ['tiara', 'crown', 'pearl', 'royal']
  }
];

// Helper to expand catalog dynamically to 42 products programmatically
export function generateFullCatalog(): JewelryItem[] {
  const metals: MetalType[] = ['18K Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Sterling Silver'];
  const gems: JewelryItem['gemstone'][] = ['Diamond', 'Emerald', 'Sapphire', 'Ruby', 'Pearl', 'Opal', 'Topaz'];
  const styles: JewelryItem['style'][] = ['Bridal', 'Modern', 'Vintage', 'Minimalist', 'Royal'];
  const categories: JewelryItem['category'][] = ['necklace', 'earrings', 'ring', 'bracelet', 'tiara'];

  const extended: JewelryItem[] = [...INITIAL_PRODUCTS];

  let count = extended.length + 1;
  while (extended.length < 42) {
    const cat = categories[(count % categories.length)];
    const metal = metals[(count % metals.length)];
    const gem = gems[(count % gems.length)];
    const style = styles[(count % styles.length)];
    const price = Math.round(950 + (count * 95));

    let pngOverlayAsset = '/overlays/ring_solitaire_sapphire.png';
    if (cat === 'necklace') pngOverlayAsset = '/overlays/necklace_diamond_teardrop.png';
    else if (cat === 'earrings') pngOverlayAsset = '/overlays/earring_emerald_chandelier.png';
    else if (cat === 'tiara') pngOverlayAsset = '/overlays/tiara_empress_pearl.png';
    else if (cat === 'ring') pngOverlayAsset = count % 2 === 0 ? '/overlays/ring_solitaire_diamond.png' : '/overlays/ring_solitaire_sapphire.png';

    extended.push({
      id: `${cat}-${count}`,
      name: `${metal} ${gem} ${style} ${cat.toUpperCase()}`,
      category: cat,
      price,
      rating: +(4.7 + (count % 3) * 0.1).toFixed(2),
      reviewCount: 12 + count * 2,
      image: `/jewelry/${cat === 'necklace' ? 'diamond_necklace.png' : cat === 'earrings' ? 'emerald_earrings.png' : cat === 'ring' ? 'sapphire_ring.png' : 'gold_tiara.png'}`,
      pngOverlayAsset,
      metal,
      gemstone: gem,
      caratWeight: `${(1.0 + (count % 4) * 0.5).toFixed(1)} ct`,
      totalWeightGrams: +(8 + count * 0.8).toFixed(1),
      style,
      description: `A stunning ${style.toLowerCase()} ${cat} finely handcrafted in ${metal} featuring natural ${gem}.`,
      occasionTags: [(count % 2 === 0 ? 'bridal' : 'everyday'), (count % 3 === 0 ? 'festive' : 'office')],
      overlayAssetId: `${cat}_param_${count}`,
      anchorPoints: [cat === 'necklace' ? 'neckBase' : cat === 'earrings' ? 'leftEarlobe' : cat === 'ring' ? 'selectedFingerBase' : cat === 'bracelet' ? 'wristCenter' : 'foreheadCenter'],
      styleVector: [(0.4 + (count % 5) * 0.12), (0.2 + (count % 4) * 0.2), 0.7, (count % 6), 1.0],
      specs: {
        caratWeight: `${(1.0 + (count % 4) * 0.5).toFixed(1)} ct`,
        metalPurity: metal === 'Platinum' ? '950 Platinum' : '18K Gold',
        stoneClarity: 'VVS Natural Gemstone',
        totalWeight: `${(8 + count * 0.8).toFixed(1)}g`,
        dimensions: 'Custom Precision Fit'
      },
      skinToneSuitability: metal.includes('Gold') ? ['Warm Gold', 'Neutral Rosé'] : ['Cool Silver', 'Neutral Rosé'],
      faceShapeSuitability: ['Oval', 'Round', 'Heart', 'Square'],
      isNewArrival: count % 3 === 0,
      tags: [cat, metal.toLowerCase(), gem.toLowerCase(), style.toLowerCase()]
    });
    count++;
  }

  return extended;
}

export const CATALOG_PRODUCTS: JewelryItem[] = generateFullCatalog();

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'necklace-1',
    userName: 'Victoria S.',
    rating: 5,
    date: '2 days ago',
    text: 'The live AR preview was uncanny! The teardrop pendant actually sat right on my collarbone and swung as I turned my head. Ordered it for my wedding!',
    sentiment: 'positive',
    sentimentScore: 98,
    verified: true,
    pros: ['Realistic collarbone tracking', 'Breathtaking diamond sparkle', 'Comfortable chain'],
    cons: [],
    helpfulCount: 24
  },
  {
    id: 'rev-2',
    productId: 'earrings-1',
    userName: 'Elena Rostova',
    rating: 5,
    date: '1 week ago',
    text: 'The dual earlobe tracking followed both ears when I tilted my head. The emerald green refraction looks completely real!',
    sentiment: 'positive',
    sentimentScore: 95,
    verified: true,
    pros: ['Dual earlobe rotation tracking', 'Vibrant emerald color'],
    cons: [],
    helpfulCount: 18
  },
  {
    id: 'rev-3',
    productId: 'ring-1',
    userName: 'Sophia M.',
    rating: 5,
    date: '3 days ago',
    text: 'The ring finger estimator predicted my size US 7 accurately! The sapphire shine on platinum is divine.',
    sentiment: 'positive',
    sentimentScore: 94,
    verified: true,
    pros: ['Accurate finger sizing', 'Platinum sheen'],
    cons: [],
    helpfulCount: 12
  }
];
