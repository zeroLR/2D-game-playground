# Rune Ball — MVP Planning

> Working title. Mobile portrait neon-fantasy ball action game driven by swipe direction control and drawn rune gestures.

## Product thesis

Rune Ball should feel less like precision sports and more like a **stress-relief power fantasy**:

> Swipe to redirect a magical core, draw runes to bend the arena rules, then cash the setup into explosive chain destruction and Overdrive.

The MVP exists to validate whether this escalation loop is inherently satisfying before adding roguelite progression, bosses, economy, unlock trees, or content-heavy systems.

## Core pillars

1. **Impact** — every successful input produces immediate audiovisual feedback.
2. **Flow** — the player stays in motion; UI must not interrupt play.
3. **Expression** — rune gestures meaningfully alter ball/arena behavior rather than acting as generic damage buttons.
4. **Escalation** — combo, sound, speed, glow, particles, and camera response intensify together.
5. **Release** — the session periodically resolves into a high-density destruction climax.

## MVP hypothesis

A player should understand and enjoy this sequence without explanation-heavy onboarding:

```mermaid
flowchart LR
    A[Swipe ball] --> B[Hit crystal targets]
    B --> C[Build Combo + Flow]
    C --> D[Draw Rune]
    D --> E[Create chain reaction]
    E --> F[Trigger Overdrive]
    F --> G[Short destruction climax]
    G --> H[Want another run]
```

## First playable scope

- Portrait mobile-first viewport.
- One arena theme.
- One magical ball/core.
- Four directional swipe actions.
- Three rune gestures: Circle, V, Z.
- One target archetype plus one tougher target variant.
- Combo and Flow systems.
- One Overdrive state.
- 60–90 second run.
- Score/result screen with instant retry.
- Neon VFX and audio feedback sufficient to evaluate the intended feel.

## Explicit non-goals

Do **not** add these before the core loop is validated:

- roguelite upgrade draft
- permanent progression
- currencies or shop
- equipment
- multiple characters
- PvP
- online backend
- narrative campaign
- complex boss phases
- large rune library
- realistic ball physics

## Planning documents

- [MVP-SPEC.md](./MVP-SPEC.md) — gameplay, controls, architecture, performance, acceptance criteria.
- [ART-DIRECTION.md](./ART-DIRECTION.md) — visual hierarchy, VFX language, UI and motion constraints.
- [ROADMAP.md](./ROADMAP.md) — implementation slices and playtest gates.
- [P5-VFX-AUDIO.md](./P5-VFX-AUDIO.md) — audiovisual hierarchy, camera / motion rules, performance budgets, and the P5 phone gate.
- [POST-MVP-PROGRESSION.md](./POST-MVP-PROGRESSION.md) — deferred progression candidates including Overdrive Archetypes and Rune Cards + Ascension Release.

## Decision rule

If the first fully instrumented vertical slice is not fun with placeholder progression removed, **do not solve that by adding more content**. Rework ball feel, target density, rune payoff, audiovisual timing, and Overdrive cadence first.
