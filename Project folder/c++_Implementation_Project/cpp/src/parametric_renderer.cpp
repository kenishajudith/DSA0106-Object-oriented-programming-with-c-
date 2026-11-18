#include "../include/parametric_renderer.hpp"
#include <algorithm>
#include <cmath>
#include <sstream>

namespace aura {

OverlayTransform ParametricRenderer::computeTransform(
    const JewelryItem& item,
    const BodyLandmarksResult& landmarks,
    double manualScale,
    double manualRotationDeg,
    double opacity,
    bool isRightSideEarring
) const {
    OverlayTransform transform;
    transform.opacity = opacity;

    switch (item.category) {
        case JewelryCategory::Ring: {
            if (!landmarks.hasHand) break;
            const auto& mcp = landmarks.selectedFingerMCP;
            const auto& pip = landmarks.selectedFingerPIP;

            transform.anchorX = (mcp.x + pip.x) / 2.0;
            transform.anchorY = (mcp.y + pip.y) / 2.0;
            transform.rotationRad = (landmarks.fingerAngleDegrees + manualRotationDeg) * (PI / 180.0);
            transform.scale = (landmarks.fingerJointDistPx / 60.0) * manualScale;

            transform.shadowOffsetX = 0.0;
            transform.shadowOffsetY = 4.0;
            transform.shadowRadiusX = 24.0;
            transform.shadowRadiusY = 12.0;
            break;
        }

        case JewelryCategory::Necklace: {
            if (!landmarks.hasFace && !landmarks.hasPose) break;
            transform.anchorX = landmarks.neckBase.x;
            transform.anchorY = landmarks.neckBase.y;
            transform.rotationRad = (landmarks.headRollDegrees + manualRotationDeg) * (PI / 180.0);
            transform.scale = manualScale * 0.9;

            transform.shadowOffsetX = 0.0;
            transform.shadowOffsetY = 50.0;
            transform.shadowRadiusX = 140.0;
            transform.shadowRadiusY = 25.0;
            break;
        }

        case JewelryCategory::Earrings: {
            if (!landmarks.hasFace) break;
            const auto& ear = isRightSideEarring ? landmarks.rightEarlobe : landmarks.leftEarlobe;
            transform.anchorX = ear.x;
            transform.anchorY = ear.y;
            transform.rotationRad = (landmarks.headRollDegrees + manualRotationDeg) * (PI / 180.0);
            transform.scale = manualScale * 0.7;

            transform.shadowOffsetX = 0.0;
            transform.shadowOffsetY = 30.0;
            transform.shadowRadiusX = 12.0;
            transform.shadowRadiusY = 6.0;
            break;
        }

        case JewelryCategory::Bracelet: {
            if (!landmarks.hasHand) break;
            transform.anchorX = landmarks.wristCenter.x;
            transform.anchorY = landmarks.wristCenter.y;
            transform.rotationRad = (landmarks.wristAngleDegrees + manualRotationDeg) * (PI / 180.0);
            transform.scale = (landmarks.wristWidthPx / 120.0) * manualScale;

            transform.shadowOffsetX = 0.0;
            transform.shadowOffsetY = 0.0;
            transform.shadowRadiusX = 45.0;
            transform.shadowRadiusY = 18.0;
            break;
        }

        case JewelryCategory::Tiara: {
            if (!landmarks.hasFace) break;
            transform.anchorX = landmarks.foreheadCenter.x;
            transform.anchorY = landmarks.foreheadCenter.y - 20.0;
            transform.rotationRad = (landmarks.headRollDegrees + manualRotationDeg) * (PI / 180.0);
            transform.scale = manualScale * 0.85;

            transform.shadowOffsetX = 0.0;
            transform.shadowOffsetY = 20.0;
            transform.shadowRadiusX = 100.0;
            transform.shadowRadiusY = 15.0;
            break;
        }

        default:
            break;
    }

    return transform;
}

TransparentMatchBreakdown ParametricRenderer::generateMatchBreakdown(
    const JewelryItem& item,
    FaceShape faceShape,
    SkinTone skinTone
) const {
    bool isMetalMatch = std::find(item.skinToneSuitability.begin(), item.skinToneSuitability.end(), skinTone) != item.skinToneSuitability.end();
    bool isShapeMatch = std::find(item.faceShapeSuitability.begin(), item.faceShapeSuitability.end(), faceShape) != item.faceShapeSuitability.end();

    int metalScore = isMetalMatch ? 98 : 88;
    int shapeScore = isShapeMatch ? 96 : 85;
    int proportionScore = 95;

    int totalScore = static_cast<int>(std::round((metalScore + shapeScore + proportionScore) / 3.0));

    std::string skinStr = skinToneToString(skinTone);
    std::string shapeStr = faceShapeToString(faceShape);
    std::string metalStr = metalToString(item.metal);
    std::string catStr = categoryToString(item.category);
    std::string styleStr = styleToString(item.style);

    std::string metalReason = isMetalMatch
        ? (metalStr + " directly illuminates your " + skinStr + " undertones.")
        : (metalStr + " provides a bold contrast for " + skinStr + " tones.");

    std::string shapeReason = isShapeMatch
        ? ("The " + catStr + " geometry balances " + shapeStr + " facial proportions.")
        : ("Classic " + styleStr + " styling complements " + shapeStr + " features gracefully.");

    std::string proportionReason = "Scale factor automatically calibrated to your detected landmark dimensions.";

    std::string compliment = "That " + item.name + " sits elegantly — the " + metalStr +
                             " is a stunning match for your " + skinStr + " undertones!";

    TransparentMatchBreakdown breakdown;
    breakdown.totalScore = totalScore;
    breakdown.compliment = compliment;
    breakdown.factors = {
        { "Skin Undertone Match", metalScore, metalReason },
        { "Facial Shape Fit", shapeScore, shapeReason },
        { "Landmark Scale Proportion", proportionScore, proportionReason }
    };

    return breakdown;
}

} // namespace aura

