import { Container, FederatedPointerEvent, Graphics, Rectangle, Text } from 'pixi.js';
import { CARDINAL_DIRECTIONS, type Direction, type PageState, type WorldState } from '../domain/model';
import { DEMO_DEFINITION_REGISTRY, DEMO_LEVEL } from '../domain/demo-level';
import {
  buildAdjacencyGraph,
  pageAt,
  reachablePages,
  resetLevel,
  rotatePage,
  rotatedPageExits,
  swapPages,
} from '../domain/world';
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
};

const DRAG_THRESHOLD = 9;

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
  private feedback: FeedbackState = { tone: 'neutral', text: 'Tap a page to select · drag it onto another page to swap' };
  private viewportWidth: number;
  private viewportHeight: number;
  private layout: BoardLayout;
  private drag: DragState | null = null;
  private pageViews = new Map<string, Container>();
  private dropIndicator: Graphics | null = null;

  constructor(width: number, height: number) {
    super();
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.layout = computeBoardLayout(width, height, this.world.width, this.world.height);
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
      text: 'PAPER TRAILS  ·  P2 MOBILE MANIPULATION',
      style: {
        fill: COLORS.antiqueGold,
        fontFamily: 'monospace',
        fontSize: Math.max(9, Math.round(width * 0.024)),
        letterSpacing: 1.2,
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

    const graph = buildAdjacencyGraph(this.world, DEMO_DEFINITION_REGISTRY);
    const reachable = reachablePages(graph, this.world.travelerPageId);

    for (const page of this.world.pages) {
      const view = this.createPageView(page, reachable.has(page.id));
      this.pageViews.set(page.id, view);
      this.addChild(view);
    }

    const travelerPage = this.world.pages.find((page) => page.id === this.world.travelerPageId);
    if (travelerPage) {
      const rect = cellRect(this.layout, travelerPage.position);
      const traveler = new Graphics()
        .circle(rect.x + rect.width / 2, rect.y + rect.height / 2, Math.max(5, rect.width * 0.065))
        .fill(COLORS.antiqueGold)
        .stroke({ color: COLORS.ink, width: 2, alpha: 0.8 });
      traveler.zIndex = 25;
      this.addChild(traveler);
    }

    this.dropIndicator = new Graphics();
    this.dropIndicator.zIndex = 45;
    this.addChild(this.dropIndicator);

    this.addChild(this.createControlButton(this.layout.rotateButton, '↻', 'Rotate selected page', () => this.rotateSelected()));
    this.addChild(this.createControlButton(this.layout.resetButton, 'RESET', 'Reset puzzle', () => this.resetPuzzle()));

    const selected = this.selectedPageId ? this.world.pages.find((page) => page.id === this.selectedPageId) : undefined;
    const selectedDefinition = selected ? DEMO_DEFINITION_REGISTRY.get(selected.definitionId) : undefined;
    const selectionStatus = selected
      ? `${selected.id} · ${selected.rotation}°${selectedDefinition?.canSwap === false ? ' · FIXED' : ''}`
      : 'No page selected';
    const status = new Text({
      text: `${reachable.size}/${this.world.pages.length} reachable  ·  ${selectionStatus}  ·  rev ${this.world.revision}`,
      style: {
        fill: COLORS.stone,
        fontFamily: 'monospace',
        fontSize: Math.max(9, Math.round(width * 0.023)),
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
  }

  private createPageView(page: PageState, reachable: boolean): Container {
    const rect = cellRect(this.layout, page.position);
    const view = new Container();
    view.position.set(rect.x, rect.y);
    view.eventMode = 'static';
    view.cursor = 'pointer';
    view.hitArea = new Rectangle(0, 0, rect.width, rect.height);
    view.zIndex = 10;

    const selected = page.id === this.selectedPageId;
    const definition = DEMO_DEFINITION_REGISTRY.get(page.definitionId);
    const fixed = definition?.canSwap === false;
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

    view.on('pointerdown', (event: FederatedPointerEvent) => this.beginPagePointer(page.id, event));
    return view;
  }

  private createControlButton(
    rect: { readonly x: number; readonly y: number; readonly width: number; readonly height: number },
    labelText: string,
    ariaDescription: string,
    onTap: () => void,
  ): Container {
    const button = new Container();
    button.position.set(rect.x, rect.y);
    button.eventMode = 'static';
    button.cursor = 'pointer';
    button.hitArea = new Rectangle(0, 0, rect.width, rect.height);
    button.zIndex = 30;
    button.label = ariaDescription;
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
    button.on('pointertap', (event: FederatedPointerEvent) => {
      event.stopPropagation();
      onTap();
    });
    return button;
  }

  private beginPagePointer(pageId: string, event: FederatedPointerEvent): void {
    if (this.drag) return;
    const page = this.world.pages.find((candidate) => candidate.id === pageId);
    if (!page) return;
    const rect = cellRect(this.layout, page.position);
    this.selectedPageId = pageId;
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
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.global.x - drag.startX;
    const dy = event.global.y - drag.startY;
    if (!drag.active && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    drag.active = true;

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
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (!drag.active) {
      this.feedback = { tone: 'neutral', text: `${drag.pageId} selected · use ↻ to rotate or drag to swap` };
      this.drag = null;
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

  private rotateSelected(): void {
    if (this.drag) return;
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
    if (this.drag) return;
    this.world = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
    this.selectedPageId = this.world.travelerPageId;
    this.feedback = { tone: 'neutral', text: 'Puzzle reset to authored state' };
    this.renderScene();
  }

  private updateDropIndicator(x: number, y: number, sourcePageId: string): void {
    const indicator = this.dropIndicator;
    if (!indicator) return;
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
