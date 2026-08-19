import type { Container } from 'pixi.js';
import type { Rect } from '../movement';

export type EnemyKind = 'walker' | 'leaper' | 'floater';

export interface EnemyActor extends Container {
  readonly enemyId: number;
  readonly kind: EnemyKind;
  hp: number;
  hurtTime: number;
  update(playerX: number, playerY: number, dt: number): void;
  hurtbox(): Rect;
  hit(direction: -1 | 1): void;
  impactPoint(): { x: number; y: number };
}
