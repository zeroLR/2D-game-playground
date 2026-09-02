# P3.2.1 Ecology Recovery Fix

Validation target:

1. Gather a root resource node until it is depleted.
2. Defeat at least one crawler and collect its loot.
3. Advance the world at the TICK terminal.
4. If that resource has positive ecology recovery, confirm the node becomes harvestable again and grants its original capacity.
5. Confirm at least one defeated crawler is repopulated after the world advance. Hostility below 4 restores one defeated crawler; hostility 4+ restores up to two.
6. Defeated crawlers return at their canonical spawn position with full HP and their original loot payload.

The fix preserves deterministic world-tick semantics and does not add full entity persistence yet.
