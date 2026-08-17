import { AnimatedSprite, Assets, Container, Graphics, type Texture } from 'pixi.js';
import { resolveNovaAnimationState, type NovaAnimationState } from './NovaAnimationState';
import { NOVA_FRAME_SCALE } from './NovaSpriteLayout';
import { redrawPlayer } from './visuals';

const FRAME_ANCHOR_Y = 0.5;
const VISUAL_Y_OFFSET = -8;

const NOVA_FRAME_URLS: Record<NovaAnimationState, string[]> = {
  idle: [1, 2, 3, 4].map((frame) => new URL(`../game/assets/nova/idle/idle-0${frame}.png`, import.meta.url).href),
  jump: [1, 2, 3].map((frame) => new URL(`../game/assets/nova/jump/jump-0${frame}.png`, import.meta.url).href),
  fall: [1, 2, 3, 4].map((frame) => new URL(`../game/assets/nova/fall/fall-0${frame}.png`, import.meta.url).href),
  'dash-left': [1, 2, 3, 4, 5, 6].map((frame) => new URL(`../game/assets/nova/dash_left/dash_left-0${frame}.png`, import.meta.url).href),
  'dash-right': [1, 2, 3, 4, 5, 6].map((frame) => new URL(`../game/assets/nova/dash_right/dash_right-0${frame}.png`, import.meta.url).href),
};

const ANIMATION_SPEED: Record<NovaAnimationState, number> = { idle: 0.08, jump: 0.14, fall: 0.12, 'dash-left': 0.62, 'dash-right': 0.62 };
const LOOPING: Record<NovaAnimationState, boolean> = { idle: true, jump: false, fall: true, 'dash-left': false, 'dash-right': false };

export type NovaPlayerVisualFrame = { x: number; y: number; elapsed: number; velocityY: number; dashDirection: -1 | 0 | 1; dashVisualTime: number };

/** Nova is centered on the gameplay visual origin shared by FlowAura. */
export class NovaPlayerRenderer {
  readonly view = new Container();
  private readonly fallback = new Graphics();
  private readonly textures = new Map<NovaAnimationState, Texture[]>();
  private sprite: AnimatedSprite | null = null;
  private animation: NovaAnimationState = 'idle';

  constructor() { this.view.addChild(this.fallback); void this.loadTextures(); }

  update(frame: NovaPlayerVisualFrame) {
    this.view.position.set(frame.x, frame.y);
    const nextAnimation = resolveNovaAnimationState(frame);
    if (!this.sprite) { redrawPlayer(this.fallback, 0, 0, frame.elapsed, frame.dashVisualTime > 0 ? frame.dashDirection : 0); return; }
    if (nextAnimation !== this.animation) this.play(nextAnimation);
  }

  private async loadTextures() {
    try {
      const states = Object.keys(NOVA_FRAME_URLS) as NovaAnimationState[];
      await Promise.all(states.map(async (state) => { this.textures.set(state, await Promise.all(NOVA_FRAME_URLS[state].map((url) => Assets.load<Texture>(url)))); }));
      const idle = this.textures.get('idle'); if (!idle?.length) return;
      this.sprite = new AnimatedSprite(idle);
      this.sprite.anchor.set(0.5, FRAME_ANCHOR_Y);
      this.sprite.position.y = VISUAL_Y_OFFSET;
      this.sprite.scale.set(NOVA_FRAME_SCALE);
      this.sprite.animationSpeed = ANIMATION_SPEED.idle; this.sprite.loop = true;
      this.fallback.visible = false; this.view.addChild(this.sprite); this.sprite.play();
    } catch (error) { console.warn('Nova animation textures failed to load; using vector fallback.', error); }
  }

  private play(state: NovaAnimationState) {
    if (!this.sprite) return; const frames = this.textures.get(state); if (!frames?.length) return;
    this.animation = state; this.sprite.textures = frames; this.sprite.animationSpeed = ANIMATION_SPEED[state]; this.sprite.loop = LOOPING[state]; this.sprite.gotoAndPlay(0);
  }
}
