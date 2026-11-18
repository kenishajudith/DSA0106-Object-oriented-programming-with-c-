# Convert AI Virtual Jewelry Try-On & E-Commerce Platform to C++ (Native + WebAssembly)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the entire AI Virtual Jewelry Try-On and E-Commerce platform to high-performance C++20 with full functional parity, supporting both native compilation (MSVC/CMake) and WebAssembly (WASM via Emscripten).

**Architecture:** The core logic, computer vision algorithms, AI recommendation engine, conversational NLP stylist, review sentiment analyzer, parametric overlay calculations, and store/cart/session managers are migrated to a modular, object-oriented C++20 architecture under `cpp/`. Emscripten Embind bindings (`cpp/src/wasm_bindings.cpp`) expose the C++ classes to the browser environment, and a TypeScript bridge connects the frontend with the C++ engine. A native C++ test suite and runner (`cpp/src/main.cpp`) validates 100% of the logic natively.

**Tech Stack:** C++20, CMake, MSVC / GCC / Clang, Emscripten (Embind / WASM), React 19, TypeScript, Vite.

---

### Task 1: Core C++ Domain Models & Types (`cpp/include/jewelry_types.hpp`)
**Files:**
- Create: `cpp/include/jewelry_types.hpp`
- Test: `cpp/src/main.cpp`

**Step 1: Write C++ header with all types, enums, structures, and JSON serialization helpers**
Define `JewelryCategory`, `MetalType`, `GemstoneType`, `StyleType`, `FaceShape`, `SkinTone`, `OccasionTag`, `SelectedFinger`, `JewelryItem`, `Review`, `FaceAnalysisResult`, `BodyLandmarksResult`, `ARPlacement`, `AmbientLightSample`, `CartItem`, `ProductSentimentSummary`, `TransparentMatchBreakdown`, and `SessionTryOnLog`.

---

### Task 2: Computer Vision & Feature Detection Engine (`cpp/include/vision_engine.hpp` & `cpp/src/vision_engine.cpp`)
**Files:**
- Create: `cpp/include/vision_engine.hpp`
- Create: `cpp/src/vision_engine.cpp`
- Test: `cpp/src/main.cpp`

**Step 1: Implement pixel-level skin tone detection (YCbCr / RGB variance, undertone classification into Warm Gold, Cool Silver, Neutral Rosé, hex string generation)**
**Step 2: Implement facial aspect ratio calculation, face shape determination (Oval, Round, Heart, Square, Diamond), and metal/style recommendation mapping**
**Step 3: Implement multi-part landmark geometric math (earlobe angles, roll degrees, yaw ratio, finger MCP-to-PIP vectors, finger width, US ring size estimation, wrist angle/width)**
**Step 4: Implement ambient lighting sampler (luminance, color temperature, highlight shift)**

---

### Task 3: Parametric AR Overlay & Math Engine (`cpp/include/parametric_renderer.hpp` & `cpp/src/parametric_renderer.cpp`)
**Files:**
- Create: `cpp/include/parametric_renderer.hpp`
- Create: `cpp/src/parametric_renderer.cpp`
- Test: `cpp/src/main.cpp`

**Step 1: Implement transform matrix & affine calculations for each jewelry category (ring, necklace, earrings, tiara, bracelet)**
**Step 2: Implement contact shadow calculations (offset, blur radius, rotation)**
**Step 3: Implement transparent match breakdown generator (3-factor scoring: undertone, face shape, landmark scale, plus personalized compliment generator)**

---

### Task 4: AI Recommendation Engine (`cpp/include/recommendation_engine.hpp` & `cpp/src/recommendation_engine.cpp`)
**Files:**
- Create: `cpp/include/recommendation_engine.hpp`
- Create: `cpp/src/recommendation_engine.cpp`
- Test: `cpp/src/main.cpp`

**Step 1: Implement `getAIRecommendations` scoring based on skin undertone, face shape, best-seller status, and category weights**
**Step 2: Implement `getSimilarProducts` multi-attribute distance ranking**

---

### Task 5: Conversational AI Stylist Engine ("Aura") (`cpp/include/stylist_engine.hpp` & `cpp/src/stylist_engine.cpp`)
**Files:**
- Create: `cpp/include/stylist_engine.hpp`
- Create: `cpp/src/stylist_engine.cpp`
- Test: `cpp/src/main.cpp`

**Step 1: Implement query tokenization and intent classifier for event occasions (bridal, wedding, festive, gala), dress colors (emerald, rose, sapphire), and metal preferences**
**Step 2: Implement response generator with curated jewelry recommendations**

---

### Task 6: NLP Sentiment Analysis & Review Analytics (`cpp/include/sentiment_engine.hpp` & `cpp/src/sentiment_engine.cpp`)
**Files:**
- Create: `cpp/include/sentiment_engine.hpp`
- Create: `cpp/src/sentiment_engine.cpp`
- Test: `cpp/src/main.cpp`

**Step 1: Implement lexical sentiment analyzer with positive/negative dictionaries and score normalization (0-100)**
**Step 2: Implement aggregate sentiment summary generator (positive/neutral/negative percentage distribution, pros/cons extraction, aspect scores, AI summary text)**

---

### Task 7: Store Manager & Catalog Database (`cpp/include/store_manager.hpp` & `cpp/src/store_manager.cpp`)
**Files:**
- Create: `cpp/include/store_manager.hpp`
- Create: `cpp/src/store_manager.cpp`
- Test: `cpp/src/main.cpp`

**Step 1: Implement complete catalog initialization with all jewelry items and specs**
**Step 2: Implement search query matcher and multi-attribute filters (category, metal, gemstone, max price, sorting)**
**Step 3: Implement cart operations (add, update, remove, clear, subtotal/tax/total)**
**Step 4: Implement wishlist and session try-on log tracking**

---

### Task 8: Standalone Native C++ Application & Test Runner (`cpp/src/main.cpp` & `CMakeLists.txt`)
**Files:**
- Create: `cpp/src/main.cpp`
- Create: `CMakeLists.txt`
- Create: `build_native.bat`
- Test: Run native compilation with MSVC / CMake to verify 100% test pass

**Step 1: Write test harness exercising all vision, recommendation, stylist, sentiment, store, and rendering modules**
**Step 2: Configure CMakeLists.txt and compile with MSVC**
**Step 3: Execute native binary and verify all test outputs**

---

### Task 9: WebAssembly Emscripten Bindings & Web Integration (`cpp/src/wasm_bindings.cpp`, `src/utils/cppEngineBridge.ts`)
**Files:**
- Create: `cpp/src/wasm_bindings.cpp`
- Create: `src/utils/cppEngineBridge.ts`
- Modify: `src/App.tsx` or components to use C++ Engine Bridge
- Create: `build_wasm.bat` and documentation

**Step 1: Write Embind bindings exposing C++ classes to JavaScript / WebAssembly**
**Step 2: Implement TypeScript bridge with seamless fallback and full parity**
**Step 3: Build and test end-to-end**

