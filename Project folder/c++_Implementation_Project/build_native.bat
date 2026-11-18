@echo off
setlocal
call "C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
if not exist build mkdir build
cd build
cl /std:c++latest /EHsc /O2 /I..\cpp\include ..\cpp\src\vision_engine.cpp ..\cpp\src\parametric_renderer.cpp ..\cpp\src\recommendation_engine.cpp ..\cpp\src\stylist_engine.cpp ..\cpp\src\sentiment_engine.cpp ..\cpp\src\store_manager.cpp ..\cpp\src\main.cpp /Fe:aura_native.exe
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================
    echo Compilation Succeeded! Running aura_native.exe...
    echo ======================================================
    aura_native.exe
) else (
    echo Compilation Failed!
    exit /b %ERRORLEVEL%
)

