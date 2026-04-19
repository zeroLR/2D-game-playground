# Axiom Adjustment Log

- Added documentation for current Axiom enemy roster/behavior (`axiom/docs/ENEMY.md`), card pool (`axiom/docs/CARDS.md`), and primal skills (`axiom/docs/SKILLS.md`).
- Softened Stage 2 and Stage 3 theme palettes and added configurable matte fog overlay rendering for darker stage atmospheres.
- Added normal-mode stage strength multipliers (Stage 2 = 1.5×, Stage 3 = 2.5×) applied to enemy HP, movement speed, contact damage, and enemy weapon damage at spawn-time.
- Fixed equipment overlay overflow so growing lists no longer push the back button out of reach; limited enhancement card equips to one copy per card; correctly applied selected avatar skin during runs; and added pause/resume/restart run controls.
- Added starting-shape progression: cumulative points now unlock Square (Face Beam) and Diamond (Orbit Shard), added a dedicated "Starting Shape" menu page, persisted selected starting shape in profile data, and applied shape-specific starting weapon modes at run start.
- Added 4 Evolution-class draft cards — Aegis (regenerating shield, max 2 / 6s), Revenant (one-shot revive at 50% maxHp), Compact (-25% hitbox), Phase Shift (auto-dodge with 8s cooldown). Refactored avatar-damage resolution into a single helper (dodge → shield → HP → revenant). Mirror Boss reflects each pick as bonus HP or speed.
- Added an in-game Discussions modal and embedded giscus (`giscus.app/client.js`) for Axiom, wired to `zeroLR/2D-game-playground` discussions and opened from a new topbar `comments` button.
- Added a fallback link in the Axiom Discussions modal that opens the repository’s GitHub Discussions page directly when in-widget posting fails.
- Added 6 Weapon-class draft cards (Face Beam, Orbit Shard, Tracker, Burst, Sweep, Cannon) and the parallel-weapon slot system: each pick appends a secondary weapon (cap 3) that fires alongside the primary. Introduced 4 new firing modes (homing missile with bounded turn rate, burst-into-fragments, wide 5-shot fan, slow piercing cannon). Mirror Boss reflects weapon picks as flavour-matched stat pressure (extra projectiles / damage / fire-rate / HP).
- Rebalanced normal-mode progression: enemy kills now use documented base points with stage multipliers (Stage 1=1x, Stage 2=2x, Stage 3=3x), draft reroll token cost now increases by +1 per reroll use within a draft, and stage wave counts are now Stage 1=8 / Stage 2=12 / Stage 3=15.
- **Skill Tree / Meta expansion (SCHEMA_VERSION 1 → 2):**
  - Expanded Primal Skills from 2 → 5: added Reflect Shield (blocks damage + reflects projectiles, 3s/35s), Barrage (radial burst, 2s/25s), Lifesteal Pulse (AoE damage + heal, 4s/40s).
  - Added MAX_SKILL_LEVEL = 10 cap; upgrade button hidden at max; `upgradeCost()` returns Infinity at cap.
  - Expanded Achievements from 4 → 16 across 4 categories (Progress, Difficulty, Style, Speed).
  - Added 4 new equipment cards: Resilience (+0.3s iframe), Magnet (+20% pickup radius), Piercing Shot (+1 pierce), Multi Shot (+1 projectile).
  - Added 6th equipment slot expansion (slot-6, 2500 pts).
  - Storage layer now migrates v1 skill tree and achievement states to v2 by merging missing keys from defaults.
  - Export/import handles both v1 and v2 save formats transparently.
