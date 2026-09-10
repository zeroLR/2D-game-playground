import type { DestructionEvent } from '../game/DestructionSession';
import type { VortexEvolutionPath } from '../progression/VortexEvolutionSystem';

const PATH_FINAL: Record<VortexEvolutionPath, string> = {
  'gravity-well': 'SINGULARITY',
  orbit: 'EVENT HORIZON',
};

export class VortexEvolutionStatus {
  private readonly root: HTMLElement;
  private readonly stage: HTMLElement;
  private readonly progress: HTMLElement;
  private path: VortexEvolutionPath;
  private flashTimer: number | null = null;

  constructor(host: HTMLElement, path: VortexEvolutionPath) {
    this.path = path;

    const root = document.createElement('div');
    root.className = 'vortex-evolution-status';
    root.setAttribute('aria-live', 'polite');

    const glyph = document.createElement('span');
    glyph.className = 'vortex-evolution-glyph';
    glyph.textContent = '○';

    const copy = document.createElement('span');
    copy.className = 'vortex-evolution-copy';

    const stage = document.createElement('strong');
    stage.className = 'vortex-evolution-stage';
    stage.textContent = 'VORTEX';

    const progress = document.createElement('span');
    progress.className = 'vortex-evolution-progress';
    progress.textContent = `0/3 → ${PATH_FINAL[path]}`;

    copy.append(stage, progress);
    root.append(glyph, copy);
    host.append(root);

    this.root = root;
    this.stage = stage;
    this.progress = progress;
  }

  reset(path: VortexEvolutionPath): void {
    this.path = path;
    this.stage.textContent = 'VORTEX';
    this.progress.textContent = `0/3 → ${PATH_FINAL[path]}`;
    this.root.dataset.stage = '0';
    this.root.classList.remove('is-evolving');
    if (this.flashTimer !== null) window.clearTimeout(this.flashTimer);
    this.flashTimer = null;
  }

  handle(event: DestructionEvent): void {
    if (event.type === 'vortex-evolution-progress') {
      this.path = event.path;
      this.stage.textContent = event.stageName;
      this.root.dataset.stage = String(event.stage);
      this.progress.textContent = event.nextThreshold === null
        ? 'MAX EVOLUTION'
        : `${event.qualifiedUses}/${event.nextThreshold} → ${PATH_FINAL[event.path]}`;
      return;
    }

    if (event.type !== 'vortex-evolved') return;
    this.path = event.path;
    this.stage.textContent = event.stageName;
    this.root.dataset.stage = String(event.stage);
    this.progress.textContent = event.nextThreshold === null
      ? 'MAX EVOLUTION'
      : `${event.qualifiedUses}/${event.nextThreshold} → ${PATH_FINAL[event.path]}`;
    this.flashEvolution();
  }

  setVisible(visible: boolean): void {
    this.root.hidden = !visible;
  }

  destroy(): void {
    if (this.flashTimer !== null) window.clearTimeout(this.flashTimer);
    this.root.remove();
  }

  private flashEvolution(): void {
    this.root.classList.remove('is-evolving');
    void this.root.offsetWidth;
    this.root.classList.add('is-evolving');
    if (this.flashTimer !== null) window.clearTimeout(this.flashTimer);
    this.flashTimer = window.setTimeout(() => {
      this.root.classList.remove('is-evolving');
      this.flashTimer = null;
    }, 900);
  }
}
