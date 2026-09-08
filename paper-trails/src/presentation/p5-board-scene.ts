import { Container, FederatedPointerEvent, Graphics, Rectangle, Text } from 'pixi.js';
import { PAGE_ART_MANIFEST, isPageArtFamily, type TravelerFacing } from '../art/pixel-art-manifest';
import {
  P5_DEFINITION_REGISTRY,
  P5_LEVELS,
  firstIncompleteLevelIndex,
  hasNextLevel,
  levelAt,
  treasureExists,
  treasureRequired,
  type P5Level,
} from '../content/p5-levels';
import type { GridPosition, PageState, WorldState } from '../domain/model';
import {
  createObjectiveProgress,
  resolveObjectiveTraversal,
  type ObjectiveEvent,
  type ObjectiveKind,
  type ObjectiveProgress,
} from '../domain/objectives';
import {
  buildAdjacencyGraph,
  moveTravelerToPage,
  pageAt,
  reachablePages,
  resetLevel,
  rotatePage,
  shortestPath,
  swapPages,
} from '../domain/world';
import {
  loadProgress,
  markLevelCompleted,
  saveProgress,
  type ProgressSaveV1,
  type StorageLike,
} from '../progression/progress';
import { cellRect, computeBoardLayout, gridPositionAtPoint, type BoardLayout } from './board-layout';
import { createPageArtSprite, createTravelerSprite } from './pixel-art';
import { createGateWorldObject, createRelicWorldObject } from './world-object-pixel';
import { gateVisualState } from './world-object-state';

const COLORS = {
  ink: 0x121917,
  inkRaised: 0x1b2421,
  stone: 0x777365,
  parchment: 0xd8c7a3,
  antiqueGold: 0xa8874c,
  invalid: 0x8b544a,
  reachable: 0xc5b991,
  veil: 0x111614,
};

const DRAG_THRESHOLD = 9;
const TRAVEL_STEP_MS = 230;
const ROUTE_PULSE_FRAME_MS = 115;
const ROUTE_PULSE_FRAMES = 4;
const OBJECTIVE_PULSE_FRAMES = ROUTE_PULSE_FRAMES * 2;
const ARRIVAL_FRAME_MS = 140;
const WORLD_OBJECT_FRAME_MS = 180;
const GATE_OPENING_FRAMES = 5;

type FeedbackTone = 'neutral' | 'success' | 'invalid';

interface FeedbackState {
  readonly tone: FeedbackTone;
  readonly text: string;
}

interface DragState {
  readonly pageId: string;
  readonly pointerId: number;
  readonly startX: number;
  readonly startY: number;
  readonly originX: number;
  readonly originY: number;
  active: boolean;
}

export class P5BoardScene extends Container {
  private currentLevelIndex: number;
  private currentLevel: P5Level;
  private world: WorldState;
  private selectedPageId: string | null;
  private objectiveProgress: ObjectiveProgress = createObjectiveProgress();
  private savedProgress: ProgressSaveV1;
  private readonly storage: StorageLike | null;
  private feedback: FeedbackState = { tone: 'neutral', text: '' };
  private viewportWidth: number;
  private viewportHeight: number;
  private layout: BoardLayout;
  private drag: DragState | null = null;
  private moving = false;
  private traversalTimer: number | null = null;
  private pageViews = new Map<string, Container>();
  private dropIndicator: Graphics | null = null;
  private travelerFacing: TravelerFacing = 'north';
  private travelerFrameTick = 0;
  private travelerArriving = false;
  private arrivalTimer: number | null = null;
  private routePulsePath: readonly string[] = [];
  private routePulsePhase = 0;
  private routePulseLimit = ROUTE_PULSE_FRAMES;
  private routePulseTimer: number | null = null;
  private worldObjectFrameTick = 0;
  private worldObjectTimer: number | null = null;
  private gateOpeningFrame: number | null = null;
  private manipulationCount = 0;
  private tutorialCueActive = false;
  private readonly reducedMotion: boolean;

  constructor(width: number, height: number) {
    super();
    this.storage = safeLocalStorage();
    this.savedProgress = loadProgress(this.storage);
    this.currentLevelIndex = firstIncompleteLevelIndex(this.savedProgress.completedLevelIds);
    this.currentLevel = levelAt(this.currentLevelIndex);
    this.world = resetLevel(this.currentLevel.level, P5_DEFINITION_REGISTRY);
    this.selectedPageId = this.world.travelerPageId;
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.layout = computeBoardLayout(width, height, this.world.width, this.world.height);
    this.reducedMotion = prefersReducedMotion();
    this.tutorialCueActive = this.shouldShowTutorialCue();

    this.eventMode = 'static';
    this.sortableChildren = true;
    this.hitArea = new Rectangle(0, 0, Math.max(1, width), Math.max(1, height));
    this.on('pointermove', this.handlePointerMove);
    this.on('pointerup', this.handlePointerUp);
    this.on('pointerupoutside', this.handlePointerUp);
    this.renderScene();
    this.scheduleWorldObjectFrame();
  }

  setViewport(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.layout = computeBoardLayout(width, height, this.world.width, this.world.height);
    this.hitArea = new Rectangle(0, 0, Math.max(1, width), Math.max(1, height));
    this.cancelDrag();
    this.renderScene();
  }

  private shouldShowTutorialCue(): boolean {
    return this.currentLevel.tutorialCue !== null
      && !this.savedProgress.completedLevelIds.includes(this.currentLevel.level.id);
  }

  private renderScene(): void {
    const stale = this.removeChildren();
    for (const child of stale) child.destroy({ children: true });
    this.pageViews.clear();
    this.dropIndicator = null;

    const graph = buildAdjacencyGraph(this.world, P5_DEFINITION_REGISTRY);
    const reachable = reachablePages(graph, this.world.travelerPageId);
    this.addChild(new Graphics().rect(0, 0, this.viewportWidth, this.viewportHeight).fill(COLORS.ink));

    this.drawHeader();
    this.drawBookFrame();

    for (const page of this.world.pages) {
      const view = this.createPageView(page, reachable.has(page.id));
      this.pageViews.set(page.id, view);
      this.addChild(view);
    }

    this.drawRoutePulse();
    this.drawTraveler();
    this.dropIndicator = new Graphics();
    this.dropIndicator.zIndex = 45;
    this.addChild(this.dropIndicator);
    this.drawControls();
    this.drawTutorialCue();

    if (this.objectiveProgress.completed) this.drawCompletionOverlay();
  }

  private drawHeader(): void {
    const title = new Text({
      text: '書頁迷城',
      style: {
        fill: COLORS.parchment,
        fontFamily: 'serif',
        fontSize: Math.max(24, Math.round(this.viewportWidth * 0.075)),
        fontWeight: '600',
        letterSpacing: 3,
      },
    });
    title.position.set(this.layout.margin, this.layout.margin);
    this.addChild(title);

    const subtitle = new Text({
      text: `${String(this.currentLevel.index).padStart(2, '0')} / ${P5_LEVELS.length}  ·  ${this.currentLevel.title}`,
      style: {
        fill: COLORS.antiqueGold,
        fontFamily: 'monospace',
        fontSize: Math.max(10, Math.round(this.viewportWidth * 0.023)),
        fontWeight: '700',
        letterSpacing: 1,
      },
    });
    subtitle.position.set(this.layout.margin, this.layout.margin + Math.max(42, this.viewportWidth * 0.11));
    this.addChild(subtitle);
  }

  private drawBookFrame(): void {
    const padding = Math.max(10, Math.round(this.viewportWidth * 0.025));
    this.addChild(
      new Graphics()
        .roundRect(
          this.layout.boardX - padding,
          this.layout.boardY - padding,
          this.layout.boardWidth + padding * 2,
          this.layout.boardHeight + padding * 2,
          14,
        )
        .fill(COLORS.inkRaised)
        .stroke({ color: COLORS.stone, width: 1, alpha: 0.6 }),
    );
  }

  private createPageView(page: PageState, reachable: boolean): Container {
    const rect = cellRect(this.layout, page.position);
    const view = new Container();
    view.position.set(rect.x, rect.y);
    view.eventMode = 'static';
    view.cursor = this.moving || this.objectiveProgress.completed ? 'default' : 'pointer';
    view.hitArea = new Rectangle(0, 0, rect.width, rect.height);
    view.zIndex = 10;

    const selected = page.id === this.selectedPageId;
    const pulsing = this.routePulsePath.includes(page.id);
    const border = new Graphics()
      .roundRect(0, 0, rect.width, rect.height, 4)
      .fill(COLORS.inkRaised)
      .stroke({
        color: selected || pulsing ? COLORS.antiqueGold : reachable ? COLORS.reachable : COLORS.stone,
        width: selected ? 3 : pulsing || reachable ? 2 : 1,
        alpha: selected ? 0.95 : pulsing ? routePulseAlpha(this.routePulsePhase) : reachable ? 0.58 : 0.36,
      });
    view.addChild(border);

    const artInset = 3;
    const art = createPageArtSprite(page.definitionId, page.rotation, rect.width - artInset * 2, reachable ? 1 : 0.5);
    art.position.set(rect.width / 2, rect.height / 2);
    view.addChild(art);

    if (!reachable) {
      view.addChild(
        new Graphics()
          .roundRect(artInset, artInset, rect.width - artInset * 2, rect.height - artInset * 2, 2)
          .fill({ color: COLORS.veil, alpha: 0.26 }),
      );
    }

    this.drawWorldObjective(view, page, rect.width);

    if (
      this.tutorialCueActive
      && this.currentLevel.tutorialCue === 'rotate'
      && page.id === this.world.travelerPageId
    ) {
      const rotateCue = new Text({
        text: '↻',
        style: {
          fill: COLORS.antiqueGold,
          fontFamily: 'monospace',
          fontSize: Math.max(18, rect.width * 0.2),
          fontWeight: '700',
        },
      });
      rotateCue.anchor.set(1, 0);
      rotateCue.position.set(rect.width - 8, 5);
      view.addChild(rotateCue);
    }

    view.on('pointerdown', (event: FederatedPointerEvent) => this.beginPagePointer(page.id, event));
    return view;
  }

  private drawWorldObjective(view: Container, page: PageState, pageSize: number): void {
    const objective = page.state.objective;
    if (
      objective === 'treasure'
      && treasureExists(this.currentLevel)
      && !this.objectiveProgress.treasureCollected
    ) {
      view.addChild(createRelicWorldObject(pageSize, this.worldObjectFrameTick));
      return;
    }

    if (objective === 'goal') {
      const gateUnlocked = !treasureRequired(this.currentLevel) || this.objectiveProgress.treasureCollected;
      const gateState = gateVisualState(gateUnlocked, gateUnlocked ? this.gateOpeningFrame : null);
      view.addChild(createGateWorldObject(pageSize, gateState, this.worldObjectFrameTick, page.rotation));
    }
  }

  private drawRoutePulse(): void {
    if (this.routePulsePath.length < 2) return;
    const alpha = routePulseAlpha(this.routePulsePhase);
    const line = new Graphics();
    line.zIndex = 27;
    for (let index = 0; index < this.routePulsePath.length - 1; index += 1) {
      const from = this.pageById(this.routePulsePath[index] ?? '');
      const to = this.pageById(this.routePulsePath[index + 1] ?? '');
      if (!from || !to) continue;
      const fromRect = cellRect(this.layout, from.position);
      const toRect = cellRect(this.layout, to.position);
      line.moveTo(fromRect.x + fromRect.width / 2, fromRect.y + fromRect.height / 2);
      line.lineTo(toRect.x + toRect.width / 2, toRect.y + toRect.height / 2);
    }
    line.stroke({ color: COLORS.antiqueGold, width: Math.max(2, this.layout.pageSize * 0.025), alpha });
    this.addChild(line);
  }

  private drawTraveler(): void {
    const page = this.pageById(this.world.travelerPageId);
    if (!page) return;
    const rect = cellRect(this.layout, page.position);
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height * 0.72;

    const halo = new Graphics()
      .ellipse(x, y + 1, Math.max(11, rect.width * 0.12), Math.max(4, rect.width * 0.045))
      .fill({ color: COLORS.antiqueGold, alpha: 0.2 });
    halo.zIndex = 33;
    this.addChild(halo);

    const outline = createTravelerSprite(
      this.travelerFacing,
      this.moving,
      this.travelerFrameTick,
      rect.width,
      this.travelerArriving,
    );
    outline.position.set(x, y);
    outline.tint = COLORS.ink;
    outline.scale.x *= 1.12;
    outline.scale.y *= 1.12;
    outline.alpha = 0.94;
    outline.zIndex = 34;
    this.addChild(outline);

    const traveler = createTravelerSprite(
      this.travelerFacing,
      this.moving,
      this.travelerFrameTick,
      rect.width,
      this.travelerArriving,
    );
    traveler.position.set(x, y);
    traveler.zIndex = 35;
    this.addChild(traveler);
  }

  private drawControls(): void {
    const interactive = !this.moving && !this.objectiveProgress.completed;

    if (this.currentLevel.allowRotate) {
      this.addChild(this.createControlButton(
        this.layout.rotateButton,
        '↻',
        'Rotate selected Page',
        () => this.rotateSelected(),
        interactive,
      ));
    }

    if (this.canGoToSelected() && interactive) {
      this.addChild(this.createControlButton(
        this.layout.travelButton,
        'GO →',
        'Travel to selected Page',
        () => this.travelSelected(),
        true,
      ));
    }

    const finalLevel = !hasNextLevel(this.currentLevelIndex);
    const resetLabel = this.objectiveProgress.completed ? (finalLevel ? 'AGAIN' : 'NEXT') : 'RESET';
    const resetAction = this.objectiveProgress.completed ? () => this.advanceLevel() : () => this.resetPuzzle();
    this.addChild(this.createControlButton(
      this.layout.resetButton,
      resetLabel,
      this.objectiveProgress.completed ? 'Continue to next level' : 'Reset puzzle',
      resetAction,
      !this.moving,
    ));

    if (this.feedback.text) {
      const feedback = new Text({
        text: this.feedback.text,
        style: {
          fill: this.feedback.tone === 'invalid'
            ? COLORS.invalid
            : this.feedback.tone === 'success'
              ? COLORS.antiqueGold
              : COLORS.stone,
          fontFamily: 'monospace',
          fontSize: Math.max(9, Math.round(this.viewportWidth * 0.023)),
          align: 'center',
          wordWrap: true,
          wordWrapWidth: this.viewportWidth - this.layout.margin * 2,
        },
      });
      feedback.anchor.set(0.5, 0);
      feedback.position.set(this.viewportWidth / 2, this.layout.feedbackY);
      this.addChild(feedback);
    }
  }

  private drawTutorialCue(): void {
    if (!this.tutorialCueActive || this.moving || this.objectiveProgress.completed) return;

    if (this.currentLevel.tutorialCue === 'rotate') {
      const target = this.layout.rotateButton;
      const focus = new Graphics()
        .roundRect(target.x - 4, target.y - 4, target.width + 8, target.height + 8, 11)
        .stroke({ color: COLORS.antiqueGold, width: 2, alpha: 0.78 });
      focus.zIndex = 42;
      this.addChild(focus);
      return;
    }

    if (this.currentLevel.tutorialCue === 'swap') {
      const a = this.pageById('p4');
      const b = this.pageById('p5');
      if (!a || !b) return;
      const ar = cellRect(this.layout, a.position);
      const br = cellRect(this.layout, b.position);
      const line = new Graphics()
        .moveTo(ar.x + ar.width * 0.72, ar.y + ar.height * 0.5)
        .lineTo(br.x + br.width * 0.28, br.y + br.height * 0.5)
        .stroke({ color: COLORS.antiqueGold, width: 2, alpha: 0.78 });
      line.zIndex = 42;
      this.addChild(line);
      const cue = new Text({
        text: '↔',
        style: { fill: COLORS.antiqueGold, fontFamily: 'monospace', fontSize: 20, fontWeight: '700' },
      });
      cue.anchor.set(0.5);
      cue.position.set((ar.x + ar.width + br.x) / 2, ar.y + ar.height * 0.5 - 15);
      cue.zIndex = 43;
      this.addChild(cue);
    }
  }

  private createControlButton(
    rect: { readonly x: number; readonly y: number; readonly width: number; readonly height: number },
    labelText: string,
    ariaDescription: string,
    onTap: () => void,
    enabled: boolean,
  ): Container {
    const button = new Container();
    button.position.set(rect.x, rect.y);
    button.eventMode = enabled ? 'static' : 'none';
    button.cursor = enabled ? 'pointer' : 'default';
    button.hitArea = new Rectangle(0, 0, rect.width, rect.height);
    button.zIndex = 30;
    button.label = ariaDescription;
    button.alpha = enabled ? 1 : 0.42;
    button.addChild(
      new Graphics()
        .roundRect(0, 0, rect.width, rect.height, 8)
        .fill(COLORS.inkRaised)
        .stroke({ color: COLORS.antiqueGold, width: 1, alpha: 0.72 }),
    );
    const label = new Text({
      text: labelText,
      style: {
        fill: COLORS.parchment,
        fontFamily: 'monospace',
        fontSize: labelText === '↻' ? 28 : 12,
        fontWeight: '700',
        letterSpacing: labelText === '↻' ? 0 : 1.2,
      },
    });
    label.anchor.set(0.5);
    label.position.set(rect.width / 2, rect.height / 2);
    button.addChild(label);
    if (enabled) {
      button.on('pointertap', (event: FederatedPointerEvent) => {
        event.stopPropagation();
        onTap();
      });
    }
    return button;
  }

  private beginPagePointer(pageId: string, event: FederatedPointerEvent): void {
    if (this.moving || this.objectiveProgress.completed || this.drag) return;
    const page = this.pageById(pageId);
    if (!page) return;
    const rect = cellRect(this.layout, page.position);
    this.drag = {
      pageId,
      pointerId: event.pointerId,
      startX: event.global.x,
      startY: event.global.y,
      originX: rect.x,
      originY: rect.y,
      active: false,
    };
  }

  private readonly handlePointerMove = (event: FederatedPointerEvent): void => {
    const drag = this.drag;
    if (this.moving || !drag || drag.pointerId !== event.pointerId || !this.currentLevel.allowSwap) return;
    const dx = event.global.x - drag.startX;
    const dy = event.global.y - drag.startY;
    if (!drag.active && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    drag.active = true;
    this.selectedPageId = drag.pageId;
    const view = this.pageViews.get(drag.pageId);
    if (view) {
      view.position.set(drag.originX + dx, drag.originY + dy);
      view.alpha = 0.88;
      view.zIndex = 50;
    }
    this.updateDropIndicator(event.global.x, event.global.y, drag.pageId);
  };

  private readonly handlePointerUp = (event: FederatedPointerEvent): void => {
    const drag = this.drag;
    if (this.moving || !drag || drag.pointerId !== event.pointerId) return;

    if (!drag.active) {
      this.drag = null;
      this.selectedPageId = drag.pageId;
      this.feedback = this.canGoToSelected()
        ? { tone: 'success', text: '' }
        : drag.pageId === this.world.travelerPageId
          ? { tone: 'neutral', text: '' }
          : { tone: 'neutral', text: 'No connected road.' };
      this.renderScene();
      return;
    }

    if (!this.currentLevel.allowSwap) {
      this.drag = null;
      this.feedback = { tone: 'invalid', text: 'These Pages are bound in this chapter.' };
      this.renderScene();
      return;
    }

    const target = this.pageUnderPoint(event.global.x, event.global.y);
    if (!target || target.id === drag.pageId) {
      this.drag = null;
      this.feedback = { tone: 'neutral', text: '' };
      this.renderScene();
      return;
    }

    const before = this.currentReachable();
    try {
      this.world = swapPages(this.world, P5_DEFINITION_REGISTRY, drag.pageId, target.id);
      this.drag = null;
      this.manipulationCount += 1;
      if (this.currentLevel.tutorialCue === 'swap') this.tutorialCueActive = false;
      const opened = this.prepareConnectivityPulse(before);
      this.feedback = opened > 0 ? { tone: 'success', text: '' } : { tone: 'neutral', text: '' };
    } catch (error) {
      this.drag = null;
      this.feedback = { tone: 'invalid', text: readableError(error) };
    }
    this.renderScene();
  };

  private currentReachable(): ReadonlySet<string> {
    const graph = buildAdjacencyGraph(this.world, P5_DEFINITION_REGISTRY);
    return reachablePages(graph, this.world.travelerPageId);
  }

  private canTravelTo(pageId: string): boolean {
    return this.currentReachable().has(pageId);
  }

  private canGoToSelected(): boolean {
    return Boolean(
      this.selectedPageId
      && this.selectedPageId !== this.world.travelerPageId
      && this.canTravelTo(this.selectedPageId),
    );
  }

  private travelSelected(): void {
    if (this.moving || this.objectiveProgress.completed || !this.selectedPageId) return;
    const graph = buildAdjacencyGraph(this.world, P5_DEFINITION_REGISTRY);
    const path = shortestPath(graph, this.world.travelerPageId, this.selectedPageId);
    if (!path || path.length <= 1) {
      this.feedback = { tone: 'invalid', text: 'That Page is not connected.' };
      this.renderScene();
      return;
    }
    this.startTraversal(path);
  }

  private startTraversal(path: readonly string[]): void {
    this.cancelTraversalTimer();
    this.cancelArrivalTimer();
    this.cancelRoutePulseTimer();
    this.routePulsePath = [];
    this.routePulseLimit = ROUTE_PULSE_FRAMES;
    this.travelerArriving = false;
    this.moving = true;
    this.selectedPageId = path[path.length - 1] ?? null;
    this.feedback = { tone: 'neutral', text: '' };
    this.renderScene();

    const steps = path.slice(1);
    const advance = (index: number) => {
      const pageId = steps[index];
      if (!pageId) {
        this.finishTraversal(path);
        return;
      }
      const delay = this.reducedMotion ? 40 : TRAVEL_STEP_MS;
      this.traversalTimer = window.setTimeout(() => {
        const from = this.pageById(this.world.travelerPageId)?.position;
        const to = this.pageById(pageId)?.position;
        if (from && to) this.travelerFacing = facingBetween(from, to, this.travelerFacing);
        this.travelerFrameTick += 1;
        this.world = moveTravelerToPage(this.world, pageId);

        if (index === steps.length - 1) {
          this.finishTraversal(path);
          return;
        }
        this.renderScene();
        advance(index + 1);
      }, delay);
    };
    advance(0);
  }

  private finishTraversal(path: readonly string[]): void {
    this.moving = false;
    this.cancelTraversalTimer();
    const objectiveEvent = this.applyDestinationObjective(path);
    if (objectiveEvent === 'none') this.feedback = { tone: 'neutral', text: '' };
    this.startArrivalPose();
    this.renderScene();
  }

  private startArrivalPose(): void {
    if (this.reducedMotion) return;
    this.cancelArrivalTimer();
    this.travelerArriving = true;
    this.travelerFrameTick += 1;
    let framesRemaining = 2;
    const advanceArrival = () => {
      if (framesRemaining <= 0) {
        this.travelerArriving = false;
        this.arrivalTimer = null;
        this.renderScene();
        return;
      }
      this.arrivalTimer = window.setTimeout(() => {
        this.travelerFrameTick += 1;
        framesRemaining -= 1;
        this.renderScene();
        advanceArrival();
      }, ARRIVAL_FRAME_MS);
    };
    advanceArrival();
  }

  private applyDestinationObjective(path: readonly string[]): ObjectiveEvent {
    const traversedPages = path
      .map((pageId) => this.pageById(pageId))
      .filter((page): page is PageState => Boolean(page));
    const resolution = resolveObjectiveTraversal(
      this.objectiveProgress,
      traversedPages,
      treasureRequired(this.currentLevel),
    );
    this.objectiveProgress = resolution.progress;

    switch (resolution.event) {
      case 'treasure-collected':
        if (treasureRequired(this.currentLevel)) {
          this.gateOpeningFrame = this.reducedMotion ? null : 0;
          this.startObjectivePagePulse('goal');
        }
        this.feedback = { tone: 'success', text: '' };
        return resolution.event;
      case 'goal-locked':
        this.feedback = { tone: 'invalid', text: 'The gate is sealed.' };
        return resolution.event;
      case 'completed':
        this.savedProgress = markLevelCompleted(this.savedProgress, this.currentLevel.level.id);
        saveProgress(this.storage, this.savedProgress);
        this.tutorialCueActive = false;
        this.feedback = { tone: 'success', text: '' };
        return resolution.event;
      case 'none':
        return resolution.event;
    }
  }

  private rotateSelected(): void {
    if (this.moving || this.objectiveProgress.completed || this.drag || !this.currentLevel.allowRotate) return;
    if (!this.selectedPageId) return;
    const before = this.currentReachable();
    try {
      this.world = rotatePage(this.world, P5_DEFINITION_REGISTRY, this.selectedPageId);
      this.manipulationCount += 1;
      if (this.currentLevel.tutorialCue === 'rotate') this.tutorialCueActive = false;
      this.prepareConnectivityPulse(before);
      this.feedback = { tone: 'neutral', text: '' };
    } catch (error) {
      this.feedback = { tone: 'invalid', text: readableError(error) };
    }
    this.renderScene();
  }

  private prepareConnectivityPulse(before: ReadonlySet<string>): number {
    this.cancelRoutePulseTimer();
    this.routePulsePath = [];
    this.routePulsePhase = 0;
    this.routePulseLimit = ROUTE_PULSE_FRAMES;
    const graph = buildAdjacencyGraph(this.world, P5_DEFINITION_REGISTRY);
    const after = reachablePages(graph, this.world.travelerPageId);
    const opened = [...after].filter((pageId) => !before.has(pageId));
    if (opened.length === 0) return 0;

    let bestPath: readonly string[] | null = null;
    for (const pageId of opened) {
      const path = shortestPath(graph, this.world.travelerPageId, pageId);
      if (path && (!bestPath || path.length > bestPath.length)) bestPath = path;
    }
    this.routePulsePath = bestPath ?? [];
    if (!this.reducedMotion && this.routePulsePath.length > 1) {
      this.routePulseTimer = window.setTimeout(() => this.advanceRoutePulse(), ROUTE_PULSE_FRAME_MS);
    } else if (this.reducedMotion) {
      this.routePulsePath = [];
    }
    return opened.length;
  }

  private startObjectivePagePulse(kind: ObjectiveKind): void {
    const page = this.world.pages.find((candidate) => candidate.state.objective === kind);
    if (!page || this.reducedMotion) return;
    this.cancelRoutePulseTimer();
    this.routePulsePath = [page.id];
    this.routePulsePhase = 0;
    this.routePulseLimit = OBJECTIVE_PULSE_FRAMES;
    this.routePulseTimer = window.setTimeout(() => this.advanceRoutePulse(), ROUTE_PULSE_FRAME_MS);
  }

  private advanceRoutePulse(): void {
    this.routePulsePhase += 1;
    if (this.routePulsePhase >= this.routePulseLimit) {
      this.routePulsePath = [];
      this.routePulseTimer = null;
      this.routePulseLimit = ROUTE_PULSE_FRAMES;
      this.renderScene();
      return;
    }
    this.renderScene();
    this.routePulseTimer = window.setTimeout(() => this.advanceRoutePulse(), ROUTE_PULSE_FRAME_MS);
  }

  private scheduleWorldObjectFrame(): void {
    if (this.reducedMotion) return;
    this.worldObjectTimer = window.setTimeout(() => {
      this.worldObjectFrameTick += 1;
      if (this.gateOpeningFrame !== null) {
        const nextFrame = this.gateOpeningFrame + 1;
        this.gateOpeningFrame = nextFrame >= GATE_OPENING_FRAMES ? null : nextFrame;
      }
      if (!this.moving && !this.drag?.active) this.renderScene();
      this.scheduleWorldObjectFrame();
    }, WORLD_OBJECT_FRAME_MS);
  }

  private resetPuzzle(): void {
    if (this.moving) return;
    this.resetCurrentLevelState();
    this.renderScene();
  }

  private resetCurrentLevelState(): void {
    this.cancelTraversalTimer();
    this.cancelArrivalTimer();
    this.cancelRoutePulseTimer();
    this.world = resetLevel(this.currentLevel.level, P5_DEFINITION_REGISTRY);
    this.objectiveProgress = createObjectiveProgress();
    this.selectedPageId = this.world.travelerPageId;
    this.travelerFacing = 'north';
    this.travelerFrameTick = 0;
    this.travelerArriving = false;
    this.routePulsePath = [];
    this.routePulsePhase = 0;
    this.routePulseLimit = ROUTE_PULSE_FRAMES;
    this.worldObjectFrameTick = 0;
    this.gateOpeningFrame = null;
    this.manipulationCount = 0;
    this.tutorialCueActive = this.shouldShowTutorialCue();
    this.feedback = { tone: 'neutral', text: '' };
  }

  private advanceLevel(): void {
    if (this.moving) return;
    if (hasNextLevel(this.currentLevelIndex)) {
      this.currentLevelIndex += 1;
      this.currentLevel = levelAt(this.currentLevelIndex);
    }
    this.resetCurrentLevelState();
    this.renderScene();
  }

  private drawCompletionOverlay(): void {
    const panelWidth = Math.min(this.viewportWidth - this.layout.margin * 2, 310);
    const panelHeight = 104;
    const x = (this.viewportWidth - panelWidth) / 2;
    const y = this.layout.boardY + (this.layout.boardHeight - panelHeight) / 2;
    const overlay = new Container();
    overlay.zIndex = 80;
    overlay.addChild(
      new Graphics()
        .roundRect(x, y, panelWidth, panelHeight, 10)
        .fill({ color: COLORS.ink, alpha: 0.95 })
        .stroke({ color: COLORS.antiqueGold, width: 2, alpha: 0.9 }),
    );

    const title = new Text({
      text: this.currentLevelIndex === P5_LEVELS.length - 1 ? 'BOOK RESTORED' : 'PAGE RESTORED',
      style: { fill: COLORS.parchment, fontFamily: 'monospace', fontSize: 15, fontWeight: '700', letterSpacing: 1.4 },
    });
    title.anchor.set(0.5);
    title.position.set(this.viewportWidth / 2, y + 31);
    overlay.addChild(title);

    let detailText = `MOVES ${this.manipulationCount}`;
    if (this.currentLevel.relicPolicy === 'optional') {
      detailText += this.objectiveProgress.treasureCollected ? '  ·  RELIC FOUND' : '  ·  DIRECT EXIT';
    }
    const detail = new Text({
      text: detailText,
      style: { fill: COLORS.stone, fontFamily: 'monospace', fontSize: 10, align: 'center', letterSpacing: 0.5 },
    });
    detail.anchor.set(0.5);
    detail.position.set(this.viewportWidth / 2, y + 63);
    overlay.addChild(detail);

    const continuation = new Text({
      text: hasNextLevel(this.currentLevelIndex) ? 'NEXT BELOW' : 'MVP COMPLETE',
      style: { fill: COLORS.antiqueGold, fontFamily: 'monospace', fontSize: 9, align: 'center', letterSpacing: 0.8 },
    });
    continuation.anchor.set(0.5);
    continuation.position.set(this.viewportWidth / 2, y + 84);
    overlay.addChild(continuation);
    this.addChild(overlay);
  }

  private updateDropIndicator(x: number, y: number, sourcePageId: string): void {
    const indicator = this.dropIndicator;
    if (!indicator || this.moving || !this.currentLevel.allowSwap) return;
    indicator.clear();
    const target = this.pageUnderPoint(x, y);
    if (!target || target.id === sourcePageId) return;
    const source = this.pageById(sourcePageId);
    if (!source) return;
    const legal = P5_DEFINITION_REGISTRY.get(source.definitionId)?.canSwap !== false
      && P5_DEFINITION_REGISTRY.get(target.definitionId)?.canSwap !== false;
    const rect = cellRect(this.layout, target.position);
    indicator
      .roundRect(rect.x - 2, rect.y - 2, rect.width + 4, rect.height + 4, 7)
      .stroke({ color: legal ? COLORS.antiqueGold : COLORS.invalid, width: 3, alpha: 0.95 });
  }

  private pageUnderPoint(x: number, y: number): PageState | undefined {
    const position = gridPositionAtPoint(this.layout, x, y);
    return position ? pageAt(this.world, position) : undefined;
  }

  private pageById(pageId: string): PageState | undefined {
    return this.world.pages.find((page) => page.id === pageId);
  }

  private cancelDrag(): void {
    this.drag = null;
    this.dropIndicator?.clear();
  }

  private cancelTraversalTimer(): void {
    if (this.traversalTimer !== null) window.clearTimeout(this.traversalTimer);
    this.traversalTimer = null;
  }

  private cancelRoutePulseTimer(): void {
    if (this.routePulseTimer !== null) window.clearTimeout(this.routePulseTimer);
    this.routePulseTimer = null;
  }

  private cancelArrivalTimer(): void {
    if (this.arrivalTimer !== null) window.clearTimeout(this.arrivalTimer);
    this.arrivalTimer = null;
  }
}

function pageFamilyLabel(definitionId: string | undefined): string {
  if (!definitionId || !isPageArtFamily(definitionId)) return definitionId ?? 'Unknown Page';
  return PAGE_ART_MANIFEST[definitionId].label;
}

function facingBetween(from: GridPosition, to: GridPosition, fallback: TravelerFacing): TravelerFacing {
  if (to.row < from.row) return 'north';
  if (to.row > from.row) return 'south';
  if (to.column > from.column) return 'east';
  if (to.column < from.column) return 'west';
  return fallback;
}

function routePulseAlpha(phase: number): number {
  return [0.34, 0.68, 0.96, 0.5][phase % ROUTE_PULSE_FRAMES] ?? 0.42;
}

function readableError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
      .replace('Page cannot rotate:', 'This Page cannot turn:')
      .replace('Page cannot swap:', 'This Page is bound:');
  }
  return 'That manipulation is not allowed';
}

function safeLocalStorage(): StorageLike | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}
