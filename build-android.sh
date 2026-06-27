#!/usr/bin/env bash
#
# build-android.sh — Build Gravity Simulator .apk for Android via Tauri 2
#
# This script automates the full Android APK build pipeline:
#   1. Prerequisites check (Rust targets, Android SDK/NDK, Java)
#   2. Generate icons (if missing)
#   3. Copy frontend assets into dist/
#   4. Build the APK (release or debug)
#
# Usage:
#   ./build-android.sh              # Build release APK (arm64-v8a only)
#   ./build-android.sh --debug      # Build debug APK (arm64-v8a only)
#   ./build-android.sh --all        # Build for all 4 architectures (needs ~14GB)
#   ./build-android.sh --clean      # Remove cached build artifacts (frees ~4-14GB)
#   ./build-android.sh --help       # Show this help
#
# ---------------------------------------------------------------------------

set -euo pipefail

# ─── Colours ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Colour

info()  { echo -e "${CYAN}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
err()   { echo -e "${RED}[ERROR]${NC} $*"; }

# ─── Config ──────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

BUILD_TYPE="${1:-release}"        # default: release
if [[ "$BUILD_TYPE" == "--help" || "$BUILD_TYPE" == "-h" ]]; then
  sed -n '/^#/,/^$/p' "$0" | head -n -1 | sed 's/^# //; s/^#//'
  exit 0
fi
if [[ "$BUILD_TYPE" == "--debug" || "$BUILD_TYPE" == "debug" ]]; then
  BUILD_TYPE="debug"
elif [[ "$BUILD_TYPE" == "--all" || "$BUILD_TYPE" == "all" ]]; then
  BUILD_TYPE="release"
  BUILD_ALL=true
else
  BUILD_TYPE="release"
fi

# ─── Helper — check free disk space ──────────────────────────────────────────
MIN_SPACE_GB=15
check_disk_space() {
  local avail_kb
  avail_kb=$(df -k . | tail -1 | awk '{print $4}')
  local avail_gb=$(( avail_kb / 1048576 ))
  if [[ "$avail_gb" -lt "$MIN_SPACE_GB" ]]; then
    warn "Low disk space: ${avail_gb}GB available (need ≥${MIN_SPACE_GB}GB)"
    TARGET_SIZE=$(du -sk src-tauri/target/ 2>/dev/null | awk '{print $1}')
    if [[ -n "$TARGET_SIZE" && "$TARGET_SIZE" -gt 0 ]]; then
      local target_gb=$(( TARGET_SIZE / 1048576 ))
      info "  Cached build artifacts: ~${target_gb}GB in src-tauri/target/"
      info "  Auto-cleaning target/ to free up space…"
      rm -rf src-tauri/target/ src-tauri/gen/android/app/build/
      ok "Cleaned. Rechecking space…"
      avail_kb=$(df -k . | tail -1 | awk '{print $4}')
      avail_gb=$(( avail_kb / 1048576 ))
    fi
    if [[ "$avail_gb" -lt "$MIN_SPACE_GB" ]]; then
      err "Still only ${avail_gb}GB available. Need ≥${MIN_SPACE_GB}GB."
      err "Free up space manually and try again."
      exit 1
    fi
  fi
  ok "Disk space: ${avail_gb}GB available"
}

# ─── Step 0 — Prerequisites ──────────────────────────────────────────────────
echo ""
info "========================================"
info "  Gravity Simulator — Android APK Build"
info "========================================"
echo ""

# Handle --clean flag
if [[ "$BUILD_TYPE" == "--clean" ]]; then
  info "Cleaning build artifacts…"
  rm -rf src-tauri/target/ src-tauri/gen/android/app/build/
  ok "Cleaned. Run script again to build."
  exit 0
fi

check_disk_space

# Java
if command -v java &>/dev/null; then
  JAVA_VER=$(java -version 2>&1 | head -1 | sed 's/.*version "\([0-9]*\).*/\1/')
  if [[ "$JAVA_VER" -ge 17 ]]; then
    ok "Java $JAVA_VER found"
  else
    warn "Java $JAVA_VER detected; Tauri 2 recommends Java 17+"
  fi
else
  err "Java not found. Install JDK 17+ (e.g. via https://adoptium.net)"
  exit 1
fi

# Android SDK (via ANDROID_HOME or ANDROID_SDK_ROOT)
ANDROID_SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
if [[ -z "$ANDROID_SDK" ]]; then
  # Common fallback locations
  for candidate in "$HOME/Library/Android/sdk" "$HOME/Android/Sdk"; do
    if [[ -d "$candidate" ]]; then
      ANDROID_SDK="$candidate"
      break
    fi
  done
fi
if [[ -z "$ANDROID_SDK" || ! -d "$ANDROID_SDK" ]]; then
  err "Android SDK not found. Set ANDROID_HOME or install via Android Studio."
  err "Expected at ~/Library/Android/sdk or ~/Android/Sdk"
  exit 1
fi
export ANDROID_HOME="$ANDROID_SDK"
ok "Android SDK: $ANDROID_SDK"

# NDK
NDK_DIR="$ANDROID_SDK/ndk"
if [[ -d "$NDK_DIR" && "$(ls -1 "$NDK_DIR" 2>/dev/null)" != "" ]]; then
  ok "NDK found: $(ls -1 "$NDK_DIR" | head -1)"
else
  err "NDK not found in $NDK_DIR. Install via SDK Manager (side-by-side NDK)."
  exit 1
fi

# Rust Android targets
info "Checking Rust Android targets…"
MISSING_TARGETS=()
for t in aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android; do
  if ! rustup target list --installed 2>/dev/null | grep -q "$t"; then
    MISSING_TARGETS+=("$t")
  fi
done
if [[ ${#MISSING_TARGETS[@]} -gt 0 ]]; then
  warn "Missing Rust targets: ${MISSING_TARGETS[*]}"
  info "Installing with: rustup target add ${MISSING_TARGETS[*]}"
  rustup target add "${MISSING_TARGETS[@]}"
fi
ok "All 4 Android Rust targets present"

# Cargo APT (optional, for native libs)
if ! cargo install --list 2>/dev/null | grep -q 'cargo-ndk'; then
  info "cargo-ndk not found — installing (used for native library build)…"
  cargo install cargo-ndk 2>&1 | tail -1
fi

# npm dependencies
if [[ ! -d "node_modules" ]]; then
  info "Installing npm dependencies…"
  npm install
fi

# Tauri CLI
if ! npx --yes @tauri-apps/cli --version &>/dev/null 2>&1; then
  info "Installing @tauri-apps/cli…"
  npm install --save-dev @tauri-apps/cli
fi
ok "All prerequisites satisfied"

# ─── Step 1 — Generate Icons ─────────────────────────────────────────────────
echo ""
info "Step 1/4 — Generating app icons…"
if [[ ! -d "src-tauri/icons" || -z "$(ls -A src-tauri/icons 2>/dev/null)" ]]; then
  python3 generate-icons.py
  ok "Icons generated in src-tauri/icons/"
else
  ok "Icons already exist in src-tauri/icons/"
fi

# ─── Step 2 — Ensure Android project is initialised ──────────────────────────
echo ""
info "Step 2/4 — Ensuring Android project is initialised…"
if [[ ! -f "src-tauri/gen/android/tauri.settings.gradle" ]]; then
  info "Running: npx tauri android init"
  npx tauri android init
  ok "Android project initialised"
else
  ok "Android project already initialised"
fi

# ─── Step 3 — Copy frontend assets ───────────────────────────────────────────
echo ""
info "Step 3/4 — Copying frontend assets to dist/…"
npm run copy:frontend
ok "Frontend copied to dist/"

# ─── Step 4 — Build APK ──────────────────────────────────────────────────────
echo ""
info "Step 4/4 — Building APK ($BUILD_TYPE)…"
info "NOTE: First build compiles Rust dependencies from source — this takes 5–15 minutes."
info "      Subsequent builds are incremental and much faster."
echo ""

# Default: arm64-v8a only (covers 99% of devices, ~3-4GB artifacts)
# Use --all flag to build for all 4 architectures (~14GB artifacts)
if [[ "${BUILD_ALL:-}" == "true" ]]; then
  TARGET_FLAG=""
  info "Building for ALL 4 architectures (needs ~14GB free)"
else
  TARGET_FLAG="--target aarch64"
  info "Building for arm64-v8a only (use --all for all architectures)"
fi

if [[ "$BUILD_TYPE" == "debug" ]]; then
  npx tauri android build --apk --debug $TARGET_FLAG
  APK_DIR="src-tauri/gen/android/app/build/outputs/apk/debug"
else
  npx tauri android build --apk $TARGET_FLAG
  APK_DIR="src-tauri/gen/android/app/build/outputs/apk/release"
fi

echo ""
if [[ -d "$APK_DIR" ]]; then
  APK_FILE=$(ls -1t "$APK_DIR"/*.apk 2>/dev/null | head -1)
  if [[ -n "$APK_FILE" ]]; then
    FILESIZE=$(stat -f%z "$APK_FILE" 2>/dev/null | awk '{printf "%.1f MB", $1/1048576}' || \
               stat -c%s "$APK_FILE" 2>/dev/null | awk '{printf "%.1f MB", $1/1048576}')
    ok "✅ Build successful!"
    echo ""
    echo -e "   ${CYAN}APK:${NC}  $APK_FILE"
    echo -e "   ${CYAN}Size:${NC} $FILESIZE"
    echo -e "   ${CYAN}Type:${NC} $BUILD_TYPE"
    if [[ "$BUILD_TYPE" == "release" ]]; then
      echo -e "   ${YELLOW}Note:${NC} Release APK is unsigned. For testing, use debug build instead:"
      echo -e "         ${CYAN}./build-android.sh --debug${NC}"
      echo -e "   ${YELLOW}      Or sign with:${NC} jarsigner -keystore my.keystore \"$APK_FILE\" alias_name"
    fi
    echo ""
  else
    warn "APK directory exists but no .apk found: $APK_DIR"
    info "Check build output above for any errors."
  fi
else
  warn "APK output directory not found at: $APK_DIR"
  info "Check build output above for any errors."
fi

info "Done!"
