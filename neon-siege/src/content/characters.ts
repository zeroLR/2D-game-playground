import type { RunModifiers } from './upgrades';

export type CharacterId = 'assault' | 'engineer' | 'runner';

export interface CharacterDefinition {
  id: CharacterId;
  name: string;
  role: string;
  codename: string;
  description: string;
  passive: string;
  startingWeaponIndex: number;
  startingCredits: number;
  startingHp: number;
  accent: 'pink' | 'cyan' | 'amber';
  apply: (modifiers: RunModifiers) => void;
}

export const CHARACTERS: readonly CharacterDefinition[] = [
  {
    id: 'assault',
    name: 'VEX',
    role: 'ASSAULT OPERATOR',
    codename: 'BREACH VECTOR',
    description: 'Direct-fire specialist built to personally collapse pressure lanes.',
    passive: '+15% player damage, +8% fire cadence, 110 starting HP.',
    startingWeaponIndex: 1,
    startingCredits: 380,
    startingHp: 110,
    accent: 'pink',
    apply: (m) => {
      m.playerDamage *= 1.15;
      m.fireRate *= 1.08;
      m.maxHp = 110;
    },
  },
  {
    id: 'engineer',
    name: 'MARA',
    role: 'GRID ENGINEER',
    codename: 'FORTRESS DAEMON',
    description: 'Infrastructure specialist that turns credits into durable autonomous kill-zones.',
    passive: '+18% tower damage, +45% repair power, -10% build cost.',
    startingWeaponIndex: 0,
    startingCredits: 500,
    startingHp: 100,
    accent: 'amber',
    apply: (m) => {
      m.towerDamage *= 1.18;
      m.repairPower *= 1.45;
      m.buildDiscount += 0.1;
    },
  },
  {
    id: 'runner',
    name: 'NYX',
    role: 'GHOST RUNNER',
    codename: 'TRANSIT ZERO',
    description: 'High-mobility responder tuned for cross-lane interception and energy weapons.',
    passive: '+18% move speed, +35% lane transfer, +15% energy damage; 90 HP.',
    startingWeaponIndex: 3,
    startingCredits: 400,
    startingHp: 90,
    accent: 'cyan',
    apply: (m) => {
      m.moveSpeed *= 1.18;
      m.laneTransfer *= 1.35;
      m.energy *= 1.15;
      m.maxHp = 90;
    },
  },
] as const;

let selected: CharacterDefinition = CHARACTERS[0];

export const characterById = (id: string) => CHARACTERS.find((character) => character.id === id) ?? CHARACTERS[0];
export const selectCharacter = (id: string) => { selected = characterById(id); return selected; };
export const selectedCharacter = () => selected;
export const applySelectedCharacter = (modifiers: RunModifiers) => { selected.apply(modifiers); return modifiers; };
