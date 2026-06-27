#!/bin/bash
# Build script for Gravity Simulator Android APK
# Builds release APK (faster, smaller) and signs with debug key

set -e

echo "---- Building Gravity Simulator for Android ----"

# Compile TypeScript first
echo "[0/4] Compiling TypeScript..."
npx tsc --project tsconfig.json || { echo "Error: TypeScript compilation failed"; exit 1; }
echo "       TypeScript compiled successfully"


if ! command -v cargo &> /dev/null; then
    echo "Error: Rust/Cargo is required. Install from https://rustup.rs"
    exit 1
fi

# Clean
echo "[1/4] Cleaning..."
rm -rf src-tauri/target dist /tmp/gravity-build-*

mkdir -p dist
cp index.html style.css script.js dist/
cp -r downloads dist/ 2>/dev/null || true

# Check Tauri CLI
if ! command -v cargo-tauri &> /dev/null; then
    echo "Installing Tauri CLI..."
    cargo install tauri-cli --version "^2"
else
    echo "[2/4] Tauri CLI ready"
fi

# Build APK (arm64 only to save space)
echo "[3/4] Building APK (arm64, release - smaller & faster)..."
ANDROID_ABIS=arm64-v8a cargo tauri android build --apk

echo ""
echo "---- Copying APK ----"

# Copy release APK (arm64 only)
echo "[4/4] Copying APK..."
mkdir -p downloads
if [ -f src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk ]; then
  cp src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk \
     downloads/gravity-simulator.apk
elif [ -f src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk ]; then
  cp src-tauri/gen/android/app/build/outputs/apk/universal/debug/app-universal-debug.apk \
     downloads/gravity-simulator.apk
else
  echo "Error: APK not found"
  exit 1
fi
ls -lh downloads/gravity-simulator.apk && echo "APK ready at downloads/gravity-simulator.apk"
