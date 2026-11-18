import { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Sliders, RefreshCw, Download, Sparkles, Check, AlertCircle, ShoppingBag, Heart, Layers, ArrowLeftRight, CameraIcon, Eye } from 'lucide-react';
import type { ARPlacement, FaceAnalysisResult, JewelryItem, MultiAngleSnapshots, SelectedFinger, SessionTryOnLog, TransparentMatchBreakdown } from '../types/jewelry';
import { detectFacialFeatures } from '../utils/faceDetection';
import { detectBodyLandmarks, initializeMediaPipeLandmarkers } from '../utils/mediapipeTracking';
import { estimateRingSize, generateTransparentMatchBreakdown, renderDebugLandmarksOverlay, renderParametricJewelryOverlay, sampleAmbientLighting } from '../utils/parametricRenderer';

interface ARTryOnStudioProps {
  selectedItem: JewelryItem;
  catalog: JewelryItem[];
  onSelectItem: (item: JewelryItem) => void;
  onAddToCart: (item: JewelryItem) => void;
  onAddToWishlist: (item: JewelryItem) => void;
  onOpenCompare: (item1: JewelryItem, item2?: JewelryItem) => void;
  onLogTryOnSession?: (log: SessionTryOnLog) => void;
}

const DEMO_MODELS = [
  { id: 'model-1', name: 'Gala Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { id: 'model-2', name: 'Bridal Portrait', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80' },
  { id: 'model-3', name: 'Classic Portrait', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
];

export const ARTryOnStudio: React.FC<ARTryOnStudioProps> = ({
  selectedItem,
  catalog,
  onSelectItem,
  onAddToCart,
  onAddToWishlist,
  onOpenCompare,
  onLogTryOnSession
}) => {
  const [sourceMode, setSourceMode] = useState<'webcam' | 'photo'>('webcam');
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(DEMO_MODELS[0].url);
  const [isMirror, setIsMirror] = useState<boolean>(true);
  const [lightingFilter, setLightingFilter] = useState<'normal' | 'warm' | 'sparkle' | 'studio'>('studio');
  const [selectedFinger, setSelectedFinger] = useState<SelectedFinger>('ring');
  const [debugLandmarks, setDebugLandmarks] = useState<boolean>(false);
  const [landmarkWarning, setLandmarkWarning] = useState<string | null>(null);
  
  // AR Placement fine-tuning state
  const [placement, setPlacement] = useState<ARPlacement>({
    positionX: 0,
    positionY: 0,
    scale: 1.0,
    rotation: 0,
    opacity: 0.95,
    flipHorizontal: false,
    metalToneShift: 0,
    isAutoTracked: true
  });

  // Detection & AI Match state
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysisResult | null>(null);
  const [matchBreakdown, setMatchBreakdown] = useState<TransparentMatchBreakdown | null>(null);
  const [ringSizeEst, setRingSizeEst] = useState<string | null>(null);
  const [snapshotTaken, setSnapshotTaken] = useState<string | null>(null);
  const [multiAngleSnapshots, setMultiAngleSnapshots] = useState<MultiAngleSnapshots>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const tryOnStartTimeRef = useRef<number>(Date.now());

  // Initialize MediaPipe Tasks Vision client-side
  useEffect(() => {
    initializeMediaPipeLandmarkers().then((success) => {
      if (success) {
        console.log('MediaPipe Landmarkers initialized client-side.');
      }
    });
  }, []);

  // Initialize camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (sourceMode === 'webcam') {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } })
        .then((s) => {
          stream = s;
          setCameraPermission('granted');
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.warn('Webcam permission error:', err);
          setCameraPermission('denied');
          setSourceMode('photo');
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [sourceMode]);

  // Continuous Tracking & Parametric Render Loop
  useEffect(() => {
    let isSubscribed = true;
    tryOnStartTimeRef.current = Date.now();

    const renderLoop = (timestamp: number) => {
      if (!isSubscribed) return;

      const video = videoRef.current;
      const canvas = overlayCanvasRef.current;

      if (canvas) {
        const width = canvas.width || 640;
        const height = canvas.height || 480;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.clearRect(0, 0, width, height);

          let source: HTMLVideoElement | HTMLImageElement | null = null;

          if (sourceMode === 'webcam' && video && video.readyState === 4) {
            source = video;
            if (video.videoWidth && video.videoHeight) {
              if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
              }
            }
          } else if (sourceMode === 'photo' && uploadedPhoto) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = uploadedPhoto;
            source = img;
          }

          if (source) {
            // 1. Detect facial analysis metrics
            const { analysis } = detectFacialFeatures(source, width, height);
            setFaceAnalysis(analysis);

            // 2. Detect Body/Hand/Pose landmarks
            const bMarks = detectBodyLandmarks(source, timestamp, selectedFinger, width, height);

            // Landmark Audit & Bailout Check
            let warning: string | null = null;
            if (selectedItem.category === 'ring' || selectedItem.category === 'bracelet') {
              if (!bMarks.hasHand) {
                warning = selectedItem.category === 'ring'
                  ? '🖐️ Please show your hand to the camera to position ring'
                  : '🖐️ Please show your wrist to the camera';
              }
            } else if (selectedItem.category === 'necklace' || selectedItem.category === 'earrings' || selectedItem.category === 'tiara') {
              if (!bMarks.hasFace) {
                warning = '👤 Please face the camera to align jewelry';
              }
            }
            setLandmarkWarning(warning);

            // 3. Sample Ambient Lighting
            const ambient = sampleAmbientLighting(ctx, width, height);

            // 4. Render Photorealistic Overlay
            renderParametricJewelryOverlay(
              ctx,
              selectedItem,
              bMarks,
              ambient,
              selectedFinger,
              placement.opacity,
              placement.scale,
              placement.rotation
            );

            // 5. Render Debug Landmark Overlay if enabled
            if (debugLandmarks) {
              renderDebugLandmarksOverlay(ctx, bMarks);
            }

            // 6. Update Ring Size Estimate for Ring category
            if (selectedItem.category === 'ring') {
              const est = estimateRingSize(bMarks.fingerWidthPx);
              setRingSizeEst(est.ringSizeBand);
            }

            // 7. Compute Transparent AI Match Breakdown
            if (analysis) {
              const breakdown = generateTransparentMatchBreakdown(
                selectedItem,
                analysis.faceShape,
                analysis.skinTone
              );
              setMatchBreakdown(breakdown);
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop(performance.now());

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Log Session Try-On duration
      const durationSec = Math.round((Date.now() - tryOnStartTimeRef.current) / 1000);
      if (onLogTryOnSession && durationSec > 2) {
        onLogTryOnSession({
          itemId: selectedItem.id,
          itemName: selectedItem.name,
          category: selectedItem.category,
          timestamp: new Date().toLocaleTimeString(),
          durationSec,
          matchScore: matchBreakdown ? matchBreakdown.totalScore : 95
        });
      }
    };
  }, [selectedItem, sourceMode, uploadedPhoto, selectedFinger, placement]);

  // Handle photo file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhoto(event.target.result as string);
          setSourceMode('photo');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-calibrate Landmark Offset on AI Auto-Align button click
  const handleRecalibrateLandmarks = () => {
    setPlacement({
      positionX: 0,
      positionY: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 0.95,
      flipHorizontal: false,
      metalToneShift: 0,
      isAutoTracked: true
    });
  };

  // Multi-Angle Snapshot Capture (Front, 3/4, Side)
  const handleCaptureMultiAngle = (angle: 'front' | 'threeQuarter' | 'side') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    if (sourceMode === 'webcam' && videoRef.current) {
      if (isMirror) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      if (isMirror) ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else if (uploadedPhoto) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = uploadedPhoto;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    if (overlayCanvasRef.current) {
      ctx.drawImage(overlayCanvasRef.current, 0, 0, canvas.width, canvas.height);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setMultiAngleSnapshots(prev => ({ ...prev, [angle]: dataUrl }));
  };

  // Capture Clean High-Res Export Card Still
  const handleTakeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    if (sourceMode === 'webcam' && videoRef.current) {
      if (isMirror) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      if (isMirror) ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else if (uploadedPhoto) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = uploadedPhoto;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    if (overlayCanvasRef.current) {
      ctx.drawImage(overlayCanvasRef.current, 0, 0, canvas.width, canvas.height);
    }

    // Branding Frame
    ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
    ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

    ctx.font = 'bold 24px serif';
    ctx.fillStyle = '#FCD34D';
    ctx.fillText('AURA LUXE AI AR TRY-ON', 40, canvas.height - 30);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(`Tried on: ${selectedItem.name} | ${new Date().toLocaleDateString()}`, 450, canvas.height - 30);

    const dataUrl = canvas.toDataURL('image/png');
    setSnapshotTaken(dataUrl);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 bg-[#131B2E] p-4 rounded-2xl border border-amber-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <h1 className="text-xl font-serif font-bold text-amber-100">MediaPipe AI AR Virtual Try-On Studio</h1>
          </div>
          <p className="text-xs text-amber-200/60 mt-0.5">Real-time 478-point body landmarking, parametric vector shading, & lighting-adaptive metal highlights</p>
        </div>

        {/* Mode Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setSourceMode('webcam')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              sourceMode === 'webcam'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'bg-[#0B0F19] text-amber-200/80 hover:bg-amber-500/10 border border-amber-500/20'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => {
              setSourceMode('photo');
              fileInputRef.current?.click();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              sourceMode === 'photo'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'bg-[#0B0F19] text-amber-200/80 hover:bg-amber-500/10 border border-amber-500/20'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => onOpenCompare(selectedItem)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0B0F19] text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Compare Look</span>
          </button>

          <button
            onClick={handleTakeSnapshot}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>AR Export Card</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive MediaPipe AR Viewport (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="relative w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl group">
            
            {/* Live Video Stream */}
            {sourceMode === 'webcam' && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isMirror ? 'scale-x-[-1]' : ''}`}
              />
            )}

            {/* Static Photo Mode */}
            {sourceMode === 'photo' && uploadedPhoto && (
              <img
                src={uploadedPhoto}
                alt="Try-On Model"
                className="w-full h-full object-cover"
              />
            )}

            {/* PARAMETRIC LAYERED CANVAS GRAPHICS OVERLAY */}
            <canvas
              ref={overlayCanvasRef}
              width={640}
              height={480}
              className={`absolute inset-0 w-full h-full pointer-events-none object-cover ${isMirror && sourceMode === 'webcam' ? 'scale-x-[-1]' : ''}`}
            />

            {/* Snapshot Base Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Tracking Status Indicator Badge */}
            {faceAnalysis && (
              <div className="absolute top-4 left-4 bg-[#0B0F19]/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-medium">MediaPipe 478 Mesh: {faceAnalysis.faceShape}</span>
                <span className="text-amber-400/60">|</span>
                <span className="text-amber-300 font-semibold">{faceAnalysis.skinTone}</span>
              </div>
            )}

            {/* Selected Product Tag Badge */}
            <div className="absolute top-4 right-4 bg-[#0B0F19]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs flex items-center gap-2">
              <span className="text-amber-400 font-serif font-bold">{selectedItem.name}</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full uppercase font-sans">
                ${selectedItem.price.toLocaleString()}
              </span>
            </div>

            {/* Ring Category: Finger Selector Bar Overlay */}
            {selectedItem.category === 'ring' && (
              <div className="absolute top-16 right-4 bg-[#0B0F19]/90 backdrop-blur-md p-2 rounded-xl border border-amber-500/30 text-xs flex items-center gap-1.5 shadow-xl">
                <span className="text-amber-200/60 text-[11px] mr-1">Finger:</span>
                {(['index', 'middle', 'ring', 'pinky'] as const).map((finger) => (
                  <button
                    key={finger}
                    onClick={() => setSelectedFinger(finger)}
                    className={`px-2 py-1 rounded-lg text-[10px] capitalize transition-all ${
                      selectedFinger === finger
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                        : 'text-amber-200/60 hover:text-amber-200'
                    }`}
                  >
                    {finger}
                  </button>
                ))}
              </div>
            )}

            {/* Landmark Audit Bailout Warning Banner */}
            {landmarkWarning && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-amber-500/90 backdrop-blur-md text-amber-950 font-semibold px-4 py-2 rounded-full shadow-lg border border-amber-300 flex items-center gap-2 animate-pulse z-30 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-950" />
                <span>{landmarkWarning}</span>
              </div>
            )}

            {/* Bottom Floating AR Toolbar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0B0F19]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-500/30 flex items-center gap-3 shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsMirror(!isMirror)}
                className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                  isMirror ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-amber-200/70 hover:text-amber-200'
                }`}
                title="Toggle Mirror View"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Mirror</span>
              </button>

              <div className="w-px h-4 bg-amber-500/20" />

              <button
                onClick={() => setDebugLandmarks(!debugLandmarks)}
                className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                  debugLandmarks ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-bold' : 'text-amber-200/70 hover:text-amber-200'
                }`}
                title="Toggle Landmark Debug Overlay Points"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Debug Points</span>
              </button>

              <div className="w-px h-4 bg-amber-500/20" />

              <button
                onClick={handleRecalibrateLandmarks}
                className="p-2 rounded-lg text-xs flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 transition-colors"
                title="Re-calibrate landmark scaling & position center"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Auto-Align</span>
              </button>

              <div className="w-px h-4 bg-amber-500/20" />

              {/* Lighting filter options */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-amber-200/50 text-[11px] mr-1">Lighting:</span>
                {(['studio', 'warm', 'sparkle'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setLightingFilter(filter)}
                    className={`px-2 py-1 rounded-md text-[10px] capitalize transition-all ${
                      lightingFilter === filter ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-200/60 hover:text-amber-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Permission Warning */}
            {sourceMode === 'webcam' && cameraPermission === 'denied' && (
              <div className="absolute inset-0 bg-[#0B0F19]/90 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
                <h3 className="text-lg font-serif font-bold text-amber-100">Camera Access Disabled</h3>
                <p className="text-xs text-amber-200/70 max-w-sm mt-1 mb-4">
                  Please enable camera permission in your browser or choose a portrait preset to preview jewelry.
                </p>
                <button
                  onClick={() => setSourceMode('photo')}
                  className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Use Preset Models
                </button>
              </div>
            )}

          </div>

          {/* Multi-Angle Capture Panel (Front, 3/4, Side) */}
          <div className="bg-[#131B2E] p-4 rounded-2xl border border-amber-500/20 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-200 uppercase tracking-widest flex items-center gap-2">
                <CameraIcon className="w-4 h-4 text-amber-400" />
                Multi-Angle Snapshot Capture
              </span>
              <span className="text-[11px] text-amber-200/60">Turn head/wrist to capture 3 views</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(['front', 'threeQuarter', 'side'] as const).map((angle) => (
                <div key={angle} className="bg-[#0B0F19] p-2 rounded-xl border border-amber-500/20 flex flex-col gap-2">
                  <div className="relative aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                    {multiAngleSnapshots[angle] ? (
                      <img src={multiAngleSnapshots[angle]} alt={angle} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] text-amber-200/40 capitalize">{angle} View</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCaptureMultiAngle(angle)}
                    className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold rounded-lg border border-amber-500/30 transition-colors capitalize"
                  >
                    Capture {angle}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Jewelry Quick Selection Carousel */}
          <div className="bg-[#131B2E] p-4 rounded-2xl border border-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-200 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Expanded Catalog ({catalog.length} Products)
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {catalog.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`flex-shrink-0 w-36 bg-[#0B0F19] p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedItem.id === item.id
                      ? 'border-amber-400 ring-2 ring-amber-400/40 bg-amber-500/10'
                      : 'border-amber-500/20 hover:border-amber-500/50'
                  }`}
                >
                  <div className="w-full h-24 bg-slate-900 rounded-lg overflow-hidden mb-2 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    {selectedItem.id === item.id && (
                      <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-medium text-amber-100 truncate">{item.name}</h4>
                  <p className="text-[11px] font-bold text-amber-400 mt-0.5">${item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Fine-Tuning & Transparent Match Insights (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Item Specs & Actions */}
          <div className="bg-[#131B2E] p-5 rounded-3xl border border-amber-500/20 shadow-xl flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                <span>{selectedItem.category}</span>
                <span>•</span>
                <span>{selectedItem.metal}</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-amber-100">{selectedItem.name}</h2>
              <p className="text-2xl font-bold text-amber-400 mt-2">${selectedItem.price.toLocaleString()}</p>
            </div>

            <p className="text-xs text-amber-200/70 leading-relaxed">{selectedItem.description}</p>

            {/* Smart Size Estimator Badge */}
            {ringSizeEst && selectedItem.category === 'ring' && (
              <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between">
                <span className="text-amber-200/70">AI Ring Size Estimator:</span>
                <span className="text-amber-300 font-bold">{ringSizeEst}</span>
              </div>
            )}

            {/* Specs List */}
            <div className="bg-[#0B0F19] p-3.5 rounded-2xl border border-amber-500/10 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-amber-200/60">Metal Purity:</span>
                <span className="text-amber-200 font-medium">{selectedItem.specs.metalPurity}</span>
              </div>
              {selectedItem.caratWeight && (
                <div className="flex justify-between">
                  <span className="text-amber-200/60">Gem Carats:</span>
                  <span className="text-amber-200 font-medium">{selectedItem.caratWeight}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-amber-200/60">Total Weight:</span>
                <span className="text-amber-200 font-medium">{selectedItem.totalWeightGrams}g</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart(selectedItem)}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => onAddToWishlist(selectedItem)}
                className="p-3 bg-[#0B0F19] border border-amber-500/30 hover:border-amber-400 text-rose-400 rounded-2xl text-xs transition-colors"
                title="Add to Wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Transparent AI Match Breakdown & Compliment Panel */}
          {matchBreakdown && (
            <div className="bg-[#131B2E] p-5 rounded-3xl border border-amber-500/20 shadow-xl flex flex-col gap-3">
              <h3 className="text-sm font-serif font-bold text-amber-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AI Smart Fit Compliment
                </span>
                <span className="text-emerald-400 font-bold">{matchBreakdown.totalScore}% Fit Match</span>
              </h3>

              {/* Compliment Quote */}
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed italic">
                "{matchBreakdown.compliment}"
              </div>

              {/* Transparent Factors List */}
              <div className="space-y-2 mt-1">
                <span className="text-[11px] font-bold text-amber-200/50 uppercase tracking-wider">Transparent Match Factors:</span>
                {matchBreakdown.factors.map((factor, idx) => (
                  <div key={idx} className="bg-[#0B0F19] p-2.5 rounded-xl border border-amber-500/10 text-xs">
                    <div className="flex justify-between font-semibold text-amber-200 mb-0.5">
                      <span>{factor.name}</span>
                      <span className="text-amber-400">{factor.score}%</span>
                    </div>
                    <p className="text-[11px] text-amber-200/60">{factor.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Precision Placement Sliders Panel */}
          <div className="bg-[#131B2E] p-5 rounded-3xl border border-amber-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Manual Precision Controls
              </h3>
              <button
                onClick={handleRecalibrateLandmarks}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-amber-200/70 mb-1">
                  <span>Horizontal Offset (X)</span>
                  <span>{placement.positionX}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  value={placement.positionX}
                  onChange={(e) => setPlacement({ ...placement, positionX: Number(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-amber-200/70 mb-1">
                  <span>Vertical Offset (Y)</span>
                  <span>{placement.positionY}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  value={placement.positionY}
                  onChange={(e) => setPlacement({ ...placement, positionY: Number(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-amber-200/70 mb-1">
                  <span>Jewelry Size / Scale</span>
                  <span>{(placement.scale * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.05"
                  value={placement.scale}
                  onChange={(e) => setPlacement({ ...placement, scale: Number(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-amber-200/70 mb-1">
                  <span>Angle Rotation</span>
                  <span>{placement.rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={placement.rotation}
                  onChange={(e) => setPlacement({ ...placement, rotation: Number(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Snapshot Preview Modal */}
      {snapshotTaken && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131B2E] border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-amber-100 mb-4 flex items-center justify-between">
              <span>Clean High-Res Export Card</span>
              <button onClick={() => setSnapshotTaken(null)} className="text-amber-200/60 hover:text-amber-100">✕</button>
            </h3>

            <div className="rounded-2xl overflow-hidden mb-6 border border-amber-500/20">
              <img src={snapshotTaken} alt="Try On Snapshot" className="w-full h-auto object-cover" />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSnapshotTaken(null)}
                className="px-4 py-2.5 bg-[#0B0F19] text-amber-200 text-xs font-semibold rounded-xl border border-amber-500/20"
              >
                Close
              </button>

              <a
                href={snapshotTaken}
                download={`AuraLuxe_TryOn_${selectedItem.name.replace(/\s+/g, '_')}.png`}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Save High-Res Image</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
