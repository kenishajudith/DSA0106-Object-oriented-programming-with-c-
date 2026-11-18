#include <iostream>
#include <cassert>
#include <vector>
#include <string>
#include <iomanip>

#include "../include/jewelry_types.hpp"
#include "../include/vision_engine.hpp"
#include "../include/parametric_renderer.hpp"
#include "../include/recommendation_engine.hpp"
#include "../include/stylist_engine.hpp"
#include "../include/sentiment_engine.hpp"
#include "../include/store_manager.hpp"

using namespace aura;

void printHeader(const std::string& title) {
    std::cout << "\n======================================================\n";
    std::cout << "  " << title << "\n";
    std::cout << "======================================================\n";
}

int main() {
    std::cout << "Aura Luxury AR Jewelry Try-On & E-Commerce C++ Core Engine\n";
    std::cout << "Running full native verification test suite...\n";

    int passedTests = 0;
    int totalTests = 0;

    auto testCheck = [&](bool condition, const std::string& testName) {
        totalTests++;
        if (condition) {
            passedTests++;
            std::cout << "  [PASS] " << testName << "\n";
        } else {
            std::cerr << "  [FAIL] " << testName << "\n";
        }
    };

    // ---------------------------------------------------------
    // 1. Vision Engine & Face/Skin Analysis Tests
    // ---------------------------------------------------------
    printHeader("1. Computer Vision & Feature Detection");
    VisionEngine vision;

    // Create a 160x120 synthetic test buffer with warm skin tone pixels (R=220, G=160, B=120)
    int width = 160;
    int height = 120;
    std::vector<uint8_t> syntheticFrame(width * height * 4, 0);
    for (int y = 20; y < 100; ++y) {
        for (int x = 40; x < 120; ++x) {
            int idx = (y * width + x) * 4;
            syntheticFrame[idx] = 225;     // R
            syntheticFrame[idx + 1] = 165; // G
            syntheticFrame[idx + 2] = 120; // B
            syntheticFrame[idx + 3] = 255; // A
        }
    }

    FacialLandmarks facialMarks;
    FaceAnalysisResult faceAnalysis = vision.analyzeFaceAndSkin(syntheticFrame.data(), width, height, &facialMarks);

    testCheck(faceAnalysis.skinTone == SkinTone::WarmGold, "Skin tone detected as Warm Gold");
    testCheck(faceAnalysis.skinToneHex.rfind("#", 0) == 0, "Skin tone hex generated correctly: " + faceAnalysis.skinToneHex);
    testCheck(!faceAnalysis.recommendedMetals.empty(), "Metal recommendations generated for Warm Gold");
    testCheck(faceAnalysis.recommendedMetals[0] == MetalType::Gold18K, "Top recommended metal is 18K Gold");
    testCheck(facialMarks.faceBoundingWidth > 0, "Facial bounding box calculated");

    // Ring Sizing
    RingSizeEstimate ringEst = vision.estimateRingSize(24.5);
    testCheck(ringEst.ringSizeBand.find("US Size 7") != std::string::npos, "Ring size for 24.5px is US Size 7: " + ringEst.ringSizeBand);

    // Ambient Lighting
    AmbientLightSample lightSample = vision.sampleAmbientLighting(syntheticFrame.data(), width, height);
    testCheck(lightSample.colorTemp == "warm", "Ambient lighting correctly identified as warm");
    testCheck(lightSample.luminance > 0.0, "Luminance computed: " + std::to_string(lightSample.luminance));

    // ---------------------------------------------------------
    // 2. Parametric AR Overlay & Math Calculations
    // ---------------------------------------------------------
    printHeader("2. Parametric AR Overlay Transforms");
    ParametricRenderer renderer;

    StoreManager store;
    auto optRing = store.getProductById("ring-1");
    testCheck(optRing.has_value(), "Loaded product 'ring-1' from catalog");

    BodyLandmarksResult sampleMarks;
    sampleMarks.hasHand = true;
    sampleMarks.selectedFingerMCP = { 100.0, 200.0, 0.0, "MCP" };
    sampleMarks.selectedFingerPIP = { 100.0, 150.0, 0.0, "PIP" };
    sampleMarks.fingerAngleDegrees = -90.0;
    sampleMarks.fingerJointDistPx = 50.0;

    OverlayTransform ringTransform = renderer.computeTransform(optRing.value(), sampleMarks, 1.0, 0.0, 0.95);
    testCheck(ringTransform.anchorX == 100.0 && ringTransform.anchorY == 175.0, "Ring anchor calculated at midpoint between MCP and PIP");
    testCheck(ringTransform.scale > 0.0, "Ring scale factor computed: " + std::to_string(ringTransform.scale));
    testCheck(ringTransform.shadowRadiusX == 24.0, "Contact shadow calibrated for ring geometry");

    // Transparent Match Breakdown
    TransparentMatchBreakdown breakdown = renderer.generateMatchBreakdown(optRing.value(), FaceShape::Oval, SkinTone::CoolSilver);
    testCheck(breakdown.totalScore >= 90, "Match breakdown score is >= 90: " + std::to_string(breakdown.totalScore));
    testCheck(breakdown.factors.size() == 3, "Match breakdown includes 3 contributing factors");
    testCheck(!breakdown.compliment.empty(), "Compliment generated: " + breakdown.compliment);

    // ---------------------------------------------------------
    // 3. AI Recommendation Engine Tests
    // ---------------------------------------------------------
    printHeader("3. AI Recommendation Engine");
    RecommendationEngine recEngine;

    auto recs = recEngine.getAIRecommendations(store.getCatalog(), FaceShape::Oval, SkinTone::WarmGold, JewelryCategory::Necklace);
    testCheck(!recs.empty(), "Recommendations generated");
    testCheck(recs[0].matchScore >= 95, "Top recommendation has high score: " + std::to_string(recs[0].matchScore) + "%");
    testCheck(!recs[0].reason.empty(), "Recommendation provides rationale: " + recs[0].reason);

    auto similar = recEngine.getSimilarProducts(optRing.value(), store.getCatalog(), 3);
    testCheck(!similar.empty(), "Found similar products for ring-1");
    testCheck(similar[0].category == JewelryCategory::Ring, "First similar item matches category");

    // ---------------------------------------------------------
    // 4. Conversational AI Stylist ("Aura") Tests
    // ---------------------------------------------------------
    printHeader("4. Conversational AI Luxury Stylist");
    StylistEngine stylist;

    StylistResponse res1 = stylist.consultStylist("I need jewelry for an emerald green evening gown", store.getCatalog());
    testCheck(res1.text.find("Emerald") != std::string::npos, "Stylist recognizes emerald gown context");
    testCheck(!res1.recommendedItems.empty(), "Stylist attached recommended product items");

    StylistResponse res2 = stylist.consultStylist("Looking for a romantic rose gold ring", store.getCatalog());
    testCheck(res2.text.find("Rose gold") != std::string::npos, "Stylist recognizes rose gold request");

    // ---------------------------------------------------------
    // 5. NLP Sentiment Analysis & Review Analytics Tests
    // ---------------------------------------------------------
    printHeader("5. Review Sentiment & Customer Analytics");
    SentimentEngine sentiment;

    TextSentimentResult posResult = sentiment.analyzeText("The diamond sparkle is breathtaking and exquisite! Best quality and flawless.");
    testCheck(posResult.polarity == SentimentPolarity::Positive, "Detected positive sentiment polarity");
    testCheck(posResult.score >= 90, "Positive score high: " + std::to_string(posResult.score));
    testCheck(!posResult.highlightedWords.empty(), "Extracted positive keywords");

    TextSentimentResult negResult = sentiment.analyzeText("The clasp was broken, very cheap and disappointed with slow shipping.");
    testCheck(negResult.polarity == SentimentPolarity::Negative, "Detected negative sentiment polarity");
    testCheck(negResult.score < 40, "Negative score low: " + std::to_string(negResult.score));

    ProductSentimentSummary summary = sentiment.generateSummary(store.getReviewsForProduct("necklace-1"));
    testCheck(summary.overallScore >= 90, "Aggregated overall review score >= 90: " + std::to_string(summary.overallScore));
    testCheck(summary.positivePercent > 80, "Positive percent > 80%: " + std::to_string(summary.positivePercent) + "%");
    testCheck(!summary.keyPros.empty(), "Pros extracted from reviews");

    // ---------------------------------------------------------
    // 6. Store Manager, Cart, and Wishlist Tests
    // ---------------------------------------------------------
    printHeader("6. Store Manager, Cart, and Wishlist");

    // Filtering
    auto filtered = store.filterProducts("emerald", JewelryCategory::Unknown, MetalType::Unknown, GemstoneType::None, 10000.0);
    testCheck(!filtered.empty(), "Filtered products matching 'emerald': " + std::to_string(filtered.size()) + " items");

    // Cart Operations
    testCheck(store.getCartTotalCount() == 0, "Cart is initially empty");
    store.addToCart(optRing.value(), "US Size 7");
    testCheck(store.getCartTotalCount() == 1, "Added 1 item to cart");
    testCheck(store.getCartSubtotal() == optRing.value().price, "Cart subtotal matches item price: $" + std::to_string(store.getCartSubtotal()));

    store.updateCartQuantity("ring-1", 1);
    testCheck(store.getCartTotalCount() == 2, "Updated cart quantity to 2");
    testCheck(store.getCartSubtotal() == optRing.value().price * 2, "Cart subtotal updated correctly");

    store.removeFromCart("ring-1");
    testCheck(store.getCartTotalCount() == 0, "Removed item from cart, count is 0");

    // Wishlist Operations
    testCheck(store.isInWishlist("necklace-1"), "Default wishlist contains necklace-1");
    store.toggleWishlist("necklace-1");
    testCheck(!store.isInWishlist("necklace-1"), "Toggled necklace-1 out of wishlist");
    store.toggleWishlist("necklace-1");
    testCheck(store.isInWishlist("necklace-1"), "Toggled necklace-1 back into wishlist");

    // Try-on Session Logging
    SessionTryOnLog sessionLog;
    sessionLog.itemId = "necklace-1";
    sessionLog.itemName = "Celestia Diamond Tear Drop Necklace";
    sessionLog.category = JewelryCategory::Necklace;
    sessionLog.timestamp = "10:30 AM";
    sessionLog.durationSec = 45;
    sessionLog.matchScore = 98;
    store.logTryOnSession(sessionLog);
    testCheck(!store.getSessionLogs().empty(), "Logged try-on session successfully");

    // ---------------------------------------------------------
    // Summary
    // ---------------------------------------------------------
    printHeader("VERIFICATION SUMMARY");
    std::cout << "Total Tests Run: " << totalTests << "\n";
    std::cout << "Tests Passed:    " << passedTests << " / " << totalTests << " ("
              << std::fixed << std::setprecision(1) << (static_cast<double>(passedTests) / totalTests * 100.0) << "%)\n";

    if (passedTests == totalTests) {
        std::cout << "\nSUCCESS: ALL C++ CORE MODULES AND ALGORITHMS VERIFIED 100% WORKING!\n";
        return 0;
    } else {
        std::cerr << "\nERROR: Some test assertions failed.\n";
        return 1;
    }
}

