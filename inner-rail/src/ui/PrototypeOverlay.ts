export interface OverlayCallbacks {
  onStartDevice(): void;
  onStartSynthetic(): void;
  onCalibrate(): void;
  onRestart(): void;
  onRecenter(): void;
  onSyntheticTilt(x: number, y: number): void;
}

export type OverlayState =
  | { kind: 'start'; preferSynthetic: boolean; deviceSupported: boolean }
  | { kind: 'requesting' }
  | { kind: 'awaiting-sensor' }
  | { kind: 'calibration'; sourceLabel: string }
  | { kind: 'active'; synthetic: boolean }
  | { kind: 'error'; title: string; detail: string };

export class PrototypeOverlay {
  readonly sceneRoot: HTMLElement;
  readonly telemetryRoot: HTMLElement;
  readonly tuningRoot: HTMLElement;

  private readonly shell: HTMLElement;
  private readonly stateRoot: HTMLElement;
  private readonly controlsRoot: HTMLElement;
  private readonly vectorStage: HTMLElement;
  private readonly vectorNeedle: HTMLElement;
  private readonly vectorLabel: HTMLElement;
  private readonly syntheticPad: HTMLElement;
  private readonly inputSourceChip: HTMLElement;
  private debugVisible = false;
  private active = false;

  constructor(private readonly root: HTMLElement, private readonly callbacks: OverlayCallbacks) {
    this.root.innerHTML = `
      <main class="prototype-shell" data-mode="start">
        <div class="scene-root" data-scene-root aria-hidden="true"></div>
        <div class="ambient-grid" aria-hidden="true"></div>
        <header class="prototype-header">
          <span class="eyebrow">INNER RAIL / P0.3</span>
          <span class="status-dot" aria-hidden="true"></span>
          <span class="orientation-chip orientation-chip--portrait">PORTRAIT TEST</span>
          <span class="orientation-chip orientation-chip--landscape">LANDSCAPE TEST</span>
          <span class="input-source-chip" data-input-source hidden></span>
        </header>
        <section class="vector-stage" data-vector-stage aria-label="Tilt force visualization">
          <div class="vector-ring vector-ring--outer"></div>
          <div class="vector-ring vector-ring--inner"></div>
          <div class="vector-axis vector-axis--x"></div>
          <div class="vector-axis vector-axis--y"></div>
          <div class="vector-origin"></div>
          <div class="vector-needle" data-vector-needle><span></span></div>
          <div class="vector-caption" data-vector-label>FIELD / NEUTRAL</div>
        </section>
        <section class="state-panel" data-state></section>
        <section class="synthetic-pad" data-synthetic-pad hidden aria-label="Synthetic tilt control">
          <div class="synthetic-crosshair"></div>
          <div class="synthetic-knob"></div>
          <span>SYNTHETIC INPUT · DEVICE TILT OFF</span>
        </section>
        <nav class="runtime-controls" data-controls hidden aria-label="Prototype controls">
          <button type="button" class="button button--ghost" data-restart>RESTART</button>
          <button type="button" class="button button--secondary" data-recenter>RECENTER</button>
        </nav>
        <pre class="telemetry" data-telemetry hidden></pre>
        <aside class="tuning-root" data-tuning-root hidden aria-label="Prototype tuning"></aside>
      </main>
    `;

    this.shell = this.requireElement('.prototype-shell');
    this.sceneRoot = this.requireElement('[data-scene-root]');
    this.stateRoot = this.requireElement('[data-state]');
    this.controlsRoot = this.requireElement('[data-controls]');
    this.vectorStage = this.requireElement('[data-vector-stage]');
    this.vectorNeedle = this.requireElement('[data-vector-needle]');
    this.vectorLabel = this.requireElement('[data-vector-label]');
    this.syntheticPad = this.requireElement('[data-synthetic-pad]');
    this.inputSourceChip = this.requireElement('[data-input-source]');
    this.telemetryRoot = this.requireElement('[data-telemetry]');
    this.tuningRoot = this.requireElement('[data-tuning-root]');

    this.requireElement<HTMLButtonElement>('[data-restart]').addEventListener('click', () => callbacks.onRestart());
    this.requireElement<HTMLButtonElement>('[data-recenter]').addEventListener('click', () => callbacks.onRecenter());
    this.bindSyntheticPad();
  }

  setDebugVisible(visible: boolean): void {
    this.debugVisible = visible;
    this.telemetryRoot.hidden = !visible;
    this.tuningRoot.hidden = !visible;
    this.vectorStage.hidden = this.active && !visible;
  }

  renderState(state: OverlayState): void {
    this.active = state.kind === 'active';
    this.shell.dataset.mode = state.kind;
    this.controlsRoot.hidden = !this.active;
    this.syntheticPad.hidden = !(this.active && state.kind === 'active' && state.synthetic);
    this.stateRoot.hidden = this.active;
    this.vectorStage.hidden = this.active && !this.debugVisible;

    if (state.kind === 'active') {
      this.inputSourceChip.hidden = false;
      this.inputSourceChip.textContent = state.synthetic ? 'SYNTHETIC INPUT' : 'DEVICE MOTION';
      this.inputSourceChip.classList.toggle('input-source-chip--synthetic', state.synthetic);
      this.shell.dataset.inputSource = state.synthetic ? 'synthetic' : 'device';
    } else {
      this.inputSourceChip.hidden = true;
      this.inputSourceChip.classList.remove('input-source-chip--synthetic');
      delete this.shell.dataset.inputSource;
    }

    if (state.kind === 'start') {
      const primary = state.preferSynthetic ? 'DESKTOP TILT TEST' : 'ENABLE MOTION';
      const secondary = state.preferSynthetic ? 'TRY DEVICE SENSOR' : 'USE SYNTHETIC INPUT';
      const secondaryDisabled = !state.deviceSupported && state.preferSynthetic;
      this.stateRoot.innerHTML = `
        <p class="kicker">60–90 SECOND VALIDATION TRACK</p>
        <h1>Become the ball.</h1>
        <p>One gravity rule. Read the rail, manage momentum, clear the gap, and brake inside the final luminous gate.</p>
        <div class="action-stack">
          <button type="button" class="button button--primary" data-primary>${primary}</button>
          <button type="button" class="button button--ghost" data-secondary ${secondaryDisabled ? 'disabled' : ''}>${secondary}</button>
        </div>
      `;
      this.requireElement<HTMLButtonElement>('[data-primary]', this.stateRoot).addEventListener('click', () => {
        if (state.preferSynthetic) this.callbacks.onStartSynthetic();
        else this.callbacks.onStartDevice();
      });
      this.requireElement<HTMLButtonElement>('[data-secondary]', this.stateRoot).addEventListener('click', () => {
        if (state.preferSynthetic) this.callbacks.onStartDevice();
        else this.callbacks.onStartSynthetic();
      });
      return;
    }

    if (state.kind === 'requesting') {
      this.stateRoot.innerHTML = `<p class="kicker">MOTION ACCESS</p><h1>Requesting sensor…</h1><p>Keep the browser active while motion access is resolved.</p>`;
      return;
    }

    if (state.kind === 'awaiting-sensor') {
      this.stateRoot.innerHTML = `<p class="kicker">SENSOR ONLINE</p><h1>Move the device once.</h1><p>Waiting for the first orientation sample.</p>`;
      return;
    }

    if (state.kind === 'calibration') {
      this.stateRoot.innerHTML = `
        <p class="kicker">${state.sourceLabel.toUpperCase()} / NEUTRAL POSE</p>
        <h1>Hold naturally.</h1>
        <p>This pose becomes zero horizontal force. Rotating between portrait and landscape asks for a fresh neutral pose so the comparison stays valid.</p>
        <button type="button" class="button button--primary" data-calibrate>SET NEUTRAL & START</button>
      `;
      this.requireElement<HTMLButtonElement>('[data-calibrate]', this.stateRoot).addEventListener('click', () => this.callbacks.onCalibrate());
      return;
    }

    if (state.kind === 'active') {
      this.stateRoot.innerHTML = '';
      return;
    }

    this.stateRoot.innerHTML = `
      <p class="kicker">SENSOR RECOVERY</p>
      <h1>${state.title}</h1>
      <p>${state.detail}</p>
      <button type="button" class="button button--primary" data-fallback>USE SYNTHETIC INPUT</button>
    `;
    this.requireElement<HTMLButtonElement>('[data-fallback]', this.stateRoot).addEventListener('click', () => this.callbacks.onStartSynthetic());
  }

  renderVector(x: number, y: number): void {
    const clampedX = Math.max(-1, Math.min(1, x));
    const clampedY = Math.max(-1, Math.min(1, y));
    const magnitude = Math.min(1, Math.hypot(clampedX, clampedY));
    const angleDeg = Math.atan2(clampedY, clampedX) * (180 / Math.PI) + 90;
    this.vectorNeedle.style.setProperty('--vector-angle', `${angleDeg}deg`);
    this.vectorNeedle.style.height = `${8 + 39 * magnitude}%`;
    this.vectorNeedle.style.opacity = `${0.35 + 0.65 * magnitude}`;
    this.vectorLabel.textContent = magnitude < 0.02 ? 'FIELD / NEUTRAL' : `FIELD / ${(magnitude * 100).toFixed(0)}%`;
  }

  private bindSyntheticPad(): void {
    const knob = this.requireElement<HTMLElement>('.synthetic-knob', this.syntheticPad);
    const setNeutral = (): void => {
      knob.style.left = '50%';
      knob.style.top = '50%';
      this.callbacks.onSyntheticTilt(0, 0);
    };
    const updateFromPointer = (event: PointerEvent): void => {
      const rect = this.syntheticPad.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      const clampedX = Math.max(-1, Math.min(1, x));
      const clampedY = Math.max(-1, Math.min(1, y));
      knob.style.left = `${50 + clampedX * 42}%`;
      knob.style.top = `${50 + clampedY * 42}%`;
      this.callbacks.onSyntheticTilt(clampedX, clampedY);
    };

    this.syntheticPad.addEventListener('pointerdown', (event) => {
      this.syntheticPad.setPointerCapture(event.pointerId);
      updateFromPointer(event);
    });
    this.syntheticPad.addEventListener('pointermove', (event) => {
      if (this.syntheticPad.hasPointerCapture(event.pointerId)) updateFromPointer(event);
    });
    const release = (event: PointerEvent): void => {
      if (this.syntheticPad.hasPointerCapture(event.pointerId)) this.syntheticPad.releasePointerCapture(event.pointerId);
      setNeutral();
    };
    this.syntheticPad.addEventListener('pointerup', release);
    this.syntheticPad.addEventListener('pointercancel', release);
  }

  private requireElement<T extends Element = HTMLElement>(selector: string, root: ParentNode = this.root): T {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing required prototype element: ${selector}`);
    return element;
  }
}
