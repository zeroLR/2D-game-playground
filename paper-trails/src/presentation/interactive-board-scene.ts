import { Container, FederatedPointerEvent, Graphics, Rectangle, Text } from 'pixi.js';
import { CARDINAL_DIRECTIONS, type Direction, type PageState, type WorldState } from '../domain/model';
import { DEMO_DEFINITION_REGISTRY, DEMO_LEVEL } from '../domain/demo-level';
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
  rotatedPageExits,
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

const COLORS = {
  ink: 0x121917,
  inkRaised: 0x1b2421,
  paperDark: 0x343a34,
  paperLight: 0x41433b,
  stone: 0x777365,
  parchment: 0xd8c7a3,
  antiqueGold: 0xa8874c,
  invalid: 0x8b544a,
  reachable: 0xc5b991,
  treasure: 0xb89b5c,
};

const DRAG_THRESHOLD = 9;
const TRAVEL_STEP_MS = 230;

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

export class InteractiveBoardScene extends Container {
  private world: WorldState = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
  private selectedPageId: string | null = this.world.travelerPageId;
  private objectiveProgress: ObjectiveProgress = createObjectiveProgress();
  private savedProgress: ProgressSaveV1;
  private readonly storage: StorageLike | null;
  private feedback: FeedbackState = { tone: 'neutral', text: 'Rotate the traveler page once to open the route · tap a destination twice to walk' };
  private viewportWidth: number;
  private viewportHeight: number;
  private layout: BoardLayout;
  private drag: DragState | null = null;
  private moving = false;
  private traversalTimer: number | null = null;
  private pageViews = new Map<string, Container>();
  private dropIndicator: Graphics | null = null;

  constructor(width: number, height: number) {
    super();
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.layout = computeBoardLayout(width, height, this.world.width, this.world.height);
    this.storage = safeLocalStorage();
    this.savedProgress = loadProgress(this.storage);
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
    const oldChildren = this.removeChildren();
    for (const child of oldChildren) child.destroy({ children: true });
    this.pageViews.clear();
    this.dropIndicator = null;

    const width = this.viewportWidth;
    const height = this.viewportHeight;
    const graph = buildAdjacencyGraph(this.world, DEMO_DEFINITION_REGISTRY);
    const reachable = reachablePages(graph, this.world.travelerPageId);

    this.addChild(new Graphics().rect(0, 0, width, height).fill(COLORS.ink));

    const title = new Text({
      text: '書頁迷城',
      style: {
        fill: COLORS.parchment,
        fontFamily: 'serif',
        fontSize: Math.max(24, Math.round(width * 0.075)),
        fontWeight: '600',
        letterSpacing: 3,
      },
    });
    title.position.set(this.layout.margin, this.layout.margin);
    this.addChild(title);

    const subtitle = new Text({
      text: 'PAPER TRAILS  ·  P3 TRAVELER & OBJECTIVES',
      style: {
        fill: COLORS.antiqueGold,
        fontFamily: 'monospace',
        fontSize: Math.max(9, Math.round(width * 0.023)),
        letterSpacing: 1.1,
      },
    });
    subtitle.position.set(this.layout.margin, this.layout.margin + Math.max(42, width * 0.11));
    this.addChild(subtitle);

    const bookPadding = Math.max(10, Math.round(width * 0.025));
    this.addChild(
      new Graphics()
        .roundRect(
          this.layout.boardX - bookPadding,
          this.layout.boardY - bookPadding,
          this.layout.boardWidth + bookPadding * 2,
          this.layout.boardHeight + bookPadding * 2,
          14,
        )
        .fill(COLORS.inkRaised)
        .stroke({ color: COLORS.stone, width: 1, alpha: 0.6 }),
    );

    for (const page of this.world.pages) {
      const view = this.createPageView(page, reachable.has(page.id));
      this.pageViews.set(page.id, view);
      this.addChild(view);
    }

    this.drawTraveler();
    this.dropIndicator = new Graphics();
    this.dropIndicator.zIndex = 45;
    this.addChild(this.dropIndicator);

    const manipulationEnabled = !this.moving && !this.objectiveProgress.completed;
    this.addChild(this.createControlButton(this.layout.rotateButton, '↻', 'Rotate selected page', () => this.rotateSelected(), manipulationEnabled));
    this.addChild(this.createControlButton(this.layout.resetButton, 'RESET', 'Reset puzzle', () => this.resetPuzzle(), !this.moving));

    const selected = this.selectedPageId ? this.world.pages.find((page) => page.id === this.selectedPageId) : undefined;
    const selectedDefinition = selected ? DEMO_DEFINITION_REGISTRY.get(selected.definitionId) : undefined;
    const selectionStatus = selected
      ? `${selected.id} · ${selected.rotation}°${selectedDefinition?.canSwap === false ? ' · FIXED' : ''}`
      : 'No page selected';
    const phase = this.objectiveProgress.completed ? 'COMPLETE' : this.moving ? 'WALKING' : this.objectiveProgress.treasureCollected ? 'EXIT OPEN' : 'FIND RELIC';
    const status = new Text({
      text: `${reachable.size}/${this.world.pages.length} reachable · ${selectionStatus} · ${phase}`,
      style: {
        fill: COLORS.stone,
        fontFamily: 'monospace',
        fontSize: Math.max(9, Math.round(width * 0.022)),
        align: 'center',
      },
    });
    status.anchor.set(0.5, 1);
    status.position.set(width / 2, this.layout.rotateButton.y - 8);
    this.addChild(status);

    const feedback = new Text({
      text: this.feedback.text,
      style: {
        fill: this.feedback.tone === 'invalid' ? COLORS.invalid : this.feedback.tone === 'success' ? COLORS.antiqueGold : COLORS.stone,
        fontFamily: 'monospace',
        fontSize: Math.max(9, Math.round(width * 0.023)),
        align: 'center',
        wordWrap: true,
        wordWrapWidth: width - this.layout.margin * 2,
      },
    });
    feedback.anchor.set(0.5, 0);
    feedback.position.set(width / 2, this.layout.feedbackY);
    this.addChild(feedback);

    if (this.objectiveProgress.completed) this.drawCompletionOverlay();
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
    const objective = pageObjective(page);
    const fill = (page.position.row + page.position.column) % 2 === 0 ? COLORS.paperDark : COLORS.paperLight;
    view.addChild(
      new Graphics()
        .roundRect(0, 0, rect.width, rect.height, 5)
        .fill({ color: fill, alpha: reachable ? 1 : 0.62 })
        .stroke({
          color: selected ? COLORS.antiqueGold : reachable ? COLORS.reachable : COLORS.stone,
          width: selected ? 3 : reachable ? 2 : 1,
          alpha: selected ? 0.95 : reachable ? 0.65 : 0.42,
        }),
    );

    const exits = new Set(rotatedPageExits(page, DEMO_DEFINITION_REGISTRY));
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const pathWidth = Math.max(5, Math.round(rect.width * 0.12));
    const path = new Graphics().circle(centerX, centerY, pathWidth * 0.55).fill({ color: COLORS.parchment, alpha: reachable ? 0.46 : 0.26 });
    for (const direction of CARDINAL_DIRECTIONS) {
      if (exits.has(direction)) this.drawExit(path, direction, rect.width, pathWidth, reachable);
    }
    view.addChild(path);

    const label = new Text({
      text: `${page.id} · ${page.rotation}°`,
      style: { fill: COLORS.stone, fontFamily: 'monospace', fontSize: Math.max(7, rect.width * 0.085) },
    });
    label.position.set(5, 4);
    view.addChild(label);

    if (fixed) {
      const fixedLabel = new Text({
        text: 'FIXED',
        style: { fill: COLORS.invalid, fontFamily: 'monospace', fontSize: Math.max(7, rect.width * 0.075), fontWeight: '700' },
      });
      fixedLabel.anchor.set(1, 1);
      fixedLabel.position.set(rect.width - 5, rect.height - 5);
      view.addChild(fixedLabel);
    }

    if (objective) this.drawObjectiveMarker(view, objective, rect.width);
    view.on('pointerdown', (event: FederatedPointerEvent) => this.beginPagePointer(page.id, event));
    return view;
  }

  private drawObjectiveMarker(view: Container, objective: 'treasure' | 'goal', pageSize: number): void {
    const collected = objective === 'treasure' && this.objectiveProgress.treasureCollected;
    const open = objective === 'goal' && this.objectiveProgress.treasureCollected;
    const marker = new Text({
      text: objective === 'treasure' ? (collected ? '◇' : '◆') : open ? 'EXIT' : 'LOCK',
      style: {
        fill: objective === 'treasure' ? COLORS.treasure : open ? COLORS.antiqueGold : COLORS.invalid,
        fontFamily: 'monospace',
        fontSize: objective === 'treasure' ? Math.max(14, pageSize * 0.18) : Math.max(7, pageSize * 0.075),
        fontWeight: '700',
      },
    });
    marker.anchor.set(1, 0);
    marker.position.set(pageSize - 6, 5);
    marker.alpha = collected ? 0.45 : 1;
    view.addChild(marker);
  }

  private drawTraveler(): void {
    const travelerPage = this.world.pages.find((page) => page.id === this.world.travelerPageId);
    if (!travelerPage) return;
    const rect = cellRect(this.layout, travelerPage.position);
    const traveler = new Graphics()
      .circle(rect.x + rect.width / 2, rect.y + rect.height / 2, Math.max(6, rect.width * 0.07))
      .fill(COLORS.antiqueGold)
      .stroke({ color: COLORS.ink, width: 2, alpha: 0.9 });
    traveler.zIndex = 30;
    this.addChild(traveler);
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
        fontSize: labelText.length === 1 ? 28 : 12,
        fontWeight: '700',
        letterSpacing: labelText.length > 1 ? 1.5 : 0,
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
      view.alpha = 0.86;
      view.zIndex = 50;
    }
    this.updateDropIndicator(event.global.x, event.global.y, drag.pageId);
  };

  private readonly handlePointerUp = (event: FederatedPointerEvent): void => {
    const drag = this.drag;
    if (this.moving || !drag || drag.pointerId !== event.pointerId) return;

    if (!drag.active) {
      const wasSelected = this.selectedPageId === drag.pageId;
      this.drag = null;
      if (wasSelected && drag.pageId !== this.world.travelerPageId && this.tryTravelTo(drag.pageId)) return;
      this.selectedPageId = drag.pageId;
      const travelHint = this.canTravelTo(drag.pageId) && drag.pageId !== this.world.travelerPageId
        ? ' · tap again to walk'
        : ' · use ↻ or drag to reshape the book';
      this.feedback = { tone: 'neutral', text: `${drag.pageId} selected${travelHint}` };
      this.renderScene();
      return;
    }

    const target = this.pageUnderPoint(event.global.x, event.global.y);
    if (!target || target.id === drag.pageId) {
      this.feedback = { tone: 'invalid', text: 'Swap cancelled · drop onto another page' };
      this.drag = null;
      this.renderScene();
      return;
    }

    try {
      this.world = swapPages(this.world, DEMO_DEFINITION_REGISTRY, drag.pageId, target.id);
      this.feedback = { tone: 'success', text: `Swapped ${drag.pageId} ↔ ${target.id}` };
    } catch (error) {
      this.feedback = { tone: 'invalid', text: readableError(error) };
    }
    this.drag = null;
    this.renderScene();
  };

  private canTravelTo(pageId: string): boolean {
    const graph = buildAdjacencyGraph(this.world, DEMO_DEFINITION_REGISTRY);
    return reachablePages(graph, this.world.travelerPageId).has(pageId);
  }

  private tryTravelTo(destinationPageId: string): boolean {
    const graph = buildAdjacencyGraph(this.world, DEMO_DEFINITION_REGISTRY);
    const path = shortestPath(graph, this.world.travelerPageId, destinationPageId);
    if (!path || path.length <= 1) return false;
    this.startTraversal(path);
    return true;
  }

  private startTraversal(path: readonly string[]): void {
    this.cancelTraversalTimer();
    this.moving = true;
    this.selectedPageId = path[path.length - 1] ?? null;
    this.feedback = { tone: 'neutral', text: `Walking ${Math.max(0, path.length - 1)} page${path.length === 2 ? '' : 's'}…` };
    this.renderScene();

    const steps = path.slice(1);
    const advance = (index: number) => {
      const pageId = steps[index];
      if (!pageId) {
        this.moving = false;
        if (!this.objectiveProgress.completed) {
          this.feedback = { tone: 'success', text: `Arrived at ${this.world.travelerPageId}` };
        }
        this.renderScene();
        return;
      }
      this.traversalTimer = window.setTimeout(() => {
        this.world = moveTravelerToPage(this.world, pageId);
        this.applyArrival(pageId);
        this.renderScene();
        if (this.objectiveProgress.completed) {
          this.moving = false;
          this.cancelTraversalTimer();
          this.renderScene();
          return;
        }
        advance(index + 1);
      }, TRAVEL_STEP_MS);
    };
    advance(0);
  }

  private applyArrival(pageId: string): void {
    const page = this.world.pages.find((candidate) => candidate.id === pageId);
    if (!page) return;
    const resolution = resolveObjectiveArrival(this.objectiveProgress, page);
    this.objectiveProgress = resolution.progress;
    switch (resolution.event) {
      case 'treasure-collected':
        this.feedback = { tone: 'success', text: 'Relic recovered · the EXIT seal is now open' };
        return;
      case 'goal-locked':
        this.feedback = { tone: 'invalid', text: 'EXIT sealed · recover the relic before leaving' };
        return;
      case 'completed':
        this.savedProgress = markLevelCompleted(this.savedProgress, DEMO_LEVEL.id);
        saveProgress(this.storage, this.savedProgress);
        this.feedback = { tone: 'success', text: 'Chapter complete · progress saved locally' };
        return;
      case 'none':
        return;
    }
  }

  private rotateSelected(): void {
    if (this.moving || this.objectiveProgress.completed || this.drag) return;
    if (!this.selectedPageId) {
      this.feedback = { tone: 'invalid', text: 'Select a page before rotating' };
      this.renderScene();
      return;
    }

    try {
      this.world = rotatePage(this.world, DEMO_DEFINITION_REGISTRY, this.selectedPageId);
      const page = this.world.pages.find((candidate) => candidate.id === this.selectedPageId);
      this.feedback = { tone: 'success', text: `Rotated ${this.selectedPageId} → ${page?.rotation ?? 0}°` };
    } catch (error) {
      this.feedback = { tone: 'invalid', text: readableError(error) };
    }
    this.renderScene();
  }

  private resetPuzzle(): void {
    if (this.moving) return;
    this.cancelTraversalTimer();
    this.world = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
    this.objectiveProgress = createObjectiveProgress();
    this.selectedPageId = this.world.travelerPageId;
    this.feedback = { tone: 'neutral', text: 'Puzzle reset · rotate the traveler page once to open the route' };
    this.renderScene();
  }

  private drawCompletionOverlay(): void {
    const panelWidth = Math.min(this.viewportWidth - this.layout.margin * 2, 310);
    const panelHeight = 92;
    const x = (this.viewportWidth - panelWidth) / 2;
    const y = this.layout.boardY + (this.layout.boardHeight - panelHeight) / 2;
    const overlay = new Container();
    overlay.zIndex = 80;
    overlay.addChild(
      new Graphics()
        .roundRect(x, y, panelWidth, panelHeight, 12)
        .fill({ color: COLORS.ink, alpha: 0.94 })
        .stroke({ color: COLORS.antiqueGold, width: 2, alpha: 0.9 }),
    );
    const title = new Text({
      text: 'CHAPTER COMPLETE',
      style: { fill: COLORS.parchment, fontFamily: 'monospace', fontSize: 15, fontWeight: '700', letterSpacing: 1.5 },
    });
    title.anchor.set(0.5);
    title.position.set(this.viewportWidth / 2, y + 31);
    overlay.addChild(title);
    const detail = new Text({
      text: 'Relic recovered · route restored · local save updated',
      style: { fill: COLORS.stone, fontFamily: 'monospace', fontSize: 9, align: 'center' },
    });
    detail.anchor.set(0.5);
    detail.position.set(this.viewportWidth / 2, y + 60);
    overlay.addChild(detail);
    this.addChild(overlay);
  }

  private updateDropIndicator(x: number, y: number, sourcePageId: string): void {
    const indicator = this.dropIndicator;
    if (!indicator || this.moving) return;
    indicator.clear();
    const target = this.pageUnderPoint(x, y);
    if (!target || target.id === sourcePageId) return;

    const source = this.world.pages.find((page) => page.id === sourcePageId);
    if (!source) return;
    const sourceDefinition = DEMO_DEFINITION_REGISTRY.get(source.definitionId);
    const targetDefinition = DEMO_DEFINITION_REGISTRY.get(target.definitionId);
    const legal = sourceDefinition?.canSwap !== false && targetDefinition?.canSwap !== false;
    const rect = cellRect(this.layout, target.position);
    indicator
      .roundRect(rect.x - 2, rect.y - 2, rect.width + 4, rect.height + 4, 7)
      .stroke({ color: legal ? COLORS.antiqueGold : COLORS.invalid, width: 3, alpha: 0.95 });
  }

  private pageUnderPoint(x: number, y: number): PageState | undefined {
    const position = gridPositionAtPoint(this.layout, x, y);
    return position ? pageAt(this.world, position) : undefined;
  }

  private cancelDrag(): void {
    this.drag = null;
    this.dropIndicator?.clear();
  }

  private cancelTraversalTimer(): void {
    if (this.traversalTimer !== null) window.clearTimeout(this.traversalTimer);
    this.traversalTimer = null;
  }

  private drawExit(graphics: Graphics, direction: Direction, pageSize: number, pathWidth: number, reachable: boolean): void {
    const centerX = pageSize / 2;
    const centerY = pageSize / 2;
    const half = pathWidth / 2;
    const fill = { color: COLORS.parchment, alpha: reachable ? 0.46 : 0.26 };
    switch (direction) {
      case 'N':
        graphics.rect(centerX - half, 0, pathWidth, pageSize / 2).fill(fill);
        return;
      case 'E':
        graphics.rect(centerX, centerY - half, pageSize / 2, pathWidth).fill(fill);
        return;
      case 'S':
        graphics.rect(centerX - half, centerY, pathWidth, pageSize / 2).fill(fill);
        return;
      case 'W':
        graphics.rect(0, centerY - half, pageSize / 2, pathWidth).fill(fill);
    }
  }
}

function readableError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
      .replace('Page cannot rotate:', 'Cannot rotate fixed page:')
      .replace('Page cannot swap:', 'Cannot swap fixed page:');
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
