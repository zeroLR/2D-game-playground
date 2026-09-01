import { Application, Container, Graphics, Text } from 'pixi.js';
import './style.css';

const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;
const BOOT_TIMEOUT_MS = 5000;
const GROUND_Y = 364;

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
    text: 'BITLAND // P0.1 MOBILE INPUT',
    style: { fill: 0xb8fff4, fontFamily: 'monospace', fontSize: 18 },
  });
  title.position.set(24, 22);
  world.addChild(title);

  const hint = new Text({
    text: 'LEFT PAD move  ·  RIGHT ACTIONS  ·  keyboard retained for desktop testing',
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
  player.position.set(180, GROUND_Y);
  return player;
}

type MobileInputState = {
  moveX: number;
  moveY: number;
  jumpPressed: boolean;
  attackHeld: boolean;
  guardHeld: boolean;
  dodgePressed: boolean;
};

type ActionName = 'JUMP' | 'ATK' | 'GUARD' | 'DODGE';

function makeMobileControls(input: MobileInputState): Container {
  const hud = new Container();
  hud.zIndex = 100;

  const padRadius = 62;
  const knobRadius = 25;
  const padCenter = { x: 104, y: LOGICAL_HEIGHT - 96 };

  const padBase = new Graphics()
    .circle(0, 0, padRadius).fill({ color: 0x071314, alpha: 0.5 })
    .circle(0, 0, padRadius).stroke({ color: 0x7be6d6, width: 2, alpha: 0.55 })
    .moveTo(-38, 0).lineTo(38, 0).stroke({ color: 0x7be6d6, width: 1, alpha: 0.22 })
    .moveTo(0, -38).lineTo(0, 38).stroke({ color: 0x7be6d6, width: 1, alpha: 0.22 });
  padBase.position.set(padCenter.x, padCenter.y);
  padBase.eventMode = 'static';
  padBase.cursor = 'pointer';
  hud.addChild(padBase);

  const knob = new Graphics()
    .circle(0, 0, knobRadius).fill({ color: 0x6ecf78, alpha: 0.28 })
    .circle(0, 0, knobRadius).stroke({ color: 0xb8fff4, width: 2, alpha: 0.8 });
  knob.position.set(padCenter.x, padCenter.y);
  hud.addChild(knob);

  let padPointerId: number | null = null;

  const updatePad = (globalX: number, globalY: number) => {
    const dx = globalX - padCenter.x;
    const dy = globalY - padCenter.y;
    const distance = Math.hypot(dx, dy);
    const clamped = Math.min(distance, padRadius);
    const nx = distance > 0 ? dx / distance : 0;
    const ny = distance > 0 ? dy / distance : 0;
    knob.position.set(padCenter.x + nx * clamped, padCenter.y + ny * clamped);
    input.moveX = Math.abs(dx / padRadius) < 0.16 ? 0 : Math.max(-1, Math.min(1, dx / padRadius));
    input.moveY = Math.abs(dy / padRadius) < 0.16 ? 0 : Math.max(-1, Math.min(1, dy / padRadius));
  };

  const resetPad = () => {
    padPointerId = null;
    knob.position.set(padCenter.x, padCenter.y);
    input.moveX = 0;
    input.moveY = 0;
  };

  padBase.on('pointerdown', (event) => {
    padPointerId = event.pointerId;
    updatePad(event.global.x, event.global.y);
  });
  padBase.on('pointermove', (event) => {
    if (padPointerId === event.pointerId) updatePad(event.global.x, event.global.y);
  });
  padBase.on('pointerup', (event) => {
    if (padPointerId === event.pointerId) resetPad();
  });
  padBase.on('pointerupoutside', (event) => {
    if (padPointerId === event.pointerId) resetPad();
  });

  const makeActionButton = (
    name: ActionName,
    x: number,
    y: number,
    radius: number,
    color: number,
    onPress: () => void,
    onRelease?: () => void,
  ) => {
    const button = new Container();
    button.position.set(x, y);
    button.eventMode = 'static';
    button.cursor = 'pointer';

    const ring = new Graphics()
      .circle(0, 0, radius).fill({ color: 0x071314, alpha: 0.52 })
      .circle(0, 0, radius).stroke({ color, width: 2, alpha: 0.72 });
    button.addChild(ring);

    const label = new Text({
      text: name,
      style: { fill: color, fontFamily: 'monospace', fontSize: name === 'JUMP' ? 13 : 11, fontWeight: '700' },
    });
    label.anchor.set(0.5);
    button.addChild(label);

    const setPressed = (pressed: boolean) => {
      button.scale.set(pressed ? 0.9 : 1);
      ring.alpha = pressed ? 1 : 0.82;
    };

    button.on('pointerdown', () => {
      setPressed(true);
      onPress();
    });
    const release = () => {
      setPressed(false);
      onRelease?.();
    };
    button.on('pointerup', release);
    button.on('pointerupoutside', release);
    button.on('pointercancel', release);

    hud.addChild(button);
  };

  makeActionButton('JUMP', 856, 433, 42, 0xb8fff4, () => { input.jumpPressed = true; });
  makeActionButton('ATK', 782, 472, 32, 0xffb36b, () => { input.attackHeld = true; }, () => { input.attackHeld = false; });
  makeActionButton('GUARD', 852, 505, 28, 0x6be8ff, () => { input.guardHeld = true; }, () => { input.guardHeld = false; });
  makeActionButton('DODGE', 914, 476, 29, 0xd0a6ff, () => { input.dodgePressed = true; });

  return hud;
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

    app.stage.sortableChildren = true;
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;

    const world = makeWorld();
    const player = makePlayer();
    world.addChild(player);
    app.stage.addChild(world);

    const mobileInput: MobileInputState = {
      moveX: 0,
      moveY: 0,
      jumpPressed: false,
      attackHeld: false,
      guardHeld: false,
      dodgePressed: false,
    };
    app.stage.addChild(makeMobileControls(mobileInput));

    const keys = new Set<string>();
    let velocityY = 0;
    let grounded = true;
    let dodgeCooldown = 0;

    window.addEventListener('keydown', (event) => {
      keys.add(event.code);
      if (event.code === 'Space') event.preventDefault();
    });
    window.addEventListener('keyup', (event) => keys.delete(event.code));

    app.ticker.add((ticker) => {
      const dt = Math.min(ticker.deltaMS / 1000, 0.05);
      dodgeCooldown = Math.max(0, dodgeCooldown - dt);

      const keyboardAxis = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
      const axis = Math.abs(mobileInput.moveX) > 0.01 ? mobileInput.moveX : keyboardAxis;
      const speedMultiplier = mobileInput.guardHeld ? 0.42 : 1;
      player.x = Math.max(18, Math.min(LOGICAL_WIDTH - 18, player.x + axis * 190 * speedMultiplier * dt));

      const wantsJump = mobileInput.jumpPressed || keys.has('Space');
      if (grounded && wantsJump) {
        velocityY = -330;
        grounded = false;
      }
      mobileInput.jumpPressed = false;

      if (mobileInput.dodgePressed && dodgeCooldown <= 0 && Math.abs(axis) > 0.1) {
        player.x = Math.max(18, Math.min(LOGICAL_WIDTH - 18, player.x + Math.sign(axis) * 46));
        dodgeCooldown = 0.5;
      }
      mobileInput.dodgePressed = false;

      player.alpha = mobileInput.guardHeld ? 0.72 : 1;
      player.scale.set(mobileInput.attackHeld ? 1.06 : 1);

      if (!grounded) {
        velocityY += 900 * dt;
        player.y += velocityY * dt;
        if (player.y >= GROUND_Y) {
          player.y = GROUND_Y;
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
