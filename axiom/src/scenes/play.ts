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
import { resetStatusPhase, updateStatusEffects } from "../game/systems/status";
import { newWaveState, updateWave, type WaveState } from "../game/systems/wave";
import { updateWeapon } from "../game/systems/weapon";
import type { WaveSpec } from "../game/waves";
import { type EntityId, World } from "../game/world";
import { drawGrid, drawWorld } from "../render";
import type { Scene } from "./scene";
import { KILL_POINTS, BOSS_WAVE_BONUS, rollBossLoot, type LootDrop, type RunResult } from "../game/rewards";
import {
  type ActiveSkillState,
  activateSkill,
  tickSkillState,
  timeStopSpeedMul,
  cloneInheritRatio,
} from "../game/skills";
import { survivalWaveSpec, isMirrorBossWave, survivalHpScale, survivalSpeedScale } from "../game/survivalWaves";
import type { StageTheme } from "../game/stageThemes";

export type GameMode = "normal" | "survival";

export interface PlayCallbacks {
  onWaveCleared: (clearedIdx: number) => void; // 1-based
  onPlayerDied: () => void;
  onRunWon: () => void;
  onRunComplete: (result: RunResult) => void;
  updateHud: (hp: number, maxHp: number, waveIdx: number, totalWaves: number, points: number) => void;
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
  private readonly mode: GameMode;
  private readonly waves: readonly WaveSpec[];
  private waveIdx: number;
  private wave: WaveState;
  private tracking = false;
  private readonly boundOnDown: (ev: PointerEvent) => void;
  private readonly boundOnMove: (ev: PointerEvent) => void;
  private readonly boundOnUp: (ev: PointerEvent) => void;
  private ended = false;
  private mirrorApplied = false;
  private readonly gridColor: number;
  private readonly theme: StageTheme | undefined;

  // Points & stats
  private runPoints = 0;
  private runKills = 0;
  private runBossKills = 0;
  private readonly loot: LootDrop[] = [];
  readonly stageIndex: number;

  // Primal skills (runtime)
  readonly activeSkills: ActiveSkillState[];
  private cloneId: EntityId | null = null;

  constructor(
    rng: Rng,
    cb: PlayCallbacks,
    mapper: PointerMapper,
    opts: {
      mode: GameMode;
      waves: readonly WaveSpec[];
      gridColor?: number;
      stageIndex?: number;
      activeSkills?: ActiveSkillState[];
      theme?: StageTheme;
    },
  ) {
    this.root = new Container();
    const gridG = new Graphics();
    this.gridColor = opts.gridColor ?? 0xf0f0f0;
    drawGrid(gridG, this.gridColor);
    this.root.addChild(gridG);
    this.g = new Graphics();
    this.root.addChild(this.g);
    this.world = new World();
    this.rng = rng;
    this.cb = cb;
    this.mapper = mapper;
    this.mode = opts.mode;
    this.waves = opts.waves;
    this.stageIndex = opts.stageIndex ?? 0;
    this.activeSkills = opts.activeSkills ?? [];
    this.theme = opts.theme;
    this.avatarId = spawnAvatar(this.world);
    this.waveIdx = 0;
    this.wave = newWaveState(this.waves[this.waveIdx]!);
    resetStatusPhase();

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
    if (this.mode === "normal" && this.waveIdx + 1 >= this.waves.length) return;

    this.waveIdx += 1;

    if (this.mode === "survival") {
      // Dynamically generate the next wave.
      const spec = survivalWaveSpec(this.waveIdx + 1, this.rng);
      this.wave = newWaveState(spec);
    } else {
      this.wave = newWaveState(this.waves[this.waveIdx]!);
    }
    this.ended = false;
    this.mirrorApplied = false;
    this.updateHud();
  }

  recordPick(card: Card): void {
    this.picks.push(card);
  }

  currentWave1(): number {
    return this.waveIdx + 1;
  }

  totalWaves(): number {
    return this.mode === "survival" ? this.waveIdx + 1 : this.waves.length;
  }

  /** Activate a primal skill by index. */
  activateSkill(index: number): void {
    const sk = this.activeSkills[index];
    if (!sk) return;
    if (!activateSkill(sk)) return;

    if (sk.id === "shadowClone") {
      this.spawnClone(sk);
    }
  }

  buildRunResult(): RunResult {
    return {
      mode: this.mode,
      stageIndex: this.stageIndex,
      wavesCleared: this.waveIdx + 1,
      totalKills: this.runKills,
      bossKills: this.runBossKills,
      pointsEarned: this.runPoints,
      loot: this.loot,
      noPowerRun: this.picks.length === 0,
    };
  }

  update(dt: number): void {
    if (this.ended) return;

    // Tick primal skills.
    const timeStopActive = this.activeSkills.some((s) => s.id === "timeStop" && s.active > 0);
    const slowMul = timeStopActive ? timeStopSpeedMul(0) : 1;
    for (const sk of this.activeSkills) tickSkillState(sk, dt);

    // Effective dt for enemies when time-stop is active.
    const enemyDt = dt * slowMul;

    updateWave(this.wave, this.world, this.rng, dt);

    // Apply survival scaling to newly spawned enemies.
    if (this.mode === "survival") {
      this.applySurvivalScaling();
    }

    // Mirror boss application (normal mode last wave, or survival mirror waves).
    const wave1 = this.waveIdx + 1;
    const shouldMirror =
      this.mode === "normal"
        ? wave1 === this.waves.length
        : isMirrorBossWave(wave1);
    if (shouldMirror && !this.mirrorApplied) {
      this.applyMirrorBuildOnce();
    }

    updateAvatarMotion(this.world, dt);
    updateEnemyAi(this.world, this.avatarId, enemyDt, this.rng);
    updateProjectileMotion(this.world, dt);
    updateWeapon(this.world, this.avatarId, this.rng, dt);
    updateBossWeapon(this.world, this.avatarId, this.rng, enemyDt);

    // Shadow clone weapon
    if (this.cloneId !== null) {
      const clone = this.world.get(this.cloneId);
      if (clone) {
        updateWeapon(this.world, this.cloneId, this.rng, dt);
        // Move clone to follow avatar
        const avatar = this.world.get(this.avatarId);
        if (avatar?.pos && clone.avatar) {
          clone.avatar.targetX = avatar.pos.x + 20;
          clone.avatar.targetY = avatar.pos.y + 20;
        }
        updateAvatarMotion(this.world, dt);
      }
      // Check if clone should expire (managed by skill state)
      const cloneSkill = this.activeSkills.find((s) => s.id === "shadowClone");
      if (!cloneSkill || cloneSkill.active <= 0) {
        if (this.cloneId !== null) {
          this.world.remove(this.cloneId);
          this.cloneId = null;
        }
      }
    }

    let died = false;
    const events = {
      onEnemyKilled: (eid: EntityId) => {
        playSfx("hit");
        this.onEnemyKilled(eid);
      },
      onPlayerDied: () => { died = true; },
    };
    updateCollisions(this.world, this.avatarId, events, this.rng);
    updateStatusEffects(this.world, enemyDt, events);
    removeDeadEnemies(this.world);
    decayHitFlash(this.world, dt);

    this.updateHud();

    if (died) {
      this.ended = true;
      this.cb.onRunComplete(this.buildRunResult());
      this.cb.onPlayerDied();
      return;
    }

    if (this.wave.cleared) {
      const cleared = this.waveIdx + 1;
      if (this.mode === "normal" && cleared >= this.waves.length) {
        this.ended = true;
        this.cb.onRunComplete(this.buildRunResult());
        this.cb.onRunWon();
      } else {
        this.cb.onWaveCleared(cleared);
      }
    }
  }

  render(_alpha: number): void {
    drawWorld(this.g, this.world, this.theme);
  }

  // ── Private ─────────────────────────────────────────────────────────────

  private onEnemyKilled(eid: EntityId): void {
    const ec = this.world.get(eid);
    if (!ec?.enemy) return;
    const kind = ec.enemy.kind;
    const pts = KILL_POINTS[kind] ?? 1;
    this.runPoints += pts;
    this.runKills += 1;

    if (kind === "boss") {
      this.runBossKills += 1;
      // Boss wave bonus
      this.runPoints += BOSS_WAVE_BONUS * (this.waveIdx + 1);
      // Roll loot
      const drop = rollBossLoot(this.rng);
      this.loot.push(drop);
      if (drop.kind === "points") this.runPoints += drop.value;
    }
  }

  private applyMirrorBuildOnce(): void {
    for (const [, c] of this.world.with("enemy", "hp")) {
      if (c.enemy!.kind !== "boss") continue;
      applyMirrorSpec(c, mirrorBossSpec(this.picks));
      this.mirrorApplied = true;
      return;
    }
  }

  private applySurvivalScaling(): void {
    const wave1 = this.waveIdx + 1;
    const hpMul = survivalHpScale(wave1);
    const spdMul = survivalSpeedScale(wave1);
    for (const [, c] of this.world.with("enemy", "hp")) {
      if (c.enemy!.kind === "boss") continue;
      if (c.enemy!.scaled) continue;
      c.hp!.value = Math.ceil(c.hp!.value * hpMul);
      c.enemy!.maxSpeed *= spdMul;
      c.enemy!.scaled = true;
    }
  }

  private spawnClone(_sk: ActiveSkillState): void {
    const avatar = this.world.get(this.avatarId);
    if (!avatar?.pos || !avatar.weapon || !avatar.avatar) return;
    const ratio = cloneInheritRatio(0);
    this.cloneId = this.world.create({
      pos: { x: avatar.pos.x + 20, y: avatar.pos.y + 20 },
      vel: { x: 0, y: 0 },
      radius: 8,
      team: "player",
      avatar: {
        hp: 1,
        maxHp: 1,
        speedMul: avatar.avatar.speedMul,
        iframes: 999, // clones can't be hit
        targetX: avatar.pos.x + 20,
        targetY: avatar.pos.y + 20,
      },
      weapon: {
        period: avatar.weapon.period / ratio,
        damage: Math.max(1, Math.floor(avatar.weapon.damage * ratio)),
        projectileSpeed: avatar.weapon.projectileSpeed,
        projectiles: Math.max(1, Math.floor(avatar.weapon.projectiles * ratio)),
        pierce: avatar.weapon.pierce,
        crit: avatar.weapon.crit * ratio,
        cooldown: 0.3,
        ricochet: avatar.weapon.ricochet,
        chain: avatar.weapon.chain,
        burnDps: avatar.weapon.burnDps * ratio,
        burnDuration: avatar.weapon.burnDuration,
        slowPct: avatar.weapon.slowPct,
        slowDuration: avatar.weapon.slowDuration,
      },
    });
  }

  private updateHud(): void {
    const c = this.world.get(this.avatarId);
    const hp = c?.avatar?.hp ?? 0;
    const maxHp = c?.avatar?.maxHp ?? 0;
    this.cb.updateHud(hp, maxHp, this.waveIdx + 1, this.totalWaves(), this.runPoints);
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
