#pragma once

#include "jewelry_types.hpp"
#include <vector>
#include <string>

namespace aura {

struct ScoredRecommendation {
    JewelryItem item;
    int matchScore = 70;
    std::string reason;
};

class RecommendationEngine {
public:
    RecommendationEngine() = default;

    // Get ranked recommendations tailored to face shape, skin tone, and optional category
    std::vector<ScoredRecommendation> getAIRecommendations(
        const std::vector<JewelryItem>& products,
        FaceShape faceShape = FaceShape::Unknown,
        SkinTone skinTone = SkinTone::Unknown,
        JewelryCategory selectedCategory = JewelryCategory::Unknown
    ) const;

    // Retrieve similar products ranked by category, metal, gemstone, and style vector similarity
    std::vector<JewelryItem> getSimilarProducts(
        const JewelryItem& currentProduct,
        const std::vector<JewelryItem>& allProducts,
        size_t limit = 4
    ) const;
};

} // namespace aura

