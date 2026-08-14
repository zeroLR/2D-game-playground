import type { TowerType } from '../domain/models';

export interface TowerDefinition {
  id: TowerType;
  name: string;
  role: string;
  cost: number;
  maxHp: number;
}

export const TOWERS: readonly TowerDefinition[] = [
  { id: 'turret', name: 'TURRET', role: 'single-target DPS', cost: 120, maxHp: 0 },
  { id: 'tesla', name: 'TESLA', role: 'crowd damage', cost: 180, maxHp: 0 },
  { id: 'barrier', name: 'BARRIER', role: 'block and cluster', cost: 90, maxHp: 260 },
];

export const towerAt = (index: number): TowerDefinition => TOWERS[index] ?? TOWERS[0];
