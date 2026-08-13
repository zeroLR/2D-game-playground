export const BALANCE = {
  player: {
    speed: 260,
    jumpVelocity: -420,
    gravity: 980,
    maxHp: 100,
    shootCooldown: 0.16,
    bulletDamage: 24,
    bulletSpeed: 640,
    hitInvulnerability: 0.65,
  },
  tower: {
    turretCost: 120,
    teslaCost: 180,
    turretPrimaryRange: 360,
    turretEmergencyRange: 120,
    teslaPrimaryRange: 230,
    teslaEmergencyRange: 100,
  },
  economy: {
    startingCredits: 300,
    killReward: 28,
    waveReward: 100,
  },
} as const;
