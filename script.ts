// Gravity Simulator - TypeScript Implementation

// Interfaces for type safety
interface SimulationSettings {
  gravity: number;
  height: number;
  bounciness: number;
  airResistance: number;
  timeScale: number;
}

interface SavedSetting extends SimulationSettings {
  name: string;
  timestamp: number;
}

interface DOMElements {
  settingsMenu: HTMLElement;
  gravityInput: HTMLInputElement;
  heightInput: HTMLInputElement;
  bouncinessSlider: HTMLInputElement;
  airResistanceSlider: HTMLInputElement;
  simTimeScaleSlider: HTMLInputElement;
  bouncinessValue: HTMLElement;
  airResistanceValue: HTMLElement;
  simTimeScaleValue: HTMLElement;
  timeScaleDisplay: HTMLElement;
  startBtn: HTMLElement;
  saveBtn: HTMLElement;
  loadBtn: HTMLElement;
  pauseBtn: HTMLElement;
  againBtn: HTMLElement;
  settingsBtn: HTMLElement;
  ground: HTMLElement;
  object: HTMLElement;
  currentStatus: HTMLElement;
  currentGravity: HTMLElement;
  currentBounciness: HTMLElement;
  heightDisplay: HTMLElement;
  velocity: HTMLElement;
  time: HTMLElement;
  bounceNumber: HTMLElement;
  kineticEnergy: HTMLElement;
  potentialEnergy: HTMLElement;
  totalEnergy: HTMLElement;
  airResistanceDisplay: HTMLElement;
  inputFocusNotice: HTMLElement;
}

// Global variables
let settings: SimulationSettings = {
  gravity: 9.8,
  height: 30,
  bounciness: 0.7,
  airResistance: 0.0,
  timeScale: 1.0
};

let isRunning: boolean = false;
let isPaused: boolean = false;
let animationId: number | null = null;
let currentTime: number = 0;
let currentHeight: number = 30;
let currentVelocity: number = 0;
let bounceCount: number = 0;
let objectMass: number = 1.0; // Fixed mass for energy calculations
const pixelsPerMeter: number = 10;

// DOM Elements
const elements: DOMElements = {} as DOMElements;

// Initialize DOM elements
function initializeElements(): void {
  elements.settingsMenu = document.getElementById('settings-menu') as HTMLElement;
  elements.gravityInput = document.getElementById('gravity-input') as HTMLInputElement;
  elements.heightInput = document.getElementById('height-input') as HTMLInputElement;
  elements.bouncinessSlider = document.getElementById('bounciness-slider') as HTMLInputElement;
  elements.airResistanceSlider = document.getElementById('air-resistance-slider') as HTMLInputElement;
  elements.simTimeScaleSlider = document.getElementById('sim-time-scale-slider') as HTMLInputElement;
  elements.bouncinessValue = document.getElementById('bounciness-value') as HTMLElement;
  elements.airResistanceValue = document.getElementById('air-resistance-value') as HTMLElement;
  elements.simTimeScaleValue = document.getElementById('sim-time-scale-value') as HTMLElement;
  elements.timeScaleDisplay = document.getElementById('time-scale-display') as HTMLElement;
  elements.startBtn = document.getElementById('start-btn') as HTMLElement;
  elements.saveBtn = document.getElementById('save-btn') as HTMLElement;
  elements.loadBtn = document.getElementById('load-btn') as HTMLElement;
  elements.pauseBtn = document.getElementById('pause-btn') as HTMLElement;
  elements.againBtn = document.getElementById('again-btn') as HTMLElement;
  elements.settingsBtn = document.getElementById('settings-btn') as HTMLElement;
  elements.ground = document.getElementById('ground') as HTMLElement;
  elements.object = document.getElementById('object') as HTMLElement;
  elements.currentStatus = document.getElementById('current-status') as HTMLElement;
  elements.currentGravity = document.getElementById('current-gravity') as HTMLElement;
  elements.currentBounciness = document.getElementById('current-bounciness') as HTMLElement;
  elements.heightDisplay = document.getElementById('height-display') as HTMLElement;
  elements.velocity = document.getElementById('velocity') as HTMLElement;
  elements.time = document.getElementById('time') as HTMLElement;
  elements.bounceNumber = document.getElementById('bounce-number') as HTMLElement;
  elements.kineticEnergy = document.getElementById('kinetic-energy') as HTMLElement;
  elements.potentialEnergy = document.getElementById('potential-energy') as HTMLElement;
  elements.totalEnergy = document.getElementById('total-energy') as HTMLElement;
  elements.airResistanceDisplay = document.getElementById('air-resistance-display') as HTMLElement;
  elements.inputFocusNotice = document.getElementById('input-focus-notice') as HTMLElement;
}

// Update display values
function updateDisplays(): void {
  elements.bouncinessValue.textContent = settings.bounciness.toFixed(2);
  elements.airResistanceValue.textContent = settings.airResistance.toFixed(2);
  elements.simTimeScaleValue.textContent = settings.timeScale.toFixed(2) + 'x';
  elements.timeScaleDisplay.textContent = settings.timeScale.toFixed(2) + 'x';
  elements.currentGravity.textContent = settings.gravity.toFixed(2) + ' m/s²';
  elements.currentBounciness.textContent = settings.bounciness.toFixed(2);
  elements.airResistanceDisplay.textContent = settings.airResistance.toFixed(2);
}

// Save settings to localStorage with custom name
function saveSettings(): void {
  const saveName = prompt('Enter a name for this save:');
  if (!saveName || saveName.trim() === '') {
    alert('Please enter a valid name for the save.');
    return;
  }

  const savedSettings: SavedSetting = {
    ...settings,
    name: saveName.trim(),
    timestamp: Date.now()
  };

  // Get existing saves
  const existingSaves = getSaves();
  
  // Check if name already exists
  const existingIndex = existingSaves.findIndex(s => s.name === savedSettings.name);
  if (existingIndex !== -1) {
    if (confirm(`A save named "${savedSettings.name}" already exists. Overwrite?`)) {
      existingSaves[existingIndex] = savedSettings;
    } else {
      return;
    }
  } else {
    existingSaves.push(savedSettings);
  }

  localStorage.setItem('gravitySimulatorSaves', JSON.stringify(existingSaves));
  alert(`Settings saved as "${savedSettings.name}"!`);
}

// Get all saved settings from localStorage
function getSaves(): SavedSetting[] {
  const savesJson = localStorage.getItem('gravitySimulatorSaves');
  return savesJson ? JSON.parse(savesJson) : [];
}

// Load settings menu
function showLoadMenu(): void {
  const saves = getSaves();
  
  if (saves.length === 0) {
    alert('No saved settings found.');
    return;
  }

  let message = 'Saved Settings:\n\n';
  saves.forEach((save, index) => {
    const date = new Date(save.timestamp).toLocaleDateString();
    message += `${index + 1}. ${save.name} (${date})\n`;
    message += `   Gravity: ${save.gravity}, Height: ${save.height}, Bounciness: ${save.bounciness}\n\n`;
  });
  message += '\nEnter the number of the save to load, or 0 to cancel:';

  const choice = prompt(message);
  if (!choice) return;
  
  const selectedIndex = parseInt(choice, 10) - 1;
  
  if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= saves.length) {
    if (parseInt(choice, 10) !== 0) {
      alert('Invalid selection.');
    }
    return;
  }

  const selectedSave = saves[selectedIndex];
  settings = {
    gravity: selectedSave.gravity,
    height: selectedSave.height,
    bounciness: selectedSave.bounciness,
    airResistance: selectedSave.airResistance,
    timeScale: selectedSave.timeScale
  };

  // Update UI
  elements.gravityInput.value = settings.gravity.toString();
  elements.heightInput.value = settings.height.toString();
  elements.bouncinessSlider.value = settings.bounciness.toString();
  elements.airResistanceSlider.value = settings.airResistance.toString();
  elements.simTimeScaleSlider.value = settings.timeScale.toString();
  
  updateDisplays();
  alert(`Loaded "${selectedSave.name}"!`);
}

// Delete a save
function deleteSave(index: number): void {
  const saves = getSaves();
  if (index >= 0 && index < saves.length) {
    const deleted = saves.splice(index, 1);
    localStorage.setItem('gravitySimulatorSaves', JSON.stringify(saves));
    alert(`Deleted "${deleted[0].name}"`);
  }
}

// Physics simulation
function simulatePhysics(deltaTime: number): void {
  if (!isRunning || isPaused) return;

  const scaledDeltaTime = deltaTime * settings.timeScale;
  currentTime += scaledDeltaTime;

  // Apply gravity
  currentVelocity += settings.gravity * scaledDeltaTime;

  // Apply air resistance (drag force proportional to velocity squared)
  if (settings.airResistance > 0 && currentVelocity !== 0) {
    const dragForce = settings.airResistance * currentVelocity * Math.abs(currentVelocity);
    currentVelocity -= dragForce * scaledDeltaTime;
  }

  // Update position
  currentHeight -= currentVelocity * scaledDeltaTime;

  // Ground collision detection
  if (currentHeight <= 0) {
    currentHeight = 0;
    
    if (Math.abs(currentVelocity) > 0.1) {
      // Bounce
      currentVelocity = -currentVelocity * settings.bounciness;
      bounceCount++;
      
      // If velocity is too small after bounce, stop
      if (Math.abs(currentVelocity) < 0.5) {
        currentVelocity = 0;
        isRunning = false;
        elements.currentStatus.textContent = 'Stopped';
      }
    } else {
      currentVelocity = 0;
      isRunning = false;
      elements.currentStatus.textContent = 'Stopped';
    }
  }

  // Update displays
  updateSimulationDisplays();
}

// Update simulation-specific displays
function updateSimulationDisplays(): void {
  const heightInMeters = Math.max(0, currentHeight);
  const velocityValue = currentVelocity;
  const timeValue = currentTime;
  
  // Calculate energies (KE = 0.5 * m * v^2, PE = m * g * h)
  const kineticEnergyValue = 0.5 * objectMass * velocityValue * velocityValue;
  const potentialEnergyValue = objectMass * settings.gravity * heightInMeters;
  const totalEnergyValue = kineticEnergyValue + potentialEnergyValue;

  elements.heightDisplay.textContent = heightInMeters.toFixed(2) + ' m';
  elements.velocity.textContent = velocityValue.toFixed(2) + ' m/s';
  elements.time.textContent = timeValue.toFixed(2) + ' s';
  elements.bounceNumber.textContent = bounceCount.toString();
  elements.kineticEnergy.textContent = kineticEnergyValue.toFixed(2) + ' J';
  elements.potentialEnergy.textContent = potentialEnergyValue.toFixed(2) + ' J';
  elements.totalEnergy.textContent = totalEnergyValue.toFixed(2) + ' J';

  // Update object position visually
  const groundRect = elements.ground.getBoundingClientRect();
  const objectHeight = elements.object.offsetHeight;
  const availableHeight = groundRect.top - objectHeight;
  const pixelPosition = availableHeight - (heightInMeters * pixelsPerMeter);
  
  elements.object.style.transform = `translateY(${Math.max(0, pixelPosition)}px)`;
}

// Animation loop
function animate(timestamp: number): void {
  if (!isRunning || isPaused) {
    if (isRunning) {
      animationId = requestAnimationFrame(animate);
    }
    return;
  }

  const deltaTime = 0.016; // Approximate 60fps
  simulatePhysics(deltaTime);
  
  if (isRunning) {
    animationId = requestAnimationFrame(animate);
  }
}

// Start simulation
function startSimulation(): void {
  // Reset state
  currentHeight = settings.height;
  currentVelocity = 0;
  currentTime = 0;
  bounceCount = 0;
  isRunning = true;
  isPaused = false;
  
  // Hide settings menu
  elements.settingsMenu.style.display = 'none';
  
  // Update status
  elements.currentStatus.textContent = 'Running';
  
  // Initial display update
  updateSimulationDisplays();
  
  // Start animation loop
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  animationId = requestAnimationFrame(animate);
}

// Pause/Resume simulation
function togglePause(): void {
  if (!isRunning) return;
  
  isPaused = !isPaused;
  const pauseBtnText = elements.pauseBtn.querySelector('.text') as HTMLElement;
  const pauseBtnIcon = elements.pauseBtn.querySelector('.icon') as HTMLElement;
  
  if (isPaused) {
    elements.currentStatus.textContent = 'Paused';
    if (pauseBtnText) pauseBtnText.textContent = 'Resume';
    if (pauseBtnIcon) pauseBtnIcon.textContent = '▶️';
  } else {
    elements.currentStatus.textContent = 'Running';
    if (pauseBtnText) pauseBtnText.textContent = 'Pause';
    if (pauseBtnIcon) pauseBtnIcon.textContent = '⏸️';
    animate(0);
  }
}

// Restart simulation
function restartSimulation(): void {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  // Show settings menu
  elements.settingsMenu.style.display = 'block';
  elements.currentStatus.textContent = 'Ready';
  isRunning = false;
  isPaused = false;
  
  // Reset object position
  elements.object.style.transform = 'translateY(0px)';
  
  // Reset displays to initial values
  currentHeight = settings.height;
  currentVelocity = 0;
  currentTime = 0;
  bounceCount = 0;
  updateSimulationDisplays();
}

// Open settings
function openSettings(): void {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  elements.settingsMenu.style.display = 'block';
  elements.currentStatus.textContent = 'Ready';
  isRunning = false;
  isPaused = false;
  
  // Reset object position
  elements.object.style.transform = 'translateY(0px)';
  
  // Reset displays to initial values
  currentHeight = settings.height;
  currentVelocity = 0;
  currentTime = 0;
  bounceCount = 0;
  updateSimulationDisplays();
}

// Event listeners setup
function setupEventListeners(): void {
  // Gravity input change
  elements.gravityInput.addEventListener('change', () => {
    const value = parseFloat(elements.gravityInput.value);
    if (value >= 0.01) {
      settings.gravity = value;
      updateDisplays();
    }
  });

  // Height input change
  elements.heightInput.addEventListener('change', () => {
    const value = parseFloat(elements.heightInput.value);
    if (value >= 0.1) {
      settings.height = value;
      currentHeight = value;
      updateSimulationDisplays();
    }
  });

  // Bounciness slider change
  elements.bouncinessSlider.addEventListener('input', () => {
    settings.bounciness = parseFloat(elements.bouncinessSlider.value);
    updateDisplays();
  });

  // Air resistance slider change
  elements.airResistanceSlider.addEventListener('input', () => {
    settings.airResistance = parseFloat(elements.airResistanceSlider.value);
    updateDisplays();
  });

  // Time scale slider change during simulation (can be adjusted while running)
  elements.simTimeScaleSlider.addEventListener('input', () => {
    settings.timeScale = parseFloat(elements.simTimeScaleSlider.value);
    updateDisplays();
  });

  // Preset buttons for gravity
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const gravity = parseFloat((btn as HTMLElement).dataset.gravity || '9.8');
      settings.gravity = gravity;
      elements.gravityInput.value = gravity.toString();
      updateDisplays();
    });
  });

  // Start button
  elements.startBtn.addEventListener('click', startSimulation);

  // Save button
  elements.saveBtn.addEventListener('click', saveSettings);

  // Load button
  elements.loadBtn.addEventListener('click', showLoadMenu);

  // Pause button
  elements.pauseBtn.addEventListener('click', togglePause);

  // Again button
  elements.againBtn.addEventListener('click', restartSimulation);

  // Settings button
  elements.settingsBtn.addEventListener('click', openSettings);

  // Handle Enter key for number inputs
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('keydown', ((e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.key === 'Enter') {
        (input as HTMLInputElement).blur();
        elements.inputFocusNotice.style.opacity = '0';
      }
    }) as EventListener);

    input.addEventListener('focus', () => {
      elements.inputFocusNotice.style.opacity = '1';
    });

    input.addEventListener('blur', () => {
      elements.inputFocusNotice.style.opacity = '0';
    });
  });
}

// Initialize application
function init(): void {
  initializeElements();
  updateDisplays();
  setupEventListeners();
  
  // Set initial object position
  currentHeight = settings.height;
  updateSimulationDisplays();
}

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
