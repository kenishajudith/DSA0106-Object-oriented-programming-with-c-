import { FilesetResolver, FaceLandmarker, HandLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';
import type { SelectedFinger } from '../types/jewelry';

export interface TrackingPoint {
  x: number;
  y: number;
  z?: number;
  label?: string;
}

export interface BodyLandmarksResult {
  hasFace: boolean;
  hasHand: boolean;
  hasPose: boolean;
  handLandmarkCount: number;
  faceLandmarkCount: number;
  poseLandmarkCount: number;
  trackingConfidence: number; // 0.0 to 1.0

  // 1. Face landmarks
  leftEarlobe: TrackingPoint;
  rightEarlobe: TrackingPoint;
  foreheadCenter: TrackingPoint;
  chinTip: TrackingPoint;
  nostrilCenter: TrackingPoint;
  headRollDegrees: number;
  headYawRatio: number; // -1 to +1

  // 2. Pose/Neck landmarks
  leftShoulder: TrackingPoint;
  rightShoulder: TrackingPoint;
  neckBase: TrackingPoint;

  // 3. Hand landmarks (for selected finger & wrist)
  selectedFingerMCP: TrackingPoint;
  selectedFingerPIP: TrackingPoint;
  selectedFingerTip: TrackingPoint;
  fingerAngleDegrees: number;
  fingerJointDistPx: number;
  fingerWidthPx: number;
  wristCenter: TrackingPoint;
  wristWidthPx: number;
  wristAngleDegrees: number;

  // Raw arrays for Debug Landmark Overlay
  rawHandPoints: TrackingPoint[];
  rawFacePoints: TrackingPoint[];
  rawPosePoints: TrackingPoint[];
  allFaceLandmarks: TrackingPoint[];
  allHandLandmarks: TrackingPoint[][];
  allPoseLandmarks: TrackingPoint[];
}

let faceLandmarker: FaceLandmarker | null = null;
let handLandmarker: HandLandmarker | null = null;
let poseLandmarker: PoseLandmarker | null = null;
let isInitializing = false;
let isInitialized = false;

let lastFaceTimestamp = 0;
let lastHandTimestamp = 0;
let lastPoseTimestamp = 0;

/**
 * Initializes MediaPipe Tasks Vision Landmarkers client-side.
 */
export async function initializeMediaPipeLandmarkers(): Promise<boolean> {
  if (isInitialized) return true;
  if (isInitializing) return false;
  isInitializing = true;

  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    // Initialize FaceLandmarker
    try {
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numFaces: 1
      });
    } catch {
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'CPU'
        },
        runningMode: 'VIDEO',
        numFaces: 1
      });
    }

    // Initialize HandLandmarker
    try {
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 2
      });
    } catch {
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'CPU'
        },
        runningMode: 'VIDEO',
        numHands: 2
      });
    }

    // Initialize PoseLandmarker
    try {
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numPoses: 1
      });
    } catch {
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'CPU'
        },
        runningMode: 'VIDEO',
        numPoses: 1
      });
    }

    isInitialized = true;
    isInitializing = false;
    return true;
  } catch (err) {
    console.warn('MediaPipe WASM load notice:', err);
    isInitializing = false;
    return false;
  }
}

/**
 * Detects real multi-part landmarks for face, neck, wrist, and selected finger.
 */
export function detectBodyLandmarks(
  source: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement,
  timestamp: number,
  selectedFinger: SelectedFinger = 'ring',
  canvasWidth: number = 640,
  canvasHeight: number = 480
): BodyLandmarksResult {
  const result: BodyLandmarksResult = {
    hasFace: false,
    hasHand: false,
    hasPose: false,
    handLandmarkCount: 0,
    faceLandmarkCount: 0,
    poseLandmarkCount: 0,
    trackingConfidence: 0.95,
    leftEarlobe: { x: 0, y: 0 },
    rightEarlobe: { x: 0, y: 0 },
    foreheadCenter: { x: 0, y: 0 },
    chinTip: { x: 0, y: 0 },
    nostrilCenter: { x: 0, y: 0 },
    headRollDegrees: 0,
    headYawRatio: 0,
    leftShoulder: { x: 0, y: 0 },
    rightShoulder: { x: 0, y: 0 },
    neckBase: { x: 0, y: 0 },
    selectedFingerMCP: { x: 0, y: 0 },
    selectedFingerPIP: { x: 0, y: 0 },
    selectedFingerTip: { x: 0, y: 0 },
    fingerAngleDegrees: 0,
    fingerJointDistPx: 25,
    fingerWidthPx: 20,
    wristCenter: { x: 0, y: 0 },
    wristWidthPx: 70,
    wristAngleDegrees: 0,
    rawHandPoints: [],
    rawFacePoints: [],
    rawPosePoints: [],
    allFaceLandmarks: [],
    allHandLandmarks: [],
    allPoseLandmarks: []
  };

  // 1. Process FaceLandmarker
  if (faceLandmarker && source instanceof HTMLVideoElement && source.readyState === 4) {
    try {
      const faceTs = Math.max(lastFaceTimestamp + 1, Math.round(timestamp));
      lastFaceTimestamp = faceTs;
      const faceResult = faceLandmarker.detectForVideo(source, faceTs);
      if (faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0) {
        const marks = faceResult.faceLandmarks[0];
        result.hasFace = true;
        result.faceLandmarkCount = marks.length;

        // All 478 face landmarks
        result.allFaceLandmarks = marks.map((p, idx) => ({
          x: p.x * canvasWidth,
          y: p.y * canvasHeight,
          z: p.z,
          label: idx === 132 ? 'L Ear' : idx === 361 ? 'R Ear' : idx === 1 ? 'Nose' : idx === 152 ? 'Chin' : undefined
        }));

        // Sample raw face points for backward compatibility
        result.rawFacePoints = [132, 361, 10, 152, 1].map((idx) => {
          const p = marks[idx];
          return { x: p.x * canvasWidth, y: p.y * canvasHeight, label: `Face ${idx}` };
        });

        const leftEar = marks[132] || marks[234];
        const rightEar = marks[361] || marks[454];
        const forehead = marks[10];
        const chin = marks[152];
        const nose = marks[1];

        if (leftEar) result.leftEarlobe = { x: leftEar.x * canvasWidth, y: leftEar.y * canvasHeight, z: leftEar.z };
        if (rightEar) result.rightEarlobe = { x: rightEar.x * canvasWidth, y: rightEar.y * canvasHeight, z: rightEar.z };
        if (forehead) result.foreheadCenter = { x: forehead.x * canvasWidth, y: forehead.y * canvasHeight, z: forehead.z };
        if (chin) result.chinTip = { x: chin.x * canvasWidth, y: chin.y * canvasHeight, z: chin.z };
        if (nose) result.nostrilCenter = { x: nose.x * canvasWidth, y: nose.y * canvasHeight, z: nose.z };

        const dx = result.rightEarlobe.x - result.leftEarlobe.x;
        const dy = result.rightEarlobe.y - result.leftEarlobe.y;
        result.headRollDegrees = Math.atan2(dy, dx) * (180 / Math.PI);

        result.neckBase = {
          x: result.chinTip.x,
          y: result.chinTip.y + canvasHeight * 0.12
        };
      }
    } catch {
      // Fallback
    }
  }

  // 2. Process HandLandmarker (Strict 21-point multi-hand model)
  if (handLandmarker && source instanceof HTMLVideoElement && source.readyState === 4) {
    try {
      const handTs = Math.max(lastHandTimestamp + 1, Math.round(timestamp));
      lastHandTimestamp = handTs;
      const handResult = handLandmarker.detectForVideo(source, handTs);

      if (handResult.landmarks && handResult.landmarks.length > 0) {
        result.hasHand = true;
        result.handLandmarkCount = handResult.landmarks.reduce((acc, h) => acc + h.length, 0);

        // Store all hands (up to 2 hands, 21 points each)
        result.allHandLandmarks = handResult.landmarks.map((hand) =>
          hand.map((p) => ({
            x: p.x * canvasWidth,
            y: p.y * canvasHeight,
            z: p.z
          }))
        );

        const hand = handResult.landmarks[0];

        // Export raw 21 hand points for Debug Mode
        const jointNames = ['Wrist', 'Thumb CMC', 'Thumb MCP', 'Thumb IP', 'Thumb Tip',
          'Index MCP', 'Index PIP', 'Index DIP', 'Index Tip',
          'Middle MCP', 'Middle PIP', 'Middle DIP', 'Middle Tip',
          'Ring MCP', 'Ring PIP', 'Ring DIP', 'Ring Tip',
          'Pinky MCP', 'Pinky PIP', 'Pinky DIP', 'Pinky Tip'];

        result.rawHandPoints = hand.map((p, idx) => ({
          x: p.x * canvasWidth,
          y: p.y * canvasHeight,
          z: p.z,
          label: jointNames[idx] || `H${idx}`
        }));

        const wrist = hand[0];
        result.wristCenter = { x: wrist.x * canvasWidth, y: wrist.y * canvasHeight, z: wrist.z };

        // Finger landmark mapping (MCP -> PIP -> Tip)
        const fingerIndices: Record<SelectedFinger, { mcp: number; pip: number; tip: number }> = {
          index: { mcp: 5, pip: 6, tip: 8 },
          middle: { mcp: 9, pip: 10, tip: 12 },
          ring: { mcp: 13, pip: 14, tip: 16 },
          pinky: { mcp: 17, pip: 18, tip: 20 }
        };

        const target = fingerIndices[selectedFinger];
        const mcpPt = hand[target.mcp];
        const pipPt = hand[target.pip];
        const tipPt = hand[target.tip];

        if (mcpPt && pipPt) {
          result.selectedFingerMCP = { x: mcpPt.x * canvasWidth, y: mcpPt.y * canvasHeight, z: mcpPt.z };
          result.selectedFingerPIP = { x: pipPt.x * canvasWidth, y: pipPt.y * canvasHeight, z: pipPt.z };
          if (tipPt) result.selectedFingerTip = { x: tipPt.x * canvasWidth, y: tipPt.y * canvasHeight, z: tipPt.z };

          // Vector from MCP to PIP joint (proximal -> distal)
          const dx = result.selectedFingerPIP.x - result.selectedFingerMCP.x;
          const dy = result.selectedFingerPIP.y - result.selectedFingerMCP.y;

          result.fingerAngleDegrees = Math.atan2(dy, dx) * (180 / Math.PI);
          result.fingerJointDistPx = Math.hypot(dx, dy);
          result.fingerWidthPx = Math.max(16, result.fingerJointDistPx * 0.55);
        }

        // Wrist angle and width
        const indexMcp = hand[5];
        const pinkyMcp = hand[17];
        if (indexMcp && pinkyMcp) {
          const wdx = (pinkyMcp.x - indexMcp.x) * canvasWidth;
          const wdy = (pinkyMcp.y - indexMcp.y) * canvasHeight;
          result.wristWidthPx = Math.hypot(wdx, wdy) * 1.15;
          result.wristAngleDegrees = Math.atan2(wdy, wdx) * (180 / Math.PI);
        }
      }
    } catch {
      // Fallback
    }
  }

  // 3. Process PoseLandmarker for shoulder alignment
  if (poseLandmarker && source instanceof HTMLVideoElement && source.readyState === 4) {
    try {
      const poseTs = Math.max(lastPoseTimestamp + 1, Math.round(timestamp));
      lastPoseTimestamp = poseTs;
      const poseResult = poseLandmarker.detectForVideo(source, poseTs);
      if (poseResult.landmarks && poseResult.landmarks.length > 0) {
        result.hasPose = true;
        result.poseLandmarkCount = poseResult.landmarks[0].length;
        const pose = poseResult.landmarks[0];

        result.allPoseLandmarks = pose.map((p) => ({
          x: p.x * canvasWidth,
          y: p.y * canvasHeight,
          z: p.z
        }));

        const ls = pose[11];
        const rs = pose[12];
        if (ls) result.leftShoulder = { x: ls.x * canvasWidth, y: ls.y * canvasHeight, z: ls.z };
        if (rs) result.rightShoulder = { x: rs.x * canvasWidth, y: rs.y * canvasHeight, z: rs.z };
      }
    } catch {
      // Fallback
    }
  }

  return result;
}
