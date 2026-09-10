import { DEFAULT_STAGE_ID, STAGES, getStage, type StageId } from '../content/StageCatalog';
import {
  getVortexPathDefinition,
  type VortexEvolutionPath,
} from '../progression/RuneEvolutionCatalog';
import { RuneTreePanel } from './RuneTreePanel';

export type ProductScreen = 'home' | 'journey' | 'runes' | 'stage-detail';
export type AppScreen = ProductScreen | 'loading' | 'run';

export interface GameShellCallbacks {
  onStartStage(stageId: StageId): void;
  onVortexPathChange(path: VortexEvolutionPath): void;
  onScreenChange(screen: AppScreen): void;
}

export class GameShell {
  private readonly root: HTMLElement;
  private readonly screens = new Map<ProductScreen, HTMLElement>();
  private readonly callbacks: GameShellCallbacks;
  private readonly homeBuild: HTMLElement;
  private readonly stageBuild: HTMLElement;
  private runeTree: RuneTreePanel | null = null;
  private selectedPath: VortexEvolutionPath;
  private selectedStage: StageId = DEFAULT_STAGE_ID;
  private currentScreen: ProductScreen = 'home';
  private stageDetailReturn: 'home' | 'journey' = 'journey';
  private runesReturn: 'home' | 'stage-detail' = 'home';

  constructor(host: HTMLElement, selectedPath: VortexEvolutionPath, callbacks: GameShellCallbacks) {
    this.selectedPath = selectedPath;
    this.callbacks = callbacks;

    const root = document.createElement('div');
    root.className = 'game-shell';
    root.setAttribute('aria-label', 'Rune Ball navigation');

    const home = this.makeHomeScreen();
    const journey = this.makeJourneyScreen();
    const runes = this.makeRunesScreen();
    const stageDetail = this.makeStageDetailScreen();
    root.append(home, journey, runes, stageDetail);
    host.append(root);

    this.root = root;
    this.screens.set('home', home);
    this.screens.set('journey', journey);
    this.screens.set('runes', runes);
    this.screens.set('stage-detail', stageDetail);

    const homeBuild = home.querySelector<HTMLElement>('[data-role="home-build"]');
    const stageBuild = stageDetail.querySelector<HTMLElement>('[data-role="stage-build"]');
    if (!homeBuild || !stageBuild) throw new Error('GameShell build summary mount missing.');
    this.homeBuild = homeBuild;
    this.stageBuild = stageBuild;

    this.renderBuild();
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
    if (stage.status !== 'available') return;
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
    if (number) number.textContent = `STAGE ${stage.number.toString().padStart(2, '0')}`;
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

  setVortexPath(path: VortexEvolutionPath): void {
    this.selectedPath = path;
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
    subtitle.textContent = 'Redirect the core. Evolve your runes. Break the field.';
    brand.append(eyebrow, title, subtitle);

    const core = document.createElement('div');
    core.className = 'game-shell-core';
    core.setAttribute('aria-hidden', 'true');
    core.innerHTML = '<span class="game-shell-core-ring"></span><span class="game-shell-core-dot"></span>';

    const stage = getStage(DEFAULT_STAGE_ID);
    const mission = document.createElement('button');
    mission.type = 'button';
    mission.className = 'game-shell-mission';
    mission.addEventListener('click', () => this.showStageDetail(DEFAULT_STAGE_ID));
    mission.innerHTML = [
      `<span class="game-shell-kicker">CONTINUE · STAGE ${stage.number.toString().padStart(2, '0')}</span>`,
      `<strong>${stage.title}</strong>`,
      '<span class="game-shell-build-line" data-role="home-build"></span>',
    ].join('');

    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'game-shell-primary';
    play.textContent = 'PLAY';
    play.addEventListener('click', () => this.showStageDetail(DEFAULT_STAGE_ID));

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
    intro.textContent = 'Choose the arena you want to enter. New stages will introduce authored formations and Rune opportunities.';

    const list = document.createElement('div');
    list.className = 'journey-list';
    for (const stage of STAGES) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'journey-stage';
      button.disabled = stage.status === 'locked';
      button.dataset.status = stage.status;
      button.innerHTML = [
        `<span class="journey-stage-index">${stage.number.toString().padStart(2, '0')}</span>`,
        '<span class="journey-stage-copy">',
        `<strong>${stage.title}</strong>`,
        `<span>${stage.status === 'locked' ? 'LOCKED · CONTENT NOT YET AUTHORED' : stage.objective}</span>`,
        '</span>',
        `<span class="journey-stage-state">${stage.status === 'locked' ? '◇' : '→'}</span>`,
      ].join('');
      if (stage.status === 'available') button.addEventListener('click', () => this.showStageDetail(stage.id));
      list.append(button);
    }

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
    intro.textContent = 'Choose a Rune, then tap an evolution symbol to make that path active. Qualified uses evolve it automatically during a run.';
    body.append(intro);

    this.runeTree = new RuneTreePanel(body, this.selectedPath, {
      onVortexPathChange: (path) => {
        this.selectedPath = path;
        this.renderBuild();
        this.callbacks.onVortexPathChange(path);
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
    start.textContent = 'START RUN';
    start.addEventListener('click', () => {
      this.callbacks.onStartStage(this.selectedStage);
    });

    body.append(number, title, chapter, objectiveCard, buildCard, start);
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

  private renderBuild(): void {
    const path = getVortexPathDefinition(this.selectedPath);
    const text = `○ ${path.tierOne.name} → ${path.tierTwo.name}`;
    if (this.homeBuild) this.homeBuild.textContent = text;
    if (this.stageBuild) this.stageBuild.textContent = text;
    this.runeTree?.setVortexPath(this.selectedPath);
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
