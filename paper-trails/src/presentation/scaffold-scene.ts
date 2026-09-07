import { Container, Graphics, Text } from 'pixi.js';

const COLORS = {
  ink: 0x121917,
  inkRaised: 0x1b2421,
  moss: 0x34443c,
  stone: 0x777365,
  parchment: 0xd8c7a3,
  antiqueGold: 0xa8874c,
};

export function createScaffoldScene(width: number, height: number): Container {
  const root = new Container();
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
    text: 'PAPER TRAILS  ·  P0 SCAFFOLD',
    style: {
      fill: COLORS.antiqueGold,
      fontFamily: 'monospace',
      fontSize: Math.max(9, Math.round(width * 0.027)),
      letterSpacing: 2,
    },
  });
  subtitle.position.set(margin, margin + Math.max(42, width * 0.11));
  root.addChild(subtitle);

  const bookWidth = width - margin * 2;
  const bookTop = Math.max(112, height * 0.19);
  const bookHeight = Math.min(bookWidth * 1.18, height * 0.58);
  const book = new Graphics()
    .roundRect(margin, bookTop, bookWidth, bookHeight, 16)
    .fill(COLORS.inkRaised)
    .stroke({ color: COLORS.antiqueGold, width: 1, alpha: 0.55 });
  root.addChild(book);

  const boardInset = Math.max(16, Math.round(bookWidth * 0.07));
  const boardSize = Math.min(bookWidth - boardInset * 2, bookHeight - boardInset * 2);
  const gap = Math.max(4, Math.floor(boardSize * 0.018));
  const pageSize = Math.floor((boardSize - gap * 2) / 3);
  const boardX = Math.round((width - (pageSize * 3 + gap * 2)) / 2);
  const boardY = Math.round(bookTop + (bookHeight - (pageSize * 3 + gap * 2)) / 2);

  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const x = boardX + column * (pageSize + gap);
      const y = boardY + row * (pageSize + gap);
      const page = new Graphics()
        .roundRect(x, y, pageSize, pageSize, 5)
        .fill((row + column) % 2 === 0 ? 0x3d473f : 0x45483f)
        .stroke({ color: COLORS.stone, width: 1, alpha: 0.55 });
      root.addChild(page);

      const pathWidth = Math.max(4, Math.round(pageSize * 0.12));
      const path = new Graphics()
        .rect(x + Math.round(pageSize / 2 - pathWidth / 2), y + 4, pathWidth, pageSize - 8)
        .fill({ color: COLORS.parchment, alpha: 0.34 });
      if ((row + column) % 3 === 1) {
        path
          .rect(x + 4, y + Math.round(pageSize / 2 - pathWidth / 2), pageSize - 8, pathWidth)
          .fill({ color: COLORS.parchment, alpha: 0.34 });
      }
      root.addChild(path);
    }
  }

  const traveler = new Graphics()
    .circle(boardX + pageSize / 2, boardY + pageSize * 2.5 + gap * 2, Math.max(4, pageSize * 0.07))
    .fill(COLORS.antiqueGold);
  root.addChild(traveler);

  const status = new Text({
    text: 'Renderer ready · world graph begins in P1',
    style: {
      fill: COLORS.stone,
      fontFamily: 'monospace',
      fontSize: Math.max(10, Math.round(width * 0.028)),
      align: 'center',
    },
  });
  status.anchor.set(0.5, 1);
  status.position.set(width / 2, height - Math.max(24, margin));
  root.addChild(status);

  return root;
}
