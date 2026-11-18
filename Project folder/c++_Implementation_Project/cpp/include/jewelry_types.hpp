#pragma once

#include <string>
#include <vector>
#include <memory>
#include <sstream>
#include <iomanip>
#include <cmath>

namespace aura {

// Enumerations
enum class JewelryCategory {
    Necklace,
    Earrings,
    Ring,
    Tiara,
    Bracelet,
    NoseRing,
    Unknown
};

enum class MetalType {
    Gold18K,
    WhiteGold,
    RoseGold,
    Platinum,
    SterlingSilver,
    Unknown
};

enum class GemstoneType {
    Diamond,
    Emerald,
    Sapphire,
    Ruby,
    Pearl,
    Opal,
    Topaz,
    Amethyst,
    None
};

enum class StyleType {
    Bridal,
    Modern,
    Vintage,
    Minimalist,
    Royal,
    Unknown
};

enum class FaceShape {
    Oval,
    Round,
    Heart,
    Square,
    Diamond,
    Unknown
};

enum class SkinTone {
    WarmGold,
    CoolSilver,
    NeutralRose,
    Unknown
};

enum class SelectedFinger {
    Index,
    Middle,
    Ring,
    Pinky
};

enum class SentimentPolarity {
    Positive,
    Neutral,
    Negative
};

// String conversion helpers
inline std::string categoryToString(JewelryCategory c) {
    switch (c) {
        case JewelryCategory::Necklace: return "necklace";
        case JewelryCategory::Earrings: return "earrings";
        case JewelryCategory::Ring: return "ring";
        case JewelryCategory::Tiara: return "tiara";
        case JewelryCategory::Bracelet: return "bracelet";
        case JewelryCategory::NoseRing: return "nosering";
        default: return "unknown";
    }
}

inline JewelryCategory stringToCategory(const std::string& s) {
    if (s == "necklace") return JewelryCategory::Necklace;
    if (s == "earrings") return JewelryCategory::Earrings;
    if (s == "ring") return JewelryCategory::Ring;
    if (s == "tiara") return JewelryCategory::Tiara;
    if (s == "bracelet") return JewelryCategory::Bracelet;
    if (s == "nosering") return JewelryCategory::NoseRing;
    return JewelryCategory::Unknown;
}

inline std::string metalToString(MetalType m) {
    switch (m) {
        case MetalType::Gold18K: return "18K Gold";
        case MetalType::WhiteGold: return "White Gold";
        case MetalType::RoseGold: return "Rose Gold";
        case MetalType::Platinum: return "Platinum";
        case MetalType::SterlingSilver: return "Sterling Silver";
        default: return "Unknown";
    }
}

inline MetalType stringToMetal(const std::string& s) {
    if (s == "18K Gold" || s == "gold") return MetalType::Gold18K;
    if (s == "White Gold" || s == "whitegold") return MetalType::WhiteGold;
    if (s == "Rose Gold" || s == "rosegold") return MetalType::RoseGold;
    if (s == "Platinum") return MetalType::Platinum;
    if (s == "Sterling Silver" || s == "silver") return MetalType::SterlingSilver;
    return MetalType::Unknown;
}

inline std::string gemstoneToString(GemstoneType g) {
    switch (g) {
        case GemstoneType::Diamond: return "Diamond";
        case GemstoneType::Emerald: return "Emerald";
        case GemstoneType::Sapphire: return "Sapphire";
        case GemstoneType::Ruby: return "Ruby";
        case GemstoneType::Pearl: return "Pearl";
        case GemstoneType::Opal: return "Opal";
        case GemstoneType::Topaz: return "Topaz";
        case GemstoneType::Amethyst: return "Amethyst";
        default: return "None";
    }
}

inline GemstoneType stringToGemstone(const std::string& s) {
    if (s == "Diamond") return GemstoneType::Diamond;
    if (s == "Emerald") return GemstoneType::Emerald;
    if (s == "Sapphire") return GemstoneType::Sapphire;
    if (s == "Ruby") return GemstoneType::Ruby;
    if (s == "Pearl") return GemstoneType::Pearl;
    if (s == "Opal") return GemstoneType::Opal;
    if (s == "Topaz") return GemstoneType::Topaz;
    if (s == "Amethyst") return GemstoneType::Amethyst;
    return GemstoneType::None;
}

inline std::string styleToString(StyleType s) {
    switch (s) {
        case StyleType::Bridal: return "Bridal";
        case StyleType::Modern: return "Modern";
        case StyleType::Vintage: return "Vintage";
        case StyleType::Minimalist: return "Minimalist";
        case StyleType::Royal: return "Royal";
        default: return "Unknown";
    }
}

inline StyleType stringToStyle(const std::string& s) {
    if (s == "Bridal") return StyleType::Bridal;
    if (s == "Modern") return StyleType::Modern;
    if (s == "Vintage") return StyleType::Vintage;
    if (s == "Minimalist") return StyleType::Minimalist;
    if (s == "Royal") return StyleType::Royal;
    return StyleType::Unknown;
}

inline std::string faceShapeToString(FaceShape f) {
    switch (f) {
        case FaceShape::Oval: return "Oval";
        case FaceShape::Round: return "Round";
        case FaceShape::Heart: return "Heart";
        case FaceShape::Square: return "Square";
        case FaceShape::Diamond: return "Diamond";
        default: return "Unknown";
    }
}

inline FaceShape stringToFaceShape(const std::string& s) {
    if (s == "Oval") return FaceShape::Oval;
    if (s == "Round") return FaceShape::Round;
    if (s == "Heart") return FaceShape::Heart;
    if (s == "Square") return FaceShape::Square;
    if (s == "Diamond") return FaceShape::Diamond;
    return FaceShape::Unknown;
}

inline std::string skinToneToString(SkinTone s) {
    switch (s) {
        case SkinTone::WarmGold: return "Warm Gold";
        case SkinTone::CoolSilver: return "Cool Silver";
        case SkinTone::NeutralRose: return "Neutral Rosé";
        default: return "Unknown";
    }
}

inline SkinTone stringToSkinTone(const std::string& s) {
    if (s == "Warm Gold") return SkinTone::WarmGold;
    if (s == "Cool Silver") return SkinTone::CoolSilver;
    if (s == "Neutral Rosé" || s == "Neutral Rose") return SkinTone::NeutralRose;
    return SkinTone::Unknown;
}

inline std::string fingerToString(SelectedFinger f) {
    switch (f) {
        case SelectedFinger::Index: return "index";
        case SelectedFinger::Middle: return "middle";
        case SelectedFinger::Ring: return "ring";
        case SelectedFinger::Pinky: return "pinky";
        default: return "ring";
    }
}

inline SelectedFinger stringToFinger(const std::string& s) {
    if (s == "index") return SelectedFinger::Index;
    if (s == "middle") return SelectedFinger::Middle;
    if (s == "ring") return SelectedFinger::Ring;
    if (s == "pinky") return SelectedFinger::Pinky;
    return SelectedFinger::Ring;
}

// Coordinate and Tracking Structures
struct TrackingPoint {
    double x = 0.0;
    double y = 0.0;
    double z = 0.0;
    std::string label;
};

struct FacialLandmarks {
    TrackingPoint leftEar;
    double leftEarAngle = 0.0;
    double leftEarScale = 1.0;

    TrackingPoint rightEar;
    double rightEarAngle = 0.0;
    double rightEarScale = 1.0;

    TrackingPoint neck;
    double neckWidth = 0.0;
    double neckAngle = 0.0;

    TrackingPoint forehead;
    double foreheadWidth = 0.0;
    double foreheadAngle = 0.0;

    TrackingPoint nose;
    TrackingPoint eyesCenter;
    double eyesDistance = 0.0;
    double eyesAngle = 0.0;

    TrackingPoint chin;
    double faceBoundingX = 0.0;
    double faceBoundingY = 0.0;
    double faceBoundingWidth = 0.0;
    double faceBoundingHeight = 0.0;

    double headTiltAngle = 0.0; // degrees
    double headYawRatio = 0.0;  // -1 (left) to +1 (right)
};

struct BodyLandmarksResult {
    bool hasFace = false;
    bool hasHand = false;
    bool hasPose = false;
    int handLandmarkCount = 0;
    int faceLandmarkCount = 0;
    int poseLandmarkCount = 0;
    double trackingConfidence = 0.95;

    // Face landmarks
    TrackingPoint leftEarlobe;
    TrackingPoint rightEarlobe;
    TrackingPoint foreheadCenter;
    TrackingPoint chinTip;
    TrackingPoint nostrilCenter;
    double headRollDegrees = 0.0;
    double headYawRatio = 0.0;

    // Pose landmarks
    TrackingPoint leftShoulder;
    TrackingPoint rightShoulder;
    TrackingPoint neckBase;

    // Hand landmarks
    TrackingPoint selectedFingerMCP;
    TrackingPoint selectedFingerPIP;
    TrackingPoint selectedFingerTip;
    double fingerAngleDegrees = 0.0;
    double fingerJointDistPx = 25.0;
    double fingerWidthPx = 20.0;
    TrackingPoint wristCenter;
    double wristWidthPx = 70.0;
    double wristAngleDegrees = 0.0;

    // Points collection
    std::vector<TrackingPoint> rawHandPoints;
    std::vector<TrackingPoint> rawFacePoints;
    std::vector<TrackingPoint> rawPosePoints;
    std::vector<TrackingPoint> allFaceLandmarks;
    std::vector<std::vector<TrackingPoint>> allHandLandmarks;
    std::vector<TrackingPoint> allPoseLandmarks;
};

struct FaceAnalysisResult {
    FaceShape faceShape = FaceShape::Oval;
    SkinTone skinTone = SkinTone::WarmGold;
    double confidence = 0.96;
    std::string skinToneHex = "#F3D2B8";
    std::vector<MetalType> recommendedMetals;
    std::vector<StyleType> recommendedStyles;
    std::string explanation;
    int landmarksDetected = 68;
};

struct JewelrySpecs {
    std::string caratWeight;
    std::string metalPurity;
    std::string stoneClarity;
    std::string totalWeight;
    std::string dimensions;
};

struct JewelryItem {
    std::string id;
    std::string name;
    JewelryCategory category = JewelryCategory::Necklace;
    double price = 0.0;
    double rating = 5.0;
    int reviewCount = 0;
    std::string image;
    std::string pngOverlayAsset;
    MetalType metal = MetalType::Gold18K;
    GemstoneType gemstone = GemstoneType::Diamond;
    std::string caratWeight;
    double totalWeightGrams = 0.0;
    StyleType style = StyleType::Modern;
    std::string description;
    std::vector<std::string> occasionTags;
    std::string overlayAssetId;
    std::vector<std::string> anchorPoints;
    std::vector<double> styleVector; // [formality, warmth, boldness, gemIndex, scaleFactor]
    JewelrySpecs specs;
    std::vector<SkinTone> skinToneSuitability;
    std::vector<FaceShape> faceShapeSuitability;
    bool isBestSeller = false;
    bool isNewArrival = false;
    std::vector<std::string> tags;
};

struct Review {
    std::string id;
    std::string productId;
    std::string userName;
    std::string userAvatar;
    int rating = 5;
    std::string date;
    std::string text;
    SentimentPolarity sentiment = SentimentPolarity::Positive;
    int sentimentScore = 85; // 0 - 100
    bool verified = true;
    std::vector<std::string> pros;
    std::vector<std::string> cons;
    int helpfulCount = 0;
};

struct ARPlacement {
    double positionX = 0.0;
    double positionY = 0.0;
    double scale = 1.0;
    double rotation = 0.0;
    double opacity = 0.95;
    bool flipHorizontal = false;
    double metalToneShift = 0.0;
    bool isAutoTracked = true;
};

struct AmbientLightSample {
    double luminance = 140.0; // 0 to 255
    std::string colorTemp = "neutral"; // "warm", "cool", "neutral"
    std::string highlightShiftHex = "#FFFFFF";
};

struct RingSizeEstimate {
    std::string ringSizeBand;
    bool isProportionate = true;
    double millimeterDiameter = 17.3;
};

struct CartItem {
    JewelryItem item;
    int quantity = 1;
    std::string selectedSize;
};

struct AspectRatings {
    double quality = 4.9;
    double fitAndComfort = 4.8;
    double visualShine = 4.95;
    double valueForMoney = 4.7;
};

struct ProductSentimentSummary {
    int overallScore = 90;
    int positivePercent = 88;
    int neutralPercent = 8;
    int negativePercent = 4;
    std::vector<std::string> keyPros;
    std::vector<std::string> keyCons;
    std::string aiSummary;
    AspectRatings aspectRatings;
};

struct TransparentMatchFactor {
    std::string name;
    int score = 95;
    std::string reason;
};

struct TransparentMatchBreakdown {
    int totalScore = 95;
    std::string compliment;
    std::vector<TransparentMatchFactor> factors;
};

struct SessionTryOnLog {
    std::string itemId;
    std::string itemName;
    JewelryCategory category = JewelryCategory::Necklace;
    std::string timestamp;
    int durationSec = 0;
    int matchScore = 95;
};

struct OverlayTransform {
    double anchorX = 0.0;
    double anchorY = 0.0;
    double rotationRad = 0.0;
    double scale = 1.0;
    double shadowOffsetX = 0.0;
    double shadowOffsetY = 0.0;
    double shadowRadiusX = 0.0;
    double shadowRadiusY = 0.0;
    double opacity = 0.95;
};

} // namespace aura

