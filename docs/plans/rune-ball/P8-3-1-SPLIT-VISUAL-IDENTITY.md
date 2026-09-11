# P8.3.1 — Split Visual Identity Pass

## Risk question

Can Prism and Lance communicate their authored play patterns through silhouette alone, without changing the Split collision model that already passed the P8.3 gameplay gate?

## Scope

### Prism

- Preserve the existing 4/6-point coverage geometry.
- Stop rendering evolved Prism as a collection of extra balls.
- Render T1/T2 as symmetric prism wings attached to the core.
- Increase wing span and layering from T1 to T2 so evolution reads as a silhouette change.
- Collision points may remain represented only as subtle facets; they are not independent ball identities.

### Lance

- Preserve the existing forward-axis pressure geometry.
- Stop rendering evolved Lance as a string of extra balls.
- Render T1/T2 as one continuous energy spear aligned to current ball velocity.
- Use a clear shaft + spearhead silhouette; T2 becomes longer/heavier.
- Extend Lance runtime window to improve usability without increasing damage or hit radius.

## Tuning

- Base Split duration: unchanged at 1.25s.
- Prism T1/T2 duration: unchanged at 1.35s / 1.50s.
- Lance T1/T2 duration: 1.60s / 1.85s.
- Evolution thresholds remain 3 / 6 qualified uses.
- Split hit radius and attack geometry remain unchanged.

## Architecture

- `SplitEvolutionTuning` remains the gameplay/collision source of truth.
- `SplitVisualIdentity` owns presentation-only silhouette profiles.
- `DestructionScene` consumes both sources but does not move visual tuning into gameplay domain logic.

## Phone gate

1. Prism T1/T2 reads as a winged expansion rather than multiple extra balls.
2. Lance T1/T2 reads as one long spear rather than a bead/string formation.
3. Prism and Lance remain immediately distinguishable during motion.
4. Lance's longer window improves usability without making it feel like the coverage path.
5. Collision feel and qualified-use progression remain unchanged.

## Scope guard

No Chain evolution, new damage model, new Split path, evolution threshold changes, new stage content, economy, backend, or Production Pages Smoke.
