import { Container, Graphics } from "pixi.js";

import { playSfx } from "../game/audio";
import type { Card } from "../game/cards";
import { spawnAvatar } from "../game/entities";
import { applyMirrorSpec, mirrorBossSpec } from "../game/mirrorBoss";
import type { Rng } from "../game/rng";
import { updateEnemyAi } from "../game/systems/ai";
import { updateBossWeapon } from "../game/systems/bossWeapon";
import { removeDeadEnemies, updateCollisions } from "../game/systems/collision";
import { decayHitFlash, updateAvatarMotion, updateProjectileMotion } from "../game/systems/motion";
import { newWaveState, updateWave, type WaveState } from "../game/systems/wave";
import { updateWeapon } from "../game/systems/weapon";
import { TOTAL_WAVES, WAVES } from "../game/waves";
import { type EntityId, World } from "../game/world";
import { drawGrid, drawWorld } from "../render";
import type { Scene } from "./scene";

export interface PlayCallbacks {
  onWaveCleared: (clearedIdx: number) => void; // 1-based
  onPlayerDied: () => void;
  onRunWon: () => void;
  updateHud: (hp: number, maxHp: number, waveIdx: number, totalWaves: number) => void;
}

// The canvas CSS size varies per viewport; map pointer events back to the
// fixed 360×640 play-field so gameplay math stays resolution-independent.
export interface PointerMapper {
  clientToPlay: (clientX: number, clientY: number) => { x: number; y: number };
  target: HTMLElement;
}

export class PlayScene implements Scene {
  readonly root: Container;
  readonly world: World;
  avatarId: EntityId;
  readonly picks: Card[] = [];

  private readonly rng: Rng;
  private readonly g: Graphics;
  private readonly cb: PlayCallbacks;
  private readonly mapper: PointerMapper;
  private waveIdx: number;
  private wave: WaveState;
  private tracking = false;
  private readonly boundOnDown: (ev: PointerEvent) => void;
  private readonly boundOnMove: (ev: PointerEvent) => void;
  private readonly boundOnUp: (ev: PointerEvent) => void;
  private ended = false;
  private mirrorApplied = false;

  constructor(rng: Rng, cb: PlayCallbacks, mapper: PointerMapper) {
    this.root = new Container();
    const gridG = new Graphics();
    drawGrid(gridG);
    this.root.addChild(gridG);
    this.g = new Graphics();
    this.root.addChild(this.g);
    this.world = new World();
    this.rng = rng;
    this.cb = cb;
    this.mapper = mapper;
    this.avatarId = spawnAvatar(this.world);
    this.waveIdx = 0;
    this.wave = newWaveState(WAVES[this.waveIdx]!);

    this.boundOnDown = (ev) => this.onPointerDown(ev);
    this.boundOnMove = (ev) => this.onPointerMove(ev);
    this.boundOnUp = (ev) => this.onPointerUp(ev);
    this.updateHud();
  }

  enter(): void {
    const t = this.mapper.target;
    t.addEventListener("pointerdown", this.boundOnDown);
    t.addEventListener("pointermove", this.boundOnMove);
    t.addEventListener("pointerup", this.boundOnUp);
    t.addEventListener("pointercancel", this.boundOnUp);
  }

  exit(): void {
    this.tracking = false;
    const t = this.mapper.target;
    t.removeEventListener("pointerdown", this.boundOnDown);
    t.removeEventListener("pointermove", this.boundOnMove);
    t.removeEventListener("pointerup", this.boundOnUp);
    t.removeEventListener("pointercancel", this.boundOnUp);
  }

  advanceToNextWave(): void {
    if (this.waveIdx + 1 >= TOTAL_WAVES) return;
    this.waveIdx += 1;
    this.wave = newWaveState(WAVES[this.waveIdx]!);
    this.ended = false;
    this.updateHud();
  }

  recordPick(card: Card): void {
    this.picks.push(card);
  }

  currentWave1(): number {
    return this.waveIdx + 1;
  }

  totalWaves(): number {
    return TOTAL_WAVES;
  }

  update(dt: number): void {
    if (this.ended) return;

    updateWave(this.wave, this.world, this.rng, dt);
    if (this.waveIdx + 1 === TOTAL_WAVES && !this.mirrorApplied) {
      this.applyMirrorBuildOnce();
    }
    updateAvatarMotion(this.world, dt);
    updateEnemyAi(this.world, this.avatarId, dt);
    updateProjectileMotion(this.world, dt);
    updateWeapon(this.world, this.avatarId, this.rng, dt);
    updateBossWeapon(this.world, this.avatarId, this.rng, dt);

    let died = false;
    updateCollisions(this.world, this.avatarId, {
      onEnemyKilled: () => playSfx("hit"),
      onPlayerDied: () => { died = true; },
    });
    removeDeadEnemies(this.world);
    decayHitFlash(this.world, dt);

    this.updateHud();

    if (died) {
      this.ended = true;
      this.cb.onPlayerDied();
      return;
    }

    if (this.wave.cleared) {
      const cleared = this.waveIdx + 1;
      if (cleared >= TOTAL_WAVES) {
        this.ended = true;
        this.cb.onRunWon();
      } else {
        this.cb.onWaveCleared(cleared);
      }
    }
  }

  render(_alpha: number): void {
    drawWorld(this.g, this.world);
  }

  private applyMirrorBuildOnce(): void {
    for (const [, c] of this.world.with("enemy", "hp")) {
      if (c.enemy!.kind !== "boss") continue;
      applyMirrorSpec(c, mirrorBossSpec(this.picks));
      this.mirrorApplied = true;
      return;
    }
  }

  private updateHud(): void {
    const c = this.world.get(this.avatarId);
    const hp = c?.avatar?.hp ?? 0;
    const maxHp = c?.avatar?.maxHp ?? 0;
    this.cb.updateHud(hp, maxHp, this.waveIdx + 1, TOTAL_WAVES);
  }

  private onPointerDown(ev: PointerEvent): void {
    this.tracking = true;
    this.mapper.target.setPointerCapture?.(ev.pointerId);
    this.setAvatarTarget(ev.clientX, ev.clientY);
  }

  private onPointerMove(ev: PointerEvent): void {
    if (!this.tracking) return;
    this.setAvatarTarget(ev.clientX, ev.clientY);
  }

  private onPointerUp(ev: PointerEvent): void {
    this.tracking = false;
    this.mapper.target.releasePointerCapture?.(ev.pointerId);
  }

  private setAvatarTarget(clientX: number, clientY: number): void {
    const p = this.mapper.clientToPlay(clientX, clientY);
    const a = this.world.get(this.avatarId)?.avatar;
    if (!a) return;
    a.targetX = p.x;
    a.targetY = p.y;
  }
}
