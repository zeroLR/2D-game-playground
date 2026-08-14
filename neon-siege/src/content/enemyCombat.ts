export interface EnemyContactProfile {
  damage: number;
  triggerRange: number;
  windup: number;
  recovery: number;
  playerKnockback: number;
  enemyRecoil: number;
}

export const ENEMY_CONTACT = {
  grunt: {
    damage: 12,
    triggerRange: 34,
    windup: 0.18,
    recovery: 0.72,
    playerKnockback: 50,
    enemyRecoil: 14,
  },
  heavy: {
    damage: 22,
    triggerRange: 46,
    windup: 0.32,
    recovery: 1.05,
    playerKnockback: 78,
    enemyRecoil: 20,
  },
} satisfies Record<'grunt' | 'heavy', EnemyContactProfile>;

export function enemyContactProfile(heavy: boolean): EnemyContactProfile {
  return heavy ? ENEMY_CONTACT.heavy : ENEMY_CONTACT.grunt;
}
