import { DEFAULT_STAGE_ID, STAGES, getStage, type StageId } from '../content/StageCatalog';
import {
  getChainPathDefinition,
  getSplitPathDefinition,
  getVortexPathDefinition,
  type ChainEvolutionPath,
  type SplitEvolutionPath,
  type VortexEvolutionPath,
} from '../progression/RuneEvolutionCatalog';
import type { CampaignProgressionSnapshot, StageProgressState } from '../progression/CampaignProgression';
import type { RuneKind } from '../rune/RuneTypes';
import { RuneTreePanel } from './RuneTreePanel';

export type ProductScreen = 'home' | 'journey' | 'runes' | 'stage-detail';
export type AppScreen = ProductScreen | 'loading' | 'run';

export interface GameShellCallbacks {
  onStartStage(stageId: StageId): void;
  onVortexPathChange(path: VortexEvolutionPath): void;
  onSplitPathChange(path: SplitEvolutionPath): void;
  onChainPathChange(path: ChainEvolutionPath): void;
  onScreenChange(screen: AppScreen): void;
}

const RUNE_GLYPH: Record<RuneKind, string> = {
  vortex: '○',
  split: 'V',
  chain: 'Z',
};

const RUNE_NAME: Record<RuneKind, string> = {
  vortex: 'VORTEX',
  split: 'SPLIT',
  chain: 'CHAIN',
};

export class GameShell {
  private readonly root: HTMLElement;
  private readonly screens = new Map<ProductScreen, HTMLElement>();
  private readonly callbacks: GameShellCallbacks;
  private readonly homeBuild: HTMLElement;
  private readonly stageBuild: HTMLElement;
  private readonly homeMission: HTMLButtonElement;
  private readonly journeyList: HTMLElement;
  private readonly stageReward: HTMLElement;
  private readonly stageStart: HTMLButtonElement;
  private runeTree: RuneTreePanel | null = null;
  private selectedPath: VortexEvolutionPath;
  private selectedSplitPath: SplitEvolutionPath;
  private selectedChainPath: ChainEvolutionPath;
  private selectedStage: StageId = DEFAULT_STAGE_ID;
  private currentScreen: ProductScreen = 'home';
  private stageDetailReturn: 'home' | 'journey' = 'journey';
  private runesReturn: 'home' | 'stage-detail' = 'home';
  private progression: CampaignProgressionSnapshot;

  constructor(
    host: HTMLElement,
    selectedPath: VortexEvolutionPath,
    selectedSplitPath: SplitEvolutionPath,
    selectedChainPath: ChainEvolutionPath,
    progression: CampaignProgressionSnapshot,
    callbacks: GameShellCallbacks,
  ) {
    this.selectedPath = selectedPath;
    this.selectedSplitPath = selectedSplitPath;
    this.selectedChainPath = selectedChainPath;
    this.progression = progression;
    this.callbacks = callbacks;

    const root = document.createElement('div');
    root.className = 'game-shell';
    root.setAttribute('aria-label', 'Rune Ball navigation');
    this.root = root;

    const home = this.makeHomeScreen();
    const journey = this.makeJourneyScreen();
    const runes = this.makeRunesScreen();
    const stageDetail = this.makeStageDetailScreen();
    root.append(home, journey, runes, stageDetail);
    host.append(root);

    this.screens.set('home', home);
    this.screens.set('journey', journey);
    this.screens.set('runes', runes);
    this.screens.set('stage-detail', stageDetail);

    const homeBuild = home.querySelector<HTMLElement>('[data-role="home-build"]');
    const stageBuild = stageDetail.querySelector<HTMLElement>('[data-role="stage-build"]');
    const homeMission = home.querySelector<HTMLButtonElement>('[data-role="home-mission"]');
    const journeyList = journey.querySelector<HTMLElement>('[data-role="journey-list"]');
    const stageReward = stageDetail.querySelector<HTMLElement>('[data-role="stage-reward"]');
    const stageStart = stageDetail.querySelector<HTMLButtonElement>('[data-role="stage-start"]');
    if (!homeBuild || !stageBuild || !homeMission || !journeyList || !stageReward || !stageStart) {
      throw new Error('GameShell progression mount missing.');
    }
    this.homeBuild = homeBuild;
    this.stageBuild = stageBuild;
    this.homeMission = homeMission;
    this.journeyList = journeyList;
    this.stageReward = stageReward;
    this.stageStart = stageStart;

    this.renderBuild();
    this.renderProgression();
    this.show('home');
  }

  showHome(): void {
    this.show('home');
  }

  showJourney(): void {
    this.show('journey');
  }

  showRunes(returnTo?: 'home' | 'stage-detail'): void {
    this.runesReturn = returnTo ?? (this.currentScreen === 'stage-detail' ? 'stage-detail' : 'home');
    this.runeTree?.showConfiguredRune();
    this.show('runes');
  }

  showStageDetail(stageId: StageId = this.selectedStage): void {
    const stage = getStage(stageId);
    const state = this.stageState(stageId);
    if (state === 'locked' || state === 'coming-soon') return;
    this.stageDetailReturn = this.currentScreen === 'home' ? 'home' : 'journey';
    this.selectedStage = stageId;
    const screen = this.screens.get('stage-detail');
    const title = screen?.querySelector<HTMLElement>('[data-role="stage-title"]');
    const chapter = screen?.querySelector<HTMLElement>('[data-role="stage-chapter"]');
    const objective = screen?.querySelector<HTMLElement>('[data-role="stage-objective"]');
    const number = screen?.querySelector<HTMLElement>('[data-role="stage-number"]');
    if (title) title.textContent = stage.title;
    if (chapter) chapter.textContent = stage.chapter;
    if (objective) objective.textContent = stage.objective;
    if (number) number.textContent = `STAGE ${stage.number.toString().padStart(2, '0')}${state === 'cleared' ? ' · CLEARED' : ''}`;
    this.renderStageReward(stageId, state);
    this.stageStart.disabled = stage.contentStatus !== 'authored';
    this.stageStart.textContent = state === 'cleared' ? 'REPLAY STAGE' : 'START RUN';
    this.show('stage-detail');
  }

  hideForLoading(): void {
    this.root.hidden = true;
    this.callbacks.onScreenChange('loading');
  }

  hideForRun(): void {
    this.root.hidden = true;
    this.callbacks.onScreenChange('run');
  }

  setProgression(progression: CampaignProgressionSnapshot): void {
    this.progression = progression;
    this.renderProgression();
    this.renderBuild();
  }

  setVortexPath(path: VortexEvolutionPath): void {
    this.selectedPath = path;
    this.renderBuild();
  }

  setSplitPath(path: SplitEvolutionPath): void {
    this.selectedSplitPath = path;
    this.renderBuild();
  }

  setChainPath(path: ChainEvolutionPath): void {
    this.selectedChainPath = path;
    this.renderBuild();
  }

  destroy(): void {
    this.runeTree?.destroy();
    this.root.remove();
  }

  private makeHomeScreen(): HTMLElement {
    const screen = this.makeScreen('home');
    screen.classList.add('game-shell-home');

    const hero = document.createElement('div');
    hero.className = 'game-shell-hero';

    const brand = document.createElement('div');
    brand.className = 'game-shell-brand';
    const eyebrow = document.createElement('span');
    eyebrow.className = 'game-shell-eyebrow';
    eyebrow.textContent = 'ARCANE SPORT // FRACTURE 01';
    const title = document.createElement('h1');
    title.tabIndex = -1;
    title.textContent = 'RUNE BALL';
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Redirect the core. Learn new runes. Break the field.';
    brand.append(eyebrow, title, subtitle);

    const core = document.createElement('div');
    core.className = 'game-shell-core';
    core.setAttribute('aria-hidden', 'true');
    core.innerHTML = '<span class="game-shell-core-ring"></span><span class="game-shell-core-dot"></span>';

    const mission = document.createElement('button');
    mission.type = 'button';
    mission.className = 'game-shell-mission';
    mission.dataset.role = 'home-mission';
    mission.addEventListener('click', () => this.showStageDetail(this.progression.continueStageId));
    mission.innerHTML = [
      '<span class="game-shell-kicker" data-role="home-stage-kicker"></span>',
      '<strong data-role="home-stage-title"></strong>',
      '<span class="game-shell-build-line" data-role="home-build"></span>',
    ].join('');

    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'game-shell-primary';
    play.textContent = 'PLAY';
    play.addEventListener('click', () => this.showStageDetail(this.progression.continueStageId));

    const nav = document.createElement('div');
    nav.className = 'game-shell-home-nav';
    nav.append(
      this.makeHomeNavButton('JOURNEY', 'Stages & progression', () => this.showJourney()),
      this.makeHomeNavButton('RUNES', 'Evolution build', () => this.showRunes('home')),
    );

    hero.append(brand, core, mission, play, nav);
    screen.append(hero);
    return screen;
  }

  private makeJourneyScreen(): HTMLElement {
    const screen = this.makeScreen('journey');
    screen.append(this.makeHeader('JOURNEY', 'Chapter I · The Fracture', () => this.showHome()));

    const intro = document.createElement('p');
    intro.className = 'game-shell-screen-copy';
    intro.textContent = 'Clear arenas to unlock the next Stage and expand your Rune vocabulary.';

    const list = document.createElement('div');
    list.className = 'journey-list';
    list.dataset.role = 'journey-list';

    const body = document.createElement('div');
    body.className = 'game-shell-body';
    body.append(intro, list);
    screen.append(body);
    return screen;
  }

  private makeRunesScreen(): HTMLElement {
    const screen = this.makeScreen('runes');
    screen.append(this.makeHeader('RUNES', 'Evolution Build', () => this.show(this.runesReturn)));

    const body = document.createElement('div');
    body.className = 'game-shell-body';

    const intro = document.createElement('p');
    intro.className = 'game-shell-screen-copy';
    intro.textContent = 'Boss clears unlock new base Runes. Choose an evolution path for each Rune you have learned.';
    body.append(intro);

    this.runeTree = new RuneTreePanel(body, this.selectedPath, this.selectedSplitPath, this.selectedChainPath, {
      onVortexPathChange: (path) => {
        this.selectedPath = path;
        this.renderBuild();
        this.callbacks.onVortexPathChange(path);
      },
      onSplitPathChange: (path) => {
        this.selectedSplitPath = path;
        this.renderBuild();
        this.callbacks.onSplitPathChange(path);
      },
      onChainPathChange: (path) => {
        this.selectedChainPath = path;
        this.renderBuild();
        this.callbacks.onChainPathChange(path);
      },
    });

    screen.append(body);
    return screen;
  }

  private makeStageDetailScreen(): HTMLElement {
    const screen = this.makeScreen('stage-detail');
    screen.append(this.makeHeader('STAGE', 'Run Briefing', () => this.show(this.stageDetailReturn)));

    const body = document.createElement('div');
    body.className = 'game-shell-body stage-detail-body';

    const number = document.createElement('span');
    number.className = 'game-shell-eyebrow';
    number.dataset.role = 'stage-number';

    const title = document.createElement('h2');
    title.className = 'stage-detail-title';
    title.tabIndex = -1;
    title.dataset.role = 'stage-title';

    const chapter = document.createElement('span');
    chapter.className = 'stage-detail-chapter';
    chapter.dataset.role = 'stage-chapter';

    const objectiveCard = document.createElement('section');
    objectiveCard.className = 'stage-detail-card';
    const objectiveLabel = document.createElement('span');
    objectiveLabel.className = 'game-shell-kicker';
    objectiveLabel.textContent = 'OBJECTIVE';
    const objective = document.createElement('p');
    objective.dataset.role = 'stage-objective';
    objectiveCard.append(objectiveLabel, objective);

    const rewardCard = document.createElement('section');
    rewardCard.className = 'stage-detail-card';
    const rewardLabel = document.createElement('span');
    rewardLabel.className = 'game-shell-kicker';
    rewardLabel.textContent = 'STAGE REWARD';
    const reward = document.createElement('strong');
    reward.dataset.role = 'stage-reward';
    rewardCard.append(rewardLabel, reward);

    const buildCard = document.createElement('section');
    buildCard.className = 'stage-detail-card stage-detail-build';
    const buildLabel = document.createElement('span');
    buildLabel.className = 'game-shell-kicker';
    buildLabel.textContent = 'RUNE BUILD';
    const build = document.createElement('strong');
    build.dataset.role = 'stage-build';
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'game-shell-text-action';
    edit.textContent = 'EDIT RUNES';
    edit.addEventListener('click', () => this.showRunes('stage-detail'));
    buildCard.append(buildLabel, build, edit);

    const start = document.createElement('button');
    start.type = 'button';
    start.className = 'game-shell-primary stage-detail-start';
    start.dataset.role = 'stage-start';
    start.textContent = 'START RUN';
    start.addEventListener('click', () => {
      this.callbacks.onStartStage(this.selectedStage);
    });

    body.append(number, title, chapter, objectiveCard, rewardCard, buildCard, start);
    screen.append(body);
    this.showStageDetailContent(DEFAULT_STAGE_ID, title, chapter, objective, number);
    return screen;
  }

  private showStageDetailContent(
    stageId: StageId,
    title: HTMLElement,
    chapter: HTMLElement,
    objective: HTMLElement,
    number: HTMLElement,
  ): void {
    const stage = getStage(stageId);
    title.textContent = stage.title;
    chapter.textContent = stage.chapter;
    objective.textContent = stage.objective;
    number.textContent = `STAGE ${stage.number.toString().padStart(2, '0')}`;
  }

  private makeScreen(screenName: ProductScreen): HTMLElement {
    const screen = document.createElement('section');
    screen.className = 'game-shell-screen';
    screen.dataset.screen = screenName;
    screen.hidden = true;
    return screen;
  }

  private makeHeader(titleText: string, subtitleText: string, onBack: () => void): HTMLElement {
    const header = document.createElement('header');
    header.className = 'game-shell-header';

    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'game-shell-back';
    back.setAttribute('aria-label', 'Back');
    back.textContent = '‹';
    back.addEventListener('click', onBack);

    const copy = document.createElement('div');
    const eyebrow = document.createElement('span');
    eyebrow.className = 'game-shell-kicker';
    eyebrow.textContent = subtitleText;
    const title = document.createElement('h1');
    title.tabIndex = -1;
    title.textContent = titleText;
    copy.append(eyebrow, title);
    header.append(back, copy);
    return header;
  }

  private makeHomeNavButton(title: string, subtitle: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game-shell-nav-card';
    button.innerHTML = `<strong>${title}</strong><span>${subtitle}</span>`;
    button.addEventListener('click', onClick);
    return button;
  }

  private renderProgression(): void {
    const continueStage = getStage(this.progression.continueStageId);
    const kicker = this.homeMission.querySelector<HTMLElement>('[data-role="home-stage-kicker"]');
    const title = this.homeMission.querySelector<HTMLElement>('[data-role="home-stage-title"]');
    const state = this.stageState(continueStage.id);
    if (kicker) kicker.textContent = `${state === 'cleared' ? 'REPLAY' : 'CONTINUE'} · STAGE ${continueStage.number.toString().padStart(2, '0')}`;
    if (title) title.textContent = continueStage.title;

    this.journeyList.replaceChildren();
    for (const stage of STAGES) {
      const stageState = this.stageState(stage.id);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'journey-stage';
      button.disabled = stageState === 'locked' || stageState === 'coming-soon';
      button.dataset.status = stageState;

      const reward = stage.rewardRune
        ? `${RUNE_GLYPH[stage.rewardRune]} ${RUNE_NAME[stage.rewardRune]}`
        : null;
      const stateCopy = this.stageStateCopy(stage.id, stageState);
      const rewardCopy = reward ? ` · REWARD ${reward}` : '';
      button.innerHTML = [
        `<span class="journey-stage-index">${stage.number.toString().padStart(2, '0')}</span>`,
        '<span class="journey-stage-copy">',
        `<strong>${stage.title}</strong>`,
        `<span>${stateCopy}${rewardCopy}</span>`,
        '</span>',
        `<span class="journey-stage-state">${stageState === 'cleared' ? '✓' : stageState === 'available' ? '→' : '◇'}</span>`,
      ].join('');
      if (!button.disabled) button.addEventListener('click', () => this.showStageDetail(stage.id));
      this.journeyList.append(button);
    }

    const unlocked = new Set(this.progression.unlockedRunes);
    for (const rune of ['vortex', 'split', 'chain'] as const) {
      const button = this.root.querySelector<HTMLButtonElement>(`.rune-tree-rune-button[data-rune="${rune}"]`);
      if (!button) continue;
      const isUnlocked = unlocked.has(rune);
      button.disabled = !isUnlocked;
      button.dataset.locked = String(!isUnlocked);
      const stateLabel = button.querySelector<HTMLElement>('small');
      if (stateLabel) stateLabel.textContent = isUnlocked ? 'TREE' : 'LOCKED';
    }
  }

  private renderStageReward(stageId: StageId, state: StageProgressState): void {
    const stage = getStage(stageId);
    if (!stage.rewardRune) {
      this.stageReward.textContent = 'NO NEW RUNE';
      return;
    }
    const reward = `${RUNE_GLYPH[stage.rewardRune]} ${RUNE_NAME[stage.rewardRune]}`;
    this.stageReward.textContent = state === 'cleared' ? `${reward} · UNLOCKED` : `UNLOCK ${reward}`;
  }

  private stageState(stageId: StageId): StageProgressState {
    return this.progression.stages.find((stage) => stage.id === stageId)?.state ?? 'locked';
  }

  private stageStateCopy(stageId: StageId, state: StageProgressState): string {
    const stage = getStage(stageId);
    switch (state) {
      case 'cleared': return `CLEARED · ${stage.objective}`;
      case 'available': return stage.objective;
      case 'coming-soon': return `COMING SOON · ${stage.objective}`;
      case 'locked': {
        const required = stage.requiresClear?.[0];
        return required ? `LOCKED · CLEAR ${getStage(required).title}` : 'LOCKED';
      }
    }
  }

  private renderBuild(): void {
    const pieces: string[] = [];
    if (this.progression.unlockedRunes.includes('vortex')) {
      pieces.push(`○ ${getVortexPathDefinition(this.selectedPath).title}`);
    }
    if (this.progression.unlockedRunes.includes('split')) {
      pieces.push(`V ${getSplitPathDefinition(this.selectedSplitPath).title}`);
    }
    if (this.progression.unlockedRunes.includes('chain')) {
      pieces.push(`Z ${getChainPathDefinition(this.selectedChainPath).title}`);
    }
    const text = pieces.join(' · ');
    if (this.homeBuild) this.homeBuild.textContent = text;
    if (this.stageBuild) this.stageBuild.textContent = text;
    this.runeTree?.setVortexPath(this.selectedPath);
    this.runeTree?.setSplitPath(this.selectedSplitPath);
    this.runeTree?.setChainPath(this.selectedChainPath);
  }

  private show(screenName: ProductScreen): void {
    this.root.hidden = false;
    this.currentScreen = screenName;
    for (const [name, screen] of this.screens) screen.hidden = name !== screenName;
    this.callbacks.onScreenChange(screenName);
    const heading = this.screens.get(screenName)?.querySelector<HTMLElement>('h1, h2');
    queueMicrotask(() => heading?.focus({ preventScroll: true }));
  }
}
