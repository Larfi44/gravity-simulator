interface SimulationState {
    gravity: number;
    initialSpeed: number;
    angle: number;
    drag: number;
    isRunning: boolean;
    timeScale: number;
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
}

class GravitySimulator {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private state: SimulationState;
    private animationId: number | null = null;
    private saves: SavedConfig[] = [];

    constructor() {
        this.canvas = document.getElementById('simCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.state = {
            gravity: 9.81,
            initialSpeed: 50,
            angle: 45,
            drag: 0,
            isRunning: false,
            timeScale: 1,
            position: { x: 50, y: 0 },
            velocity: { x: 0, y: 0 }
        };
        this.loadSaves();
        this.initElements();
        this.resizeCanvas();
        this.updateDisplays();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    private loadSaves(): void {
        const saved = localStorage.getItem('gravitySaves');
        if (saved) {
            try { this.saves = JSON.parse(saved); } catch (e) { this.saves = []; }
        }
    }

    private saveSaves(): void {
        localStorage.setItem('gravitySaves', JSON.stringify(this.saves));
    }

    private initElements(): void {
        const gravitySlider = document.getElementById('gravitySlider') as HTMLInputElement;
        const gravityValue = document.getElementById('gravityValue') as HTMLElement;
        gravitySlider.addEventListener('input', (e) => {
            this.state.gravity = parseFloat((e.target as HTMLInputElement).value);
            gravityValue.textContent = this.state.gravity.toFixed(2);
            this.updatePlanetButtons();
        });

        document.querySelectorAll('.planet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const g = parseFloat((btn as HTMLElement).dataset.g || '9.81');
                this.state.gravity = g;
                gravitySlider.value = g.toString();
                gravityValue.textContent = g.toFixed(2);
                this.updatePlanetButtons();
            });
        });

        const speedSlider = document.getElementById('speedSlider') as HTMLInputElement;
        const speedValue = document.getElementById('speedValue') as HTMLElement;
        speedSlider.addEventListener('input', (e) => {
            this.state.initialSpeed = parseFloat((e.target as HTMLInputElement).value);
            speedValue.textContent = this.state.initialSpeed.toFixed(0);
        });

        const angleInput = document.getElementById('angleInput') as HTMLInputElement;
        angleInput.addEventListener('input', (e) => {
            this.state.angle = parseFloat((e.target as HTMLInputElement).value);
        });

        const dragSlider = document.getElementById('dragSlider') as HTMLInputElement;
        const dragValue = document.getElementById('dragValue') as HTMLElement;
        dragSlider.addEventListener('input', (e) => {
            this.state.drag = parseFloat((e.target as HTMLInputElement).value);
            dragValue.textContent = this.state.drag.toFixed(2);
        });

        document.getElementById('btnStart')!.addEventListener('click', () => this.startSimulation());
        document.getElementById('btnReset')!.addEventListener('click', () => this.resetSimulation());
        document.getElementById('btnSave')!.addEventListener('click', () => this.showSaveModal());
        document.getElementById('btnSaveBottom')!.addEventListener('click', () => this.showSaveModal());
        document.getElementById('btnLoad')!.addEventListener('click', () => this.showLoadModal());
        document.getElementById('btnLoadBottom')!.addEventListener('click', () => this.showLoadModal());

        const timeScaleSlider = document.getElementById('timeScaleSlider') as HTMLInputElement;
        const simSpeedDisplay = document.getElementById('simSpeedDisplay') as HTMLElement;
        timeScaleSlider.addEventListener('input', (e) => {
            const val = parseInt((e.target as HTMLInputElement).value);
            if (val === 0) { this.state.timeScale = 1; }
            else if (val < 0) { this.state.timeScale = Math.pow(10, val / 1000); }
            else { this.state.timeScale = Math.pow(10, val / 1000); }
            simSpeedDisplay.textContent = 'x' + this.state.timeScale.toFixed(2);
        });

        document.getElementById('btnPauseSim')!.addEventListener('click', () => this.togglePause());
        document.getElementById('btnCloseSim')!.addEventListener('click', () => this.closeSimulation());

        const closeModal = document.getElementById('closeModal') as HTMLButtonElement;
        const saveModal = document.getElementById('saveModal') as HTMLElement;
        closeModal.addEventListener('click', () => { saveModal.classList.remove('active'); });
        saveModal.addEventListener('click', (e) => { if (e.target === saveModal) saveModal.classList.remove('active'); });

        let isDragging = false;
        let dragStart = { x: 0, y: 0 };
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.state.isRunning) return;
            isDragging = true;
            const rect = this.canvas.getBoundingClientRect();
            dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            this.state.position = { ...dragStart };
            this.draw();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = this.canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            const dx = dragStart.x - currentX;
            const dy = dragStart.y - currentY;
            const power = 0.15;
            this.state.velocity = { x: dx * power, y: dy * power };
            const speed = Math.sqrt(dx * dx + dy * dy) * power;
            const angle = Math.atan2(-dy, dx) * 180 / Math.PI;
            this.state.initialSpeed = Math.min(speed, 200);
            this.state.angle = Math.max(0, Math.min(90, angle));
            speedSlider.value = this.state.initialSpeed.toFixed(0);
            speedValue.textContent = this.state.initialSpeed.toFixed(0);
            angleInput.value = this.state.angle.toFixed(0);
            this.drawTrajectory();
        });

        this.canvas.addEventListener('mouseup', () => { isDragging = false; });
    }

    private updatePlanetButtons(): void {
        document.querySelectorAll('.planet-btn').forEach(btn => {
            const g = parseFloat((btn as HTMLElement).dataset.g || '0');
            if (Math.abs(g - this.state.gravity) < 0.01) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }

    private updateDisplays(): void {
        (document.getElementById('gravitySlider') as HTMLInputElement).value = this.state.gravity.toString();
        document.getElementById('gravityValue')!.textContent = this.state.gravity.toFixed(2);
        (document.getElementById('speedSlider') as HTMLInputElement).value = this.state.initialSpeed.toString();
        document.getElementById('speedValue')!.textContent = this.state.initialSpeed.toFixed(0);
        (document.getElementById('angleInput') as HTMLInputElement).value = this.state.angle.toString();
        (document.getElementById('dragSlider') as HTMLInputElement).value = this.state.drag.toString();
        document.getElementById('dragValue')!.textContent = this.state.drag.toFixed(2);
        this.updatePlanetButtons();
    }

    private resizeCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (!this.state.isRunning) {
            this.state.position.y = this.canvas.height - 30;
            this.draw();
        }
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#334155';
        this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
        this.ctx.beginPath();
        this.ctx.arc(this.state.position.x, this.state.position.y, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#4f46e5';
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        if (!this.state.isRunning) this.drawTrajectory();
    }

    private drawTrajectory(): void {
        const rad = this.state.angle * Math.PI / 180;
        let x = this.state.position.x;
        let y = this.state.position.y;
        let vx = Math.cos(rad) * this.state.initialSpeed;
        let vy = -Math.sin(rad) * this.state.initialSpeed;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.strokeStyle = 'rgba(79, 70, 229, 0.5)';
        this.ctx.setLineDash([5, 5]);
        for (let i = 0; i < 200; i++) {
            vx *= (1 - this.state.drag);
            vy *= (1 - this.state.drag);
            vy += this.state.gravity * 0.016;
            x += vx;
            y += vy;
            if (y > this.canvas.height - 20) break;
            this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    private startSimulation(): void {
        if (this.state.isRunning) return;
        document.getElementById('settings-panel')!.classList.add('hidden');
        document.getElementById('sim-controls')!.classList.remove('hidden');
        this.state.position = { x: 50, y: this.canvas.height - 30 };
        const rad = this.state.angle * Math.PI / 180;
        this.state.velocity = { x: Math.cos(rad) * this.state.initialSpeed, y: -Math.sin(rad) * this.state.initialSpeed };
        this.state.isRunning = true;
        this.animate();
    }

    private animate(): void {
        if (!this.state.isRunning) return;
        const dt = 0.016 * this.state.timeScale;
        this.state.velocity.x *= (1 - this.state.drag * dt);
        this.state.velocity.y *= (1 - this.state.drag * dt);
        this.state.velocity.y += this.state.gravity * dt;
        this.state.position.x += this.state.velocity.x * dt;
        this.state.position.y += this.state.velocity.y * dt;
        if (this.state.position.y > this.canvas.height - 20) {
            this.state.position.y = this.canvas.height - 20;
            this.state.velocity.y *= -0.7;
            if (Math.abs(this.state.velocity.y) < 1) this.state.velocity.y = 0;
        }
        if (this.state.position.x < 0 || this.state.position.x > this.canvas.width) {
            this.state.velocity.x *= -0.8;
            this.state.position.x = Math.max(0, Math.min(this.canvas.width, this.state.position.x));
        }
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    private togglePause(): void {
        const btn = document.getElementById('btnPauseSim')!;
        if (this.state.isRunning) {
            this.state.isRunning = false;
            if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
            btn.textContent = 'Resume';
        } else {
            this.state.isRunning = true;
            this.animate();
            btn.textContent = 'Pause';
        }
    }

    private closeSimulation(): void {
        this.state.isRunning = false;
        if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
        document.getElementById('sim-controls')!.classList.add('hidden');
        document.getElementById('settings-panel')!.classList.remove('hidden');
        this.resetSimulation();
    }

    private resetSimulation(): void {
        this.state.position = { x: 50, y: this.canvas.height - 30 };
        this.state.velocity = { x: 0, y: 0 };
        this.state.isRunning = false;
        if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
        document.getElementById('btnPauseSim')!.textContent = 'Pause';
        this.draw();
    }

    private showSaveModal(): void {
        const modal = document.getElementById('saveModal')!;
        const name = prompt('Enter a name for this save:');
        if (!name) return;
        const config: SavedConfig = { name, timestamp: Date.now(), gravity: this.state.gravity, initialSpeed: this.state.initialSpeed, angle: this.state.angle, drag: this.state.drag };
        this.saves.push(config);
        this.saveSaves();
        alert('Settings saved as "' + name + '"!');
        modal.classList.remove('active');
    }

    private showLoadModal(): void {
        const modal = document.getElementById('saveModal')!;
        const container = document.getElementById('saveListContainer')!;
        if (this.saves.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No saved settings found.</p>';
        } else {
            container.innerHTML = '';
            const sorted = [...this.saves].sort((a, b) => b.timestamp - a.timestamp);
            sorted.forEach((save, idx) => {
                const date = new Date(save.timestamp).toLocaleString();
                const item = document.createElement('div');
                item.className = 'save-item';
                item.innerHTML = '<div class="save-info"><h4>' + save.name + '</h4><p>Saved: ' + date + '</p><p style="font-size:0.75rem;opacity:0.7">Gravity:' + save.gravity.toFixed(2) + '|Speed:' + save.initialSpeed.toFixed(0) + '|Angle:' + save.angle.toFixed(0) + '°|Drag:' + save.drag.toFixed(2) + '</p></div><div class="save-actions"><button class="btn btn-primary" data-idx="' + idx + '">Load</button><button class="btn btn-danger" data-del="' + idx + '">Delete</button></div>';
                container.appendChild(item);
            });
            container.querySelectorAll('[data-idx]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = parseInt((btn as HTMLElement).dataset.idx || '0');
                    const sorted = [...this.saves].sort((a, b) => b.timestamp - a.timestamp);
                    this.loadConfig(sorted[idx]);
                    modal.classList.remove('active');
                });
            });
            container.querySelectorAll('[data-del]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = parseInt((btn as HTMLElement).dataset.del || '0');
                    const sorted = [...this.saves].sort((a, b) => b.timestamp - a.timestamp);
                    const toDel = sorted[idx];
                    if (confirm('Delete "' + toDel.name + '"?')) {
                        this.saves = this.saves.filter(s => s.timestamp !== toDel.timestamp);
                        this.saveSaves();
                        this.showLoadModal();
                    }
                });
            });
        }
        modal.classList.add('active');
    }

    private loadConfig(config: SavedConfig): void {
        this.state.gravity = config.gravity;
        this.state.initialSpeed = config.initialSpeed;
        this.state.angle = config.angle;
        this.state.drag = config.drag;
        this.updateDisplays();
        this.draw();
    }
}

window.addEventListener('DOMContentLoaded', () => { new GravitySimulator(); });
