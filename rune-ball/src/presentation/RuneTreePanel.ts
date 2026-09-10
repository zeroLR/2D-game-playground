import {
  RUNE_TREE_ORDER,
  VORTEX_PATH_ORDER,
  getRuneBaseDefinition,
  getVortexEvolutionNode,
  getVortexPathDefinition,
  type RuneTreeId,
  type VortexEvolutionPath,
  type VortexEvolutionTier,
} from '../progression/RuneEvolutionCatalog';
import '../rune-tree.css';
import '../rune-tree-refinement.css';

type VortexNodeSelection =
  | { kind: 'base' }
  | { kind: 'evolution'; path: VortexEvolutionPath; tier: VortexEvolutionTier };

export interface RuneTreePanelCallbacks {
  onVortexPathChange(path: VortexEvolutionPath): void;
}

export class RuneTreePanel {
  private readonly root: HTMLElement;
  private readonly runeButtons = new Map<RuneTreeId, HTMLButtonElement>();
  private readonly treeMount: HTMLElement;
  private readonly detailMount: HTMLElement;
  private readonly callbacks: RuneTreePanelCallbacks;
  private readonly branchRoots = new Map<VortexEvolutionPath, HTMLElement>();
  private readonly nodeButtons = new Map<string, HTMLButtonElement>();
  private selectedRune: RuneTreeId = 'vortex';
  private selectedPath: VortexEvolutionPath;
  private selectedNode: VortexNodeSelection;

  constructor(host: HTMLElement, selectedPath: VortexEvolutionPath, callbacks: RuneTreePanelCallbacks) {
    this.selectedPath = selectedPath;
    this.selectedNode = { kind: 'evolution', path: selectedPath, tier: 2 };
    this.callbacks = callbacks;

    const root = document.createElement('section');
    root.className = 'rune-tree-workspace';
    root.setAttribute('aria-label', 'Rune evolution build');

    const selector = document.createElement('div');
    selector.className = 'rune-tree-selector';
    selector.setAttribute('role', 'group');
    selector.setAttribute('aria-label', 'Choose Rune');

    for (const runeId of RUNE_TREE_ORDER) {
      const definition = getRuneBaseDefinition(runeId);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rune-tree-rune-button';
      button.dataset.rune = runeId;
      button.dataset.status = definition.evolutionStatus;
      button.setAttribute('aria-pressed', 'false');

      const glyph = document.createElement('span');
      glyph.className = 'rune-tree-rune-glyph';
      glyph.textContent = definition.glyph;
      glyph.setAttribute('aria-hidden', 'true');

      const copy = document.createElement('span');
      copy.className = 'rune-tree-rune-copy';
      const name = document.createElement('strong');
      name.textContent = definition.name;
      const state = document.createElement('small');
      state.textContent = definition.evolutionStatus === 'authored' ? 'TREE' : 'BASE';
      copy.append(name, state);

      button.append(glyph, copy);
      button.addEventListener('click', () => this.selectRune(runeId));
      selector.append(button);
      this.runeButtons.set(runeId, button);
    }

    const treeMount = document.createElement('div');
    treeMount.className = 'rune-tree-canvas';

    const detailMount = document.createElement('div');
    detailMount.className = 'rune-tree-detail-mount';
    detailMount.setAttribute('aria-live', 'polite');

    root.append(selector, treeMount, detailMount);
    host.append(root);

    this.root = root;
    this.treeMount = treeMount;
    this.detailMount = detailMount;
    this.renderRune();
  }

  setVortexPath(path: VortexEvolutionPath): void {
    const changed = path !== this.selectedPath;
    this.selectedPath = path;
    if (changed && this.selectedRune === 'vortex') {
      this.selectedNode = { kind: 'evolution', path, tier: 2 };
    }
    this.syncVortexState();
    this.renderDetail();
  }

  showConfiguredRune(): void {
    if (this.selectedRune !== 'vortex') this.selectRune('vortex');
  }

  destroy(): void {
    this.root.remove();
  }

  private selectRune(runeId: RuneTreeId): void {
    if (this.selectedRune === runeId) return;
    this.selectedRune = runeId;
    if (runeId === 'vortex') {
      this.selectedNode = { kind: 'evolution', path: this.selectedPath, tier: 2 };
    }
    this.renderRune();
  }

  private renderRune(): void {
    for (const [runeId, button] of this.runeButtons) {
      button.setAttribute('aria-pressed', String(runeId === this.selectedRune));
    }

    this.branchRoots.clear();
    this.nodeButtons.clear();
    this.treeMount.replaceChildren();

    if (this.selectedRune === 'vortex') this.renderVortexTree();
    else this.renderFutureRune();

    this.renderDetail();
  }

  private renderVortexTree(): void {
    const base = getRuneBaseDefinition('vortex');
    const graph = document.createElement('div');
    graph.className = 'rune-tree-graph';

    const baseNode = document.createElement('button');
    baseNode.type = 'button';
    baseNode.className = 'rune-tree-node rune-tree-base-node';
    baseNode.dataset.node = 'vortex-base';
    baseNode.setAttribute('aria-pressed', String(this.selectedNode.kind === 'base'));
    baseNode.setAttribute('aria-label', 'Base Vortex');
    const baseGlyph = document.createElement('span');
    baseGlyph.className = 'rune-tree-node-base-glyph';
    baseGlyph.textContent = base.glyph;
    baseGlyph.setAttribute('aria-hidden', 'true');
    baseNode.append(baseGlyph);
    baseNode.addEventListener('click', () => {
      this.selectedNode = { kind: 'base' };
      this.syncNodeSelection();
      this.renderDetail();
    });
    this.nodeButtons.set('base', baseNode);

    const branches = document.createElement('div');
    branches.className = 'rune-tree-branch-grid';

    for (const path of VORTEX_PATH_ORDER) {
      const pathDefinition = getVortexPathDefinition(path);
      const branch = document.createElement('section');
      branch.className = 'rune-tree-branch';
      branch.dataset.path = path;
      branch.dataset.equipped = String(path === this.selectedPath);

      const pathMark = document.createElement('span');
      pathMark.className = `rune-tree-path-mark rune-tree-path-mark--${path}`;
      pathMark.setAttribute('aria-hidden', 'true');

      const tierOne = this.makeEvolutionNode(path, 1);
      const rail = document.createElement('span');
      rail.className = 'rune-tree-rail';
      rail.setAttribute('aria-hidden', 'true');
      const tierTwo = this.makeEvolutionNode(path, 2);

      branch.append(pathMark, tierOne, rail, tierTwo);
      branches.append(branch);
      this.branchRoots.set(path, branch);
    }

    graph.append(baseNode, branches);
    this.treeMount.append(graph);
    this.syncVortexState();
  }

  private makeEvolutionNode(path: VortexEvolutionPath, tier: VortexEvolutionTier): HTMLButtonElement {
    const node = getVortexEvolutionNode(path, tier);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'rune-tree-node rune-tree-evolution-node';
    button.dataset.path = path;
    button.dataset.tier = String(tier);
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `Tier ${tier} ${node.name}. Auto evolves at ${node.threshold} qualified Vortex uses.`);

    const sigil = document.createElement('span');
    sigil.className = `rune-tree-node-sigil rune-tree-node-sigil--${path} rune-tree-node-sigil--tier-${tier}`;
    sigil.setAttribute('aria-hidden', 'true');
    const core = document.createElement('span');
    core.className = 'rune-tree-node-sigil-core';
    sigil.append(core);
    button.append(sigil);

    button.addEventListener('click', () => {
      if (path !== this.selectedPath) {
        this.selectedPath = path;
        this.callbacks.onVortexPathChange(path);
      }
      this.selectedNode = { kind: 'evolution', path, tier };
      this.syncVortexState();
      this.renderDetail();
    });

    this.nodeButtons.set(`${path}:${tier}`, button);
    return button;
  }

  private renderFutureRune(): void {
    const definition = getRuneBaseDefinition(this.selectedRune);

    const graph = document.createElement('div');
    graph.className = 'rune-tree-graph rune-tree-graph-future';

    const baseNode = document.createElement('div');
    baseNode.className = 'rune-tree-node rune-tree-base-node rune-tree-future-base';
    const baseGlyph = document.createElement('span');
    baseGlyph.className = 'rune-tree-node-base-glyph';
    baseGlyph.textContent = definition.glyph;
    baseGlyph.setAttribute('aria-hidden', 'true');
    baseNode.append(baseGlyph);

    const branches = document.createElement('div');
    branches.className = 'rune-tree-branch-grid rune-tree-future-branches';
    for (let index = 0; index < 2; index += 1) {
      const branch = document.createElement('div');
      branch.className = 'rune-tree-branch rune-tree-future-branch';
      branch.innerHTML = [
        '<span class="rune-tree-future-path-mark" aria-hidden="true"></span>',
        '<div class="rune-tree-node rune-tree-future-node"><span class="rune-tree-future-node-mark" aria-hidden="true"></span></div>',
        '<span class="rune-tree-rail" aria-hidden="true"></span>',
        '<div class="rune-tree-node rune-tree-future-node"><span class="rune-tree-future-node-mark rune-tree-future-node-mark--final" aria-hidden="true"></span></div>',
      ].join('');
      branches.append(branch);
    }

    graph.append(baseNode, branches);
    this.treeMount.append(graph);
  }

  private renderDetail(): void {
    this.detailMount.replaceChildren();

    if (this.selectedRune !== 'vortex') {
      const definition = getRuneBaseDefinition(this.selectedRune);
      this.detailMount.append(this.makeDetailCard({
        eyebrow: `BASE RUNE · ${definition.role}`,
        title: definition.name,
        description: definition.description,
        playPattern: definition.playPattern,
        trigger: 'EVOLUTION TREE · NOT YET AUTHORED',
      }));
      return;
    }

    const base = getRuneBaseDefinition('vortex');
    if (this.selectedNode.kind === 'base') {
      this.detailMount.append(this.makeDetailCard({
        eyebrow: `BASE RUNE · ${base.role}`,
        title: base.name,
        description: base.description,
        playPattern: base.playPattern,
        trigger: 'EVOLUTION BEGINS FROM QUALIFIED VORTEX USES',
      }));
      return;
    }

    const path = getVortexPathDefinition(this.selectedNode.path);
    const node = getVortexEvolutionNode(this.selectedNode.path, this.selectedNode.tier);
    const card = this.makeDetailCard({
      eyebrow: `T${node.tier} · ${path.title} PATH`,
      title: node.name,
      description: node.description,
      playPattern: node.playPattern,
      trigger: `AUTO-EVOLVE · ${node.threshold} QUALIFIED VORTEX USES`,
    });

    const active = document.createElement('span');
    active.className = 'rune-tree-detail-active';
    active.textContent = `${path.title} PATH ACTIVE`;
    card.append(active);
    this.detailMount.append(card);
  }

  private makeDetailCard(copy: {
    eyebrow: string;
    title: string;
    description: string;
    playPattern: string;
    trigger: string;
  }): HTMLElement {
    const card = document.createElement('section');
    card.className = 'rune-tree-detail';

    const eyebrow = document.createElement('span');
    eyebrow.className = 'rune-tree-detail-eyebrow';
    eyebrow.textContent = copy.eyebrow;

    const title = document.createElement('h2');
    title.textContent = copy.title;

    const description = document.createElement('p');
    description.textContent = copy.description;

    const pattern = document.createElement('div');
    pattern.className = 'rune-tree-pattern';
    const patternLabel = document.createElement('span');
    patternLabel.textContent = 'PLAY PATTERN';
    const patternValue = document.createElement('strong');
    patternValue.textContent = copy.playPattern;
    pattern.append(patternLabel, patternValue);

    const trigger = document.createElement('span');
    trigger.className = 'rune-tree-trigger';
    trigger.textContent = copy.trigger;

    card.append(eyebrow, title, description, pattern, trigger);
    return card;
  }

  private syncVortexState(): void {
    if (this.selectedRune !== 'vortex') return;
    for (const [path, branch] of this.branchRoots) {
      branch.dataset.equipped = String(path === this.selectedPath);
    }
    this.syncNodeSelection();

  }

  private syncNodeSelection(): void {
    for (const [key, button] of this.nodeButtons) {
      const selected = this.selectedNode.kind === 'base'
        ? key === 'base'
        : key === `${this.selectedNode.path}:${this.selectedNode.tier}`;
      button.setAttribute('aria-pressed', String(selected));
    }
  }
}
