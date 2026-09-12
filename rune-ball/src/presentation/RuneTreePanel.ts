import {
  CHAIN_PATH_ORDER,
  RUNE_TREE_ORDER,
  SPLIT_PATH_ORDER,
  VORTEX_PATH_ORDER,
  getChainEvolutionNode,
  getChainPathDefinition,
  getRuneBaseDefinition,
  getSplitEvolutionNode,
  getSplitPathDefinition,
  getVortexEvolutionNode,
  getVortexPathDefinition,
  type ChainEvolutionPath,
  type ChainEvolutionTier,
  type RuneTreeId,
  type SplitEvolutionPath,
  type SplitEvolutionTier,
  type VortexEvolutionPath,
  type VortexEvolutionTier,
} from '../progression/RuneEvolutionCatalog';
import '../rune-tree.css';
import '../rune-tree-refinement.css';

type NodeSelection =
  | { kind: 'base'; rune: RuneTreeId }
  | { kind: 'vortex'; path: VortexEvolutionPath; tier: VortexEvolutionTier }
  | { kind: 'split'; path: SplitEvolutionPath; tier: SplitEvolutionTier }
  | { kind: 'chain'; path: ChainEvolutionPath; tier: ChainEvolutionTier };

export interface RuneTreePanelCallbacks {
  onVortexPathChange(path: VortexEvolutionPath): void;
  onSplitPathChange(path: SplitEvolutionPath): void;
  onChainPathChange(path: ChainEvolutionPath): void;
}

export class RuneTreePanel {
  private readonly root: HTMLElement;
  private readonly runeButtons = new Map<RuneTreeId, HTMLButtonElement>();
  private readonly treeMount: HTMLElement;
  private readonly detailMount: HTMLElement;
  private readonly callbacks: RuneTreePanelCallbacks;
  private readonly branchRoots = new Map<string, HTMLElement>();
  private readonly nodeButtons = new Map<string, HTMLButtonElement>();
  private selectedRune: RuneTreeId = 'vortex';
  private selectedVortexPath: VortexEvolutionPath;
  private selectedSplitPath: SplitEvolutionPath;
  private selectedChainPath: ChainEvolutionPath;
  private selectedNode: NodeSelection;

  constructor(
    host: HTMLElement,
    selectedVortexPath: VortexEvolutionPath,
    selectedSplitPath: SplitEvolutionPath,
    selectedChainPath: ChainEvolutionPath,
    callbacks: RuneTreePanelCallbacks,
  ) {
    this.selectedVortexPath = selectedVortexPath;
    this.selectedSplitPath = selectedSplitPath;
    this.selectedChainPath = selectedChainPath;
    this.selectedNode = { kind: 'vortex', path: selectedVortexPath, tier: 2 };
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
    const changed = path !== this.selectedVortexPath;
    this.selectedVortexPath = path;
    if (changed && this.selectedRune === 'vortex') this.selectedNode = { kind: 'vortex', path, tier: 2 };
    this.syncAuthoredState();
    this.renderDetail();
  }

  setSplitPath(path: SplitEvolutionPath): void {
    const changed = path !== this.selectedSplitPath;
    this.selectedSplitPath = path;
    if (changed && this.selectedRune === 'split') this.selectedNode = { kind: 'split', path, tier: 2 };
    this.syncAuthoredState();
    this.renderDetail();
  }

  setChainPath(path: ChainEvolutionPath): void {
    const changed = path !== this.selectedChainPath;
    this.selectedChainPath = path;
    if (changed && this.selectedRune === 'chain') this.selectedNode = { kind: 'chain', path, tier: 2 };
    this.syncAuthoredState();
    this.renderDetail();
  }

  showConfiguredRune(): void {
    this.renderRune();
  }

  destroy(): void {
    this.root.remove();
  }

  private selectRune(runeId: RuneTreeId): void {
    if (this.selectedRune === runeId) return;
    this.selectedRune = runeId;
    if (runeId === 'vortex') this.selectedNode = { kind: 'vortex', path: this.selectedVortexPath, tier: 2 };
    else if (runeId === 'split') this.selectedNode = { kind: 'split', path: this.selectedSplitPath, tier: 2 };
    else this.selectedNode = { kind: 'chain', path: this.selectedChainPath, tier: 2 };
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
    else if (this.selectedRune === 'split') this.renderSplitTree();
    else this.renderChainTree();

    this.renderDetail();
  }

  private makeBaseNode(rune: RuneTreeId): HTMLButtonElement {
    const baseNode = document.createElement('button');
    baseNode.type = 'button';
    baseNode.className = 'rune-tree-node rune-tree-base-node';
    baseNode.dataset.node = `${rune}-base`;
    baseNode.setAttribute('aria-pressed', String(this.selectedNode.kind === 'base' && this.selectedNode.rune === rune));
    baseNode.setAttribute('aria-label', `Base ${getRuneBaseDefinition(rune).name}`);
    baseNode.append(this.makeBaseEffect(rune));
    baseNode.addEventListener('click', () => {
      this.selectedNode = { kind: 'base', rune };
      this.syncNodeSelection();
      this.renderDetail();
    });
    this.nodeButtons.set(`${rune}:base`, baseNode);
    return baseNode;
  }

  private renderVortexTree(): void {
    const graph = document.createElement('div');
    graph.className = 'rune-tree-graph';
    const baseNode = this.makeBaseNode('vortex');
    const branches = document.createElement('div');
    branches.className = 'rune-tree-branch-grid';

    for (const path of VORTEX_PATH_ORDER) {
      const branch = this.makeBranch('vortex', path, path === this.selectedVortexPath);
      branch.append(
        this.makePathMark(path),
        this.makeVortexEvolutionNode(path, 1),
        this.makeRail(),
        this.makeVortexEvolutionNode(path, 2),
      );
      branches.append(branch);
    }

    graph.append(baseNode, branches);
    this.treeMount.append(graph);
    this.syncAuthoredState();
  }

  private renderSplitTree(): void {
    const graph = document.createElement('div');
    graph.className = 'rune-tree-graph';
    const baseNode = this.makeBaseNode('split');
    const branches = document.createElement('div');
    branches.className = 'rune-tree-branch-grid';

    for (const path of SPLIT_PATH_ORDER) {
      const branch = this.makeBranch('split', path, path === this.selectedSplitPath);
      branch.append(
        this.makePathMark(path),
        this.makeSplitEvolutionNode(path, 1),
        this.makeRail(),
        this.makeSplitEvolutionNode(path, 2),
      );
      branches.append(branch);
    }

    graph.append(baseNode, branches);
    this.treeMount.append(graph);
    this.syncAuthoredState();
  }

  private renderChainTree(): void {
    const graph = document.createElement('div');
    graph.className = 'rune-tree-graph';
    const baseNode = this.makeBaseNode('chain');
    const branches = document.createElement('div');
    branches.className = 'rune-tree-branch-grid';

    for (const path of CHAIN_PATH_ORDER) {
      const branch = this.makeBranch('chain', path, path === this.selectedChainPath);
      branch.append(
        this.makePathMark(path),
        this.makeChainEvolutionNode(path, 1),
        this.makeRail(),
        this.makeChainEvolutionNode(path, 2),
      );
      branches.append(branch);
    }

    graph.append(baseNode, branches);
    this.treeMount.append(graph);
    this.syncAuthoredState();
  }

  private makeBranch(rune: 'vortex' | 'split' | 'chain', path: string, equipped: boolean): HTMLElement {
    const branch = document.createElement('section');
    branch.className = 'rune-tree-branch';
    branch.dataset.path = path;
    branch.dataset.equipped = String(equipped);
    this.branchRoots.set(`${rune}:${path}`, branch);
    return branch;
  }

  private makePathMark(path: string): HTMLElement {
    const mark = document.createElement('span');
    mark.className = `rune-tree-path-mark rune-tree-path-mark--${path}`;
    mark.setAttribute('aria-hidden', 'true');
    return mark;
  }

  private makeRail(): HTMLElement {
    const rail = document.createElement('span');
    rail.className = 'rune-tree-rail';
    rail.setAttribute('aria-hidden', 'true');
    return rail;
  }

  private makeVortexEvolutionNode(path: VortexEvolutionPath, tier: VortexEvolutionTier): HTMLButtonElement {
    const node = getVortexEvolutionNode(path, tier);
    return this.makeEvolutionButton(
      `vortex:${path}:${tier}`,
      path,
      tier,
      node.name,
      node.threshold,
      'Vortex',
      () => {
        if (path !== this.selectedVortexPath) {
this.selectedVortexPath = path;
this.callbacks.onVortexPathChange(path);
        }
        this.selectedNode = { kind: 'vortex', path, tier };
      },
    );
  }

  private makeSplitEvolutionNode(path: SplitEvolutionPath, tier: SplitEvolutionTier): HTMLButtonElement {
    const node = getSplitEvolutionNode(path, tier);
    return this.makeEvolutionButton(
      `split:${path}:${tier}`,
      path,
      tier,
      node.name,
      node.threshold,
      'Split',
      () => {
        if (path !== this.selectedSplitPath) {
this.selectedSplitPath = path;
this.callbacks.onSplitPathChange(path);
        }
        this.selectedNode = { kind: 'split', path, tier };
      },
    );
  }

  private makeChainEvolutionNode(path: ChainEvolutionPath, tier: ChainEvolutionTier): HTMLButtonElement {
    const node = getChainEvolutionNode(path, tier);
    return this.makeEvolutionButton(
      `chain:${path}:${tier}`,
      path,
      tier,
      node.name,
      node.threshold,
      'Chain',
      () => {
        if (path !== this.selectedChainPath) {
          this.selectedChainPath = path;
          this.callbacks.onChainPathChange(path);
        }
        this.selectedNode = { kind: 'chain', path, tier };
      },
    );
  }

  private makeEvolutionButton(
    key: string,
    path: string,
    tier: 1 | 2,
    name: string,
    threshold: number,
    runeName: string,
    select: () => void,
  ): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'rune-tree-node rune-tree-evolution-node';
    button.dataset.path = path;
    button.dataset.tier = String(tier);
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `Tier ${tier} ${name}. Auto evolves at ${threshold} qualified ${runeName} uses.`);

    const sigil = document.createElement('span');
    sigil.className = `rune-tree-node-sigil rune-tree-node-sigil--${path} rune-tree-node-sigil--tier-${tier}`;
    sigil.setAttribute('aria-hidden', 'true');
    const core = document.createElement('span');
    core.className = 'rune-tree-node-sigil-core';
    sigil.append(core);
    button.append(sigil);

    button.addEventListener('click', () => {
      select();
      this.syncAuthoredState();
      this.renderDetail();
    });

    this.nodeButtons.set(key, button);
    return button;
  }

  private renderFutureRune(): void {
    const graph = document.createElement('div');
    graph.className = 'rune-tree-graph rune-tree-graph-future';

    const baseNode = document.createElement('div');
    baseNode.className = 'rune-tree-node rune-tree-base-node rune-tree-future-base';
    baseNode.append(this.makeBaseEffect(this.selectedRune));

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

  private makeBaseEffect(runeId: RuneTreeId): HTMLElement {
    const effect = document.createElement('span');
    effect.className = `rune-tree-base-effect rune-tree-base-effect--${runeId}`;
    effect.setAttribute('aria-hidden', 'true');

    for (const part of ['core', 'accent-a', 'accent-b']) {
      const element = document.createElement('span');
      element.className = `rune-tree-base-effect-${part}`;
      effect.append(element);
    }
    return effect;
  }

  private renderDetail(): void {
    this.detailMount.replaceChildren();
    const base = getRuneBaseDefinition(this.selectedRune);

    if (this.selectedNode.kind === 'base') {
      this.detailMount.append(this.makeDetailCard({
        eyebrow: `BASE RUNE · ${base.role}`,
        title: base.name,
        description: base.description,
        playPattern: base.playPattern,
        trigger: base.evolutionStatus === 'authored'
? `EVOLUTION BEGINS FROM QUALIFIED ${base.name} USES`
: 'EVOLUTION TREE · NOT YET AUTHORED',
      }));
      return;
    }

    if (this.selectedNode.kind === 'vortex') {
      const path = getVortexPathDefinition(this.selectedNode.path);
      const node = getVortexEvolutionNode(this.selectedNode.path, this.selectedNode.tier);
      this.detailMount.append(this.makeEvolutionDetail(path.title, node.tier, node.name, node.description, node.playPattern, node.threshold, 'VORTEX'));
      return;
    }

    if (this.selectedNode.kind === 'split') {
      const path = getSplitPathDefinition(this.selectedNode.path);
      const node = getSplitEvolutionNode(this.selectedNode.path, this.selectedNode.tier);
      this.detailMount.append(this.makeEvolutionDetail(path.title, node.tier, node.name, node.description, node.playPattern, node.threshold, 'SPLIT'));
      return;
    }

    const path = getChainPathDefinition(this.selectedNode.path);
    const node = getChainEvolutionNode(this.selectedNode.path, this.selectedNode.tier);
    this.detailMount.append(this.makeEvolutionDetail(path.title, node.tier, node.name, node.description, node.playPattern, node.threshold, 'CHAIN'));
  }

  private makeEvolutionDetail(
    pathTitle: string,
    tier: 1 | 2,
    name: string,
    description: string,
    playPattern: string,
    threshold: number,
    runeName: string,
  ): HTMLElement {
    const card = this.makeDetailCard({
      eyebrow: `T${tier} · ${pathTitle} PATH`,
      title: name,
      description,
      playPattern,
      trigger: `AUTO-EVOLVE · ${threshold} QUALIFIED ${runeName} USES`,
    });
    const active = document.createElement('span');
    active.className = 'rune-tree-detail-active';
    active.textContent = `${pathTitle} PATH ACTIVE`;
    card.append(active);
    return card;
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

  private syncAuthoredState(): void {
    if (this.selectedRune === 'vortex') {
      for (const path of VORTEX_PATH_ORDER) {
        const branch = this.branchRoots.get(`vortex:${path}`);
        if (branch) branch.dataset.equipped = String(path === this.selectedVortexPath);
      }
    } else if (this.selectedRune === 'split') {
      for (const path of SPLIT_PATH_ORDER) {
        const branch = this.branchRoots.get(`split:${path}`);
        if (branch) branch.dataset.equipped = String(path === this.selectedSplitPath);
      }
    } else {
      for (const path of CHAIN_PATH_ORDER) {
        const branch = this.branchRoots.get(`chain:${path}`);
        if (branch) branch.dataset.equipped = String(path === this.selectedChainPath);
      }
    }
    this.syncNodeSelection();
  }

  private syncNodeSelection(): void {
    for (const [key, button] of this.nodeButtons) {
      const selected = this.selectedNode.kind === 'base'
        ? key === `${this.selectedNode.rune}:base`
        : this.selectedNode.kind === 'vortex'
          ? key === `vortex:${this.selectedNode.path}:${this.selectedNode.tier}`
          : this.selectedNode.kind === 'split'
            ? key === `split:${this.selectedNode.path}:${this.selectedNode.tier}`
            : key === `chain:${this.selectedNode.path}:${this.selectedNode.tier}`;
      button.setAttribute('aria-pressed', String(selected));
    }
  }
}
