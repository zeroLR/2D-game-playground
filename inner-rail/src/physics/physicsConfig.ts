export const PHYSICS_CONFIG = {
  gravityMagnitude: 9.81,
  fixedTimeStep: 1 / 60,
  maxSubSteps: 4,
  ballRadius: 0.65,
  ballMass: 1.4,
  ballLinearDamping: 0.16,
  ballAngularDamping: 0.12,
  contactFriction: 0.48,
  contactRestitution: 0.08,
  sandboxWidth: 16,
  sandboxLength: 48,
  floorThickness: 0.5,
  wallThickness: 0.5,
  wallHeight: 2.6,
  spawn: { x: 0, y: 1.05, z: -18 },
  safetySpeedLimit: 22,
} as const;

export type PhysicsConfig = typeof PHYSICS_CONFIG;
