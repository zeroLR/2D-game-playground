import { Container, Graphics } from 'pixi.js';
import type { Point2D } from '../input/SwipeClassifier';
import type { SplitEvolutionPath, SplitEvolutionStage } from '../progression/SplitEvolutionSystem';
import { getSplitRuntimeGlyphSpec, type SplitImpactProfile } from './SplitRuntimeSvgSpec';

interface ImpactShard {
  graphic: Graphics;
  velocityX: number;
  velocityY: number;
}

interface SplitImpactInstance {
  root: Container;
  flash: Graphics;
  ring: Graphics;
  streakPrimary: Graphics;
  streakSecondary: Graphics;
  shards: ImpactShard[];
  active: boolean;
  life: number;
  maxLife: number;
  profile: SplitImpactProfile | null;
  intensity: number;
}

const POOL_CAPACITY = 14;
const MAX_SHARDS_PER_IMPACT = 8;

function unit(serial: number, salt: number): number {
  return ((serial * 41 + salt * 67 + 23) % 103) / 102;
}

function createShardGraphic(index: number): Graphics {
  const graphic = new Graphics();
  graphic.blendMode = 'add';
  if (index % 3 === 0) {
    return graphic
      .moveTo(0, -2.8)
      .lineTo(1.7, 0)
      .lineTo(0, 2.8)
      .lineTo(-1.7, 0)
      .lineTo(0, -2.8)
      .fill(0xffffff);
  }
  return graphic
    .moveTo(-2.8, 0)
    .lineTo(2.8, 0)
    .stroke({ color: 0xffffff, width: index % 3 === 1 ? 1.3 : 0.9, cap: 'round' });
}

export class SplitImpactPool extends Container {
  private readonly impacts: SplitImpactInstance[] = [];
  private cursor = 0;
  private spawnSerial = 0;
  private reducedMotion = false;

  constructor() {
    super();
    for (let index = 0; index < POOL_CAPACITY; index += 1) {
      const root = new Container();
      root.visible = false;

      const flash = new Graphics().circle(0, 0, 1).fill(0xffffff);
      flash.blendMode = 'add';

      const ring = new Graphics()
        .moveTo(0, -1)
        .lineTo(1, 0)
        .lineTo(0, 1)
        .lineTo(-1, 0)
        .lineTo(0, -1)
        .stroke({ color: 0xffffff, width: 0.08, join: 'round' });
      ring.blendMode = 'add';

      const streakPrimary = new Graphics()
        .moveTo(-1, 0)
        .lineTo(1, 0)
        .stroke({ color: 0xffffff, width: 1.4, cap: 'round' });
      streakPrimary.blendMode = 'add';

      const streakSecondary = new Graphics()
        .moveTo(-1, 0)
        .lineTo(1, 0)
        .stroke({ color: 0xffffff, width: 0.9, cap: 'round' });
      streakSecondary.blendMode = 'add';

      const shards: ImpactShard[] = [];
      for (let shardIndex = 0; shardIndex < MAX_SHARDS_PER_IMPACT; shardIndex += 1) {
        const graphic = createShardGraphic(shardIndex);
        graphic.visible = false;
        root.addChild(graphic);
        shards.push({ graphic, velocityX: 0, velocityY: 0 });
      }

      root.addChild(ring, streakPrimary, streakSecondary, flash);
      this.addChild(root);
      this.impacts.push({
        root,
        flash,
        ring,
        streakPrimary,
        streakSecondary,
        shards,
        active: false,
        life: 0,
        maxLife: 0,
        profile: null,
        intensity: 1,
      });
    }
  }

  setReducedMotion(enabled: boolean): void {
    this.reducedMotion = enabled;
  }

  spawn(
    position: Point2D,
    ballPosition: Point2D,
    ballVelocity: Point2D,
    path: SplitEvolutionPath,
    stage: SplitEvolutionStage,
    overdrive: boolean,
  ): void {
    const profile = getSplitRuntimeGlyphSpec(path, stage).impact;
    if (profile.kind === 'none' || profile.duration <= 0) return;

    const impact = this.acquire();
    this.resetImpact(impact);
    impact.active = true;
    impact.profile = profile;
    impact.life = profile.duration * (this.reducedMotion ? 0.72 : 1);
    impact.maxLife = impact.life;
    impact.intensity = overdrive ? 1.18 : 1;
    impact.root.visible = true;
    impact.root.position.set(position.x, position.y);
    impact.root.rotation = this.impactAngle(profile, position, ballPosition, ballVelocity);

    const alpha = Math.min(1, profile.alpha * impact.intensity);
    impact.flash.alpha = alpha;
    impact.flash.scale.set(profile.hotRadius * (overdrive ? 1.12 : 1));
    impact.ring.alpha = alpha * 0.72;
    impact.ring.scale.set(profile.ringRadius);

    impact.streakPrimary.alpha = alpha * (profile.kind === 'lance-pierce' ? 0.92 : 0.62);
    impact.streakPrimary.scale.set(profile.streakLength * 0.5, 1);
    impact.streakPrimary.rotation = profile.kind === 'prism-refraction' ? Math.PI * 0.5 : 0;

    impact.streakSecondary.visible = profile.secondaryAlpha > 0;
    impact.streakSecondary.alpha = Math.min(1, profile.secondaryAlpha * impact.intensity);
    impact.streakSecondary.scale.set(profile.streakLength * (profile.kind === 'lance-pierce' ? 0.42 : 0.34), 1);
    impact.streakSecondary.rotation = profile.kind === 'prism-refraction' ? Math.PI * 0.25 : 0;
    impact.streakSecondary.position.set(
      profile.kind === 'lance-pierce' ? profile.streakLength * 0.18 : 0,
      profile.kind === 'lance-pierce' ? 2.5 : 0,
    );

    if (profile.kind === 'prism-refraction') {
      impact.ring.tint = 0x6fe9ff;
      impact.streakPrimary.tint = 0xd756ff;
      impact.streakSecondary.tint = 0x6fe9ff;
      impact.flash.tint = 0xf0fbff;
    } else {
      impact.ring.tint = 0xd756ff;
      impact.streakPrimary.tint = 0xf0fbff;
      impact.streakSecondary.tint = 0x6fe9ff;
      impact.flash.tint = 0xf0fbff;
    }

    const shardCount = this.reducedMotion ? 0 : Math.min(profile.shardCount, impact.shards.length);
    for (let index = 0; index < shardCount; index += 1) {
      this.activateShard(impact.shards[index], profile, index, alpha);
    }
    this.spawnSerial += 1;
  }

  update(dtSeconds: number): void {
    const dt = Number.isFinite(dtSeconds) ? Math.max(0, Math.min(0.05, dtSeconds)) : 0;
    for (const impact of this.impacts) {
      if (!impact.active || !impact.profile) continue;
      impact.life -= dt;
      if (impact.life <= 0) {
        this.resetImpact(impact);
        continue;
      }

      const profile = impact.profile;
      const remaining = Math.max(0, impact.life / impact.maxLife);
      const progress = 1 - remaining;
      const fade = Math.pow(remaining, 0.72);
      const alpha = Math.min(1, profile.alpha * impact.intensity);

      impact.flash.alpha = alpha * fade * fade;
      impact.ring.alpha = alpha * 0.72 * fade;
      impact.streakPrimary.alpha = alpha * (profile.kind === 'lance-pierce' ? 0.92 : 0.62) * fade;
      impact.streakSecondary.alpha = Math.min(1, profile.secondaryAlpha * impact.intensity) * fade;

      if (!this.reducedMotion) {
        impact.flash.scale.set(profile.hotRadius * (1 + progress * 0.62));
        impact.ring.scale.set(profile.ringRadius * (0.78 + progress * 0.44));
        impact.streakPrimary.scale.set(profile.streakLength * 0.5 * (1 + progress * 0.12), 1);
      }

      for (const shard of impact.shards) {
        if (!shard.graphic.visible) continue;
        if (this.reducedMotion) {
          shard.graphic.visible = false;
          continue;
        }
        shard.graphic.x += shard.velocityX * dt;
        shard.graphic.y += shard.velocityY * dt;
        shard.graphic.alpha = fade * 0.9;
        shard.graphic.scale.set(Math.max(0.42, remaining));
      }
    }
  }

  private activateShard(shard: ImpactShard, profile: SplitImpactProfile, index: number, alpha: number): void {
    const serial = this.spawnSerial * MAX_SHARDS_PER_IMPACT + index;
    const count = Math.max(1, profile.shardCount);
    const t = count <= 1 ? 0.5 : index / (count - 1);
    const angle = (t - 0.5) * profile.shardSpread;
    const variance = 0.82 + unit(serial, 1) * 0.34;
    const speed = profile.shardSpeed * variance;

    shard.graphic.visible = true;
    shard.graphic.position.set(0, 0);
    shard.graphic.rotation = angle;
    shard.graphic.alpha = alpha * 0.9;
    shard.graphic.scale.set(0.78 + unit(serial, 2) * 0.38);
    shard.velocityX = Math.cos(angle) * speed;
    shard.velocityY = Math.sin(angle) * speed;

    if (profile.kind === 'prism-refraction') {
      shard.graphic.tint = index % 3 === 0 ? 0xf0fbff : index % 2 === 0 ? 0x6fe9ff : 0xd756ff;
      return;
    }
    shard.graphic.tint = index % 3 === 0 ? 0x6fe9ff : index % 2 === 0 ? 0xf0fbff : 0xd756ff;
  }

  private impactAngle(
    profile: SplitImpactProfile,
    position: Point2D,
    ballPosition: Point2D,
    ballVelocity: Point2D,
  ): number {
    if (profile.kind === 'lance-pierce') {
      const speed = Math.hypot(ballVelocity.x, ballVelocity.y);
      if (speed > 0.001) return Math.atan2(ballVelocity.y, ballVelocity.x);
    }

    const dx = position.x - ballPosition.x;
    const dy = position.y - ballPosition.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 0.001) return Math.atan2(dy, dx);

    return Math.atan2(ballVelocity.y, ballVelocity.x);
  }

  private acquire(): SplitImpactInstance {
    for (let offset = 0; offset < this.impacts.length; offset += 1) {
      const index = (this.cursor + offset) % this.impacts.length;
      const impact = this.impacts[index];
      if (!impact.active) {
        this.cursor = (index + 1) % this.impacts.length;
        return impact;
      }
    }

    const impact = this.impacts[this.cursor];
    this.cursor = (this.cursor + 1) % this.impacts.length;
    return impact;
  }

  private resetImpact(impact: SplitImpactInstance): void {
    impact.active = false;
    impact.life = 0;
    impact.maxLife = 0;
    impact.profile = null;
    impact.intensity = 1;
    impact.root.visible = false;
    impact.root.rotation = 0;
    impact.flash.alpha = 0;
    impact.ring.alpha = 0;
    impact.streakPrimary.alpha = 0;
    impact.streakSecondary.alpha = 0;
    impact.streakSecondary.visible = false;
    impact.streakSecondary.position.set(0, 0);
    for (const shard of impact.shards) {
      shard.graphic.visible = false;
      shard.velocityX = 0;
      shard.velocityY = 0;
    }
  }
}
