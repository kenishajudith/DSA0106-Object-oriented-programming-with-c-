#pragma once

#include "jewelry_types.hpp"

namespace aura {

class ParametricRenderer {
public:
    ParametricRenderer() = default;

    // Computes the geometric affine transformation and contact shadow for an item given landmarks
    OverlayTransform computeTransform(
        const JewelryItem& item,
        const BodyLandmarksResult& landmarks,
        double manualScale = 1.0,
        double manualRotationDeg = 0.0,
        double opacity = 0.95,
        bool isRightSideEarring = false
    ) const;

    // Generates transparent AI Match Breakdown with 3 factors and personalized compliment
    TransparentMatchBreakdown generateMatchBreakdown(
        const JewelryItem& item,
        FaceShape faceShape,
        SkinTone skinTone
    ) const;

private:
    static constexpr double PI = 3.14159265358979323846;
};

} // namespace aura

