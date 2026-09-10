import type { VortexEvolutionPath } from '../progression/VortexEvolutionSystem';

interface PathCopy {
  title: string;
  tierOne: string;
  tierTwo: string;
  summary: string;
}

const PATH_COPY: Record<VortexEvolutionPath, PathCopy> = {
  'gravity-well': {
    title: 'GRAVITY',
    tierOne: 'GRAVITY WELL',
    tierTwo: 'SINGULARITY',
    summary: 'Gather harder, then collapse clustered targets.',
  },
  orbit: {
    title: 'ORBIT',
    tierOne: 'ORBIT',
    tierTwo: 'EVENT HORIZON',
    summary: 'Capture targets into a longer rotating field.',
  },
};

export class VortexBuildPicker {
  private readonly root: HTMLElement;
  private readonly optionButtons = new Map<VortexEvolutionPath, HTMLButtonElement>();
  private readonly startButton: HTMLButtonElement;
  private selected: VortexEvolutionPath = 'gravity-well';
  private resolver: ((path: VortexEvolutionPath) => void) | null = null;

  constructor(host: HTMLElement) {
    const root = document.createElement('section');
    root.className = 'vortex-build-picker';
    root.hidden = true;
    root.setAttribute('aria-label', 'Choose Vortex evolution path');

    const backdrop = document.createElement('div');
    backdrop.className = 'vortex-build-backdrop';

    const panel = document.createElement('div');
    panel.className = 'vortex-build-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');

    const eyebrow = document.createElement('span');
    eyebrow.className = 'vortex-build-eyebrow';
    eyebrow.textContent = 'VORTEX EVOLUTION';

    const title = document.createElement('strong');
    title.className = 'vortex-build-title';
    title.textContent = 'Choose how ○ evolves this run';

    const options = document.createElement('div');
    options.className = 'vortex-build-options';

    for (const path of ['gravity-well', 'orbit'] as const) {
      const copy = PATH_COPY[path];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'vortex-build-option';
      button.dataset.path = path;
      button.setAttribute('aria-pressed', 'false');

      const heading = document.createElement('strong');
      heading.textContent = copy.title;
      const branch = document.createElement('span');
      branch.className = 'vortex-build-branch';
      branch.textContent = `${copy.tierOne}  →  ${copy.tierTwo}`;
      const summary = document.createElement('span');
      summary.className = 'vortex-build-summary';
      summary.textContent = copy.summary;
      const thresholds = document.createElement('span');
      thresholds.className = 'vortex-build-thresholds';
      thresholds.textContent = '3 qualified uses → T1   ·   6 → T2';

      button.append(heading, branch, summary, thresholds);
      button.addEventListener('click', () => this.select(path));
      options.append(button);
      this.optionButtons.set(path, button);
    }

    const startButton = document.createElement('button');
    startButton.type = 'button';
    startButton.className = 'vortex-build-start';
    startButton.textContent = 'START RUN';
    startButton.addEventListener('click', () => {
      const resolver = this.resolver;
      if (!resolver) return;
      this.resolver = null;
      root.hidden = true;
      resolver(this.selected);
    });

    panel.append(eyebrow, title, options, startButton);
    root.append(backdrop, panel);
    host.append(root);

    this.root = root;
    this.startButton = startButton;
    this.select(this.selected);
  }

  choose(current: VortexEvolutionPath): Promise<VortexEvolutionPath> {
    if (this.resolver) throw new Error('VortexBuildPicker is already awaiting a choice.');
    this.select(current);
    this.root.hidden = false;
    queueMicrotask(() => this.optionButtons.get(current)?.focus());
    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  destroy(): void {
    this.resolver = null;
    this.root.remove();
  }

  private select(path: VortexEvolutionPath): void {
    this.selected = path;
    for (const [candidate, button] of this.optionButtons) {
      button.setAttribute('aria-pressed', String(candidate === path));
    }
    this.startButton?.setAttribute('aria-label', `Start run with ${PATH_COPY[path].tierTwo} path`);
  }
}
