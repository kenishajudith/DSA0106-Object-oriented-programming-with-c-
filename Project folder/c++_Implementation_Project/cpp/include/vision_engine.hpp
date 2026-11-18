#pragma once

#include "jewelry_types.hpp"
#include <cstdint>

namespace aura {

class VisionEngine {
public:
    VisionEngine() = default;

    // Detect facial features & skin undertone from an RGBA image buffer
    FaceAnalysisResult analyzeFaceAndSkin(
        const uint8_t* rgbaData,
        int width,
        int height,
        FacialLandmarks* outLandmarks = nullptr
    );

    // Compute geometric transforms and tracking metrics from detected landmark points
    BodyLandmarksResult computeBodyLandmarksMetrics(
        BodyLandmarksResult inputMarks,
        SelectedFinger selectedFinger,
        int canvasWidth,
        int canvasHeight
    );

    // Estimate US ring size band based on finger width in pixels
    RingSizeEstimate estimateRingSize(double fingerWidthPx) const;

    // Sample ambient lighting from RGBA frame to derive luminance and color temperature
    AmbientLightSample sampleAmbientLighting(
        const uint8_t* rgbaData,
        int width,
        int height
    ) const;

private:
    static constexpr double PI = 3.14159265358979323846;
};

} // namespace aura

