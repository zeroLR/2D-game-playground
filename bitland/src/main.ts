import { Application, Container, Graphics, Text } from 'pixi.js';
import './style.css';

const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;
const BOOT_TIMEOUT_MS = 5000;

const hostElement = document.querySelector<HTMLElement>('#app');
if (!hostElement) throw new Error('Missing #app');
const host: HTMLElement = hostElement;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}

function makeWorld(): Container {
  const world = new Container();

  const sky = new Graphics().rect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT).fill(0x071314);
  world.addChild(sky);

  const far = new Graphics();
  for (let x = 0; x < LOGICAL_WIDTH; x += 48) {
    const h = 60 + ((x / 48) % 5) * 18;
    far.rect(x, 270 - h, 34, h).fill(0x0c2a2b);
  }
  world.addChild(far);

  const ground = new Graphics()
    .rect(0, 390, 960, 150).fill(0x102c22)
    .rect(0, 382, 420, 8).fill(0x6ecf78)
    .rect(420, 382, 300, 8).fill(0x59d7ea)
    .rect(720, 382, 240, 8).fill(0xff7a59);
  world.addChild(ground);

  const crystal = new Graphics()
    .poly([520, 382, 540, 315, 560, 382]).fill(0x6be8ff)
    .poly([548, 382, 566, 336, 584, 382]).fill(0xb9f7ff);
  world.addChild(crystal);

  const synthesis = new Graphics()
    .rect(800, 292, 72, 90).fill(0x25171c)
    .rect(808, 300, 56, 74).stroke({ color: 0xff8b68, width: 3 })
    .poly([836, 320, 852, 350, 820, 350]).stroke({ color: 0xffa27e, width: 3 });
  world.addChild(synthesis);

  const title = new Text({
    text: 'BITLAND // P0.0',
    style: { fill: 0xb8fff4, fontFamily: 'monospace', fontSize: 18 },
  });
  title.position.set(24, 22);
  world.addChild(title);

  const hint = new Text({
    text: 'A/D move  ·  SPACE jump  ·  world simulation pending',
    style: { fill: 0x78a9a2, fontFamily: 'monospace', fontSize: 13 },
  });
  hint.position.set(24, 50);
  world.addChild(hint);

  return world;
}

function makePlayer(): Container {
  const player = new Container();
  const body = new Graphics()
    .rect(-10, -16, 20, 24).fill(0x0c1517)
    .rect(-8, -14, 16, 10).stroke({ color: 0xb8fff4, width: 2 })
    .rect(-4, -10, 3, 3).fill(0xb8fff4)
    .rect(3, -10, 3, 3).fill(0xb8fff4)
    .rect(-7, 8, 5, 10).fill(0x6ecf78)
    .rect(2, 8, 5, 10).fill(0x6ecf78);
  player.addChild(body);
  player.position.set(180, 364);
  return player;
}

async function bootstrap(): Promise<void> {
  console.info('[Bitland] renderer bootstrap started');
  const app = new Application();

  try {
    await withTimeout(
      app.init({
        width: LOGICAL_WIDTH,
        height: LOGICAL_HEIGHT,
        background: '#071314',
        antialias: false,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      }),
      BOOT_TIMEOUT_MS,
      'PixiJS renderer initialization',
    );

    host.replaceChildren(app.canvas);
    console.info('[Bitland] renderer ready; canvas mounted');

    const world = makeWorld();
    const player = makePlayer();
    world.addChild(player);
    app.stage.addChild(world);

    const keys = new Set<string>();
    let velocityY = 0;
    let grounded = true;

    window.addEventListener('keydown', (event) => {
      keys.add(event.code);
      if (event.code === 'Space') event.preventDefault();
    });
    window.addEventListener('keyup', (event) => keys.delete(event.code));

    app.ticker.add((ticker) => {
      const dt = Math.min(ticker.deltaMS / 1000, 0.05);
      const axis = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
      player.x = Math.max(18, Math.min(LOGICAL_WIDTH - 18, player.x + axis * 190 * dt));

      if (grounded && keys.has('Space')) {
        velocityY = -330;
        grounded = false;
      }

      if (!grounded) {
        velocityY += 900 * dt;
        player.y += velocityY * dt;
        if (player.y >= 364) {
          player.y = 364;
          velocityY = 0;
          grounded = true;
        }
      }
    });

    const resize = () => {
      const scale = Math.min(window.innerWidth / LOGICAL_WIDTH, window.innerHeight / LOGICAL_HEIGHT);
      app.canvas.style.width = `${Math.floor(LOGICAL_WIDTH * scale)}px`;
      app.canvas.style.height = `${Math.floor(LOGICAL_HEIGHT * scale)}px`;
    };

    window.addEventListener('resize', resize);
    resize();
    console.info('[Bitland] application bootstrap complete');
  } catch (error) {
    console.error('[Bitland] renderer bootstrap failed', error);
    host.dataset.bootstrapError = 'renderer';
    host.innerHTML = '<section class="bootstrap-error"><strong>BITLAND BOOT FAILURE</strong><span>Unable to initialize the game renderer. Check the browser console for diagnostics.</span></section>';
  }
}

void bootstrap();
