cmake_minimum_required(VERSION 3.20)
project(AuraJewelryEngine VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(cpp/include)

set(AURA_SOURCES
    cpp/src/vision_engine.cpp
    cpp/src/parametric_renderer.cpp
    cpp/src/recommendation_engine.cpp
    cpp/src/stylist_engine.cpp
    cpp/src/sentiment_engine.cpp
    cpp/src/store_manager.cpp
)

if(EMSCRIPTEN)
    message(STATUS "Configuring build for WebAssembly (Emscripten)...")
    add_executable(aura_wasm
        ${AURA_SOURCES}
        cpp/src/wasm_bindings.cpp
    )
    set_target_properties(aura_wasm PROPERTIES
        OUTPUT_NAME "aura_engine"
        SUFFIX ".js"
    )
    set_target_properties(aura_wasm PROPERTIES LINK_FLAGS "-lembind -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s NO_DISABLE_EXCEPTION_CATCHING -s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME='createAuraModule'")
else()
    message(STATUS "Configuring build for Native Platform...")
    add_executable(aura_native
        ${AURA_SOURCES}
        cpp/src/main.cpp
    )
endif()

