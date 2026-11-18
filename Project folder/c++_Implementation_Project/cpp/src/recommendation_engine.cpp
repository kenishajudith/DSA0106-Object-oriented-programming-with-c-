#include "../include/recommendation_engine.hpp"
#include <algorithm>
#include <sstream>

namespace aura {

std::vector<ScoredRecommendation> RecommendationEngine::getAIRecommendations(
    const std::vector<JewelryItem>& products,
    FaceShape faceShape,
    SkinTone skinTone,
    JewelryCategory selectedCategory
) const {
    std::vector<ScoredRecommendation> results;
    results.reserve(products.size());

    for (const auto& item : products) {
        int score = 70;
        std::vector<std::string> reasons;

        // Skin Tone Matching
        if (skinTone != SkinTone::Unknown) {
            bool matches = std::find(item.skinToneSuitability.begin(), item.skinToneSuitability.end(), skinTone) != item.skinToneSuitability.end();
            if (matches) {
                score += 15;
                reasons.push_back(metalToString(item.metal) + " matches your " + skinToneToString(skinTone) + " skin undertones");
            } else {
                reasons.push_back("Versatile classic pairing");
            }
        }

        // Face Shape Matching
        if (faceShape != FaceShape::Unknown) {
            bool matches = std::find(item.faceShapeSuitability.begin(), item.faceShapeSuitability.end(), faceShape) != item.faceShapeSuitability.end();
            if (matches) {
                score += 15;
                reasons.push_back("Design balances " + faceShapeToString(faceShape) + " facial proportions");
            }
        }

        // Best seller boost
        if (item.isBestSeller) {
            score += 5;
        }

        // Category filter matching boost
        if (selectedCategory != JewelryCategory::Unknown && item.category == selectedCategory) {
            score += 5;
        }

        int finalScore = std::min(99, score);
        std::string finalReason = "Highly rated luxury piece";
        if (!reasons.empty()) {
            std::stringstream ss;
            for (size_t i = 0; i < reasons.size(); ++i) {
                if (i > 0) ss << " • ";
                ss << reasons[i];
            }
            finalReason = ss.str();
        }

        results.push_back({ item, finalScore, finalReason });
    }

    std::sort(results.begin(), results.end(), [](const ScoredRecommendation& a, const ScoredRecommendation& b) {
        return a.matchScore > b.matchScore;
    });

    return results;
}

std::vector<JewelryItem> RecommendationEngine::getSimilarProducts(
    const JewelryItem& currentProduct,
    const std::vector<JewelryItem>& allProducts,
    size_t limit
) const {
    struct ScoredItem {
        JewelryItem item;
        int similarity = 0;
    };

    std::vector<ScoredItem> candidates;
    for (const auto& p : allProducts) {
        if (p.id == currentProduct.id) continue;
        int sim = 0;
        if (p.category == currentProduct.category) sim += 40;
        if (p.metal == currentProduct.metal) sim += 20;
        if (p.gemstone == currentProduct.gemstone) sim += 20;
        if (p.style == currentProduct.style) sim += 20;
        candidates.push_back({ p, sim });
    }

    std::sort(candidates.begin(), candidates.end(), [](const ScoredItem& a, const ScoredItem& b) {
        return a.similarity > b.similarity;
    });

    std::vector<JewelryItem> out;
    size_t n = std::min(limit, candidates.size());
    for (size_t i = 0; i < n; ++i) {
        out.push_back(candidates[i].item);
    }
    return out;
}

} // namespace aura

