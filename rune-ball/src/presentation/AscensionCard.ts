import type { AscensionSnapshot } from '../progression/AscensionSystem';

export class AscensionCard {
  private readonly root: HTMLElement;
  private readonly button: HTMLButtonElement;
  private readonly meter: HTMLElement;
  private readonly state: HTMLElement;
  private readonly onRelease: () => boolean;
  private ready = false;
  private runtimeEnabled = true;

  constructor(host: HTMLElement, onRelease: () => boolean) {
    this.onRelease = onRelease;

    const root = document.createElement('div');
    root.className = 'ascension-card-root';

    const button = document.createElement('button');
    button.className = 'ascension-card';
    button.type = 'button';
    button.setAttribute('aria-label', 'Vortex Ascension: Singularity');
    button.setAttribute('aria-disabled', 'true');

    const glyph = document.createElement('span');
    glyph.className = 'ascension-card-glyph';
    glyph.textContent = '○';

    const copy = document.createElement('span');
    copy.className = 'ascension-card-copy';

    const name = document.createElement('span');
    name.className = 'ascension-card-name';
    name.textContent = 'VORTEX';

    const state = document.createElement('span');
    state.className = 'ascension-card-state';
    state.textContent = '0%';

    copy.append(name, state);

    const meter = document.createElement('span');
    meter.className = 'ascension-card-meter';

    button.append(glyph, copy, meter);
    root.append(button);
    host.append(root);

    button.addEventListener('click', () => {
      if (!this.ready || !this.runtimeEnabled) return;
      this.onRelease();
    });

    this.root = root;
    this.button = button;
    this.meter = meter;
    this.state = state;
  }

  render(snapshot: AscensionSnapshot): void {
    const ratio = Math.min(1, Math.max(0, snapshot.energy / snapshot.maxEnergy));
    this.ready = snapshot.ready;
    this.root.style.setProperty('--ascension-progress', `${ratio * 100}%`);
    this.button.dataset.state = snapshot.ready ? 'ready' : 'charging';
    this.state.textContent = snapshot.ready ? 'SINGULARITY READY' : `${Math.round(ratio * 100)}%`;
    this.meter.setAttribute('aria-hidden', 'true');
    this.syncInteraction();
  }

  setRuntimeEnabled(enabled: boolean): void {
    this.runtimeEnabled = enabled;
    this.syncInteraction();
  }

  destroy(): void {
    this.root.remove();
  }

  private syncInteraction(): void {
    const interactive = this.ready && this.runtimeEnabled;
    this.button.setAttribute('aria-disabled', String(!interactive));
    this.button.tabIndex = interactive ? 0 : -1;
  }
}
