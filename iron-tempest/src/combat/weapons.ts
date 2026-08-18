export type WeaponId = 'vulcan' | 'spread' | 'lance';

export type ProjectileSpec = {
  offsetX: number;
  vx: number;
  vy: number;
  damage: number;
  pierce: number;
  radius: number;
  color: number;
};

export type WeaponState = {
  id: WeaponId;
  rapid: number;
  twin: number;
  heavy: number;
  piercing: number;
};

export type WeaponDefinition = {
  id: WeaponId;
  name: string;
  description: string;
  cooldown: number;
  fire(state: WeaponState): ProjectileSpec[];
};

const twinOffsets = (state: WeaponState) => state.twin > 0 ? [-5, 5] : [0];
const damage = (base: number, state: WeaponState) => base + state.heavy;
const pierce = (base: number, state: WeaponState) => base + state.piercing;

export const WEAPONS: Record<WeaponId, WeaponDefinition> = {
  vulcan: {
    id: 'vulcan', name: 'VULCAN', description: 'Rapid concentrated fire', cooldown: 7,
    fire: state => twinOffsets(state).map(offsetX => ({offsetX,vx:0,vy:-9,damage:damage(1,state),pierce:pierce(0,state),radius:2,color:0x72f1ff})),
  },
  spread: {
    id: 'spread', name: 'SPREAD CANNON', description: 'Wide-area suppression', cooldown: 11,
    fire: state => twinOffsets(state).flatMap(offsetX => [-1.25,0,1.25].map(vx => ({offsetX,vx,vy:-8,damage:damage(1,state),pierce:pierce(0,state),radius:2,color:0x8dff8a}))),
  },
  lance: {
    id: 'lance', name: 'PULSE LANCE', description: 'Slow heavy piercing shot', cooldown: 20,
    fire: state => twinOffsets(state).map(offsetX => ({offsetX,vx:0,vy:-11,damage:damage(4,state),pierce:pierce(2,state),radius:4,color:0xffd45c})),
  },
};

export function createWeaponState(id: WeaponId = 'vulcan'): WeaponState {
  return {id,rapid:0,twin:0,heavy:0,piercing:0};
}

export function cooldownFor(state: WeaponState): number {
  return Math.max(2, WEAPONS[state.id].cooldown / (1 + state.rapid * .28));
}
