import type { FaceShape, JewelryItem, SkinTone } from '../types/jewelry';

export function getAIRecommendations(
  products: JewelryItem[],
  faceShape?: FaceShape,
  skinTone?: SkinTone,
  selectedCategory?: string
): { item: JewelryItem; matchScore: number; reason: string }[] {
  return products.map((item) => {
    let score = 70;
    let reasons: string[] = [];

    // Skin Tone Matching
    if (skinTone && item.skinToneSuitability.includes(skinTone)) {
      score += 15;
      reasons.push(`${item.metal} matches your ${skinTone} skin undertones`);
    } else if (skinTone) {
      reasons.push('Versatile classic pairing');
    }

    // Face Shape Matching
    if (faceShape && item.faceShapeSuitability.includes(faceShape)) {
      score += 15;
      reasons.push(`Design balances ${faceShape} facial proportions`);
    }

    // Best seller boost
    if (item.isBestSeller) {
      score += 5;
    }

    // Category filter matching boost
    if (selectedCategory && item.category === selectedCategory) {
      score += 5;
    }

    const finalScore = Math.min(99, score);
    const reason = reasons.length > 0 ? reasons.join(' • ') : 'Highly rated luxury piece';

    return { item, matchScore: finalScore, reason };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

export function getSimilarProducts(currentProduct: JewelryItem, allProducts: JewelryItem[], limit: number = 4): JewelryItem[] {
  return allProducts
    .filter((p) => p.id !== currentProduct.id)
    .map((p) => {
      let sim = 0;
      if (p.category === currentProduct.category) sim += 40;
      if (p.metal === currentProduct.metal) sim += 20;
      if (p.gemstone === currentProduct.gemstone) sim += 20;
      if (p.style === currentProduct.style) sim += 20;
      return { p, sim };
    })
    .sort((a, b) => b.sim - a.sim)
    .slice(0, limit)
    .map((x) => x.p);
}
