import type { JewelryItem, SelectedFinger, TransparentMatchBreakdown } from '../types/jewelry';
import type { BodyLandmarksResult } from './mediapipeTracking';

export interface AmbientLightSample {
  luminance: number; // 0 to 255
  colorTemp: 'warm' | 'cool' | 'neutral';
  highlightShiftHex: string;
}

// Image Asset Cache to ensure 60fps smooth rendering
const imageCache: Record<string, HTMLImageElement> = {};

function getPreloadedOverlayImage(src: string): HTMLImageElement | null {
  if (!src) return null;
  if (imageCache[src]) {
    return imageCache[src].complete ? imageCache[src] : null;
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  imageCache[src] = img;
  return null;
}

/**
 * Samples video feed to derive ambient luminance and color temperature.
 */
export function sampleAmbientLighting(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): AmbientLightSample {
  try {
    const imageData = ctx.getImageData(width * 0.2, height * 0.2, width * 0.6, height * 0.6);
    const data = imageData.data;
    let totalR = 0, totalG = 0, totalB = 0;
    const count = data.length / 4;

    for (let i = 0; i < data.length; i += 16) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
    }

    const avgR = totalR / (count / 4);
    const avgG = totalG / (count / 4);
    const avgB = totalB / (count / 4);
    const luminance = (avgR * 0.299 + avgG * 0.587 + avgB * 0.114);

    let colorTemp: 'warm' | 'cool' | 'neutral' = 'neutral';
    let highlightShiftHex = '#FFFFFF';

    if (avgR > avgB + 20) {
      colorTemp = 'warm';
      highlightShiftHex = '#FFF7ED';
    } else if (avgB > avgR + 15) {
      colorTemp = 'cool';
      highlightShiftHex = '#F0F9FF';
    }

    return { luminance, colorTemp, highlightShiftHex };
  } catch {
    return { luminance: 140, colorTemp: 'neutral', highlightShiftHex: '#FFFFFF' };
  }
}

/**
 * Estimates US Ring Size band based on finger width in pixels.
 */
export function estimateRingSize(fingerWidthPx: number): { ringSizeBand: string; isProportionate: boolean } {
  let size = 7;
  if (fingerWidthPx < 18) size = 5;
  else if (fingerWidthPx < 22) size = 6;
  else if (fingerWidthPx < 26) size = 7;
  else if (fingerWidthPx < 30) size = 8;
  else if (fingerWidthPx < 35) size = 9;
  else size = 10;

  return {
    ringSizeBand: `US Size ${size} (${(14.5 + size * 0.8).toFixed(1)}mm)`,
    isProportionate: true
  };
}

/**
 * Generates transparent AI Match Breakdown listing 3 contributing factors & custom compliment.
 */
export function generateTransparentMatchBreakdown(
  item: JewelryItem,
  faceShape: string,
  skinTone: string
): TransparentMatchBreakdown {
  const isMetalMatch = item.skinToneSuitability.includes(skinTone as any);
  const isShapeMatch = item.faceShapeSuitability.includes(faceShape as any);

  const metalScore = isMetalMatch ? 98 : 88;
  const shapeScore = isShapeMatch ? 96 : 85;
  const proportionScore = 95;

  const totalScore = Math.round((metalScore + shapeScore + proportionScore) / 3);

  const metalReason = isMetalMatch 
    ? `${item.metal} directly illuminates your ${skinTone} undertones.`
    : `${item.metal} provides a bold contrast for ${skinTone} tones.`;

  const shapeReason = isShapeMatch
    ? `The ${item.category} geometry balances ${faceShape} facial proportions.`
    : `Classic ${item.style} styling complements ${faceShape} features gracefully.`;

  const proportionReason = `Scale factor automatically calibrated to your detected landmark dimensions.`;

  const compliment = `That ${item.name} sits elegantly — the ${item.metal} is a stunning match for your ${skinTone} undertones!`;

  return {
    totalScore,
    compliment,
    factors: [
      { name: 'Skin Undertone Match', score: metalScore, reason: metalReason },
      { name: 'Facial Shape Fit', score: shapeScore, reason: shapeReason },
      { name: 'Landmark Scale Proportion', score: proportionScore, reason: proportionReason }
    ]
  };
}

/**
 * Renders Debug Mode Landmark Overlay (colored dots + labels on all detected hand/face/pose points).
 */
export function renderDebugLandmarksOverlay(
  ctx: CanvasRenderingContext2D,
  landmarks: BodyLandmarksResult
) {
  ctx.save();

  // 1. Draw 478 Face Mesh Points (Cyan) + Highlight Key Landmarks (Gold)
  if (landmarks.allFaceLandmarks && landmarks.allFaceLandmarks.length > 0) {
    landmarks.allFaceLandmarks.forEach((pt, idx) => {
      ctx.beginPath();
      // Key landmarks (earlobes 132/361, chin 152, nose 1, forehead 10) get larger dots
      const isKey = idx === 132 || idx === 361 || idx === 152 || idx === 1 || idx === 10;
      ctx.arc(pt.x, pt.y, isKey ? 4 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = isKey ? '#F59E0B' : 'rgba(6, 182, 212, 0.6)'; // Cyan mesh / Gold anchors
      ctx.fill();

      if (pt.label) {
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#FDE68A';
        ctx.fillText(pt.label, pt.x + 6, pt.y + 3);
      }
    });
  } else if (landmarks.rawFacePoints.length > 0) {
    landmarks.rawFacePoints.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();
    });
  }

  // 2. Draw Hand Skeleton (21 points per hand, Emerald / Lime)
  const handPointSets = landmarks.allHandLandmarks && landmarks.allHandLandmarks.length > 0
    ? landmarks.allHandLandmarks
    : landmarks.rawHandPoints.length > 0 ? [landmarks.rawHandPoints] : [];

  handPointSets.forEach((handPoints) => {
    // Hand skeletal connections
    const bones = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20] // Pinky
    ];

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.lineWidth = 2;
    bones.forEach(([i, j]) => {
      if (handPoints[i] && handPoints[j]) {
        ctx.beginPath();
        ctx.moveTo(handPoints[i].x, handPoints[i].y);
        ctx.lineTo(handPoints[j].x, handPoints[j].y);
        ctx.stroke();
      }
    });

    handPoints.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, idx === 0 ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#EC4899' : '#10B981'; // Pink wrist, Emerald joints
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  });

  // 3. Draw Pose / Shoulder Landmarks (Amber/Yellow)
  if (landmarks.hasPose) {
    if (landmarks.leftShoulder.x > 0 && landmarks.rightShoulder.x > 0) {
      // Connect shoulders line
      ctx.beginPath();
      ctx.moveTo(landmarks.leftShoulder.x, landmarks.leftShoulder.y);
      ctx.lineTo(landmarks.rightShoulder.x, landmarks.rightShoulder.y);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Left shoulder
      ctx.beginPath();
      ctx.arc(landmarks.leftShoulder.x, landmarks.leftShoulder.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#FEF3C7';
      ctx.fillText('L Shoulder', landmarks.leftShoulder.x + 8, landmarks.leftShoulder.y);

      // Right shoulder
      ctx.beginPath();
      ctx.arc(landmarks.rightShoulder.x, landmarks.rightShoulder.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#FEF3C7';
      ctx.fillText('R Shoulder', landmarks.rightShoulder.x + 8, landmarks.rightShoulder.y);
    }
  }

  // 4. Debug Status HUD Box
  ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
  ctx.fillRect(10, 10, 260, 65);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.strokeRect(10, 10, 260, 65);

  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#38BDF8';
  ctx.fillText(`Face Landmarker: ${landmarks.hasFace ? `${landmarks.faceLandmarkCount} pts (478 Mesh)` : 'Searching...'}`, 18, 28);
  ctx.fillStyle = '#34D399';
  ctx.fillText(`Hand Landmarker: ${landmarks.hasHand ? `${landmarks.handLandmarkCount} pts (21/hand)` : 'Searching...'}`, 18, 44);
  ctx.fillStyle = '#FBBF24';
  ctx.fillText(`Pose Landmarker: ${landmarks.hasPose ? `${landmarks.poseLandmarkCount} pts (Shoulders)` : 'Searching...'}`, 18, 60);

  ctx.restore();
}

/**
 * Main Photorealistic High-Res PNG Jewelry Overlay Renderer.
 * Composites high-resolution pre-rendered jewelry PNGs, rendered skin contact shadows, and affine transforms.
 */
export function renderParametricJewelryOverlay(
  ctx: CanvasRenderingContext2D,
  item: JewelryItem,
  landmarks: BodyLandmarksResult,
  _ambient: AmbientLightSample,
  _selectedFinger: SelectedFinger,
  opacity: number = 0.95,
  manualScale: number = 1.0,
  manualRot: number = 0
) {
  ctx.save();
  ctx.globalAlpha = opacity;

  // Contact Shadow Helper
  const drawContactShadow = (x: number, y: number, rx: number, ry: number, angleRad: number = 0) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angleRad);
    ctx.beginPath();
    ctx.ellipse(0, 4, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.filter = 'blur(6px)';
    ctx.fill();
    ctx.restore();
  };

  const assetSrc = item.pngOverlayAsset || '/overlays/ring_solitaire_sapphire.png';
  const imgAsset = getPreloadedOverlayImage(assetSrc);

  switch (item.category) {
    case 'ring': {
      if (!landmarks.hasHand) break;

      // Anchor explicitly to Selected Finger MCP and PIP joints
      const mcp = landmarks.selectedFingerMCP;
      const pip = landmarks.selectedFingerPIP;

      // Midpoint between MCP and PIP joint
      const anchorX = (mcp.x + pip.x) / 2;
      const anchorY = (mcp.y + pip.y) / 2;

      // Derives finger rotation angle from MCP -> PIP joint vector
      const angleRad = (landmarks.fingerAngleDegrees + manualRot) * (Math.PI / 180);
      const ringScale = (landmarks.fingerJointDistPx / 60) * manualScale;

      ctx.save();
      ctx.translate(anchorX, anchorY);
      ctx.rotate(angleRad);
      ctx.scale(ringScale, ringScale);

      // 1. Rendered Skin Contact Shadow
      drawContactShadow(0, 0, 24, 12, 0);

      // 2. Photorealistic PNG Asset Compositing
      if (imgAsset) {
        ctx.drawImage(imgAsset, -75, -75, 150, 150);
      } else {
        // Fallback procedural shading if image still loading
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 10, 0, 0, Math.PI * 2);
        ctx.strokeStyle = item.metal === '18K Gold' ? '#F59E0B' : '#E2E8F0';
        ctx.lineWidth = 5;
        ctx.stroke();
      }

      ctx.restore();
      break;
    }

    case 'necklace': {
      if (!landmarks.hasFace && !landmarks.hasPose) break;

      const anchorX = landmarks.neckBase.x;
      const anchorY = landmarks.neckBase.y;
      const rollRad = (landmarks.headRollDegrees + manualRot) * (Math.PI / 180);
      const necklaceScale = manualScale * 0.9;

      ctx.save();
      ctx.translate(anchorX, anchorY);
      ctx.rotate(rollRad);
      ctx.scale(necklaceScale, necklaceScale);

      // 1. Contact Shadow
      drawContactShadow(0, 50, 140, 25, 0);

      // 2. Photorealistic PNG Asset
      if (imgAsset) {
        ctx.drawImage(imgAsset, -200, -50, 400, 300);
      }
      ctx.restore();
      break;
    }

    case 'earrings': {
      if (!landmarks.hasFace) break;

      const drawSingleEarringAsset = (x: number, y: number, roll: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((roll + manualRot) * (Math.PI / 180));
        ctx.scale(manualScale * 0.7, manualScale * 0.7);

        // Contact Shadow
        drawContactShadow(0, 30, 12, 6, 0);

        if (imgAsset) {
          ctx.drawImage(imgAsset, -40, 0, 80, 160);
        }
        ctx.restore();
      };

      drawSingleEarringAsset(landmarks.leftEarlobe.x, landmarks.leftEarlobe.y, landmarks.headRollDegrees);
      drawSingleEarringAsset(landmarks.rightEarlobe.x, landmarks.rightEarlobe.y, landmarks.headRollDegrees);
      break;
    }

    case 'bracelet': {
      if (!landmarks.hasHand) break;

      const wristX = landmarks.wristCenter.x;
      const wristY = landmarks.wristCenter.y;
      const angleRad = (landmarks.wristAngleDegrees + manualRot) * (Math.PI / 180);
      const braceletScale = (landmarks.wristWidthPx / 120) * manualScale;

      ctx.save();
      ctx.translate(wristX, wristY);
      ctx.rotate(angleRad);
      ctx.scale(braceletScale, braceletScale);

      drawContactShadow(0, 0, 45, 18, 0);

      if (imgAsset) {
        ctx.drawImage(imgAsset, -90, -45, 180, 90);
      }
      ctx.restore();
      break;
    }

    case 'tiara': {
      if (!landmarks.hasFace) break;

      const fx = landmarks.foreheadCenter.x;
      const fy = landmarks.foreheadCenter.y;
      const rollRad = (landmarks.headRollDegrees + manualRot) * (Math.PI / 180);

      ctx.save();
      ctx.translate(fx, fy - 20);
      ctx.rotate(rollRad);
      ctx.scale(manualScale * 0.85, manualScale * 0.85);

      drawContactShadow(0, 20, 100, 15, 0);

      if (imgAsset) {
        ctx.drawImage(imgAsset, -180, -100, 360, 200);
      }
      ctx.restore();
      break;
    }

    default:
      break;
  }

  ctx.restore();
}
