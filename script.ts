interface SimulationState {
  gravity: number;
  initialSpeed: number;
  angle: number;
  drag: number;
  friction: number;
  bounce: number;
  spawnHeight: number;
  isRunning: boolean;
  timeScale: number;
  elapsedTime: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

interface SavedConfig {
  name: string;
  timestamp: number;
  gravity: number;
  initialSpeed: number;
  angle: number;
  drag: number;
  friction: number;
  bounce: number;
  spawnHeight: number;
}

type LangDict = { [key: string]: string };

const LANG_DATA: { en: LangDict; ru: LangDict } = {
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
    'save-btn': '\uD83D\uDCBE Save Settings',
    'load-btn': '\uD83D\uDCC2 Load Settings',
    'start-btn': '\u25B6 Start Simulation',
    'sim-height': 'Height:',
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
  },
  ru: {
    'settings-title': '\u26A1 Настройки симуляции',
    'gravity-label': 'Ускорение свободного падения (м/с\u00B2)',
    'speed-label': 'Начальная скорость (м/с)',
    'angle-label': 'Угол запуска (град)',
    'height-label': 'Высота падения (м)',
    'drag-label': 'Сопротивление воздуха',
    'friction-label': 'Коэффициент трения',
    'bounce-label': 'Отскок (упругость)',
    'data-label': '\uD83D\uDCBE Управление данными',
    'save-btn': '\uD83D\uDCBE Сохранить настройки',
    'load-btn': '\uD83D\uDCC2 Загрузить настройки',
    'start-btn': '\u25B6 Запустить симуляцию',
    'sim-height': 'Высота:',
    'sim-time': 'Время:',
    'sim-speed': 'Скорость:',
    pause: 'Пауза',
    resume: 'Продолжить',
    close: '\u2715 Закрыть',
    'save-name-title': '\uD83D\uDCBE Сохранить конфигурацию',
    'save-name-prompt': 'Введите название для сохранения:',
    'save-name-placeholder': 'Мои настройки',
    'save-cancel': 'Отмена',
    'save-confirm': 'Сохранить',
    'load-title': '\uD83D\uDCC2 Сохранённые конфигурации',
    'load-empty': 'Сохранений не найдено.',
    load: 'Загрузить',
    delete: 'Удалить',
    earth: 'Земля',
    moon: 'Луна',
    mars: 'Марс',
    venus: 'Венера',
    jupiter: 'Юпитер',
    saturn: 'Сатурн',
    pluto: 'Плутон',
    sun: 'Солнце',
    m: 'м',
    s: 'с',
  },
};

function getLang(): LangDict {
  const b = navigator.language || (navigator as any).userLanguage || 'en';
  return LANG_DATA[b.startsWith('ru') ? 'ru' : 'en'];
}

function applyTranslations(): void {
  const t = getLang();
  const map: { [id: string]: string } = {
    'settings-title': 'settings-title',
    gravityLabel: 'gravity-label',
    speedLabel: 'speed-label',
    angleLabel: 'angle-label',
    heightLabel: 'height-label',
    dragLabel: 'drag-label',
    frictionLabel: 'friction-label',
    bounceLabel: 'bounce-label',
    dataLabel: 'data-label',
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
    if (!el) continue;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.placeholder = t[key] || el.placeholder;
    } else {
      el.textContent = t[key] || el.textContent;
    }
  }
  const sl: { [id: string]: string } = {
    simHeightLabel: 'sim-height',
    simTimeLabel: 'sim-time',
    simSpeedLabel: 'sim-speed',
  };
  for (const [id, key] of Object.entries(sl)) {
    const el = document.getElementById(id);
    if (!el) continue;
    const span = el.querySelector('span');
    if (span && t[key]) {
      const after = span.nextSibling ? span.nextSibling.textContent || '' : '';
      el.textContent = '';
      el.appendChild(document.createTextNode(t[key] + ' '));
      el.appendChild(span);
      if (after) el.appendChild(document.createTextNode(after));
    }
  }
  document.querySelectorAll('.planet-btn').forEach((btn) => {
    const g = (btn as HTMLElement).dataset.g;
    const pk: { [key: string]: string } = {
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
    if (k && t[k]) btn.textContent = t[k];
  });
}

class GravitySimulator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: SimulationState;
  private animationId: number | null = null;
  private saves: SavedConfig[] = [];
  private pendingSaveName: string | null = null;
  private t: LangDict;

  private readonly BALL_R = 12;
  private readonly TOP = 12;
  private BOTTOM(): number {
    return this.canvas.height - this.BALL_R;
  }
  private RANGE(): number {
    return this.BOTTOM() - this.TOP;
  }

  constructor() {
    this.canvas = document.getElementById('simCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.state = {
      gravity: 9.81,
      initialSpeed: 0,
      angle: 0,
      drag: 0,
      friction: 0.5,
      bounce: 0.7,
      spawnHeight: 100,
      isRunning: false,
      timeScale: 1,
      elapsedTime: 0,
      position: { x: 50, y: 0 },
      velocity: { x: 0, y: 0 },
    };
    this.t = getLang();
    this.loadSaves();
    this.initElements();
    this.resizeCanvas();
    this.updateDisplays();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private _(key: string): string {
    return this.t[key] || key;
  }

  private metersToY(meters: number): number {
    return this.BOTTOM() - (meters / this.state.spawnHeight) * this.RANGE();
  }

  private loadSaves(): void {
    const saved = localStorage.getItem('gravitySaves');
    if (saved) {
      try {
        this.saves = JSON.parse(saved);
        this.saves = this.saves.map((s: any) => ({
          name: s.name,
          timestamp: s.timestamp,
          gravity: s.gravity ?? 9.81,
          initialSpeed: s.initialSpeed ?? 0,
          angle: s.angle ?? 0,
          drag: s.drag ?? 0,
          friction: s.friction ?? 0.5,
          bounce: s.bounce ?? 0.7,
          spawnHeight: s.spawnHeight ?? 100,
        }));
      } catch {
        this.saves = [];
      }
    }
  }

  private saveSaves(): void {
    localStorage.setItem('gravitySaves', JSON.stringify(this.saves));
  }

  private updateSimStats(): void {
    const topMargin = 30;
    const fraction = (this.BOTTOM() - this.state.position.y) / this.RANGE();
    const h = Math.max(0, fraction * this.state.spawnHeight);
    document.getElementById('simHeightDisplay')!.textContent = h.toFixed(1);
    document.getElementById('simTimeDisplay')!.textContent =
      this.state.elapsedTime.toFixed(2);
  }

  private initElements(): void {
    const gravityInput = document.getElementById(
      'gravityInput',
    ) as HTMLInputElement;
    gravityInput.addEventListener('input', () => {
      let val = parseFloat(gravityInput.value);
      if (isNaN(val) || val < 0) val = 0;
      this.state.gravity = val;
      this.updatePlanetButtons();
    });
    document.querySelectorAll('.planet-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const g = parseFloat((btn as HTMLElement).dataset.g || '9.81');
        this.state.gravity = g;
        gravityInput.value = g.toFixed(2);
        this.updatePlanetButtons();
      });
    });
    const speedInput = document.getElementById(
      'speedInput',
    ) as HTMLInputElement;
    speedInput.addEventListener('input', () => {
      let val = parseFloat(speedInput.value);
      if (isNaN(val) || val < 0) val = 0;
      this.state.initialSpeed = val;
    });
    const angleInput = document.getElementById(
      'angleInput',
    ) as HTMLInputElement;
    angleInput.addEventListener('input', (e) => {
      this.state.angle = parseFloat((e.target as HTMLInputElement).value);
    });
    const dragSlider = document.getElementById(
      'dragSlider',
    ) as HTMLInputElement;
    dragSlider.addEventListener('input', (e) => {
      this.state.drag = parseFloat((e.target as HTMLInputElement).value);
    });
    const frictionSlider = document.getElementById(
      'frictionSlider',
    ) as HTMLInputElement;
    frictionSlider.addEventListener('input', (e) => {
      this.state.friction = parseFloat((e.target as HTMLInputElement).value);
    });
    const bounceSlider = document.getElementById(
      'bounceSlider',
    ) as HTMLInputElement;
    bounceSlider.addEventListener('input', (e) => {
      this.state.bounce = parseFloat((e.target as HTMLInputElement).value);
    });
    const heightInput = document.getElementById(
      'heightInput',
    ) as HTMLInputElement;
    heightInput.addEventListener('input', () => {
      let val = parseFloat(heightInput.value);
      if (isNaN(val) || val < 0.1) val = 0.1;
      this.state.spawnHeight = val;
      if (!this.state.isRunning) {
        this.state.position = {
          x: this.canvas.width / 2,
          y: this.metersToY(this.state.spawnHeight),
        };
        this.draw();
      }
    });
    document
      .getElementById('btnStart')!
      .addEventListener('click', () => this.startSimulation());
    document
      .getElementById('btnSave')!
      .addEventListener('click', () => this.showSaveNameModal());
    document
      .getElementById('btnLoad')!
      .addEventListener('click', () => this.showLoadModal());

    const timeScaleSlider = document.getElementById(
      'timeScaleSlider',
    ) as HTMLInputElement;
    const simSpeedDisplay = document.getElementById(
      'simSpeedDisplay',
    ) as HTMLElement;
    timeScaleSlider.addEventListener('input', (e) => {
      const val = parseInt((e.target as HTMLInputElement).value);
      this.state.timeScale = Math.pow(10, val / 100);
      simSpeedDisplay.textContent = 'x' + this.state.timeScale.toFixed(2);
    });
    document.getElementById('btnResetSpeed')!.addEventListener('click', () => {
      this.state.timeScale = 1;
      timeScaleSlider.value = '0';
      simSpeedDisplay.textContent = 'x1.00';
    });
    document
      .getElementById('btnPauseSim')!
      .addEventListener('click', () => this.togglePause());
    document
      .getElementById('btnCloseSim')!
      .addEventListener('click', () => this.closeSimulation());

    const saveNameModal = document.getElementById('saveNameModal')!;
    const saveNameInput = document.getElementById(
      'saveNameInput',
    ) as HTMLInputElement;
    document
      .getElementById('closeSaveNameModal')!
      .addEventListener('click', () => {
        saveNameModal.classList.remove('active');
        this.pendingSaveName = null;
      });
    document.getElementById('cancelSaveName')!.addEventListener('click', () => {
      saveNameModal.classList.remove('active');
      this.pendingSaveName = null;
    });
    document
      .getElementById('confirmSaveName')!
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
        (
          document.getElementById('confirmSaveName') as HTMLButtonElement
        ).click();
      else if (e.key === 'Escape')
        (
          document.getElementById('cancelSaveName') as HTMLButtonElement
        ).click();
    });

    const closeModal = document.getElementById(
      'closeModal',
    ) as HTMLButtonElement;
    const saveModal = document.getElementById('saveModal') as HTMLElement;
    closeModal.addEventListener('click', () => {
      saveModal.classList.remove('active');
    });
    saveModal.addEventListener('click', (e) => {
      if (e.target === saveModal) saveModal.classList.remove('active');
    });

    const saveListContainer = document.getElementById('saveListContainer')!;
    saveListContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.dataset.idx !== undefined) {
        e.stopPropagation();
        const idx = parseInt(target.dataset.idx);
        const sorted = [...this.saves].sort(
          (a, b) => b.timestamp - a.timestamp,
        );
        this.loadConfig(sorted[idx]);
        saveModal.classList.remove('active');
      } else if (target.dataset.del !== undefined) {
        e.stopPropagation();
        const idx = parseInt(target.dataset.del);
        const sorted = [...this.saves].sort(
          (a, b) => b.timestamp - a.timestamp,
        );
        const toDel = sorted[idx];
        if (confirm(this._('delete-confirm').replace('{name}', toDel.name))) {
          this.saves = this.saves.filter(
            (s) => s.timestamp !== toDel.timestamp,
          );
          this.saveSaves();
          this.showLoadModal();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (this.state.isRunning || this.state.position.x > 0)
          this.togglePause();
      }
    });
  }

  private updatePlanetButtons(): void {
    document.querySelectorAll('.planet-btn').forEach((btn) => {
      const g = parseFloat((btn as HTMLElement).dataset.g || '0');
      if (Math.abs(g - this.state.gravity) < 0.01) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  private updateDisplays(): void {
    (document.getElementById('gravityInput') as HTMLInputElement).value =
      this.state.gravity.toFixed(2);
    (document.getElementById('speedInput') as HTMLInputElement).value =
      this.state.initialSpeed.toFixed(0);
    (document.getElementById('angleInput') as HTMLInputElement).value =
      this.state.angle.toString();
    (document.getElementById('dragSlider') as HTMLInputElement).value =
      this.state.drag.toString();
    (document.getElementById('frictionSlider') as HTMLInputElement).value =
      this.state.friction.toString();
    (document.getElementById('bounceSlider') as HTMLInputElement).value =
      this.state.bounce.toString();
    (document.getElementById('heightInput') as HTMLInputElement).value =
      this.state.spawnHeight.toFixed(1);
    this.updatePlanetButtons();
  }

  private resizeCanvas(): void {
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

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#334155';
    this.ctx.fillRect(
      0,
      this.BOTTOM(),
      this.canvas.width,
      this.canvas.height - this.BOTTOM(),
    );
    this.ctx.beginPath();
    this.ctx.arc(
      this.state.position.x,
      this.state.position.y,
      12,
      0,
      Math.PI * 2,
    );
    this.ctx.fillStyle = '#4f46e5';
    this.ctx.fill();
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    if (!this.state.isRunning) this.drawTrajectory();
  }

  private drawTrajectory(): void {
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
      if (y > this.BOTTOM()) break;
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  private startSimulation(): void {
    if (this.state.isRunning) return;
    this.state.timeScale = 1;
    this.state.elapsedTime = 0;
    (document.getElementById('timeScaleSlider') as HTMLInputElement).value =
      '0';
    document.getElementById('simSpeedDisplay')!.textContent = 'x1.00';
    document.getElementById('settings-panel')!.classList.add('hidden');
    document.getElementById('sim-controls')!.classList.remove('hidden');
    document.getElementById('btnPauseSim')!.textContent = this._('pause');
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

  private animate(): void {
    if (!this.state.isRunning) return;
    const dt = 0.016 * this.state.timeScale;
    const pxPerM = this.RANGE() / this.state.spawnHeight;
    const gPx = this.state.gravity * pxPerM;
    this.state.velocity.x *= 1 - this.state.drag * dt;
    this.state.velocity.y *= 1 - this.state.drag * dt;
    this.state.velocity.y += gPx * dt;
    this.state.position.x += this.state.velocity.x * dt;
    this.state.position.y += this.state.velocity.y * dt;
    this.state.elapsedTime += 0.016 * this.state.timeScale;
    // Ground
    if (this.state.position.y > this.BOTTOM()) {
      this.state.position.y = this.BOTTOM();
      if (Math.abs(this.state.velocity.y) > 2)
        this.state.velocity.y *= -this.state.bounce;
      else this.state.velocity.y = 0;
      this.state.velocity.x *= 1 - this.state.friction * 0.5;
      if (Math.abs(this.state.velocity.x) < 5) this.state.velocity.x = 0;
    }
    // Walls
    if (
      this.state.position.x < 0 ||
      this.state.position.x > this.canvas.width
    ) {
      this.state.velocity.x *= -0.8;
      this.state.position.x = Math.max(
        0,
        Math.min(this.canvas.width, this.state.position.x),
      );
    }
    this.updateSimStats();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private togglePause(): void {
    const btn = document.getElementById('btnPauseSim')!;
    if (this.state.isRunning) {
      this.state.isRunning = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      btn.textContent = this._('resume');
    } else {
      this.state.isRunning = true;
      this.animate();
      btn.textContent = this._('pause');
    }
  }

  private closeSimulation(): void {
    this.state.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    document.getElementById('settings-panel')!.classList.remove('hidden');
    document.getElementById('sim-controls')!.classList.add('hidden');
    this.state.position = {
      x: this.canvas.width / 2,
      y: this.metersToY(this.state.spawnHeight),
    };
    this.state.velocity = { x: 0, y: 0 };
    document.getElementById('btnPauseSim')!.textContent = this._('resume');
    this.draw();
  }

  private showSaveNameModal(): void {
    const modal = document.getElementById('saveNameModal')!;
    const input = document.getElementById('saveNameInput') as HTMLInputElement;
    input.value = '';
    modal.classList.add('active');
    setTimeout(() => input.focus(), 100);
  }

  private completeSave(): void {
    const name = this.pendingSaveName;
    if (!name) return;
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

  private showLoadModal(): void {
    const modal = document.getElementById('saveModal')!;
    const container = document.getElementById('saveListContainer')!;
    if (this.saves.length === 0) {
      container.innerHTML =
        '<p style="text-align:center;color:var(--text-muted);padding:20px">' +
        this._('load-empty') +
        '</p>';
    } else {
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

  private loadConfig(config: SavedConfig): void {
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

applyTranslations();
window.addEventListener('DOMContentLoaded', () => {
  new GravitySimulator();
});
