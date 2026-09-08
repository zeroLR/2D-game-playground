import { Container, FederatedPointerEvent, Graphics, Rectangle, Text } from 'pixi.js';
import { PAGE_ART_MANIFEST, isPageArtFamily, type TravelerFacing } from '../art/pixel-art-manifest';
import { DEMO_DEFINITION_REGISTRY, DEMO_LEVEL } from '../domain/demo-level';
import type { GridPosition, PageState, WorldState } from '../domain/model';
import {
  createObjectiveProgress,
  pageObjective,
  resolveObjectiveArrival,
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
import {
  advanceTutorial,
  newlyReachable,
  objectiveCopy,
  type TutorialStage,
} from './mechanic-legibility';
import { createPageArtSprite, createTravelerSprite } from './pixel-art';

const COLORS = {
  ink: 0x121917,
  inkRaised: 0x1b2421,
  stone: 0x777365,
  parchment: 0xd8c7a3,
  antiqueGold: 0xa8874c,
  invalid: 0x8b544a,
  reachable: 0xc5b991,
  treasure: 0xb89b5c,
  veil: 0x111614,
};

const DRAG_THRESHOLD = 9;
const TRAVEL_STEP_MS = 230;
const ROUTE_PULSE_FRAME_MS = 115;
const ROUTE_PULSE_FRAMES = 4;
const ARRIVAL_FRAME_MS = 140;

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

export class PixelBoardScene extends Container {
  private world: WorldState = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
  private selectedPageId: string | null = this.world.travelerPageId;
  private objectiveProgress: ObjectiveProgress = createObjectiveProgress();
  private savedProgress: ProgressSaveV1;
  private readonly storage: StorageLike | null;
  private feedback: FeedbackState = {
    tone: 'neutral',
    text: 'Rotate the marked Page to connect the first road',
  };
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
  private tutorialStage: TutorialStage = 'rotate';
  private routePulsePath: readonly string[] = [];
  private routePulsePhase = 0;
  private routePulseTimer: number | null = null;

  constructor(width: number, height: number) {
    super();
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.layout = computeBoardLayout(width, height, this.world.width, this.world.height);
    this.storage = safeLocalStorage();
    this.savedProgress = loadProgress(this.storage);
    if (this.savedProgress.completedLevelIds.includes(DEMO_LEVEL.id)) this.tutorialStage = 'complete';
    this.eventMode = 'static';
    this.sortableChildren = true;
    this.hitArea = new Rectangle(0, 0, Math.max(1, width), Math.max(1, height));
    this.on('pointermove', this.handlePointerMove);
    this.on('pointerup', this.handlePointerUp);
    this.on('pointerupoutside', this.handlePointerUp);
    this.renderScene();
  }

  setViewport(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.layout = computeBoardLayout(width, height, this.world.width, this.world.height);
    this.hitArea = new Rectangle(0, 0, Math.max(1, width), Math.max(1, height));
    this.cancelDrag();
    this.renderScene();
  }

  private renderScene(): void {
    const stale = this.removeChildren();
    for (const child of stale) child.destroy({ children: true });
    this.pageViews.clear();
    this.dropIndicator = null;

    const graph = buildAdjacencyGraph(this.world, DEMO_DEFINITION_REGISTRY);
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

    const subtitleY = this.layout.margin + Math.max(42, this.viewportWidth * 0.11);
    const subtitle = new Text({
      text: 'PAPER TRAILS  ·  P4.1 MECHANIC LEGIBILITY',
      style: {
        fill: COLORS.antiqueGold,
        fontFamily: 'monospace',
        fontSize: Math.max(9, Math.round(this.viewportWidth * 0.022)),
        letterSpacing: 1,
      },
    });
    subtitle.position.set(this.layout.margin, subtitleY);
    this.addChild(subtitle);

    this.drawObjectiveStrip(Math.min(this.layout.boardY - 34, subtitleY + 32));
  }

  private drawObjectiveStrip(y: number): void {
    const copy = objectiveCopy(this.objectiveProgress.treasureCollected, this.objectiveProgress.completed);
    const primary = new Text({
      text: copy.primary,
      style: {
        fill: COLORS.antiqueGold,
        fontFamily: 'monospace',
        fontSize: Math.max(9, Math.round(this.viewportWidth * 0.023)),
        fontWeight: '700',
        letterSpacing: 0.7,
      },
    });
    primary.position.set(this.layout.margin, y);
    this.addChild(primary);

    const secondary = new Text({
      text: copy.secondary,
      style: {
        fill: copy.secondaryActive ? COLORS.parchment : COLORS.stone,
        fontFamily: 'monospace',
        fontSize: Math.max(8, Math.round(this.viewportWidth * 0.021)),
        letterSpacing: 0.5,
      },
    });
    secondary.position.set(this.layout.margin, y + 18);
    secondary.alpha = copy.secondaryActive ? 0.95 : 0.56;
    this.addChild(secondary);
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
    view.cursor = this.moving ? 'default' : 'pointer';
    view.hitArea = new Rectangle(0, 0, rect.width, rect.height);
    view.zIndex = 10;

    const selected = page.id === this.selectedPageId;
    const definition = DEMO_DEFINITION_REGISTRY.get(page.definitionId);
    const fixed = definition?.canSwap === false;
    const pulsing = this.routePulsePath.includes(page.id);
    const tutorialRouteCandidate = this.tutorialStage === 'choose-route'
      && reachable
      && page.id !== this.world.travelerPageId;
    const border = new Graphics()
      .roundRect(0, 0, rect.width, rect.height, 4)
      .fill(COLORS.inkRaised)
      .stroke({
        color: selected || pulsing || tutorialRouteCandidate ? COLORS.antiqueGold : reachable ? COLORS.reachable : COLORS.stone,
        width: selected ? 3 : pulsing || tutorialRouteCandidate ? 2 : reachable ? 2 : 1,
        alpha: selected ? 0.95 : pulsing ? routePulseAlpha(this.routePulsePhase) : tutorialRouteCandidate ? 0.72 : reachable ? 0.6 : 0.38,
      });
    view.addChild(border);

    const artInset = 3;
    const art = createPageArtSprite(page.definitionId, page.rotation, rect.width - artInset * 2, reachable ? 1 : 0.48);
    art.position.set(rect.width / 2, rect.height / 2);
    view.addChild(art);

    if (!reachable) {
      view.addChild(
        new Graphics()
          .roundRect(artInset, artInset, rect.width - artInset * 2, rect.height - artInset * 2, 2)
          .fill({ color: COLORS.veil, alpha: 0.28 }),
      );
    }

    if (selected) {
      const label = new Text({
        text: pageFamilyLabel(page.definitionId),
        style: {
          fill: COLORS.antiqueGold,
          fontFamily: 'monospace',
          fontSize: Math.max(6, rect.width * 0.065),
          fontWeight: '700',
        },
      });
      label.position.set(6, rect.height - Math.max(14, rect.height * 0.14));
      label.alpha = 0.95;
      view.addChild(label);
    }

    if (fixed) {
      const fixedLabel = new Text({
        text: 'BOUND',
        style: { fill: COLORS.invalid, fontFamily: 'monospace', fontSize: Math.max(6, rect.width * 0.06), fontWeight: '700' },
      });
      fixedLabel.anchor.set(1, 1);
      fixedLabel.position.set(rect.width - 6, rect.height - 5);
      view.addChild(fixedLabel);
    }

    if (this.tutorialStage === 'rotate' && page.id === this.world.travelerPageId) {
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

    const objective = pageObjective(page);
    if (objective) this.drawObjectiveMarker(view, objective, rect.width);
    view.on('pointerdown', (event: FederatedPointerEvent) => this.beginPagePointer(page.id, event));
    return view;
  }

  private drawObjectiveMarker(view: Container, objective: 'treasure' | 'goal', pageSize: number): void {
    const g = new Graphics();
    g.zIndex = 20;
    if (objective === 'treasure') {
      const collected = this.objectiveProgress.treasureCollected;
      const x = pageSize - 16;
      const y = 13;
      g.rect(x, y - 4, 5, 5).fill({ color: COLORS.treasure, alpha: collected ? 0.3 : 1 });
      g.rect(x - 4, y, 13, 5).fill({ color: COLORS.treasure, alpha: collected ? 0.3 : 1 });
      g.rect(x, y + 4, 5, 5).fill({ color: COLORS.treasure, alpha: collected ? 0.3 : 1 });
    } else {
      const open = this.objectiveProgress.treasureCollected;
      const color = open ? COLORS.antiqueGold : COLORS.invalid;
      const x = pageSize - 26;
      g.rect(x, 8, 18, 4).fill(color);
      g.rect(x, 12, 4, 13).fill(color);
      g.rect(x + 14, 12, 4, 13).fill(color);
      if (!open) g.rect(x + 6, 15, 6, 7).fill(color);
    }
    view.addChild(g);
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

    const nodes = new Graphics();
    nodes.zIndex = 28;
    for (const pageId of this.routePulsePath) {
      const page = this.pageById(pageId);
      if (!page) continue;
      const rect = cellRect(this.layout, page.position);
      nodes
        .circle(rect.x + rect.width / 2, rect.y + rect.height / 2, Math.max(3, rect.width * 0.035))
        .fill({ color: COLORS.antiqueGold, alpha: Math.min(1, alpha + 0.12) });
    }
    this.addChild(nodes);
  }

  private drawTraveler(): void {
    const page = this.world.pages.find((candidate) => candidate.id === this.world.travelerPageId);
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
    const enabled = !this.moving && !this.objectiveProgress.completed;
    this.addChild(this.createControlButton(this.layout.rotateButton, '↻', 'Rotate selected Page', () => this.rotateSelected(), enabled));

    const canGo = this.canGoToSelected();
    if (canGo) {
      this.addChild(this.createControlButton(this.layout.travelButton, 'GO →', 'Travel to selected Page', () => this.travelSelected(), enabled));
    }

    this.addChild(this.createControlButton(this.layout.resetButton, 'RESET', 'Reset puzzle', () => this.resetPuzzle(), !this.moving));

    const selected = this.selectedPageId ? this.world.pages.find((page) => page.id === this.selectedPageId) : undefined;
    const selectedText = selected ? pageFamilyLabel(selected.definitionId) : 'No Page selected';
    const phase = this.objectiveProgress.completed
      ? 'COMPLETE'
      : this.moving
        ? 'WALKING'
        : this.objectiveProgress.treasureCollected
          ? 'RETURN TO GATE'
          : 'FIND RELIC';
    const status = new Text({
      text: `${selectedText} · ${phase}`,
      style: {
        fill: COLORS.stone,
        fontFamily: 'monospace',
        fontSize: Math.max(8, Math.round(this.viewportWidth * 0.021)),
        align: 'center',
      },
    });
    status.anchor.set(0.5, 1);
    status.position.set(this.viewportWidth / 2, this.layout.rotateButton.y - 8);
    this.addChild(status);

    const feedback = new Text({
      text: this.feedback.text,
      style: {
        fill: this.feedback.tone === 'invalid' ? COLORS.invalid : this.feedback.tone === 'success' ? COLORS.antiqueGold : COLORS.stone,
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

  private drawTutorialCue(): void {
    if (this.moving || this.objectiveProgress.completed || this.tutorialStage === 'complete') return;
    const target = this.tutorialStage === 'go' && this.canGoToSelected()
      ? this.layout.travelButton
      : this.tutorialStage === 'rotate'
        ? this.layout.rotateButton
        : null;
    if (!target) return;

    const focus = new Graphics()
      .roundRect(target.x - 4, target.y - 4, target.width + 8, target.height + 8, 11)
      .stroke({ color: COLORS.antiqueGold, width: 2, alpha: 0.78 });
    focus.zIndex = 42;
    this.addChild(focus);

    const marker = new Graphics()
      .circle(target.x + target.width / 2, target.y - 10, 3)
      .fill({ color: COLORS.antiqueGold, alpha: 0.95 });
    marker.zIndex = 43;
    this.addChild(marker);
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
        letterSpacing: labelText === '↻' ? 0 : 1.3,
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
    const page = this.world.pages.find((candidate) => candidate.id === pageId);
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
    if (this.moving || !drag || drag.pointerId !== event.pointerId) return;
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
      const canTravel = drag.pageId !== this.world.travelerPageId && this.canTravelTo(drag.pageId);
      if (canTravel) {
        this.tutorialStage = advanceTutorial(this.tutorialStage, 'selected-reachable');
        this.feedback = { tone: 'success', text: 'Route ready · tap GO' };
      } else if (drag.pageId === this.world.travelerPageId) {
        this.feedback = { tone: 'neutral', text: 'Traveler Page selected · rotate or drag the book' };
      } else {
        this.feedback = { tone: 'neutral', text: 'No route yet · reshape Pages until the road connects' };
      }
      this.renderScene();
      return;
    }

    const target = this.pageUnderPoint(event.global.x, event.global.y);
    if (!target || target.id === drag.pageId) {
      this.feedback = { tone: 'invalid', text: 'Swap cancelled · drop onto another Page' };
      this.drag = null;
      this.renderScene();
      return;
    }

    const before = this.currentReachable();
    try {
      this.world = swapPages(this.world, DEMO_DEFINITION_REGISTRY, drag.pageId, target.id);
      this.drag = null;
      const opened = this.prepareConnectivityPulse(before);
      if (opened > 0) {
        this.tutorialStage = advanceTutorial(this.tutorialStage, 'opened-route');
        this.feedback = { tone: 'success', text: 'Road connected · choose a lit Page' };
      } else {
        this.feedback = { tone: 'success', text: `Pages exchanged · ${pageFamilyLabel(target.definitionId)} shifted` };
      }
    } catch (error) {
      this.drag = null;
      this.feedback = { tone: 'invalid', text: readableError(error) };
    }
    this.renderScene();
  };

  private currentReachable(): ReadonlySet<string> {
    const graph = buildAdjacencyGraph(this.world, DEMO_DEFINITION_REGISTRY);
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
    const graph = buildAdjacencyGraph(this.world, DEMO_DEFINITION_REGISTRY);
    const path = shortestPath(graph, this.world.travelerPageId, this.selectedPageId);
    if (!path || path.length <= 1) {
      this.feedback = { tone: 'invalid', text: 'That Page is not connected to the traveler' };
      this.renderScene();
      return;
    }
    this.tutorialStage = advanceTutorial(this.tutorialStage, 'travel-started');
    this.startTraversal(path);
  }

  private startTraversal(path: readonly string[]): void {
    this.cancelTraversalTimer();
    this.cancelArrivalTimer();
    this.cancelRoutePulseTimer();
    this.routePulsePath = [];
    this.travelerArriving = false;
    this.moving = true;
    this.selectedPageId = path[path.length - 1] ?? null;
    this.feedback = { tone: 'neutral', text: `Walking ${Math.max(0, path.length - 1)} Page${path.length === 2 ? '' : 's'}…` };
    this.renderScene();

    const steps = path.slice(1);
    const advance = (index: number) => {
      const pageId = steps[index];
      if (!pageId) {
        this.moving = false;
        if (!this.objectiveProgress.completed) {
          this.feedback = { tone: 'success', text: `Arrived · ${pageFamilyLabel(this.pageById(this.world.travelerPageId)?.definitionId)}` };
        }
        this.startArrivalPose();
        this.renderScene();
        return;
      }
      this.traversalTimer = window.setTimeout(() => {
        const from = this.pageById(this.world.travelerPageId)?.position;
        const to = this.pageById(pageId)?.position;
        if (from && to) this.travelerFacing = facingBetween(from, to, this.travelerFacing);
        this.travelerFrameTick += 1;
        this.world = moveTravelerToPage(this.world, pageId);
        this.applyArrival(pageId);
        this.renderScene();
        if (this.objectiveProgress.completed) {
          this.moving = false;
          this.cancelTraversalTimer();
          this.startArrivalPose();
          this.renderScene();
          return;
        }
        advance(index + 1);
      }, TRAVEL_STEP_MS);
    };
    advance(0);
  }

  private startArrivalPose(): void {
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

  private applyArrival(pageId: string): void {
    const page = this.pageById(pageId);
    if (!page) return;
    const resolution = resolveObjectiveArrival(this.objectiveProgress, page);
    this.objectiveProgress = resolution.progress;
    switch (resolution.event) {
      case 'treasure-collected':
        this.feedback = { tone: 'success', text: 'Relic recovered · return to the Ruined Gate' };
        return;
      case 'goal-locked':
        this.feedback = { tone: 'invalid', text: 'Ruined Gate sealed · recover the relic first' };
        return;
      case 'completed':
        this.savedProgress = markLevelCompleted(this.savedProgress, DEMO_LEVEL.id);
        saveProgress(this.storage, this.savedProgress);
        this.tutorialStage = 'complete';
        this.feedback = { tone: 'success', text: 'Chapter complete · progress saved locally' };
        return;
      case 'none':
        return;
    }
  }

  private rotateSelected(): void {
    if (this.moving || this.objectiveProgress.completed || this.drag) return;
    if (!this.selectedPageId) return;
    const before = this.currentReachable();
    try {
      this.world = rotatePage(this.world, DEMO_DEFINITION_REGISTRY, this.selectedPageId);
      const opened = this.prepareConnectivityPulse(before);
      if (opened > 0) {
        this.tutorialStage = advanceTutorial(this.tutorialStage, 'opened-route');
        this.feedback = { tone: 'success', text: 'Road connected · choose a lit Page' };
      } else {
        this.feedback = { tone: 'neutral', text: `${pageFamilyLabel(this.pageById(this.selectedPageId)?.definitionId)} rotated · keep looking for a connection` };
      }
    } catch (error) {
      this.feedback = { tone: 'invalid', text: readableError(error) };
    }
    this.renderScene();
  }

  private prepareConnectivityPulse(before: ReadonlySet<string>): number {
    this.cancelRoutePulseTimer();
    this.routePulsePath = [];
    this.routePulsePhase = 0;
    const graph = buildAdjacencyGraph(this.world, DEMO_DEFINITION_REGISTRY);
    const after = reachablePages(graph, this.world.travelerPageId);
    const opened = newlyReachable(before, after);
    if (opened.length === 0) return 0;

    let bestPath: readonly string[] | null = null;
    for (const pageId of opened) {
      const path = shortestPath(graph, this.world.travelerPageId, pageId);
      if (path && (!bestPath || path.length > bestPath.length)) bestPath = path;
    }
    this.routePulsePath = bestPath ?? [];
    if (this.routePulsePath.length > 1) {
      this.routePulseTimer = window.setTimeout(() => this.advanceRoutePulse(), ROUTE_PULSE_FRAME_MS);
    }
    return opened.length;
  }

  private advanceRoutePulse(): void {
    this.routePulsePhase += 1;
    if (this.routePulsePhase >= ROUTE_PULSE_FRAMES) {
      this.routePulsePath = [];
      this.routePulseTimer = null;
      this.renderScene();
      return;
    }
    this.renderScene();
    this.routePulseTimer = window.setTimeout(() => this.advanceRoutePulse(), ROUTE_PULSE_FRAME_MS);
  }

  private resetPuzzle(): void {
    if (this.moving) return;
    this.cancelTraversalTimer();
    this.cancelArrivalTimer();
    this.cancelRoutePulseTimer();
    this.world = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
    this.objectiveProgress = createObjectiveProgress();
    this.selectedPageId = this.world.travelerPageId;
    this.travelerFacing = 'north';
    this.travelerFrameTick = 0;
    this.travelerArriving = false;
    this.routePulsePath = [];
    this.routePulsePhase = 0;
    this.tutorialStage = this.savedProgress.completedLevelIds.includes(DEMO_LEVEL.id)
      ? 'complete'
      : advanceTutorial(this.tutorialStage, 'reset');
    this.feedback = this.tutorialStage === 'complete'
      ? { tone: 'neutral', text: 'Puzzle reset' }
      : { tone: 'neutral', text: 'Rotate the marked Page to connect the first road' };
    this.renderScene();
  }

  private drawCompletionOverlay(): void {
    const panelWidth = Math.min(this.viewportWidth - this.layout.margin * 2, 310);
    const panelHeight = 96;
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
      text: 'CHAPTER COMPLETE',
      style: { fill: COLORS.parchment, fontFamily: 'monospace', fontSize: 15, fontWeight: '700', letterSpacing: 1.5 },
    });
    title.anchor.set(0.5);
    title.position.set(this.viewportWidth / 2, y + 32);
    overlay.addChild(title);
    const detail = new Text({
      text: 'Relic recovered · gate restored · local save updated',
      style: { fill: COLORS.stone, fontFamily: 'monospace', fontSize: 9, align: 'center' },
    });
    detail.anchor.set(0.5);
    detail.position.set(this.viewportWidth / 2, y + 62);
    overlay.addChild(detail);
    this.addChild(overlay);
  }

  private updateDropIndicator(x: number, y: number, sourcePageId: string): void {
    const indicator = this.dropIndicator;
    if (!indicator || this.moving) return;
    indicator.clear();
    const target = this.pageUnderPoint(x, y);
    if (!target || target.id === sourcePageId) return;
    const source = this.pageById(sourcePageId);
    if (!source) return;
    const legal = DEMO_DEFINITION_REGISTRY.get(source.definitionId)?.canSwap !== false
      && DEMO_DEFINITION_REGISTRY.get(target.definitionId)?.canSwap !== false;
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
  return [0.34, 0.68, 0.96, 0.5][phase] ?? 0.42;
}

function readableError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
      .replace('Page cannot rotate:', 'Cannot rotate bound Page:')
      .replace('Page cannot swap:', 'Cannot swap bound Page:');
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
