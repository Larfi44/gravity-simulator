// DOM Elements
var object = document.getElementById("object");
var settingsMenu = document.getElementById("settings-menu");
// Input Elements
var gravityInput = document.getElementById("gravity-input");
var heightInput = document.getElementById("height-input");
var bouncinessSlider = document.getElementById("bounciness-slider");
var bouncinessValue = document.getElementById("bounciness-value");
// Display Elements
var currentStatus = document.getElementById("current-status");
var currentGravityDisplay = document.getElementById("current-gravity");
var currentBouncinessDisplay = document.getElementById("current-bounciness");
var currentHeightDisplay = document.getElementById("current-height-display");
var heightDisplay = document.getElementById("height-display");
var velocityDisplay = document.getElementById("velocity");
var timeDisplay = document.getElementById("time");
var bounceNumberDisplay = document.getElementById("bounce-number");
var energyDisplay = document.getElementById("energy");
// Game State
var gravity = 9.8;
var startHeight = 30;
var bounciness = 0.7;
var velocity = 0;
var currentHeight = 30;
var time = 0;
var bounceCount = 0;
var isRunning = false;
var isPaused = false;
var isFalling = true;
var energy = 100;
var currentBounceEnergy = 100;
var animationId = null;
var lastTime = 0;
// Game Constants
var GROUND_HEIGHT_PERCENT = 90;
var MIN_BOUNCE_HEIGHT = 0.01;
var MIN_VELOCITY = 0.05;
// Store original values before editing
var originalGravityValue = "9.8";
var originalHeightValue = "30";
// Format and validate number on blur only
function formatNumberOnBlur(inputValue, maxDecimals, minValue) {
    // Trim whitespace
    var trimmed = inputValue.trim();
    // If empty, return minimum value ONLY on blur
    if (trimmed === "") {
        return {
            value: minValue,
            display: minValue.toString(),
        };
    }
    // Remove any non-digit and non-dot characters (allow negative for some cases)
    var cleaned = trimmed.replace(/[^\d.-]/g, "");
    // Remove extra dots (keep only first one)
    var dotIndex = cleaned.indexOf(".");
    if (dotIndex !== -1) {
        cleaned =
            cleaned.substring(0, dotIndex + 1) +
                cleaned.substring(dotIndex + 1).replace(/\./g, "");
    }
    // Handle edge cases
    if (cleaned === "" || cleaned === "." || cleaned === "-") {
        return {
            value: minValue,
            display: minValue.toString(),
        };
    }
    // Parse the number
    var value = parseFloat(cleaned);
    // If NaN, return minimum value
    if (isNaN(value)) {
        return {
            value: minValue,
            display: minValue.toString(),
        };
    }
    // Ensure minimum value
    if (value < minValue) {
        value = minValue;
    }
    // Format with max decimals, but remove unnecessary trailing zeros
    var display = value.toString();
    // If it has decimals, limit to maxDecimals and clean up
    if (display.includes(".")) {
        // Limit to maxDecimals
        var parts = display.split(".");
        if (parts[1].length > maxDecimals) {
            value = parseFloat(value.toFixed(maxDecimals));
            display = value.toString();
        }
        // Remove trailing zeros after decimal
        display = display.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
    }
    return { value: value, display: display };
}
// Handle gravity input on blur (after editing)
function handleGravityBlur() {
    var trimmedValue = gravityInput.value.trim();
    // If empty, set to minimum
    if (trimmedValue === "") {
        var minValue = 0.01;
        gravityInput.value = minValue.toString();
        gravity = minValue;
        if (currentGravityDisplay) {
            currentGravityDisplay.textContent = "".concat(minValue, " m/s\u00B2");
        }
        return;
    }
    // Otherwise, format normally
    var result = formatNumberOnBlur(gravityInput.value, 2, 0.01);
    // Update the input field with corrected value
    gravityInput.value = result.display;
    // Store the actual value
    gravity = result.value;
    // Update display
    if (currentGravityDisplay) {
        currentGravityDisplay.textContent = "".concat(result.display, " m/s\u00B2");
    }
}
// Handle height input on blur (after editing)
function handleHeightBlur() {
    var trimmedValue = heightInput.value.trim();
    // If empty, set to minimum
    if (trimmedValue === "") {
        var minValue = 0.1;
        heightInput.value = minValue.toString();
        startHeight = minValue;
        if (!isRunning) {
            currentHeight = minValue;
        }
        if (currentHeightDisplay) {
            currentHeightDisplay.textContent = "".concat(minValue, " m");
        }
        if (heightDisplay && !isRunning) {
            heightDisplay.textContent = "".concat(minValue.toFixed(1), " m");
        }
        return;
    }
    // Otherwise, format normally
    var result = formatNumberOnBlur(heightInput.value, 1, 0.1);
    // Update the input field with corrected value
    heightInput.value = result.display;
    // Store the actual value
    startHeight = result.value;
    // Update current height if simulation not running
    if (!isRunning) {
        currentHeight = startHeight;
    }
    // Update display
    if (currentHeightDisplay) {
        currentHeightDisplay.textContent = "".concat(result.display, " m");
    }
    // Update height display (always show 1 decimal for physics)
    if (heightDisplay && !isRunning) {
        heightDisplay.textContent = "".concat(currentHeight.toFixed(1), " m");
    }
}
// Handle gravity input on focus - store original value
function handleGravityFocus() {
    originalGravityValue = gravityInput.value;
    setTimeout(function () {
        gravityInput.select();
    }, 10);
}
// Handle height input on focus - store original value
function handleHeightFocus() {
    originalHeightValue = heightInput.value;
    setTimeout(function () {
        heightInput.select();
    }, 10);
}
// Handle Escape key - restore original value
function handleGravityKeyDown(e) {
    if (e.key === "Escape") {
        gravityInput.value = originalGravityValue;
        gravityInput.blur();
    }
    else if (e.key === "Enter") {
        gravityInput.blur();
    }
}
// Handle Escape key - restore original value
function handleHeightKeyDown(e) {
    if (e.key === "Escape") {
        heightInput.value = originalHeightValue;
        heightInput.blur();
    }
    else if (e.key === "Enter") {
        heightInput.blur();
    }
}
// Update bounciness from slider
function handleBouncinessInput() {
    bounciness = parseFloat(bouncinessSlider.value);
    // Update slider value display
    if (bouncinessValue) {
        bouncinessValue.textContent = bounciness.toFixed(2);
    }
    // Update bounciness display
    if (currentBouncinessDisplay) {
        currentBouncinessDisplay.textContent = bounciness.toFixed(2);
    }
}
// Update all displays
function updateDisplays() {
    if (currentStatus) {
        if (!isRunning) {
            currentStatus.textContent = "Stopped ⏹️";
        }
        else {
            currentStatus.textContent = isFalling ? "Falling ↓" : "Rising ↑";
        }
    }
    // Height: show 1 decimal for physics
    if (heightDisplay) {
        heightDisplay.textContent = "".concat(currentHeight.toFixed(1), " m");
    }
    // Velocity: 2 decimals
    if (velocityDisplay) {
        var velocitySign = isFalling ? "-" : "+";
        velocityDisplay.textContent = "".concat(velocitySign).concat(Math.abs(velocity).toFixed(2), " m/s");
    }
    // Time: 2 decimals
    if (timeDisplay) {
        timeDisplay.textContent = "".concat(time.toFixed(2), " s");
    }
    if (bounceNumberDisplay) {
        bounceNumberDisplay.textContent = bounceCount.toString();
    }
    // Energy: 0 decimals
    if (energyDisplay) {
        energyDisplay.textContent = "".concat(energy.toFixed(0), "%");
    }
}
// Convert meters to screen percentage
function metersToPercent(meters) {
    var maxHeight = startHeight;
    var groundPercent = GROUND_HEIGHT_PERCENT;
    var percent = ((maxHeight - meters) / maxHeight) * groundPercent;
    return Math.max(0, Math.min(groundPercent, percent));
}
// Update object position
function updateObjectPosition() {
    var screenPosition = metersToPercent(currentHeight);
    object.style.top = "".concat(screenPosition, "%");
    // Visual feedback based on state
    var hue = isFalling ? 200 : 300;
    object.style.background = "radial-gradient(circle at 30% 30%, hsl(".concat(hue, ", 100%, 70%), hsl(").concat(hue + 30, ", 100%, 50%))");
}
// Calculate next bounce height
function calculateNextBounceHeight(currentPeakHeight) {
    return currentPeakHeight * Math.pow(bounciness, 2);
}
// Physics update
function updatePhysics(deltaTime) {
    if (!isRunning || isPaused)
        return;
    time += deltaTime;
    if (isFalling) {
        velocity += gravity * deltaTime;
        currentHeight -= velocity * deltaTime;
        if (currentHeight <= 0) {
            currentHeight = 0;
            var impactVelocity = Math.abs(velocity);
            var bounceVelocity = impactVelocity * bounciness;
            energy = energy * Math.pow(bounciness, 2);
            currentBounceEnergy = currentBounceEnergy * Math.pow(bounciness, 2);
            if (bounceVelocity >= MIN_VELOCITY && currentHeight < startHeight) {
                velocity = -bounceVelocity;
                isFalling = false;
                bounceCount++;
                object.classList.add("bouncing");
                setTimeout(function () { return object.classList.remove("bouncing"); }, 300);
            }
            else {
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
        velocity += gravity * deltaTime;
        currentHeight -= velocity * deltaTime;
        if (velocity >= -0.01) {
            velocity = 0;
            isFalling = true;
            var nextBounceHeight = calculateNextBounceHeight(currentHeight);
            if (nextBounceHeight < MIN_BOUNCE_HEIGHT) {
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
    var deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    updatePhysics(deltaTime);
    if (isRunning && !isPaused) {
        animationId = requestAnimationFrame(gameLoop);
    }
}
// Start simulation
function startSimulation() {
    // Get values from inputs
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
function resetSimulation() {
    velocity = 0;
    currentHeight = startHeight;
    time = 0;
    bounceCount = 0;
    isRunning = true;
    isPaused = false;
    isFalling = true;
    energy = 100;
    currentBounceEnergy = 100;
    updateDisplays();
    updateObjectPosition();
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
    bouncinessSlider.value = "0.70";
    // Store original values
    originalGravityValue = gravityInput.value;
    originalHeightValue = heightInput.value;
    // Update displays
    handleGravityBlur();
    handleHeightBlur();
    handleBouncinessInput();
    updateDisplays();
    // Event Listeners
    gravityInput.addEventListener("focus", handleGravityFocus);
    gravityInput.addEventListener("blur", handleGravityBlur);
    gravityInput.addEventListener("keydown", handleGravityKeyDown);
    heightInput.addEventListener("focus", handleHeightFocus);
    heightInput.addEventListener("blur", handleHeightBlur);
    heightInput.addEventListener("keydown", handleHeightKeyDown);
    bouncinessSlider.addEventListener("input", handleBouncinessInput);
    // Main buttons
    var startBtn = document.getElementById("start-btn");
    var pauseBtn = document.getElementById("pause-btn");
    var againBtn = document.getElementById("again-btn");
    var settingsBtn = document.getElementById("settings-btn");
    if (startBtn)
        startBtn.addEventListener("click", startSimulation);
    if (pauseBtn)
        pauseBtn.addEventListener("click", togglePause);
    if (againBtn)
        againBtn.addEventListener("click", resetSimulation);
    if (settingsBtn)
        settingsBtn.addEventListener("click", showSettingsMenu);
    // Global keyboard shortcuts
    document.addEventListener("keydown", function (e) {
        // Don't trigger shortcuts when typing in inputs
        if (e.target instanceof HTMLInputElement) {
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
var style = document.createElement("style");
style.textContent = "\n  @keyframes bounce {\n    0% { transform: translateX(-50%) scale(1, 1); }\n    30% { transform: translateX(-50%) scale(1.1, 0.9); }\n    50% { transform: translateX(-50%) scale(0.9, 1.1); }\n    70% { transform: translateX(-50%) scale(1.05, 0.95); }\n    100% { transform: translateX(-50%) scale(1, 1); }\n  }\n  \n  .bouncing {\n    animation: bounce 0.4s ease;\n  }\n";
document.head.appendChild(style);
