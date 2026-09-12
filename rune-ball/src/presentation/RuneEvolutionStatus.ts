import type { DestructionEvent } from '../game/DestructionSession';
import {
  CHAIN_TIER_ONE_THRESHOLD,
  SPLIT_TIER_ONE_THRESHOLD,
  VORTEX_TIER_ONE_THRESHOLD,
  getChainPathDefinition,
  getRuneBaseDefinition,
  getSplitPathDefinition,
  getVortexPathDefinition,
  type ChainEvolutionPath,
  type SplitEvolutionPath,
  type VortexEvolutionPath,
} from '../progression/RuneEvolutionCatalog';

interface EvolutionDisplayState {
  stage: 0 | 1 | 2;
  stageName: string;
  qualifiedUses: number;
  nextThreshold: number | null;
  finalStageName: string;
}

type AuthoredRune = 'vortex' | 'split' | 'chain';

export class RuneEvolutionStatus {
  private readonly root: HTMLElement;
  private readonly glyph: HTMLElement;
  private readonly stage: HTMLElement;
  private readonly progress: HTMLElement;
  private vortexPath: VortexEvolutionPath;
  private splitPath: SplitEvolutionPath;
  private chainPath: ChainEvolutionPath;
  private vortexState: EvolutionDisplayState;
  private splitState: EvolutionDisplayState;
  private chainState: EvolutionDisplayState;
  private activeRune: AuthoredRune = 'vortex';
  private flashTimer: number | null = null;

  constructor(
    host: HTMLElement,
    vortexPath: VortexEvolutionPath,
    splitPath: SplitEvolutionPath,
    chainPath: ChainEvolutionPath,
  ) {
    this.vortexPath = vortexPath;
    this.splitPath = splitPath;
    this.chainPath = chainPath;
    this.vortexState = this.initialVortexState();
    this.splitState = this.initialSplitState();
    this.chainState = this.initialChainState();

    const root = document.createElement('div');
    root.className = 'rune-evolution-status';
    root.setAttribute('aria-live', 'polite');

    const glyph = document.createElement('span');
    glyph.className = 'rune-evolution-glyph';

    const copy = document.createElement('span');
    copy.className = 'rune-evolution-copy';
    const stage = document.createElement('strong');
    stage.className = 'rune-evolution-stage';
    const progress = document.createElement('span');
    progress.className = 'rune-evolution-progress';
    copy.append(stage, progress);
    root.append(glyph, copy);
    host.append(root);

    this.root = root;
    this.glyph = glyph;
    this.stage = stage;
    this.progress = progress;
    this.render('vortex');
  }

  reset(vortexPath: VortexEvolutionPath, splitPath: SplitEvolutionPath, chainPath: ChainEvolutionPath): void {
    this.vortexPath = vortexPath;
    this.splitPath = splitPath;
    this.chainPath = chainPath;
    this.vortexState = this.initialVortexState();
    this.splitState = this.initialSplitState();
    this.chainState = this.initialChainState();
    this.activeRune = 'vortex';
    this.root.classList.remove('is-evolving');
    if (this.flashTimer !== null) window.clearTimeout(this.flashTimer);
    this.flashTimer = null;
    this.render('vortex');
  }

  handle(event: DestructionEvent): void {
    if (event.type === 'vortex-evolution-progress' || event.type === 'vortex-evolved') {
      this.vortexPath = event.path;
      this.vortexState = {
        stage: event.stage,
        stageName: event.stageName,
        qualifiedUses: event.qualifiedUses,
        nextThreshold: event.nextThreshold,
        finalStageName: getVortexPathDefinition(event.path).tierTwo.name,
      };
      this.render('vortex');
      if (event.type === 'vortex-evolved') this.flashEvolution();
      return;
    }

    if (event.type === 'split-evolution-progress' || event.type === 'split-evolved') {
      this.splitPath = event.path;
      this.splitState = {
        stage: event.stage,
        stageName: event.stageName,
        qualifiedUses: event.qualifiedUses,
        nextThreshold: event.nextThreshold,
        finalStageName: getSplitPathDefinition(event.path).tierTwo.name,
      };
      this.render('split');
      if (event.type === 'split-evolved') this.flashEvolution();
      return;
    }

    if (event.type === 'chain-evolution-progress' || event.type === 'chain-evolved') {
      this.chainPath = event.path;
      this.chainState = {
        stage: event.stage,
        stageName: event.stageName,
        qualifiedUses: event.qualifiedUses,
        nextThreshold: event.nextThreshold,
        finalStageName: getChainPathDefinition(event.path).tierTwo.name,
      };
      this.render('chain');
      if (event.type === 'chain-evolved') this.flashEvolution();
    }
  }

  setVisible(visible: boolean): void {
    this.root.hidden = !visible;
  }

  destroy(): void {
    if (this.flashTimer !== null) window.clearTimeout(this.flashTimer);
    this.root.remove();
  }

  private initialVortexState(): EvolutionDisplayState {
    return {
      stage: 0,
      stageName: getRuneBaseDefinition('vortex').name,
      qualifiedUses: 0,
      nextThreshold: VORTEX_TIER_ONE_THRESHOLD,
      finalStageName: getVortexPathDefinition(this.vortexPath).tierTwo.name,
    };
  }

  private initialSplitState(): EvolutionDisplayState {
    return {
      stage: 0,
      stageName: getRuneBaseDefinition('split').name,
      qualifiedUses: 0,
      nextThreshold: SPLIT_TIER_ONE_THRESHOLD,
      finalStageName: getSplitPathDefinition(this.splitPath).tierTwo.name,
    };
  }

  private initialChainState(): EvolutionDisplayState {
    return {
      stage: 0,
      stageName: getRuneBaseDefinition('chain').name,
      qualifiedUses: 0,
      nextThreshold: CHAIN_TIER_ONE_THRESHOLD,
      finalStageName: getChainPathDefinition(this.chainPath).tierTwo.name,
    };
  }

  private render(rune: AuthoredRune): void {
    this.activeRune = rune;
    const state = rune === 'vortex'
      ? this.vortexState
      : rune === 'split'
        ? this.splitState
        : this.chainState;
    this.root.dataset.rune = rune;
    this.root.dataset.stage = String(state.stage);
    this.glyph.textContent = getRuneBaseDefinition(rune).glyph;
    this.stage.textContent = state.stageName;
    this.progress.textContent = state.nextThreshold === null
      ? 'MAX EVOLUTION'
      : `${state.qualifiedUses}/${state.nextThreshold} → ${state.finalStageName}`;
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
