@echo off
setlocal
echo ======================================================
echo Compiling Aura Core Engine to WebAssembly via Emscripten
echo ======================================================

where em++ >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Emscripten compiler 'em++' was not found in your PATH.
    echo To build WebAssembly, ensure the Emscripten SDK (emsdk) is active:
    echo   1. git clone https://github.com/emscripten-core/emsdk.git
    echo   2. cd emsdk && emsdk install latest && emsdk activate latest
    echo   3. emsdk_env.bat
    echo   4. Run this script again!
    exit /b 1
)

if not exist public\wasm mkdir public\wasm

em++ -O3 -std=c++20 ^
    -Icpp/include ^
    cpp/src/vision_engine.cpp ^
    cpp/src/parametric_renderer.cpp ^
    cpp/src/recommendation_engine.cpp ^
    cpp/src/stylist_engine.cpp ^
    cpp/src/sentiment_engine.cpp ^
    cpp/src/store_manager.cpp ^
    cpp/src/wasm_bindings.cpp ^
    -lembind ^
    -s WASM=1 ^
    -s ALLOW_MEMORY_GROWTH=1 ^
    -s NO_DISABLE_EXCEPTION_CATCHING ^
    -s EXPORT_ES6=1 ^
    -s MODULARIZE=1 ^
    -s EXPORT_NAME="createAuraModule" ^
    -o public/wasm/aura_engine.js

if %ERRORLEVEL% EQU 0 (
    echo WebAssembly module generated successfully in public/wasm/!
) else (
    echo WebAssembly build failed.
    exit /b %ERRORLEVEL%
)

