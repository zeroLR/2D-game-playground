export type Facing = -1 | 1;
export type TowerType = 'turret' | 'tesla' | 'barrier';

export interface GameState {
  playerX: number;
  playerY: number;
  vy: number;
  grounded: boolean;
  facing: Facing;
  playerHp: number;
  hitCooldown: number;
  credits: number;
  coreHp: number;
  wave: number;
  killed: number;
  spawned: number;
  waveSize: number;
  spawnTimer: number;
  shootTimer: number;
  towerMode: number;
  weaponIndex: number;
  gameOver: boolean;
}

export interface EnemyModel {
  hp: number;
  speed: number;
  x: number;
  y: number;
  attack: number;
  heavy: boolean;
}

export interface TowerModel {
  x: number;
  y: number;
  type: TowerType;
  cooldown: number;
}

export interface ProjectileModel {
  x: number;
  y: number;
  vx: number;
  damage: number;
}

export const createInitialGameState = (): GameState => ({
  playerX: 0,
  playerY: 0,
  vy: 0,
  grounded: true,
  facing: -1,
  playerHp: 100,
  hitCooldown: 0,
  credits: 300,
  coreHp: 100,
  wave: 1,
  killed: 0,
  spawned: 0,
  waveSize: 8,
  spawnTimer: 0,
  shootTimer: 0,
  towerMode: 0,
  weaponIndex: 0,
  gameOver: false,
});
