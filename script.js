"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
const LANG_DATA = {
    en: {
        'settings-title': '\u26A1 Gravity Simulator',
        'gravity-label': 'Gravity Acceleration (m/s\u00B2)',
        'speed-label': 'Initial Speed (m/s)',
        'angle-label': 'Launch Angle (deg)',
        'height-label': 'Falling Height (m)',
        'drag-label': 'Air Resistance (Drag)',
        'friction-label': 'Friction Coefficient',
        'bounce-label': 'Bounce (Restitution)',
        'data-label': '\uD83D\uDCBE Data Management',
        'app-settings-label': '\u2699\uFE0F Settings',
        'app-settings-btn': '\u2699\uFE0F Settings',
        'save-btn': '\uD83D\uDCBE Save Settings',
        'load-btn': '\uD83D\uDCC2 Load Settings',
        'start-btn': '\u25B6 Start Simulation',
        'sim-height': 'Height:',
        'sim-ball-speed': 'Ball Speed:',
        'sim-collision-time': 'First Collision:',
        'sim-time': 'Time:',
        'sim-speed': 'Speed:',
        pause: 'Pause',
        resume: 'Resume',
        close: '\u2715 Close',
        'save-name-title': '\uD83D\uDCBE Save Configuration',
        'save-name-prompt': 'Enter a name for this save:',
        'save-name-placeholder': 'My Settings',
        'save-cancel': 'Cancel',
        'save-confirm': 'Save',
        'load-title': '\uD83D\uDCC2 Saved Configurations',
        'load-empty': 'No saved settings found.',
        load: 'Load',
        delete: 'Delete',
        earth: 'Earth',
        moon: 'Moon',
        mars: 'Mars',
        venus: 'Venus',
        jupiter: 'Jupiter',
        saturn: 'Saturn',
        pluto: 'Pluto',
        sun: 'Sun',
        m: 'm',
        s: 's',
        'gravity-var-label': 'Gravity depends on height',
        'lang-label': 'Language',
        'made-by': 'Created by ',
        'footer-title': 'Yarik Studio',
        donate: 'Donate',
        'settings-modal-title': '\u2699\uFE0F Settings',
    },
    ru: {
        'settings-title': '\u26A1 Gravity Simulator',
        'gravity-label': '\u0423\u0441\u043A\u043E\u0440\u0435\u043D\u0438\u0435 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u043E\u0433\u043E \u043F\u0430\u0434\u0435\u043D\u0438\u044F (\u043C/\u0441\u00B2)',
        'speed-label': '\u041D\u0430\u0447\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C (\u043C/\u0441)',
        'angle-label': '\u0423\u0433\u043E\u043B \u0437\u0430\u043F\u0443\u0441\u043A\u0430 (\u0433\u0440\u0430\u0434)',
        'height-label': '\u0412\u044B\u0441\u043E\u0442\u0430 \u043F\u0430\u0434\u0435\u043D\u0438\u044F (\u043C)',
        'drag-label': '\u0421\u043E\u043F\u0440\u043E\u0442\u0438\u0432\u043B\u0435\u043D\u0438\u0435 \u0432\u043E\u0437\u0434\u0443\u0445\u0430',
        'friction-label': '\u041A\u043E\u044D\u0444\u0444\u0438\u0446\u0438\u0435\u043D\u0442 \u0442\u0440\u0435\u043D\u0438\u044F',
        'bounce-label': '\u041E\u0442\u0441\u043A\u043E\u043A (\u0443\u043F\u0440\u0443\u0433\u043E\u0441\u0442\u044C)',
        'data-label': '\uD83D\uDCBE \u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0434\u0430\u043D\u043D\u044B\u043C\u0438',
        'app-settings-label': '\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
        'app-settings-btn': '\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
        'save-btn': '\uD83D\uDCBE \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
        'load-btn': '\uD83D\uDCC2 \u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
        'start-btn': '\u25B6 \u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0441\u0438\u043C\u0443\u043B\u044F\u0446\u0438\u044E',
        'sim-height': '\u0412\u044B\u0441\u043E\u0442\u0430:',
        'sim-ball-speed': '\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C \u043C\u044F\u0447\u0430:',
        'sim-collision-time': '\u041F\u0435\u0440\u0432\u043E\u0435 \u0441\u0442\u043E\u043B\u043A\u043D\u043E\u0432\u0435\u043D\u0438\u0435:',
        'sim-time': '\u0412\u0440\u0435\u043C\u044F:',
        'sim-speed': '\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C:',
        pause: '\u041F\u0430\u0443\u0437\u0430',
        resume: '\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C',
        close: '\u2715 \u0417\u0430\u043A\u0440\u044B\u0442\u044C',
        'save-name-title': '\uD83D\uDCBE \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044E',
        'save-name-prompt': '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F:',
        'save-name-placeholder': '\u041C\u043E\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
        'save-cancel': '\u041E\u0442\u043C\u0435\u043D\u0430',
        'save-confirm': '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C',
        'load-title': '\uD83D\uDCC2 \u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438',
        'load-empty': '\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0439 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.',
        load: '\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C',
        delete: '\u0423\u0434\u0430\u043B\u0438\u0442\u044C',
        earth: '\u0417\u0435\u043C\u043B\u044F',
        moon: '\u041B\u0443\u043D\u0430',
        mars: '\u041C\u0430\u0440\u0441',
        venus: '\u0412\u0435\u043D\u0435\u0440\u0430',
        jupiter: '\u042E\u043F\u0438\u0442\u0435\u0440',
        saturn: '\u0421\u0430\u0442\u0443\u0440\u043D',
        pluto: '\u041F\u043B\u0443\u0442\u043E\u043D',
        sun: '\u0421\u043E\u043B\u043D\u0446\u0435',
        m: '\u043C',
        s: '\u0441',
        'gravity-var-label': '\u0413\u0440\u0430\u0432\u0438\u0442\u0430\u0446\u0438\u044F \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0432\u044B\u0441\u043E\u0442\u044B',
        'lang-label': '\u042F\u0437\u044B\u043A',
        'made-by': '\u0421\u043E\u0437\u0434\u0430\u043D\u043E ',
        'footer-title': 'Yarik Studio',
        donate: '\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0430\u0442\u044C',
        'settings-modal-title': '\u2699\uFE0F \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
    },
};
function getLang() {
    const stored = localStorage.getItem('gravityLang');
    if (stored === 'en' || stored === 'ru') {
        return LANG_DATA[stored];
    }
    const b = navigator.language || navigator.userLanguage || 'en';
    return LANG_DATA[b.startsWith('ru') ? 'ru' : 'en'];
}
function applyTranslations() {
    const t = getLang();
    // Sync the app instance's language cache so togglePause() uses the correct translation
    if (appInstance) {
        appInstance['t'] = t;
    }
    const map = {
        'settings-title': 'settings-title',
        gravityLabel: 'gravity-label',
        speedLabel: 'speed-label',
        angleLabel: 'angle-label',
        heightLabel: 'height-label',
        dragLabel: 'drag-label',
        frictionLabel: 'friction-label',
        bounceLabel: 'bounce-label',
        gravityVarLabel: 'gravity-var-label',
        dataLabel: 'data-label',
        appSettingsLabel: 'app-settings-label',
        btnAppSettings: 'app-settings-btn',
        appSettingsTitle: 'settings-modal-title',
        langLabel: 'lang-label',
        madeByLabel: 'made-by',
        donateText: 'donate',
        btnSave: 'save-btn',
        btnLoad: 'load-btn',
        btnStart: 'start-btn',
        btnPauseSim: 'resume',
        btnCloseSim: 'close',
        closeSaveNameModal: 'close',
        saveNameTitle: 'save-name-title',
        saveNamePrompt: 'save-name-prompt',
        saveNameInput: 'save-name-placeholder',
        cancelSaveName: 'save-cancel',
        confirmSaveName: 'save-confirm',
        loadTitle: 'load-title',
    };
    for (const [id, key] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (!el)
            continue;
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            el.placeholder = t[key] || el.placeholder;
        }
        else {
            if (el.children.length > 0) {
                const nodes = el.childNodes;
                for (let i = nodes.length - 1; i >= 0; i--) {
                    const node = nodes[i];
                    if (node.nodeType === Node.TEXT_NODE) {
                        const txt = node;
                        txt.textContent = t[key] || key;
                        if (txt.textContent.trim())
                            break;
                    }
                }
            }
            else {
                el.textContent = t[key] || el.textContent;
            }
        }
    }
    const sl = {
        simHeightLabel: 'sim-height',
        simBallSpeedLabel: 'sim-ball-speed',
        simCollisionTimeLabel: 'sim-collision-time',
        simTimeLabel: 'sim-time',
        simTimeScaleLabel: 'sim-speed',
    };
    for (const [id, key] of Object.entries(sl)) {
        const el = document.getElementById(id);
        if (!el)
            continue;
        const span = el.querySelector('span');
        if (span && t[key]) {
            const after = span.nextSibling ? span.nextSibling.textContent || '' : '';
            el.textContent = '';
            el.appendChild(document.createTextNode(t[key] + ' '));
            el.appendChild(span);
            if (after)
                el.appendChild(document.createTextNode(after));
        }
    }
    document.querySelectorAll('.planet-btn').forEach((btn) => {
        const g = btn.dataset.g;
        const pk = {
            '9.81': 'earth',
            '1.62': 'moon',
            '3.71': 'mars',
            '8.87': 'venus',
            '24.79': 'jupiter',
            '10.44': 'saturn',
            '0.62': 'pluto',
            '274': 'sun',
        };
        const k = pk[g || ''];
        if (k && t[k])
            btn.textContent = t[k];
    });
}
class GravitySimulator {
    BOTTOM() {
        return this.canvas.height - 14;
    }
    RANGE() {
        return this.BOTTOM() - this.TOP;
    }
    constructor() {
        this.animationId = null;
        this.saves = [];
        this.pendingSaveName = null;
        this.BALL_R = 12;
        this.TOP = 11;
        this.EARTH_RADIUS = 6371000;
        this.canvas = document.getElementById('simCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = {
            gravity: 9.81,
            initialSpeed: 0,
            angle: 0,
            drag: 0,
            friction: 0.5,
            bounce: 0.7,
            spawnHeight: 100,
            gravityVarEnabled: false,
            isRunning: false,
            timeScale: 1,
            elapsedTime: 0,
            position: { x: 50, y: 0 },
            velocity: { x: 0, y: 0 },
            firstCollisionTime: null,
            firstCollisionRecorded: false,
        };
        this.t = getLang();
        this.loadSaves();
        this.initElements();
        this.resizeCanvas();
        this.updateDisplays();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    _(key) {
        return this.t[key] || key;
    }
    metersToY(meters) {
        return this.BOTTOM() - (meters / this.state.spawnHeight) * this.RANGE();
    }
    loadSaves() {
        const saved = localStorage.getItem('gravitySaves');
        if (saved) {
            try {
                this.saves = JSON.parse(saved);
                this.saves = this.saves.map((s) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    return ({
                        name: s.name,
                        timestamp: s.timestamp,
                        gravity: (_a = s.gravity) !== null && _a !== void 0 ? _a : 9.81,
                        initialSpeed: (_b = s.initialSpeed) !== null && _b !== void 0 ? _b : 0,
                        angle: (_c = s.angle) !== null && _c !== void 0 ? _c : 0,
                        drag: (_d = s.drag) !== null && _d !== void 0 ? _d : 0,
                        friction: (_e = s.friction) !== null && _e !== void 0 ? _e : 0.5,
                        bounce: (_f = s.bounce) !== null && _f !== void 0 ? _f : 0.7,
                        spawnHeight: (_g = s.spawnHeight) !== null && _g !== void 0 ? _g : 100,
                    });
                });
            }
            catch (_a) {
                this.saves = [];
            }
        }
    }
    saveSaves() {
        localStorage.setItem('gravitySaves', JSON.stringify(this.saves));
    }
    updateSimStats() {
        const fraction = (this.BOTTOM() - this.state.position.y) / this.RANGE();
        const h = Math.max(0, fraction * this.state.spawnHeight);
        document.getElementById('simHeightDisplay').textContent = h.toFixed(1);
        document.getElementById('simTimeDisplay').textContent =
            this.state.elapsedTime.toFixed(2);
        const pxPerM = this.RANGE() / this.state.spawnHeight;
        const speedPx = Math.sqrt(this.state.velocity.x * this.state.velocity.x +
            this.state.velocity.y * this.state.velocity.y);
        const speedMs = speedPx / pxPerM;
        document.getElementById('simBallSpeedDisplay').textContent =
            speedMs.toFixed(1);
    }
    initElements() {
        const gravityInput = document.getElementById('gravityInput');
        gravityInput.addEventListener('input', () => {
            let val = parseFloat(gravityInput.value);
            if (isNaN(val) || val < 0)
                val = 0;
            this.state.gravity = val;
            this.updatePlanetButtons();
        });
        document.querySelectorAll('.planet-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const g = parseFloat(btn.dataset.g || '9.81');
                this.state.gravity = g;
                gravityInput.value = g.toFixed(2);
                this.updatePlanetButtons();
            });
        });
        const speedInput = document.getElementById('speedInput');
        speedInput.addEventListener('input', () => {
            let val = parseFloat(speedInput.value);
            if (isNaN(val) || val < 0)
                val = 0;
            this.state.initialSpeed = val;
        });
        const angleInput = document.getElementById('angleInput');
        angleInput.addEventListener('input', (e) => {
            this.state.angle = parseFloat(e.target.value);
        });
        const dragSlider = document.getElementById('dragSlider');
        dragSlider.addEventListener('input', (e) => {
            this.state.drag = parseFloat(e.target.value);
        });
        const frictionSlider = document.getElementById('frictionSlider');
        frictionSlider.addEventListener('input', (e) => {
            this.state.friction = parseFloat(e.target.value);
        });
        const bounceSlider = document.getElementById('bounceSlider');
        bounceSlider.addEventListener('input', (e) => {
            this.state.bounce = parseFloat(e.target.value);
        });
        const heightInput = document.getElementById('heightInput');
        heightInput.addEventListener('input', () => {
            let val = parseFloat(heightInput.value);
            if (isNaN(val) || val < 0.1)
                val = 0.1;
            this.state.spawnHeight = val;
            if (!this.state.isRunning) {
                this.state.position = {
                    x: this.canvas.width / 2,
                    y: this.metersToY(this.state.spawnHeight),
                };
                this.draw();
            }
        });
        const gravityVarToggle = document.getElementById('gravityVarToggle');
        if (gravityVarToggle) {
            gravityVarToggle.addEventListener('change', (e) => {
                this.state.gravityVarEnabled = e.target.checked;
            });
        }
        document
            .getElementById('btnStart')
            .addEventListener('click', () => this.startSimulation());
        document
            .getElementById('btnSave')
            .addEventListener('click', () => this.showSaveNameModal());
        document
            .getElementById('btnLoad')
            .addEventListener('click', () => this.showLoadModal());
        const timeScaleSlider = document.getElementById('timeScaleSlider');
        const simTimeScaleDisplay = document.getElementById('simTimeScaleDisplay');
        timeScaleSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            this.state.timeScale = Math.pow(10, val / 100);
            simTimeScaleDisplay.textContent = 'x' + this.state.timeScale.toFixed(2);
        });
        document.getElementById('btnResetSpeed').addEventListener('click', () => {
            this.state.timeScale = 1;
            timeScaleSlider.value = '0';
            simTimeScaleDisplay.textContent = 'x1.00';
        });
        document
            .getElementById('btnPauseSim')
            .addEventListener('click', () => this.togglePause());
        document
            .getElementById('btnCloseSim')
            .addEventListener('click', () => this.closeSimulation());
        const saveNameModal = document.getElementById('saveNameModal');
        const saveNameInput = document.getElementById('saveNameInput');
        document
            .getElementById('closeSaveNameModal')
            .addEventListener('click', () => {
            saveNameModal.classList.remove('active');
            this.pendingSaveName = null;
        });
        document.getElementById('cancelSaveName').addEventListener('click', () => {
            saveNameModal.classList.remove('active');
            this.pendingSaveName = null;
        });
        document
            .getElementById('confirmSaveName')
            .addEventListener('click', () => {
            const name = saveNameInput.value.trim();
            if (!name) {
                saveNameInput.focus();
                return;
            }
            this.pendingSaveName = name;
            saveNameModal.classList.remove('active');
            this.completeSave();
        });
        saveNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter')
                document.getElementById('confirmSaveName').click();
            else if (e.key === 'Escape')
                document.getElementById('cancelSaveName').click();
        });
        const closeModal = document.getElementById('closeModal');
        const saveModal = document.getElementById('saveModal');
        closeModal.addEventListener('click', () => {
            saveModal.classList.remove('active');
        });
        saveModal.addEventListener('click', (e) => {
            if (e.target === saveModal)
                saveModal.classList.remove('active');
        });
        const saveListContainer = document.getElementById('saveListContainer');
        saveListContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (target.dataset.idx !== undefined) {
                e.stopPropagation();
                const idx = parseInt(target.dataset.idx);
                const sorted = [...this.saves].sort((a, b) => b.timestamp - a.timestamp);
                this.loadConfig(sorted[idx]);
                saveModal.classList.remove('active');
            }
            else if (target.dataset.del !== undefined) {
                e.stopPropagation();
                const idx = parseInt(target.dataset.del);
                const sorted = [...this.saves].sort((a, b) => b.timestamp - a.timestamp);
                const toDel = sorted[idx];
                if (confirm(this._('delete-confirm').replace('{name}', toDel.name))) {
                    this.saves = this.saves.filter((s) => s.timestamp !== toDel.timestamp);
                    this.saveSaves();
                    this.showLoadModal();
                }
            }
        });
        const appSettingsModal = document.getElementById('appSettingsModal');
        const btnAppSettings = document.getElementById('btnAppSettings');
        const closeAppSettings = document.getElementById('closeAppSettings');
        if (appSettingsModal && btnAppSettings && closeAppSettings) {
            btnAppSettings.addEventListener('click', () => {
                appSettingsModal.classList.add('active');
            });
            closeAppSettings.addEventListener('click', () => {
                appSettingsModal.classList.remove('active');
            });
            appSettingsModal.addEventListener('click', (e) => {
                if (e.target === appSettingsModal)
                    appSettingsModal.classList.remove('active');
            });
        }
        const langBtns = document.querySelectorAll('#langToggle button');
        if (langBtns.length > 0) {
            const currentLang = localStorage.getItem('gravityLang') ||
                (navigator.language.startsWith('ru') ? 'ru' : 'en');
            langBtns.forEach((btn) => {
                const el = btn;
                const lang = el.dataset.lang;
                el.style.background =
                    lang === currentLang
                        ? 'rgba(99, 102, 241, 0.3)'
                        : 'rgba(0, 0, 0, 0.35)';
                btn.addEventListener('click', () => {
                    if (lang && lang !== localStorage.getItem('gravityLang')) {
                        localStorage.setItem('gravityLang', lang);
                        applyTranslations();
                        document.querySelectorAll('#langToggle button').forEach((b) => {
                            const be = b;
                            be.style.background =
                                be.dataset.lang === lang
                                    ? 'rgba(99, 102, 241, 0.3)'
                                    : 'rgba(0, 0, 0, 0.35)';
                        });
                    }
                });
            });
        }
        // External links — open in default system browser (important for Tauri Android)
        const isTauri = typeof window !== 'undefined' && window.__TAURI_INTERNALS__;
        document.querySelectorAll('a[target="_blank"]').forEach((link) => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const href = link.href;
                if (isTauri) {
                    try {
                        const { openUrl } = await Promise.resolve().then(() => __importStar(require('@tauri-apps/plugin-opener')));
                        await openUrl(href);
                    }
                    catch (err) {
                        console.error('Failed to open URL via Tauri opener, falling back to window.open:', err);
                        window.open(href, '_blank');
                    }
                }
                else {
                    window.open(href, '_blank');
                }
            });
        });
        document.addEventListener('keydown', (e) => {
            if (e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement)
                return;
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                if (this.state.isRunning || this.state.position.x > 0)
                    this.togglePause();
            }
        });
    }
    updatePlanetButtons() {
        document.querySelectorAll('.planet-btn').forEach((btn) => {
            const g = parseFloat(btn.dataset.g || '0');
            if (Math.abs(g - this.state.gravity) < 0.01)
                btn.classList.add('active');
            else
                btn.classList.remove('active');
        });
    }
    updateDisplays() {
        document.getElementById('gravityInput').value =
            this.state.gravity.toFixed(2);
        document.getElementById('speedInput').value =
            this.state.initialSpeed.toFixed(0);
        document.getElementById('angleInput').value =
            this.state.angle.toString();
        document.getElementById('dragSlider').value =
            this.state.drag.toString();
        document.getElementById('frictionSlider').value =
            this.state.friction.toString();
        document.getElementById('bounceSlider').value =
            this.state.bounce.toString();
        document.getElementById('heightInput').value =
            this.state.spawnHeight.toFixed(1);
        this.updatePlanetButtons();
    }
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (!this.state.isRunning) {
            this.state.position = {
                x: this.canvas.width / 2,
                y: this.metersToY(this.state.spawnHeight),
            };
            this.draw();
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#334155';
        this.ctx.fillRect(0, this.BOTTOM(), this.canvas.width, this.canvas.height - this.BOTTOM());
        this.ctx.beginPath();
        this.ctx.arc(this.state.position.x, this.state.position.y, 12, 0, Math.PI * 2);
        this.ctx.fillStyle = '#4f46e5';
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        if (!this.state.isRunning)
            this.drawTrajectory();
    }
    drawTrajectory() {
        const rad = (this.state.angle * Math.PI) / 180;
        const pxPerM = this.RANGE() / this.state.spawnHeight;
        const gPx = this.state.gravity * pxPerM;
        const sPx = this.state.initialSpeed * pxPerM;
        let x = this.state.position.x;
        let y = this.state.position.y;
        let vx = Math.sin(rad) * sPx;
        let vy = Math.cos(rad) * sPx;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.strokeStyle = 'rgba(79, 70, 229, 0.5)';
        this.ctx.setLineDash([5, 5]);
        for (let i = 0; i < 200; i++) {
            vx *= 1 - this.state.drag;
            vy *= 1 - this.state.drag;
            vy += gPx * 0.016;
            x += vx;
            y += vy;
            if (y > this.BOTTOM())
                break;
            this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    startSimulation() {
        if (this.state.isRunning)
            return;
        this.state.timeScale = 1;
        this.state.elapsedTime = 0;
        document.getElementById('timeScaleSlider').value =
            '0';
        this.state.firstCollisionTime = null;
        this.state.firstCollisionRecorded = false;
        document.getElementById('simCollisionTimeDisplay').textContent = '—';
        document.getElementById('simBallSpeedDisplay').textContent = '0.0';
        document.getElementById('simTimeScaleDisplay').textContent = 'x1.00';
        document.getElementById('settings-panel').classList.add('hidden');
        document.getElementById('sim-controls').classList.remove('hidden');
        document.getElementById('btnPauseSim').textContent = this._('pause');
        this.state.position = {
            x: this.canvas.width / 2,
            y: this.metersToY(this.state.spawnHeight),
        };
        const rad = (this.state.angle * Math.PI) / 180;
        const pxPerM = this.RANGE() / this.state.spawnHeight;
        const speedPx = this.state.initialSpeed * pxPerM;
        this.state.velocity = {
            x: Math.sin(rad) * speedPx,
            y: Math.cos(rad) * speedPx,
        };
        this.state.isRunning = true;
        this.updateSimStats();
        this.animate();
    }
    effectiveGravity(currentHeightMeters) {
        if (!this.state.gravityVarEnabled)
            return this.state.gravity;
        const r = this.EARTH_RADIUS;
        const h = Math.max(0, currentHeightMeters);
        return this.state.gravity * (r / (r + h)) * (r / (r + h));
    }
    animate() {
        if (!this.state.isRunning)
            return;
        // Use sub-stepping: at high timeScale, run multiple small physics steps per frame
        // so collision detection doesn't miss bounces
        const dt = 0.016 * this.state.timeScale;
        const pxPerM = this.RANGE() / this.state.spawnHeight;
        const steps = Math.max(1, Math.ceil(this.state.timeScale / 2));
        const subDt = dt / steps;
        for (let step = 0; step < steps; step++) {
            const fraction = (this.BOTTOM() - this.state.position.y) / this.RANGE();
            const currentHeightMeters = Math.max(0, fraction * this.state.spawnHeight);
            const gEffective = this.effectiveGravity(currentHeightMeters);
            const gPx = gEffective * pxPerM;
            this.state.velocity.x *= 1 - this.state.drag * subDt;
            this.state.velocity.y *= 1 - this.state.drag * subDt;
            this.state.velocity.y += gPx * subDt;
            this.state.position.x += this.state.velocity.x * subDt;
            this.state.position.y += this.state.velocity.y * subDt;
            this.state.elapsedTime += (0.016 * this.state.timeScale) / steps;
            // Ground collision
            if (this.state.position.y > this.BOTTOM()) {
                if (!this.state.firstCollisionRecorded) {
                    this.state.firstCollisionTime = this.state.elapsedTime;
                    this.state.firstCollisionRecorded = true;
                    document.getElementById('simCollisionTimeDisplay').textContent =
                        this.state.elapsedTime.toFixed(2);
                }
                this.state.position.y = this.BOTTOM();
                if (Math.abs(this.state.velocity.y) > 2)
                    this.state.velocity.y *= -this.state.bounce;
                else
                    this.state.velocity.y = 0;
                this.state.velocity.x *= 1 - this.state.friction * 0.5;
                if (Math.abs(this.state.velocity.x) < 5)
                    this.state.velocity.x = 0;
                // Stop when ball has fully settled
                if (Math.abs(this.state.velocity.y) < 0.01 &&
                    Math.abs(this.state.velocity.x) < 0.01) {
                    this.state.velocity.x = 0;
                    this.state.velocity.y = 0;
                    this.state.isRunning = false;
                    if (this.animationId) {
                        cancelAnimationFrame(this.animationId);
                        this.animationId = null;
                    }
                    this.updateSimStats();
                    this.draw();
                    return;
                }
            }
            // Wall collision
            if (this.state.position.x < 0 ||
                this.state.position.x > this.canvas.width) {
                this.state.velocity.x *= -0.8;
                this.state.position.x = Math.max(0, Math.min(this.canvas.width, this.state.position.x));
            }
        }
        this.updateSimStats();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    togglePause() {
        const btn = document.getElementById('btnPauseSim');
        if (this.state.isRunning) {
            this.state.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            btn.textContent = this._('resume');
        }
        else {
            this.state.isRunning = true;
            this.animate();
            btn.textContent = this._('pause');
        }
    }
    closeSimulation() {
        this.state.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        document.getElementById('settings-panel').classList.remove('hidden');
        document.getElementById('sim-controls').classList.add('hidden');
        this.state.position = {
            x: this.canvas.width / 2,
            y: this.metersToY(this.state.spawnHeight),
        };
        this.state.velocity = { x: 0, y: 0 };
        document.getElementById('btnPauseSim').textContent = this._('resume');
        this.draw();
    }
    showSaveNameModal() {
        const modal = document.getElementById('saveNameModal');
        const input = document.getElementById('saveNameInput');
        input.value = '';
        modal.classList.add('active');
        setTimeout(() => input.focus(), 100);
    }
    completeSave() {
        const name = this.pendingSaveName;
        if (!name)
            return;
        this.pendingSaveName = null;
        this.saves.push({
            name,
            timestamp: Date.now(),
            gravity: this.state.gravity,
            initialSpeed: this.state.initialSpeed,
            angle: this.state.angle,
            drag: this.state.drag,
            friction: this.state.friction,
            bounce: this.state.bounce,
            spawnHeight: this.state.spawnHeight,
        });
        this.saveSaves();
    }
    showLoadModal() {
        const modal = document.getElementById('saveModal');
        const container = document.getElementById('saveListContainer');
        if (this.saves.length === 0) {
            container.innerHTML =
                '<p style="text-align:center;color:var(--text-muted);padding:20px">' +
                    this._('load-empty') +
                    '</p>';
        }
        else {
            container.innerHTML = '';
            const sorted = [...this.saves].sort((a, b) => b.timestamp - a.timestamp);
            sorted.forEach((save, idx) => {
                const date = new Date(save.timestamp).toLocaleString();
                const item = document.createElement('div');
                item.className = 'save-item';
                item.innerHTML =
                    '<div class="save-info"><h4>' +
                        save.name +
                        '</h4><p>Saved: ' +
                        date +
                        '</p><p style="font-size:0.75rem;opacity:0.7">' +
                        this._('gravity-label').split(' ')[0] +
                        ': ' +
                        save.gravity.toFixed(2) +
                        ' | ' +
                        this._('speed-label').split(' ')[0] +
                        ': ' +
                        save.initialSpeed.toFixed(0) +
                        ' | ' +
                        this._('angle-label').split(' ')[0] +
                        ': ' +
                        save.angle.toFixed(0) +
                        '\u00B0 | ' +
                        this._('drag-label').split(' ')[0] +
                        ': ' +
                        save.drag.toFixed(2) +
                        ' | ' +
                        this._('friction-label').split(' ')[0] +
                        ': ' +
                        save.friction.toFixed(2) +
                        ' | ' +
                        this._('bounce-label').split(' ')[0] +
                        ': ' +
                        save.bounce.toFixed(2) +
                        ' | ' +
                        this._('height-label').split(' ')[0] +
                        ': ' +
                        save.spawnHeight.toFixed(1) +
                        '</p></div><div class="save-actions"><button class="btn btn-primary" data-idx="' +
                        idx +
                        '">' +
                        this._('load') +
                        '</button><button class="btn btn-danger" data-del="' +
                        idx +
                        '">' +
                        this._('delete') +
                        '</button></div>';
                container.appendChild(item);
            });
        }
        modal.classList.add('active');
    }
    loadConfig(config) {
        this.state.gravity = config.gravity;
        this.state.initialSpeed = config.initialSpeed;
        this.state.angle = config.angle;
        this.state.drag = config.drag;
        this.state.friction = config.friction;
        this.state.bounce = config.bounce;
        this.state.spawnHeight = config.spawnHeight;
        this.updateDisplays();
        if (!this.state.isRunning) {
            this.state.position = {
                x: this.canvas.width / 2,
                y: this.metersToY(this.state.spawnHeight),
            };
        }
        this.draw();
    }
}
let appInstance = null;
applyTranslations();
window.addEventListener('DOMContentLoaded', () => {
    appInstance = new GravitySimulator();
});
