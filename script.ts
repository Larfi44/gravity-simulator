// DOM Elements
const object = document.getElementById("object") as HTMLElement;
const settingsMenu = document.getElementById("settings-menu") as HTMLElement;

// Input Elements
const gravityInput = document.getElementById(
  "gravity-input",
) as HTMLInputElement;
const heightInput = document.getElementById("height-input") as HTMLInputElement;
const bouncinessSlider = document.getElementById(
  "bounciness-slider",
) as HTMLInputElement;
const bouncinessValue = document.getElementById(
  "bounciness-value",
) as HTMLElement;

// Display Elements
const currentStatus = document.getElementById("current-status") as HTMLElement;
const currentGravityDisplay = document.getElementById(
  "current-gravity",
) as HTMLElement;
const currentBouncinessDisplay = document.getElementById(
  "current-bounciness",
) as HTMLElement;
const currentHeightDisplay = document.getElementById(
  "current-height-display",
) as HTMLElement;
const heightDisplay = document.getElementById("height-display") as HTMLElement;
const velocityDisplay = document.getElementById("velocity") as HTMLElement;
const timeDisplay = document.getElementById("time") as HTMLElement;
const bounceNumberDisplay = document.getElementById(
  "bounce-number",
) as HTMLElement;
const energyDisplay = document.getElementById("energy") as HTMLElement;

// Game State
let gravity: number = 9.8;
let startHeight: number = 30;
let bounciness: number = 0.7;
let velocity: number = 0;
let currentHeight: number = 30;
let time: number = 0;
let bounceCount: number = 0;
let isRunning: boolean = false;
let isPaused: boolean = false;
let isFalling: boolean = true;
let energy: number = 100;
let currentBounceEnergy: number = 100;

let animationId: number | null = null;
let lastTime: number = 0;

// Game Constants
const GROUND_HEIGHT_PERCENT = 90;
const MIN_BOUNCE_HEIGHT = 0.01;
const MIN_VELOCITY = 0.05;

// Clean and validate number input (max 2 decimals for gravity, max 1 for height)
function validateNumberInput(
  inputValue: string,
  maxDecimals: number,
  minValue: number = 0.01,
): { value: number; display: string } {
  // Remove any non-digit and non-dot characters
  let cleaned = inputValue.replace(/[^\d.]/g, "");

  // Remove extra dots (keep only first one)
  const dotIndex = cleaned.indexOf(".");
  if (dotIndex !== -1) {
    cleaned =
      cleaned.substring(0, dotIndex + 1) +
      cleaned.substring(dotIndex + 1).replace(/\./g, "");
  }

  // If empty, return minimum value
  if (cleaned === "" || cleaned === ".") {
    return {
      value: minValue,
      display:
        minValue % 1 === 0
          ? minValue.toString()
          : minValue.toFixed(maxDecimals),
    };
  }

  // Parse the number
  let value = parseFloat(cleaned);

  // If NaN, return minimum value
  if (isNaN(value)) {
    return {
      value: minValue,
      display:
        minValue % 1 === 0
          ? minValue.toString()
          : minValue.toFixed(maxDecimals),
    };
  }

  // Ensure minimum value
  if (value < minValue) {
    value = minValue;
  }

  // Check decimal places
  const decimalPart = cleaned.includes(".") ? cleaned.split(".")[1] || "" : "";

  // If user typed more decimals than allowed, trim them
  if (decimalPart.length > maxDecimals) {
    value = parseFloat(value.toFixed(maxDecimals));
  }

  // Create display string - preserve user's formatting style
  let display: string;

  if (!cleaned.includes(".")) {
    // User typed whole number (e.g., "20")
    display = value.toString();
  } else if (decimalPart.length === 0) {
    // User typed number with dot but no decimals (e.g., "20.")
    display = value.toString() + ".";
  } else {
    // User typed decimals
    // Keep up to maxDecimals, but don't add trailing zeros unless user typed them
    const actualDecimals = Math.min(decimalPart.length, maxDecimals);
    display = value.toFixed(actualDecimals);

    // Remove trailing zeros after decimal point
    if (display.includes(".")) {
      display = display.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
    }
  }

  return { value, display };
}

// Format display number - show minimal necessary decimals
function formatDisplayNumber(value: number, maxDecimals: number): string {
  // For display, show up to maxDecimals but remove trailing zeros
  let formatted = value.toFixed(maxDecimals);

  // Remove trailing zeros after decimal point
  if (formatted.includes(".")) {
    formatted = formatted.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  }

  return formatted;
}

// Validate and format gravity input (max 2 decimals)
function handleGravityInput(): void {
  const result = validateNumberInput(gravityInput.value, 2, 0.01);

  // Update the input field with user-friendly display
  gravityInput.value = result.display;

  // Store the actual value
  gravity = result.value;

  // Update display with same formatting
  if (currentGravityDisplay) {
    currentGravityDisplay.textContent = `${formatDisplayNumber(gravity, 2)} m/s²`;
  }
}

// Validate and format height input (max 1 decimal, min 0.1)
function handleHeightInput(): void {
  const result = validateNumberInput(heightInput.value, 1, 0.1);

  // Update the input field with user-friendly display
  heightInput.value = result.display;

  // Store the actual value
  startHeight = result.value;

  // Update current height if simulation not running
  if (!isRunning) {
    currentHeight = startHeight;
  }

  // Update display with same formatting
  if (currentHeightDisplay) {
    currentHeightDisplay.textContent = `${formatDisplayNumber(startHeight, 1)} m`;
  }

  // Update height display (always show 1 decimal for physics)
  if (heightDisplay && !isRunning) {
    heightDisplay.textContent = `${currentHeight.toFixed(1)} m`;
  }
}

// Handle gravity input on focus - select all text
function handleGravityFocus(): void {
  setTimeout(() => {
    gravityInput.select();
  }, 10);
}

// Handle height input on focus - select all text
function handleHeightFocus(): void {
  setTimeout(() => {
    heightInput.select();
  }, 10);
}

// Update bounciness from slider (2 decimals)
function handleBouncinessInput(): void {
  bounciness = parseFloat(bouncinessSlider.value);

  // Update slider value display
  if (bouncinessValue) {
    // Show 2 decimals for slider
    bouncinessValue.textContent = bounciness.toFixed(2);
  }

  // Update bounciness display
  if (currentBouncinessDisplay) {
    currentBouncinessDisplay.textContent = bounciness.toFixed(2);
  }
}

// Update all displays with proper formatting
function updateDisplays(): void {
  if (currentStatus) {
    if (!isRunning) {
      currentStatus.textContent = "Stopped ⏹️";
    } else {
      currentStatus.textContent = isFalling ? "Falling ↓" : "Rising ↑";
    }
  }

  // Height: show 1 decimal for physics calculations
  if (heightDisplay) {
    heightDisplay.textContent = `${currentHeight.toFixed(1)} m`;
  }

  // Velocity: 2 decimals
  if (velocityDisplay) {
    const velocitySign = isFalling ? "-" : "+";
    velocityDisplay.textContent = `${velocitySign}${Math.abs(velocity).toFixed(2)} m/s`;
  }

  // Time: 2 decimals
  if (timeDisplay) {
    timeDisplay.textContent = `${time.toFixed(2)} s`;
  }

  if (bounceNumberDisplay) {
    bounceNumberDisplay.textContent = bounceCount.toString();
  }

  // Energy: 0 decimals
  if (energyDisplay) {
    energyDisplay.textContent = `${energy.toFixed(0)}%`;
  }
}

// Convert meters to screen percentage
function metersToPercent(meters: number): number {
  const maxHeight = startHeight;
  const groundPercent = GROUND_HEIGHT_PERCENT;
  const percent = ((maxHeight - meters) / maxHeight) * groundPercent;
  return Math.max(0, Math.min(groundPercent, percent));
}

// Update object position
function updateObjectPosition(): void {
  const screenPosition = metersToPercent(currentHeight);
  object.style.top = `${screenPosition}%`;

  // Visual feedback based on state
  const hue = isFalling ? 200 : 300;
  object.style.background = `radial-gradient(circle at 30% 30%, hsl(${hue}, 100%, 70%), hsl(${hue + 30}, 100%, 50%))`;
}

// Calculate next bounce height based on bounciness
function calculateNextBounceHeight(currentPeakHeight: number): number {
  return currentPeakHeight * Math.pow(bounciness, 2);
}

// Physics update with correct bounce physics
function updatePhysics(deltaTime: number): void {
  if (!isRunning || isPaused) return;

  time += deltaTime;

  if (isFalling) {
    // FALLING: Velocity increases (downward positive)
    velocity += gravity * deltaTime;
    currentHeight -= velocity * deltaTime;

    // Check for ground collision
    if (currentHeight <= 0) {
      currentHeight = 0;

      // Calculate impact velocity
      const impactVelocity = Math.abs(velocity);

      // Calculate bounce velocity using coefficient of restitution
      const bounceVelocity = impactVelocity * bounciness;

      // Update energy remaining
      energy = energy * Math.pow(bounciness, 2);
      currentBounceEnergy = currentBounceEnergy * Math.pow(bounciness, 2);

      // Only bounce if we have enough velocity and energy
      if (bounceVelocity >= MIN_VELOCITY && currentHeight < startHeight) {
        // BOUNCE: Switch to rising with reduced velocity
        velocity = -bounceVelocity;
        isFalling = false;
        bounceCount++;

        // Visual bounce effect
        object.classList.add("bouncing");
        setTimeout(() => object.classList.remove("bouncing"), 300);
      } else {
        // STOP: Bounce is too small
        velocity = 0;
        isRunning = false;
        currentStatus.textContent = "Stopped ⏹️";

        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    }
  } else {
    // RISING: Object moves UP after bounce
    velocity += gravity * deltaTime;

    // Since velocity is negative (upward), subtracting it increases height
    currentHeight -= velocity * deltaTime;

    // Check if reached peak of bounce
    if (velocity >= -0.01) {
      velocity = 0;
      isFalling = true;

      // Calculate if next bounce will be too small
      const nextBounceHeight = calculateNextBounceHeight(currentHeight);

      if (nextBounceHeight < MIN_BOUNCE_HEIGHT) {
        // Next bounce would be too small, stop now
        isRunning = false;
        currentStatus.textContent = "Stopped ⏹️";

        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    }
  }

  updateObjectPosition();
  updateDisplays();
}

// Main game loop
function gameLoop(currentTime: number): void {
  if (lastTime === 0) lastTime = currentTime;

  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  updatePhysics(deltaTime);

  if (isRunning && !isPaused) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// Start simulation
function startSimulation(): void {
  // Get values from inputs (already validated)
  gravity = parseFloat(gravityInput.value) || 9.8;
  startHeight = parseFloat(heightInput.value) || 30;
  bounciness = parseFloat(bouncinessSlider.value);

  // Reset game state
  velocity = 0;
  currentHeight = startHeight;
  time = 0;
  bounceCount = 0;
  isRunning = true;
  isPaused = false;
  isFalling = true;
  energy = 100;
  currentBounceEnergy = 100;

  // Hide settings menu
  settingsMenu.classList.add("hidden");

  // Update displays
  updateDisplays();
  updateObjectPosition();

  // Start game loop
  lastTime = 0;
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  animationId = requestAnimationFrame(gameLoop);
}

// Reset simulation
function resetSimulation(): void {
  // Reset game state but keep current settings
  velocity = 0;
  currentHeight = startHeight;
  time = 0;
  bounceCount = 0;
  isRunning = true;
  isPaused = false;
  isFalling = true;
  energy = 100;
  currentBounceEnergy = 100;

  // Update displays
  updateDisplays();
  updateObjectPosition();

  // Restart game loop
  lastTime = 0;
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  animationId = requestAnimationFrame(gameLoop);
}

// Toggle pause
function togglePause(): void {
  if (!isRunning) return;

  isPaused = !isPaused;

  if (isPaused) {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  } else {
    lastTime = 0;
    animationId = requestAnimationFrame(gameLoop);
  }
}

// Show settings menu
function showSettingsMenu(): void {
  isRunning = false;
  isPaused = false;

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  settingsMenu.classList.remove("hidden");
}

// Initialize
function initialize(): void {
  // Set initial values
  gravityInput.value = "9.8";
  heightInput.value = "30";
  bouncinessSlider.value = "0.70";

  // Update all displays
  handleGravityInput();
  handleHeightInput();
  handleBouncinessInput();
  updateDisplays();

  // Event Listeners for inputs
  gravityInput.addEventListener("input", handleGravityInput);
  gravityInput.addEventListener("focus", handleGravityFocus);
  gravityInput.addEventListener("blur", handleGravityInput);

  heightInput.addEventListener("input", handleHeightInput);
  heightInput.addEventListener("focus", handleHeightFocus);
  heightInput.addEventListener("blur", handleHeightInput);

  bouncinessSlider.addEventListener("input", handleBouncinessInput);

  // Allow Enter key to blur/confirm input
  gravityInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      this.blur();
    }
  });

  heightInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      this.blur();
    }
  });

  // Event Listeners for buttons
  const startBtn = document.getElementById("start-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const againBtn = document.getElementById("again-btn");
  const settingsBtn = document.getElementById("settings-btn");

  if (startBtn) startBtn.addEventListener("click", startSimulation);
  if (pauseBtn) pauseBtn.addEventListener("click", togglePause);
  if (againBtn) againBtn.addEventListener("click", resetSimulation);
  if (settingsBtn) settingsBtn.addEventListener("click", showSettingsMenu);

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Don't trigger shortcuts when typing in inputs
    if (e.target instanceof HTMLInputElement) {
      if (e.key === "Escape") {
        (e.target as HTMLInputElement).blur();
      }
      return;
    }

    switch (e.key) {
      case " ":
      case "Spacebar":
        e.preventDefault();
        if (!isRunning) {
          startSimulation();
        } else {
          togglePause();
        }
        break;

      case "r":
      case "R":
        if (e.ctrlKey || !isRunning) {
          e.preventDefault();
          resetSimulation();
        }
        break;

      case "Escape":
        e.preventDefault();
        showSettingsMenu();
        break;
    }
  });
}

// Start when ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

// Add bounce animation to CSS
const style = document.createElement("style");
style.textContent = `
  @keyframes bounce {
    0% { transform: translateX(-50%) scale(1, 1); }
    30% { transform: translateX(-50%) scale(1.1, 0.9); }
    50% { transform: translateX(-50%) scale(0.9, 1.1); }
    70% { transform: translateX(-50%) scale(1.05, 0.95); }
    100% { transform: translateX(-50%) scale(1, 1); }
  }
  
  .bouncing {
    animation: bounce 0.4s ease;
  }
`;
document.head.appendChild(style);
