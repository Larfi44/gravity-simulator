"use strict";
// Gravity Simulator - TypeScript Version
// Preset environments
const presets = {
    earth: 9.8,
    moon: 1.62,
    mars: 3.71,
    jupiter: 24.79,
    zero: 0
};
// Simulation state
let state = {
    isRunning: false,
    isPaused: false,
    height: 30,
    velocity: 0,
    time: 0,
    bounceCount: 0,
    gravity: 9.8,
    bounciness: 0.7,
    airResistance: 0.0,
    timeScale: 1.0
};
let animationId = null;
let lastTime = 0;
let initialHeight = 30;
// DOM Elements
let elements;
// Initialize DOM elements
function initDOM() {
    elements = {
        gravityInput: document.getElementById('gravity-input'),
        heightInput: document.getElementById('height-input'),
        bouncinessSlider: document.getElementById('bounciness-slider'),
        airResistanceSlider: document.getElementById('air-resistance-slider'),
        timeScaleSlider: document.getElementById('time-scale-slider'),
        bouncinessValue: document.getElementById('bounciness-value'),
        airResistanceValue: document.getElementById('air-resistance-value'),
        timeScaleValue: document.getElementById('time-scale-value'),
        currentStatus: document.getElementById('current-status'),
        currentGravity: document.getElementById('current-gravity'),
        currentBounciness: document.getElementById('current-bounciness'),
        heightDisplay: document.getElementById('height-display'),
        velocityDisplay: document.getElementById('velocity'),
        timeDisplay: document.getElementById('time'),
        bounceNumber: document.getElementById('bounce-number'),
        kineticEnergy: document.getElementById('kinetic-energy'),
        potentialEnergy: document.getElementById('potential-energy'),
        totalEnergy: document.getElementById('total-energy'),
        airResistanceDisplay: document.getElementById('air-resistance-display'),
        startBtn: document.getElementById('start-btn'),
        pauseBtn: document.getElementById('pause-btn'),
        againBtn: document.getElementById('again-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        saveBtn: document.getElementById('save-btn'),
        loadBtn: document.getElementById('load-btn'),
        object: document.getElementById('object'),
        ground: document.getElementById('ground'),
        settingsMenu: document.getElementById('settings-menu')
    };
}
// Update display values
function updateDisplay() {
    elements.heightDisplay.textContent = `${state.height.toFixed(2)} m`;
    elements.velocityDisplay.textContent = `${state.velocity.toFixed(2)} m/s`;
    elements.timeDisplay.textContent = `${state.time.toFixed(2)} s`;
    elements.bounceNumber.textContent = state.bounceCount.toString();
    // Calculate energies (assuming mass = 1 kg for simplicity)
    const mass = 1;
    const kinetic = 0.5 * mass * state.velocity * state.velocity;
    const potential = mass * state.gravity * state.height;
    const total = kinetic + potential;
    elements.kineticEnergy.textContent = `${kinetic.toFixed(2)} J`;
    elements.potentialEnergy.textContent = `${potential.toFixed(2)} J`;
    elements.totalEnergy.textContent = `${total.toFixed(2)} J`;
    elements.airResistanceDisplay.textContent = state.airResistance.toFixed(2);
    elements.currentGravity.textContent = `${state.gravity.toFixed(1)} m/s²`;
    elements.currentBounciness.textContent = state.bounciness.toFixed(2);
}
// Update status
function updateStatus(status) {
    elements.currentStatus.textContent = status;
}
// Physics simulation step
function physicsStep(deltaTime) {
    if (!state.isRunning || state.isPaused)
        return;
    // Apply time scale
    const dt = deltaTime * state.timeScale;
    // Update velocity with gravity and air resistance
    const airDrag = state.airResistance * state.velocity * Math.abs(state.velocity);
    state.velocity += (state.gravity - airDrag) * dt;
    // Update height
    state.height -= state.velocity * dt;
    // Update time
    state.time += dt;
    // Ground collision
    if (state.height <= 0) {
        state.height = 0;
        state.velocity = -state.velocity * state.bounciness;
        // Stop if velocity is very small
        if (Math.abs(state.velocity) < 0.1) {
            state.velocity = 0;
            state.isRunning = false;
            updateStatus('Stopped');
        }
        else {
            state.bounceCount++;
            updateStatus(`Bounced (${state.bounceCount})`);
        }
    }
    updateDisplay();
    updateObjectPosition();
}
// Update object position on screen
function updateObjectPosition() {
    const groundRect = elements.ground.getBoundingClientRect();
    const objectHeight = elements.object.offsetHeight;
    const maxHeight = groundRect.top - objectHeight - 50;
    const minHeight = groundRect.top - objectHeight;
    // Convert height (meters) to pixels
    const pixelHeight = minHeight + (maxHeight - minHeight) * (state.height / initialHeight);
    elements.object.style.bottom = `${window.innerHeight - groundRect.top + objectHeight}px`;
    elements.object.style.transform = `translateY(${-state.height * 10}px)`;
}
// Animation loop
function animate(timestamp) {
    if (!lastTime)
        lastTime = timestamp;
    const deltaTime = (timestamp - lastTime) / 1000; // Convert to seconds
    lastTime = timestamp;
    physicsStep(deltaTime);
    if (state.isRunning && !state.isPaused) {
        animationId = requestAnimationFrame(animate);
    }
}
// Start simulation
function startSimulation() {
    if (state.isRunning && !state.isPaused)
        return;
    if (!state.isRunning) {
        // Reset state
        state.height = parseFloat(elements.heightInput.value);
        state.gravity = parseFloat(elements.gravityInput.value);
        state.bounciness = parseFloat(elements.bouncinessSlider.value);
        state.airResistance = parseFloat(elements.airResistanceSlider.value);
        state.timeScale = parseFloat(elements.timeScaleSlider.value);
        state.velocity = 0;
        state.time = 0;
        state.bounceCount = 0;
        initialHeight = state.height;
        state.isRunning = true;
        state.isPaused = false;
        updateStatus('Running');
        lastTime = 0;
        animationId = requestAnimationFrame(animate);
    }
    else if (state.isPaused) {
        state.isPaused = false;
        updateStatus('Running');
        lastTime = 0;
        animationId = requestAnimationFrame(animate);
    }
    updateDisplay();
}
// Pause simulation
function pauseSimulation() {
    if (!state.isRunning)
        return;
    state.isPaused = !state.isPaused;
    if (state.isPaused) {
        updateStatus('Paused');
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    else {
        updateStatus('Running');
        lastTime = 0;
        animationId = requestAnimationFrame(animate);
    }
    elements.pauseBtn.querySelector('.icon').textContent = state.isPaused ? '▶️' : '⏸️';
    elements.pauseBtn.querySelector('.text').textContent = state.isPaused ? 'Resume' : 'Pause';
}
// Reset simulation
function resetSimulation() {
    state.isRunning = false;
    state.isPaused = false;
    state.velocity = 0;
    state.time = 0;
    state.bounceCount = 0;
    state.height = parseFloat(elements.heightInput.value);
    initialHeight = state.height;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    updateStatus('Ready');
    elements.pauseBtn.querySelector('.icon').textContent = '⏸️';
    elements.pauseBtn.querySelector('.text').textContent = 'Pause';
    updateDisplay();
    updateObjectPosition();
}
// Toggle settings menu
function toggleSettings() {
    elements.settingsMenu.classList.toggle('active');
}
// Save settings to localStorage
function saveSettings() {
    const settings = {
        gravity: state.gravity,
        height: state.height,
        bounciness: state.bounciness,
        airResistance: state.airResistance,
        timeScale: state.timeScale
    };
    localStorage.setItem('gravitySimulatorSettings', JSON.stringify(settings));
    alert('Settings saved!');
}
// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('gravitySimulatorSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        elements.gravityInput.value = settings.gravity.toString();
        elements.heightInput.value = settings.height.toString();
        elements.bouncinessSlider.value = settings.bounciness.toString();
        elements.airResistanceSlider.value = settings.airResistance.toString();
        elements.timeScaleSlider.value = settings.timeScale.toString();
        // Update state
        state.gravity = settings.gravity;
        state.height = settings.height;
        state.bounciness = settings.bounciness;
        state.airResistance = settings.airResistance;
        state.timeScale = settings.timeScale;
        // Update display values
        elements.bouncinessValue.textContent = state.bounciness.toFixed(2);
        elements.airResistanceValue.textContent = state.airResistance.toFixed(2);
        elements.timeScaleValue.textContent = `${state.timeScale.toFixed(1)}x`;
        updateDisplay();
        alert('Settings loaded!');
    }
    else {
        alert('No saved settings found.');
    }
}
// Handle preset selection
function handlePresetChange(presetName) {
    if (presetName in presets) {
        const gravity = presets[presetName];
        elements.gravityInput.value = gravity.toString();
        state.gravity = gravity;
        elements.currentGravity.textContent = `${gravity.toFixed(1)} m/s²`;
    }
}
// Event listeners
function initEventListeners() {
    // Start button
    elements.startBtn.addEventListener('click', startSimulation);
    // Pause button
    elements.pauseBtn.addEventListener('click', pauseSimulation);
    // Again button
    elements.againBtn.addEventListener('click', resetSimulation);
    // Settings button
    elements.settingsBtn.addEventListener('click', toggleSettings);
    // Save button
    elements.saveBtn.addEventListener('click', saveSettings);
    // Load button
    elements.loadBtn.addEventListener('click', loadSettings);
    // Preset buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const gravity = parseFloat(btn.dataset.gravity || '9.8');
            elements.gravityInput.value = gravity.toString();
            state.gravity = gravity;
            elements.currentGravity.textContent = `${gravity.toFixed(1)} m/s²`;
        });
    });
    // Input change handlers
    elements.gravityInput.addEventListener('change', () => {
        state.gravity = parseFloat(elements.gravityInput.value);
        updateDisplay();
    });
    elements.heightInput.addEventListener('change', () => {
        if (!state.isRunning) {
            state.height = parseFloat(elements.heightInput.value);
            initialHeight = state.height;
            updateDisplay();
            updateObjectPosition();
        }
    });
    elements.bouncinessSlider.addEventListener('input', () => {
        state.bounciness = parseFloat(elements.bouncinessSlider.value);
        elements.bouncinessValue.textContent = state.bounciness.toFixed(2);
        updateDisplay();
    });
    elements.airResistanceSlider.addEventListener('input', () => {
        state.airResistance = parseFloat(elements.airResistanceSlider.value);
        elements.airResistanceValue.textContent = state.airResistance.toFixed(2);
        updateDisplay();
    });
    elements.timeScaleSlider.addEventListener('input', () => {
        state.timeScale = parseFloat(elements.timeScaleSlider.value);
        elements.timeScaleValue.textContent = `${state.timeScale.toFixed(2)}x`;
    });
}
// Initialize
function init() {
    initDOM();
    initEventListeners();
    updateDisplay();
    updateObjectPosition();
    updateStatus('Ready');
}
// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
