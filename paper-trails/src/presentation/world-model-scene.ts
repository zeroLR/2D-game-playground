import { Container, Graphics, Text } from 'pixi.js';
import { CARDINAL_DIRECTIONS, type Direction, type PageState } from '../domain/model';
import { DEMO_DEFINITION_REGISTRY, DEMO_LEVEL } from '../domain/demo-level';
import { buildAdjacencyGraph, reachablePages, resetLevel, rotatedPageExits } from '../domain/world';

const COLORS = {
  ink: 0x121917,
  inkRaised: 0x1b2421,
  paperDark: 0x343a34,
  paperLight: 0x41433b,
  stone: 0x777365,
  parchment: 0xd8c7a3,
  antiqueGold: 0xa8874c,
};

export function createWorldModelScene(width: number, height: number): Container {
  const root = new Container();
  const world = resetLevel(DEMO_LEVEL, DEMO_DEFINITION_REGISTRY);
  const graph = buildAdjacencyGraph(world, DEMO_DEFINITION_REGISTRY);
  const reachable = reachablePages(graph, world.travelerPageId);

  root.addChild(new Graphics().rect(0, 0, width, height).fill(COLORS.ink));

  const margin = Math.max(18, Math.round(width * 0.06));
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
  title.position.set(margin, margin);
  root.addChild(title);

  const subtitle = new Text({
    text: 'PAPER TRAILS  ·  P1 WORLD MODEL',
    style: {
      fill: COLORS.antiqueGold,
      fontFamily: 'monospace',
      fontSize: Math.max(9, Math.round(width * 0.026)),
      letterSpacing: 1.5,
    },
  });
  subtitle.position.set(margin, margin + Math.max(42, width * 0.11));
  root.addChild(subtitle);

  const bookWidth = width - margin * 2;
  const bookTop = Math.max(112, height * 0.19);
  const bookHeight = Math.min(bookWidth * 1.18, height * 0.58);
  root.addChild(
    new Graphics()
      .roundRect(margin, bookTop, bookWidth, bookHeight, 16)
      .fill(COLORS.inkRaised)
      .stroke({ color: COLORS.stone, width: 1, alpha: 0.65 }),
  );

  const boardInset = Math.max(16, Math.round(bookWidth * 0.07));
  const boardSize = Math.min(bookWidth - boardInset * 2, bookHeight - boardInset * 2);
  const gap = Math.max(4, Math.floor(boardSize * 0.018));
  const pageSize = Math.floor((boardSize - gap * 2) / 3);
  const boardX = Math.round((width - (pageSize * 3 + gap * 2)) / 2);
  const boardY = Math.round(bookTop + (bookHeight - (pageSize * 3 + gap * 2)) / 2);

  for (const page of world.pages) {
    drawPage(root, page, pageSize, gap, boardX, boardY, reachable.has(page.id));
  }

  const travelerPage = world.pages.find((page) => page.id === world.travelerPageId);
  if (travelerPage) {
    const x = boardX + travelerPage.position.column * (pageSize + gap) + pageSize / 2;
    const y = boardY + travelerPage.position.row * (pageSize + gap) + pageSize / 2;
    root.addChild(new Graphics().circle(x, y, Math.max(5, pageSize * 0.07)).fill(COLORS.antiqueGold));
  }

  const status = new Text({
    text: `deterministic graph  ·  ${reachable.size}/${world.pages.length} reachable  ·  revision ${world.revision}`,
    style: {
      fill: COLORS.stone,
      fontFamily: 'monospace',
      fontSize: Math.max(10, Math.round(width * 0.027)),
      align: 'center',
    },
  });
  status.anchor.set(0.5, 1);
  status.position.set(width / 2, height - Math.max(24, margin));
  root.addChild(status);

  return root;
}

function drawPage(
  root: Container,
  page: PageState,
  pageSize: number,
  gap: number,
  boardX: number,
  boardY: number,
  reachable: boolean,
): void {
  const x = boardX + page.position.column * (pageSize + gap);
  const y = boardY + page.position.row * (pageSize + gap);
  root.addChild(
    new Graphics()
      .roundRect(x, y, pageSize, pageSize, 5)
      .fill((page.position.row + page.position.column) % 2 === 0 ? COLORS.paperDark : COLORS.paperLight)
      .stroke({ color: reachable ? COLORS.parchment : COLORS.stone, width: reachable ? 2 : 1, alpha: reachable ? 0.7 : 0.45 }),
  );

  const exits = new Set(rotatedPageExits(page, DEMO_DEFINITION_REGISTRY));
  const centerX = x + pageSize / 2;
  const centerY = y + pageSize / 2;
  const pathWidth = Math.max(4, Math.round(pageSize * 0.12));
  const path = new Graphics().circle(centerX, centerY, pathWidth * 0.55).fill({ color: COLORS.parchment, alpha: 0.42 });

  for (const direction of CARDINAL_DIRECTIONS) {
    if (!exits.has(direction)) continue;
    drawExit(path, direction, x, y, pageSize, pathWidth);
  }
  root.addChild(path);

  const label = new Text({
    text: `${page.id} · ${page.rotation}°`,
    style: { fill: COLORS.stone, fontFamily: 'monospace', fontSize: Math.max(7, pageSize * 0.09) },
  });
  label.position.set(x + 5, y + 4);
  root.addChild(label);
}

function drawExit(
  graphics: Graphics,
  direction: Direction,
  x: number,
  y: number,
  pageSize: number,
  pathWidth: number,
): void {
  const centerX = x + pageSize / 2;
  const centerY = y + pageSize / 2;
  const half = pathWidth / 2;
  switch (direction) {
    case 'N':
      graphics.rect(centerX - half, y, pathWidth, pageSize / 2).fill({ color: COLORS.parchment, alpha: 0.42 });
      return;
    case 'E':
      graphics.rect(centerX, centerY - half, pageSize / 2, pathWidth).fill({ color: COLORS.parchment, alpha: 0.42 });
      return;
    case 'S':
      graphics.rect(centerX - half, centerY, pathWidth, pageSize / 2).fill({ color: COLORS.parchment, alpha: 0.42 });
      return;
    case 'W':
      graphics.rect(x, centerY - half, pageSize / 2, pathWidth).fill({ color: COLORS.parchment, alpha: 0.42 });
  }
}
