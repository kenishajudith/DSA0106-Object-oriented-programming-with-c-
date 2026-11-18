#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "../include/jewelry_types.hpp"
#include "../include/vision_engine.hpp"
#include "../include/parametric_renderer.hpp"
#include "../include/recommendation_engine.hpp"
#include "../include/stylist_engine.hpp"
#include "../include/sentiment_engine.hpp"
#include "../include/store_manager.hpp"

using namespace emscripten;
using namespace aura;

EMSCRIPTEN_BINDINGS(aura_core_module) {
    // Enums
    enum_<JewelryCategory>("JewelryCategory")
        .value("Necklace", JewelryCategory::Necklace)
        .value("Earrings", JewelryCategory::Earrings)
        .value("Ring", JewelryCategory::Ring)
        .value("Tiara", JewelryCategory::Tiara)
        .value("Bracelet", JewelryCategory::Bracelet)
        .value("NoseRing", JewelryCategory::NoseRing)
        .value("Unknown", JewelryCategory::Unknown);

    enum_<MetalType>("MetalType")
        .value("Gold18K", MetalType::Gold18K)
        .value("WhiteGold", MetalType::WhiteGold)
        .value("RoseGold", MetalType::RoseGold)
        .value("Platinum", MetalType::Platinum)
        .value("SterlingSilver", MetalType::SterlingSilver)
        .value("Unknown", MetalType::Unknown);

    enum_<GemstoneType>("GemstoneType")
        .value("Diamond", GemstoneType::Diamond)
        .value("Emerald", GemstoneType::Emerald)
        .value("Sapphire", GemstoneType::Sapphire)
        .value("Ruby", GemstoneType::Ruby)
        .value("Pearl", GemstoneType::Pearl)
        .value("Opal", GemstoneType::Opal)
        .value("Topaz", GemstoneType::Topaz)
        .value("Amethyst", GemstoneType::Amethyst)
        .value("None", GemstoneType::None);

    enum_<FaceShape>("FaceShape")
        .value("Oval", FaceShape::Oval)
        .value("Round", FaceShape::Round)
        .value("Heart", FaceShape::Heart)
        .value("Square", FaceShape::Square)
        .value("Diamond", FaceShape::Diamond)
        .value("Unknown", FaceShape::Unknown);

    enum_<SkinTone>("SkinTone")
        .value("WarmGold", SkinTone::WarmGold)
        .value("CoolSilver", SkinTone::CoolSilver)
        .value("NeutralRose", SkinTone::NeutralRose)
        .value("Unknown", SkinTone::Unknown);

    enum_<SentimentPolarity>("SentimentPolarity")
        .value("Positive", SentimentPolarity::Positive)
        .value("Neutral", SentimentPolarity::Neutral)
        .value("Negative", SentimentPolarity::Negative);

    // Value structs
    value_object<TrackingPoint>("TrackingPoint")
        .field("x", &TrackingPoint::x)
        .field("y", &TrackingPoint::y)
        .field("z", &TrackingPoint::z)
        .field("label", &TrackingPoint::label);

    value_object<RingSizeEstimate>("RingSizeEstimate")
        .field("ringSizeBand", &RingSizeEstimate::ringSizeBand)
        .field("isProportionate", &RingSizeEstimate::isProportionate)
        .field("millimeterDiameter", &RingSizeEstimate::millimeterDiameter);

    value_object<AmbientLightSample>("AmbientLightSample")
        .field("luminance", &AmbientLightSample::luminance)
        .field("colorTemp", &AmbientLightSample::colorTemp)
        .field("highlightShiftHex", &AmbientLightSample::highlightShiftHex);

    value_object<OverlayTransform>("OverlayTransform")
        .field("anchorX", &OverlayTransform::anchorX)
        .field("anchorY", &OverlayTransform::anchorY)
        .field("rotationRad", &OverlayTransform::rotationRad)
        .field("scale", &OverlayTransform::scale)
        .field("shadowOffsetX", &OverlayTransform::shadowOffsetX)
        .field("shadowOffsetY", &OverlayTransform::shadowOffsetY)
        .field("shadowRadiusX", &OverlayTransform::shadowRadiusX)
        .field("shadowRadiusY", &OverlayTransform::shadowRadiusY)
        .field("opacity", &OverlayTransform::opacity);

    value_object<TransparentMatchFactor>("TransparentMatchFactor")
        .field("name", &TransparentMatchFactor::name)
        .field("score", &TransparentMatchFactor::score)
        .field("reason", &TransparentMatchFactor::reason);

    register_vector<TransparentMatchFactor>("VectorTransparentMatchFactor");

    value_object<TransparentMatchBreakdown>("TransparentMatchBreakdown")
        .field("totalScore", &TransparentMatchBreakdown::totalScore)
        .field("compliment", &TransparentMatchBreakdown::compliment)
        .field("factors", &TransparentMatchBreakdown::factors);

    value_object<TextSentimentResult>("TextSentimentResult")
        .field("polarity", &TextSentimentResult::polarity)
        .field("score", &TextSentimentResult::score)
        .field("highlightedWords", &TextSentimentResult::highlightedWords);

    value_object<AspectRatings>("AspectRatings")
        .field("quality", &AspectRatings::quality)
        .field("fitAndComfort", &AspectRatings::fitAndComfort)
        .field("visualShine", &AspectRatings::visualShine)
        .field("valueForMoney", &AspectRatings::valueForMoney);

    register_vector<std::string>("VectorString");
    register_vector<JewelryItem>("VectorJewelryItem");
    register_vector<Review>("VectorReview");

    value_object<ProductSentimentSummary>("ProductSentimentSummary")
        .field("overallScore", &ProductSentimentSummary::overallScore)
        .field("positivePercent", &ProductSentimentSummary::positivePercent)
        .field("neutralPercent", &ProductSentimentSummary::neutralPercent)
        .field("negativePercent", &ProductSentimentSummary::negativePercent)
        .field("keyPros", &ProductSentimentSummary::keyPros)
        .field("keyCons", &ProductSentimentSummary::keyCons)
        .field("aiSummary", &ProductSentimentSummary::aiSummary)
        .field("aspectRatings", &ProductSentimentSummary::aspectRatings);

    value_object<StylistResponse>("StylistResponse")
        .field("text", &StylistResponse::text)
        .field("recommendedItems", &StylistResponse::recommendedItems)
        .field("suggestedFilterTag", &StylistResponse::suggestedFilterTag);

    // Classes
    class_<VisionEngine>("VisionEngine")
        .constructor<>()
        .function("estimateRingSize", &VisionEngine::estimateRingSize);

    class_<ParametricRenderer>("ParametricRenderer")
        .constructor<>()
        .function("computeTransform", &ParametricRenderer::computeTransform)
        .function("generateMatchBreakdown", &ParametricRenderer::generateMatchBreakdown);

    class_<RecommendationEngine>("RecommendationEngine")
        .constructor<>()
        .function("getSimilarProducts", &RecommendationEngine::getSimilarProducts);

    class_<StylistEngine>("StylistEngine")
        .constructor<>()
        .function("consultStylist", &StylistEngine::consultStylist);

    class_<SentimentEngine>("SentimentEngine")
        .constructor<>()
        .function("analyzeText", &SentimentEngine::analyzeText)
        .function("generateSummary", &SentimentEngine::generateSummary);

    class_<StoreManager>("StoreManager")
        .constructor<>()
        .function("getCatalog", &StoreManager::getCatalog)
        .function("filterProducts", &StoreManager::filterProducts)
        .function("getAllReviews", &StoreManager::getAllReviews)
        .function("getReviewsForProduct", &StoreManager::getReviewsForProduct)
        .function("addReview", &StoreManager::addReview)
        .function("addToCart", &StoreManager::addToCart)
        .function("updateCartQuantity", &StoreManager::updateCartQuantity)
        .function("removeFromCart", &StoreManager::removeFromCart)
        .function("clearCart", &StoreManager::clearCart)
        .function("getCartSubtotal", &StoreManager::getCartSubtotal)
        .function("getCartTotalCount", &StoreManager::getCartTotalCount)
        .function("toggleWishlist", &StoreManager::toggleWishlist)
        .function("isInWishlist", &StoreManager::isInWishlist)
        .function("getWishlistItems", &StoreManager::getWishlistItems)
        .function("logTryOnSession", &StoreManager::logTryOnSession);
}
#endif

