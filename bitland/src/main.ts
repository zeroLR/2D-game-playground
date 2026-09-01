import { Application, Container, Graphics, Text } from 'pixi.js';
import { createCameraState, stepCamera } from './simulation/player/camera';
import { createLocomotionState, stepLocomotion } from './simulation/player/locomotion';
import './style.css';

const LOGICAL_WIDTH = 960;
const LOGICAL_HEIGHT = 540;
const WORLD_WIDTH = 1920;
const BOOT_TIMEOUT_MS = 5000;
const GROUND_Y = 364;
const PLAYER_MIN_X = 18;
const PLAYER_MAX_X = WORLD_WIDTH - 18;

type Platform = { x: number; y: number; width: number };
const PLATFORMS: Platform[] = [
  { x: 510, y: 310, width: 150 },
  { x: 760, y: 278, width: 130 },
  { x: 1120, y: 325, width: 180 },
  { x: 1420, y: 292, width: 150 },
];

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

  const sky = new Graphics().rect(0, 0, WORLD_WIDTH, LOGICAL_HEIGHT).fill(0x071314);
  world.addChild(sky);

  const far = new Graphics();
  for (let x = 0; x < WORLD_WIDTH; x += 48) {
    const h = 60 + ((x / 48) % 5) * 18;
    far.rect(x, 270 - h, 34, h).fill(x < 640 ? 0x0c2a2b : x < 1280 ? 0x10263a : 0x30191f);
  }
  world.addChild(far);

  const ground = new Graphics()
    .rect(0, 390, WORLD_WIDTH, 150).fill(0x102126)
    .rect(0, 382, 640, 8).fill(0x6ecf78)
    .rect(640, 382, 640, 8).fill(0x59d7ea)
    .rect(1280, 382, 640, 8).fill(0xff7a59);
  world.addChild(ground);

  const platformGraphics = new Graphics();
  for (const platform of PLATFORMS) {
    platformGraphics
      .rect(platform.x, platform.y + 18, platform.width, 18).fill(0x102126)
      .rect(platform.x, platform.y + 14, platform.width, 4).fill(0xb8fff4);
  }
  world.addChild(platformGraphics);

  const crystals = new Graphics();
  for (let x = 700; x < 1260; x += 180) {
    crystals
      .poly([x, 382, x + 18, 318, x + 38, 382]).fill(0x6be8ff)
      .poly([x + 30, 382, x + 45, 340, x + 62, 382]).fill(0xb9f7ff);
  }
  world.addChild(crystals);

  const synthesis = new Graphics()
    .rect(1630, 292, 72, 90).fill(0x25171c)
    .rect(1638, 300, 56, 74).stroke({ color: 0xff8b68, width: 3 })
    .poly([1666, 320, 1682, 350, 1650, 350]).stroke({ color: 0xffa27e, width: 3 });
  world.addChild(synthesis);

  for (let x = 120; x < WORLD_WIDTH; x += 140) {
    const glyph = new Text({
      text: x % 280 === 0 ? '1' : '0',
      style: { fill: x < 640 ? 0x497f65 : x < 1280 ? 0x44758c : 0x8d493f, fontFamily: 'monospace', fontSize: 18 },
    });
    glyph.position.set(x, 120 + (x % 4) * 28);
    world.addChild(glyph);
  }

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
  padBase.on('pointerdown', (event) => { padPointerId = event.pointerId; updatePad(event.global.x, event.global.y); });
  padBase.on('pointermove', (event) => { if (padPointerId === event.pointerId) updatePad(event.global.x, event.global.y); });
  padBase.on('pointerup', (event) => { if (padPointerId === event.pointerId) resetPad(); });
  padBase.on('pointerupoutside', (event) => { if (padPointerId === event.pointerId) resetPad(); });

  const makeActionButton = (name: ActionName, x: number, y: number, radius: number, color: number, onPress: () => void, onRelease?: () => void) => {
    const button = new Container();
    button.position.set(x, y);
    button.eventMode = 'static';
    const ring = new Graphics()
      .circle(0, 0, radius).fill({ color: 0x071314, alpha: 0.52 })
      .circle(0, 0, radius).stroke({ color, width: 2, alpha: 0.72 });
    button.addChild(ring);
    const label = new Text({ text: name, style: { fill: color, fontFamily: 'monospace', fontSize: name === 'JUMP' ? 13 : 11, fontWeight: '700' } });
    label.anchor.set(0.5);
    button.addChild(label);
    const setPressed = (pressed: boolean) => { button.scale.set(pressed ? 0.9 : 1); ring.alpha = pressed ? 1 : 0.82; };
    button.on('pointerdown', () => { setPressed(true); onPress(); });
    const release = () => { setPressed(false); onRelease?.(); };
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

function makeStatusHud(): Container {
  const hud = new Container();
  hud.zIndex = 110;
  const title = new Text({ text: 'BITLAND // P0.1 MOVEMENT + CAMERA', style: { fill: 0xb8fff4, fontFamily: 'monospace', fontSize: 18 } });
  title.position.set(24, 22);
  hud.addChild(title);
  const hint = new Text({ text: 'virtual pad · jump · dodge  // test acceleration, air control and camera look-ahead', style: { fill: 0x78a9a2, fontFamily: 'monospace', fontSize: 12 } });
  hint.position.set(24, 50);
  hud.addChild(hint);
  return hud;
}

function landOnPlatforms(previousY: number, locomotion: ReturnType<typeof createLocomotionState>): void {
  if (locomotion.vy < 0) return;
  for (const platform of PLATFORMS) {
    const withinX = locomotion.x >= platform.x - 8 && locomotion.x <= platform.x + platform.width + 8;
    const crossedTop = previousY <= platform.y && locomotion.y >= platform.y;
    if (withinX && crossedTop) {
      locomotion.y = platform.y;
      locomotion.vy = 0;
      locomotion.grounded = true;
      return;
    }
  }
}

async function bootstrap(): Promise<void> {
  console.info('[Bitland] renderer bootstrap started');
  const app = new Application();

  try {
    await withTimeout(app.init({
      width: LOGICAL_WIDTH,
      height: LOGICAL_HEIGHT,
      background: '#071314',
      antialias: false,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    }), BOOT_TIMEOUT_MS, 'PixiJS renderer initialization');

    host.replaceChildren(app.canvas);
    console.info('[Bitland] renderer ready; canvas mounted');
    app.stage.sortableChildren = true;
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;

    const world = makeWorld();
    const player = makePlayer();
    const locomotion = createLocomotionState(180, GROUND_Y);
    const camera = createCameraState();
    player.position.set(locomotion.x, locomotion.y);
    world.addChild(player);
    app.stage.addChild(world);

    const mobileInput: MobileInputState = { moveX: 0, moveY: 0, jumpPressed: false, attackHeld: false, guardHeld: false, dodgePressed: false };
    app.stage.addChild(makeMobileControls(mobileInput));
    app.stage.addChild(makeStatusHud());

    const keys = new Set<string>();
    let keyboardJumpPressed = false;
    let dodgeCooldown = 0;
    window.addEventListener('keydown', (event) => {
      keys.add(event.code);
      if (event.code === 'Space' && !event.repeat) keyboardJumpPressed = true;
      if (event.code === 'Space') event.preventDefault();
    });
    window.addEventListener('keyup', (event) => keys.delete(event.code));

    app.ticker.add((ticker) => {
      const dt = Math.min(ticker.deltaMS / 1000, 0.05);
      dodgeCooldown = Math.max(0, dodgeCooldown - dt);
      const keyboardAxis = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
      const axis = Math.abs(mobileInput.moveX) > 0.01 ? mobileInput.moveX : keyboardAxis;
      const previousY = locomotion.y;

      stepLocomotion(locomotion, {
        moveX: axis,
        jumpPressed: mobileInput.jumpPressed || keyboardJumpPressed,
        guardHeld: mobileInput.guardHeld,
      }, dt, GROUND_Y, PLAYER_MIN_X, PLAYER_MAX_X);
      mobileInput.jumpPressed = false;
      keyboardJumpPressed = false;
      landOnPlatforms(previousY, locomotion);

      if (mobileInput.dodgePressed && dodgeCooldown <= 0 && Math.abs(axis) > 0.1) {
        locomotion.x = Math.max(PLAYER_MIN_X, Math.min(PLAYER_MAX_X, locomotion.x + Math.sign(axis) * 58));
        locomotion.vx = Math.sign(axis) * 260;
        dodgeCooldown = 0.5;
      }
      mobileInput.dodgePressed = false;

      player.position.set(locomotion.x, locomotion.y);
      player.scale.x = locomotion.facing;
      player.scale.y = 1;
      player.alpha = mobileInput.guardHeld ? 0.72 : 1;
      if (mobileInput.attackHeld) player.scale.y = 1.06;

      stepCamera(camera, locomotion.x, locomotion.vx, dt, {
        viewportWidth: LOGICAL_WIDTH,
        worldWidth: WORLD_WIDTH,
        deadZoneHalfWidth: 120,
        lookAheadDistance: 90,
        followSharpness: 8,
        lookAheadSharpness: 6,
      });
      world.x = -Math.round(camera.x);
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
