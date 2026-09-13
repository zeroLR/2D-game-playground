import type { DestructionEvent } from '../game/DestructionSession';

interface BossGeometry {
  xRatio: number;
  yRatio: number;
  radiusRatio: number;
}

export class BossCoreOverlay {
  private readonly root: HTMLElement;
  private readonly core: HTMLElement;
  private readonly shell: HTMLElement;
  private readonly sigil: HTMLElement;
  private readonly phasePips: HTMLElement;
  private viewportWidth = 1;
  private viewportHeight = 1;
  private geometry: BossGeometry | null = null;
  private reducedMotion = false;

  constructor(host: HTMLElement) {
    const root = document.createElement('div');
    root.className = 'boss-core-layer';
    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');

    const shell = document.createElement('div');
    shell.className = 'boss-core-shell';

    const core = document.createElement('div');
    core.className = 'boss-core';

    const sigil = document.createElement('div');
    sigil.className = 'boss-core-sigil';

    const phasePips = document.createElement('div');
    phasePips.className = 'boss-core-phases';

    core.append(sigil);
    shell.append(core, phasePips);
    root.append(shell);
    host.append(root);

    this.root = root;
    this.core = core;
    this.shell = shell;
    this.sigil = sigil;
    this.phasePips = phasePips;
  }

  setViewport(width: number, height: number): void {
    this.viewportWidth = Math.max(1, width);
    this.viewportHeight = Math.max(1, height);
    this.applyGeometry();
  }

  setReducedMotion(enabled: boolean): void {
    this.reducedMotion = enabled;
    this.root.dataset.reducedMotion = String(enabled);
  }

  handle(event: DestructionEvent): void {
    switch (event.type) {
      case 'boss-phase-started':
        this.captureGeometry(event.position.x, event.position.y, event.radius);
        this.root.hidden = false;
        this.root.dataset.state = 'shielded';
        this.renderPhasePips(event.phaseIndex, event.total);
        this.pulse('phase');
        break;
      case 'boss-exposed':
        this.captureGeometry(event.position.x, event.position.y, event.radius);
        this.root.hidden = false;
        this.root.dataset.state = 'exposed';
        this.root.style.setProperty('--boss-exposure-seconds', `${Math.max(0.1, event.duration)}s`);
        this.pulse('exposed');
        break;
      case 'boss-core-blocked':
        this.pulse('blocked');
        break;
      case 'boss-core-hit':
        this.root.dataset.state = 'breaking';
        this.pulse('hit');
        break;
      case 'boss-rearmed':
        this.root.hidden = false;
        this.root.dataset.state = 'shielded';
        this.pulse('phase');
        break;
      case 'boss-defeated':
        this.root.dataset.state = 'defeated';
        this.pulse('defeated');
        break;
      case 'encounter-started':
        if (event.encounterKind !== 'boss') this.reset();
        break;
      default:
        break;
    }
  }

  reset(): void {
    this.geometry = null;
    this.root.hidden = true;
    delete this.root.dataset.state;
    this.phasePips.replaceChildren();
  }

  destroy(): void {
    this.root.remove();
  }

  private captureGeometry(x: number, y: number, radius: number): void {
    this.geometry = {
      xRatio: x / this.viewportWidth,
      yRatio: y / this.viewportHeight,
      radiusRatio: radius / Math.min(this.viewportWidth, this.viewportHeight),
    };
    this.applyGeometry();
  }

  private applyGeometry(): void {
    if (!this.geometry) return;
    const minAxis = Math.min(this.viewportWidth, this.viewportHeight);
    const radius = Math.max(24, this.geometry.radiusRatio * minAxis);
    this.shell.style.left = `${this.geometry.xRatio * this.viewportWidth}px`;
    this.shell.style.top = `${this.geometry.yRatio * this.viewportHeight}px`;
    this.shell.style.setProperty('--boss-core-radius', `${radius}px`);
  }

  private renderPhasePips(activeIndex: number, total: number): void {
    this.phasePips.replaceChildren();
    for (let index = 0; index < total; index += 1) {
      const pip = document.createElement('span');
      pip.className = 'boss-core-phase-pip';
      pip.dataset.state = index < activeIndex ? 'broken' : index === activeIndex ? 'active' : 'sealed';
      this.phasePips.append(pip);
    }
  }

  private pulse(kind: 'phase' | 'exposed' | 'blocked' | 'hit' | 'defeated'): void {
    if (this.reducedMotion || typeof this.core.animate !== 'function') return;

    const keyframes: Keyframe[] = kind === 'blocked'
      ? [
          { transform: 'scale(1)' },
          { transform: 'scale(1.08)' },
          { transform: 'scale(1)' },
        ]
      : kind === 'hit' || kind === 'defeated'
        ? [
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(1.28)', opacity: 1 },
            { transform: 'scale(0.92)', opacity: kind === 'defeated' ? 0.18 : 1 },
          ]
        : [
            { transform: 'scale(0.88)', opacity: 0.45 },
            { transform: 'scale(1.08)', opacity: 1 },
            { transform: 'scale(1)', opacity: 1 },
          ];

    this.core.animate(keyframes, {
      duration: kind === 'defeated' ? 520 : kind === 'hit' ? 300 : 220,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    });
    this.sigil.animate(
      [{ transform: 'rotate(0deg)' }, { transform: `rotate(${kind === 'blocked' ? 18 : 90}deg)` }],
      { duration: kind === 'defeated' ? 520 : 260, easing: 'ease-out' },
    );
  }
}
