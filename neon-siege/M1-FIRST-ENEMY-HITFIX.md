# M1 First Enemy Hitfix

## Problem

The first spawned enemy can exist at `x = -45` while projectiles were previously destroyed once they crossed `x < -40`. A left-moving projectile could therefore be removed before its swept collision segment reached the first enemy's hitbox.

## Fix

- Keep the existing swept projectile collision.
- Introduce a shared off-screen projectile simulation margin of `120px`.
- Simulate projectiles until `x < -120` or `x > viewport width + 120`.
- Apply the same margin vertically before destroying projectiles.

## Playtest

1. Start a fresh run and immediately fire at the first grunt as it enters from the left edge.
2. Repeat using Pistol, SMG, Shotgun, and Railgun.
3. Confirm visual projectile paths that cross the first grunt consistently produce hit feedback and damage.
4. Confirm off-screen projectiles are still cleaned up shortly after leaving the spawn buffer.
