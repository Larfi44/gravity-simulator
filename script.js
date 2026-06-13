"use strict";
// DOM Elements
const object = document.getElementById("object");
const settingsMenu = document.getElementById("settings-menu");
// Input Elements
const gravityInput = document.getElementById("gravity-input");
const heightInput = document.getElementById("height-input");
const massInput = document.getElementById("mass-input");
const bouncinessSlider = document.getElementById("bounciness-slider");
const bouncinessValue = document.getElementById("bounciness-value");
const airResistanceSlider = document.getElementById("air-resistance-slider");
const airResistanceValue = document.getElementById("air-resistance-value");
const timeScaleSlider = document.getElementById("time-scale-slider");
const timeScaleValue = document.getElementById("time-scale-value");
const presetSelect = document.getElementById("preset-select");
const showTrajectoryCheckbox = document.getElementById("show-trajectory");
const enableSoundCheckbox = document.getElementById("enable-sound");
// Display Elements
const currentStatus = document.getElementById("current-status");
const currentGravityDisplay = document.getElementById("current-gravity");
const currentBouncinessDisplay = document.getElementById("current-bounciness");
const currentHeightDisplay = document.getElementById("current-height-display");
const heightDisplay = document.getElementById("height-display");
const velocityDisplay = document.getElementById("velocity");
const timeDisplay = document.getElementById("time");
const bounceNumberDisplay = document.getElementById("bounce-number");
const energyDisplay = document.getElementById("energy");
const massDisplay = document.getElementById("mass-display");
const kineticEnergyDisplay = document.getElementById("kinetic-energy");
const potentialEnergyDisplay = document.getElementById("potential-energy");
const totalEnergyDisplay = document.getElementById("total-energy");
const airResistanceDisplay = document.getElementById("air-resistance-display");
// Game State
let gravity = 9.8;
let startHeight = 30;
let bounciness = 0.7;
let velocity = 0;
let currentHeight = 30;
let time = 0;
let bounceCount = 0;
let isRunning = false;
let isPaused = false;
let isFalling = true;
let energy = 100;
let currentBounceEnergy = 100;
let mass = 1.0;
let airResistance = 0.0;
let timeScale = 1.0;
let showTrajectory = true;
let enableSound = true;
let animationId = null;
let lastTime = 0;
// Game Constants
const GROUND_HEIGHT_PERCENT = 90;
const MIN_BOUNCE_HEIGHT = 0.01;
const MIN_VELOCITY = 0.05;
// Preset environments
const PRESETS = {
    earth: { gravity: 9.8, description: "Earth" },
    moon: { gravity: 1.62, description: "Moon" },
    mars: { gravity: 3.71, description: "Mars" },
    jupiter: { gravity: 24.79, description: "Jupiter" },
    zero: { gravity: 0.0, description: "Zero Gravity" },
};
// Clean and validate number input (max 2 decimals for gravity, max 1 for height)
function validateNumberInput(inputValue, maxDecimals, minValue = 0.01) {
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
            display: minValue % 1 === 0
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
            display: minValue % 1 === 0
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
    let display;
    if (!cleaned.includes(".")) {
        // User typed whole number (e.g., "20")
        display = value.toString();
    }
    else if (decimalPart.length === 0) {
        // User typed number with dot but no decimals (e.g., "20.")
        display = value.toString() + ".";
    }
    else {
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
function formatDisplayNumber(value, maxDecimals) {
    // For display, show up to maxDecimals but remove trailing zeros
    let formatted = value.toFixed(maxDecimals);
    // Remove trailing zeros after decimal point
    if (formatted.includes(".")) {
        formatted = formatted.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
    }
    return formatted;
}
// Validate and format gravity input (max 2 decimals)
function handleGravityInput() {
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
function handleHeightInput() {
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
function handleGravityFocus() {
    setTimeout(() => {
        gravityInput.select();
    }, 10);
}
// Handle height input on focus - select all text
function handleHeightFocus() {
    setTimeout(() => {
        heightInput.select();
    }, 10);
}
// Handle mass input (max 1 decimal, min 0.1)
function handleMassInput() {
    const result = validateNumberInput(massInput.value, 1, 0.1);
    // Update the input field with user-friendly display
    massInput.value = result.display;
    // Store the actual value
    mass = result.value;
    // Update display
    if (massDisplay) {
        massDisplay.textContent = `${formatDisplayNumber(mass, 1)} kg`;
    }
}
// Handle air resistance slider
function handleAirResistanceInput() {
    airResistance = parseFloat(airResistanceSlider.value);
    // Update slider value display
    if (airResistanceValue) {
        airResistanceValue.textContent = airResistance.toFixed(2);
    }
    // Update display
    if (airResistanceDisplay) {
        airResistanceDisplay.textContent = airResistance.toFixed(2);
    }
}
// Handle time scale slider
function handleTimeScaleInput() {
    timeScale = parseFloat(timeScaleSlider.value);
    // Update slider value display
    if (timeScaleValue) {
        timeScaleValue.textContent = `${timeScale.toFixed(1)}x`;
    }
}
// Handle preset selection
function handlePresetChange() {
    const selectedPreset = presetSelect.value;
    if (selectedPreset === "custom") {
        return; // Don't change anything
    }
    const preset = PRESETS[selectedPreset];
    if (preset) {
        gravity = preset.gravity;
        gravityInput.value = gravity.toString();
        handleGravityInput();
        // Reset preset to custom after applying
        presetSelect.value = "custom";
    }
}
// Handle trajectory checkbox
function handleTrajectoryToggle() {
    showTrajectory = showTrajectoryCheckbox.checked;
}
// Handle sound toggle
function handleSoundToggle() {
    enableSound = enableSoundCheckbox.checked;
}
// Play bounce sound effect
function playBounceSound(intensity) {
    if (!enableSound)
        return;
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 200 + intensity * 300;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.3 * intensity, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    catch (e) {
        // Audio not supported or failed
    }
}
// Export settings as JSON
function exportSettings() {
    const settings = {
        gravity,
        startHeight,
        mass,
        bounciness,
        airResistance,
        timeScale,
        showTrajectory,
        enableSound,
        timestamp: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gravity-sim-settings-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}
// Update bounciness from slider (2 decimals)
function handleBouncinessInput() {
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
function updateDisplays() {
    if (currentStatus) {
        if (!isRunning) {
            currentStatus.textContent = "Stopped ⏹️";
        }
        else {
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
    // Mass display
    if (massDisplay) {
        massDisplay.textContent = `${formatDisplayNumber(mass, 1)} kg`;
    }
    // Calculate and display energies
    const kineticEnergy = 0.5 * mass * Math.pow(velocity, 2);
    const potentialEnergy = mass * gravity * currentHeight;
    const totalEnergyVal = kineticEnergy + potentialEnergy;
    if (kineticEnergyDisplay) {
        kineticEnergyDisplay.textContent = `${kineticEnergy.toFixed(2)} J`;
    }
    if (potentialEnergyDisplay) {
        potentialEnergyDisplay.textContent = `${potentialEnergy.toFixed(2)} J`;
    }
    if (totalEnergyDisplay) {
        totalEnergyDisplay.textContent = `${totalEnergyVal.toFixed(2)} J`;
    }
    // Air resistance display
    if (airResistanceDisplay) {
        airResistanceDisplay.textContent = airResistance.toFixed(2);
    }
}
// Convert meters to screen percentage
function metersToPercent(meters) {
    const maxHeight = startHeight;
    const groundPercent = GROUND_HEIGHT_PERCENT;
    const percent = ((maxHeight - meters) / maxHeight) * groundPercent;
    return Math.max(0, Math.min(groundPercent, percent));
}
// Update object position
function updateObjectPosition() {
    const screenPosition = metersToPercent(currentHeight);
    object.style.top = `${screenPosition}%`;
    // Visual feedback based on state
    const hue = isFalling ? 200 : 300;
    object.style.background = `radial-gradient(circle at 30% 30%, hsl(${hue}, 100%, 70%), hsl(${hue + 30}, 100%, 50%))`;
}
// Calculate next bounce height based on bounciness
function calculateNextBounceHeight(currentPeakHeight) {
    return currentPeakHeight * Math.pow(bounciness, 2);
}
// Physics update with correct bounce physics and air resistance
function updatePhysics(deltaTime) {
    if (!isRunning || isPaused)
        return;
    // Apply time scale
    const scaledDeltaTime = deltaTime * timeScale;
    time += scaledDeltaTime;
    if (isFalling) {
        // FALLING: Velocity increases (downward positive)
        // Apply gravity
        velocity += gravity * scaledDeltaTime;
        // Apply air resistance (drag force proportional to velocity squared)
        if (airResistance > 0 && velocity > 0) {
            const dragForce = airResistance * Math.pow(velocity, 2);
            const dragAcceleration = dragForce / mass;
            velocity -= dragAcceleration * scaledDeltaTime;
        }
        currentHeight -= velocity * scaledDeltaTime;
        // Check for ground collision
        if (currentHeight <= 0) {
            currentHeight = 0;
            // Calculate impact velocity
            const impactVelocity = Math.abs(velocity);
            // Play bounce sound based on impact intensity
            const intensity = Math.min(1, impactVelocity / 20);
            playBounceSound(intensity);
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
            }
            else {
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
    }
    else {
        // RISING: Object moves UP after bounce
        velocity += gravity * scaledDeltaTime;
        // Apply air resistance when moving upward
        if (airResistance > 0 && velocity < 0) {
            const dragForce = airResistance * Math.pow(Math.abs(velocity), 2);
            const dragAcceleration = dragForce / mass;
            velocity += dragAcceleration * scaledDeltaTime; // Drag opposes motion
        }
        // Since velocity is negative (upward), subtracting it increases height
        currentHeight -= velocity * scaledDeltaTime;
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
function gameLoop(currentTime) {
    if (lastTime === 0)
        lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    updatePhysics(deltaTime);
    if (isRunning && !isPaused) {
        animationId = requestAnimationFrame(gameLoop);
    }
}
// Start simulation
function startSimulation() {
    // Get values from inputs (already validated)
    gravity = parseFloat(gravityInput.value) || 9.8;
    startHeight = parseFloat(heightInput.value) || 30;
    mass = parseFloat(massInput.value) || 1.0;
    bounciness = parseFloat(bouncinessSlider.value);
    airResistance = parseFloat(airResistanceSlider.value);
    timeScale = parseFloat(timeScaleSlider.value);
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
function resetSimulation() {
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
function togglePause() {
    if (!isRunning)
        return;
    isPaused = !isPaused;
    if (isPaused) {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    else {
        lastTime = 0;
        animationId = requestAnimationFrame(gameLoop);
    }
}
// Show settings menu
function showSettingsMenu() {
    isRunning = false;
    isPaused = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    settingsMenu.classList.remove("hidden");
}
// Initialize
function initialize() {
    // Set initial values
    gravityInput.value = "9.8";
    heightInput.value = "30";
    massInput.value = "1.0";
    bouncinessSlider.value = "0.70";
    airResistanceSlider.value = "0.0";
    timeScaleSlider.value = "1";
    // Update all displays
    handleGravityInput();
    handleHeightInput();
    handleMassInput();
    handleBouncinessInput();
    handleAirResistanceInput();
    handleTimeScaleInput();
    updateDisplays();
    // Event Listeners for inputs
    gravityInput.addEventListener("input", handleGravityInput);
    gravityInput.addEventListener("focus", handleGravityFocus);
    gravityInput.addEventListener("blur", handleGravityInput);
    heightInput.addEventListener("input", handleHeightInput);
    heightInput.addEventListener("focus", handleHeightFocus);
    heightInput.addEventListener("blur", handleHeightInput);
    massInput.addEventListener("input", handleMassInput);
    massInput.addEventListener("focus", handleGravityFocus);
    massInput.addEventListener("blur", handleMassInput);
    bouncinessSlider.addEventListener("input", handleBouncinessInput);
    airResistanceSlider.addEventListener("input", handleAirResistanceInput);
    timeScaleSlider.addEventListener("input", handleTimeScaleInput);
    presetSelect.addEventListener("change", handlePresetChange);
    showTrajectoryCheckbox.addEventListener("change", handleTrajectoryToggle);
    enableSoundCheckbox.addEventListener("change", handleSoundToggle);
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
    massInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            this.blur();
        }
    });
    // Event Listeners for buttons
    const startBtn = document.getElementById("start-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const againBtn = document.getElementById("again-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const exportBtn = document.getElementById("export-btn");
    if (startBtn)
        startBtn.addEventListener("click", startSimulation);
    if (pauseBtn)
        pauseBtn.addEventListener("click", togglePause);
    if (againBtn)
        againBtn.addEventListener("click", resetSimulation);
    if (settingsBtn)
        settingsBtn.addEventListener("click", showSettingsMenu);
    if (exportBtn)
        exportBtn.addEventListener("click", exportSettings);
    // Keyboard shortcuts
    document.addEventListener("keydown", function (e) {
        // Don't trigger shortcuts when typing in inputs
        if (e.target instanceof HTMLInputElement) {
            if (e.key === "Escape") {
                e.target.blur();
            }
            return;
        }
        switch (e.key) {
            case " ":
            case "Spacebar":
                e.preventDefault();
                if (!isRunning) {
                    startSimulation();
                }
                else {
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
}
else {
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
