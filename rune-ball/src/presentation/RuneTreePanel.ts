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

type VortexNodeSelection =
  | { kind: 'base' }
  | { kind: 'evolution'; path: VortexEvolutionPath; tier: VortexEvolutionTier };

export interface RuneTreePanelCallbacks {
  onEquipVortexPath(path: VortexEvolutionPath): void;
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
    const activePath = getVortexPathDefinition(this.selectedPath);

    const summary = document.createElement('div');
    summary.className = 'rune-tree-active-build';
    const summaryLabel = document.createElement('span');
    summaryLabel.textContent = 'ACTIVE PATH';
    const summaryValue = document.createElement('strong');
    summaryValue.textContent = `${activePath.title} → ${activePath.tierTwo.name}`;
    const summaryIdentity = document.createElement('small');
    summaryIdentity.textContent = activePath.identity;
    summary.append(summaryLabel, summaryValue, summaryIdentity);

    const graph = document.createElement('div');
    graph.className = 'rune-tree-graph';

    const identity = document.createElement('header');
    identity.className = 'rune-tree-identity';
    const glyph = document.createElement('span');
    glyph.className = 'rune-tree-identity-glyph';
    glyph.textContent = base.glyph;
    const identityCopy = document.createElement('span');
    const name = document.createElement('strong');
    name.textContent = base.name;
    const role = document.createElement('small');
    role.textContent = base.role;
    identityCopy.append(name, role);
    identity.append(glyph, identityCopy);

    const baseNode = document.createElement('button');
    baseNode.type = 'button';
    baseNode.className = 'rune-tree-node rune-tree-base-node';
    baseNode.dataset.node = 'vortex-base';
    baseNode.setAttribute('aria-pressed', String(this.selectedNode.kind === 'base'));
    baseNode.innerHTML = '<span>BASE</span><strong>VORTEX</strong><small>START OF RUN</small>';
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

      const branchHeader = document.createElement('div');
      branchHeader.className = 'rune-tree-branch-header';
      const pathTitle = document.createElement('strong');
      pathTitle.textContent = pathDefinition.title;
      const pathIdentity = document.createElement('small');
      pathIdentity.textContent = pathDefinition.identity;
      branchHeader.append(pathTitle, pathIdentity);

      const tierOne = this.makeEvolutionNode(path, 1);
      const rail = document.createElement('span');
      rail.className = 'rune-tree-rail';
      rail.setAttribute('aria-hidden', 'true');
      const tierTwo = this.makeEvolutionNode(path, 2);

      branch.append(branchHeader, tierOne, rail, tierTwo);
      branches.append(branch);
      this.branchRoots.set(path, branch);
    }

    graph.append(identity, baseNode, branches);
    this.treeMount.append(summary, graph);
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

    const tierLabel = document.createElement('span');
    tierLabel.textContent = `T${tier}`;
    const name = document.createElement('strong');
    name.textContent = node.name;
    const trigger = document.createElement('small');
    trigger.textContent = `${node.threshold} USES`;
    button.append(tierLabel, name, trigger);

    button.addEventListener('click', () => {
      this.selectedNode = { kind: 'evolution', path, tier };
      this.syncNodeSelection();
      this.renderDetail();
    });

    this.nodeButtons.set(`${path}:${tier}`, button);
    return button;
  }

  private renderFutureRune(): void {
    const definition = getRuneBaseDefinition(this.selectedRune);

    const summary = document.createElement('div');
    summary.className = 'rune-tree-active-build rune-tree-active-build-future';
    summary.innerHTML = `<span>EVOLUTION</span><strong>BASE RUNE ONLY</strong><small>PATHS NOT YET AUTHORED</small>`;

    const graph = document.createElement('div');
    graph.className = 'rune-tree-graph rune-tree-graph-future';

    const identity = document.createElement('header');
    identity.className = 'rune-tree-identity';
    identity.innerHTML = [
      `<span class="rune-tree-identity-glyph">${definition.glyph}</span>`,
      `<span><strong>${definition.name}</strong><small>${definition.role}</small></span>`,
    ].join('');

    const baseNode = document.createElement('div');
    baseNode.className = 'rune-tree-node rune-tree-base-node rune-tree-future-base';
    baseNode.innerHTML = `<span>BASE</span><strong>${definition.name}</strong><small>AVAILABLE</small>`;

    const branches = document.createElement('div');
    branches.className = 'rune-tree-branch-grid rune-tree-future-branches';
    for (let index = 0; index < 2; index += 1) {
      const branch = document.createElement('div');
      branch.className = 'rune-tree-branch rune-tree-future-branch';
      branch.innerHTML = [
        '<div class="rune-tree-branch-header"><strong>UNAWAKENED</strong><small>FUTURE PATH</small></div>',
        '<div class="rune-tree-node rune-tree-future-node"><span>T1</span><strong>—</strong><small>NOT AUTHORED</small></div>',
        '<span class="rune-tree-rail" aria-hidden="true"></span>',
        '<div class="rune-tree-node rune-tree-future-node"><span>T2</span><strong>—</strong><small>NOT AUTHORED</small></div>',
      ].join('');
      branches.append(branch);
    }

    graph.append(identity, baseNode, branches);
    this.treeMount.append(summary, graph);
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

    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'rune-tree-equip';
    const equipped = path.id === this.selectedPath;
    action.disabled = equipped;
    action.textContent = equipped ? `EQUIPPED · ${path.title}` : `EQUIP ${path.title} PATH`;
    action.addEventListener('click', () => this.equipPath(path.id));
    card.append(action);
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

  private equipPath(path: VortexEvolutionPath): void {
    if (path === this.selectedPath) return;
    this.selectedPath = path;
    this.selectedNode = { kind: 'evolution', path, tier: 2 };
    this.syncVortexState();
    this.renderDetail();
    this.callbacks.onEquipVortexPath(path);
  }

  private syncVortexState(): void {
    if (this.selectedRune !== 'vortex') return;
    for (const [path, branch] of this.branchRoots) {
      branch.dataset.equipped = String(path === this.selectedPath);
    }
    this.syncNodeSelection();

    const active = this.treeMount.querySelector<HTMLElement>('.rune-tree-active-build');
    if (active) {
      const definition = getVortexPathDefinition(this.selectedPath);
      const value = active.querySelector<HTMLElement>('strong');
      const identity = active.querySelector<HTMLElement>('small');
      if (value) value.textContent = `${definition.title} → ${definition.tierTwo.name}`;
      if (identity) identity.textContent = definition.identity;
    }
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
