# Rune Ball — P8.1 Product Shell & Navigation Gate

## Risk question

**Can Rune Ball read as a complete game product rather than a prototype by giving the player clear wayfinding across Home, Journey, Rune Build, Stage Detail, Run, Results, and Settings without diluting the arena-first identity?**

P8.1 is an information-architecture and interaction-flow gate. It does not add new combat content.

## Product hierarchy

Rune Ball now uses three interface layers with distinct responsibilities:

1. **Product Shell** — Home, Journey, Rune Tree, Stage Detail.
2. **Gameplay Shell** — Arena HUD, Rune evolution status, Results.
3. **System Layer** — Settings and platform/runtime preferences.

The Product Shell owns navigation and configuration. Gameplay remains focused on Ball / Rune / Target readability, and Settings stays globally available without becoming a primary destination.

## Navigation contract

```text
Boot
→ Tap to Enter
→ Home
   ├─ PLAY / current mission → Stage Detail → Start Run
   ├─ Journey → Stage Detail → Start Run
   └─ Runes → configure build → Home

Stage Detail → Edit Runes → Rune Tree → Stage Detail

Run → Results
       ├─ Retry → same Stage + same Build
       └─ Home → Product Shell
```

Every product screen should make four things obvious: current context, available destinations, primary action, and exit/back path.

## Home

Home is deliberately not a dense mobile-game dashboard.

Visual hierarchy:

1. Rune Ball identity / arcane core.
2. Current Stage and one dominant `PLAY` action.
3. `JOURNEY` and `RUNES` as secondary destinations.
4. Settings as a small global system control.

There must not be multiple equally strong primary CTAs.

## Journey

Journey is the authored content map. P8.1 establishes the navigation model before stage content expands.

Current catalog:

- **Stage 01 — Shattered Gate:** available; uses the existing 75-second run.
- **Stage 02 — Prism Wake:** locked placeholder; gameplay is not authored yet.
- **Stage 03 — Null Cathedral:** locked placeholder; gameplay is not authored yet.

Locked stages explicitly communicate that content is unavailable rather than behaving like broken buttons.

Future stage implementation may own target formations, arena modifiers, objectives, hazards, or boss structures, but none are added by P8.1.

## Rune Tree

Rune configuration moves out of the pre-run flow and into a persistent product screen.

Current Vortex branches:

```text
VORTEX
├─ GRAVITY WELL → SINGULARITY
└─ ORBIT → EVENT HORIZON
```

The selected Vortex path is stored in the versioned player profile and is reused for later runs until the player changes it.

Split and Chain remain visible as base Runes with no authored evolution tree. This establishes future information architecture without inventing mechanics prematurely.

### Runtime rule

Rune Tree configuration must never become a second in-run skill bar. Runtime input remains:

```text
Swipe = trajectory authority
Rune gesture = rule-changing action
```

Automatic evolution continues to occur from qualified Rune uses.

## Stage Detail

Stage Detail is the pre-run briefing surface. It owns:

- stage identity;
- objective;
- current Rune Build summary;
- a route to edit Runes;
- one primary `START RUN` action.

It does not re-ask the player to choose a build every run.

## Results

Results preserve the existing score-first hierarchy.

- `RETRY` is primary and starts the same Stage with the same Build.
- `HOME` is secondary and returns to the Product Shell.

This separates the fast replay path from configuration/navigation work.

## Settings

Settings remains the existing global system layer above both Product Shell and Gameplay Shell. P8.1 does not duplicate settings into navigation cards or create a second settings implementation.

Opening Settings continues to pause active gameplay while preserving Sound and Reduced Motion behavior.

## Mobile / accessibility contract

- Primary and navigation interactions use comfortable phone touch targets in the 44pt class or larger.
- Safe-area insets are respected.
- Product screens may vertically scroll on shorter devices.
- Native product-screen scrolling must not weaken the arena gesture contract; `touch-action: none` is scoped to the gameplay canvas instead of the entire document.
- Product screens use system UI typography; compact gameplay telemetry and Rune metadata can retain monospace character.
- Reduced Motion, Reduced Transparency, and Increased Contrast fallbacks remain supported.

## Architecture

```text
GameShell
├─ Home
├─ Journey
├─ Rune Tree
└─ Stage Detail

PlayerProfile
└─ persisted Vortex build choice

StageCatalog
└─ authored stage metadata / availability

SessionChrome
├─ Arena HUD
└─ Results → Retry / Home
```

`GameShell` is presentation/application navigation. It does not own combat rules. `DestructionSession`, `SessionDirector`, `VortexEvolutionSystem`, Rune, Flow, collision, target, and scoring logic remain renderer-independent.

## Scope guard

P8.1 does **not** include:

- Split / Chain evolution trees;
- new stage gameplay variants;
- unlock economy or progression rewards;
- persistent currency;
- account/backend systems;
- Overdrive Archetypes;
- cross-Rune synergy expansion;
- Production Pages Smoke.

Production Pages Smoke remains intentionally deferred until a release-focused checkpoint.

## Phone gate

1. After Tap to Enter, Home reads as a main game screen and current Stage + `PLAY` are obvious within 1–2 seconds.
2. Journey, Runes, and Settings are easy to locate but clearly secondary to Play.
3. `Home → Stage Detail → Start Run` is natural and no build-selection modal appears before gameplay.
4. Journey clearly distinguishes playable and future locked stages.
5. Rune Tree feels like build configuration, the selected Vortex path persists, and it does not resemble an in-run skill bar.
6. `Stage Detail → Edit Runes → Back` returns to Stage Detail; Home/Journey back navigation is predictable.
7. Results `RETRY` keeps the same Stage/Build; `HOME` returns to the main shell.
8. Journey / Rune Tree scroll on shorter phones while arena swipe/Rune gestures remain unchanged.
9. Settings remains above either shell, and opening it during a run still pauses the session correctly.

P8.1 closes only when the full navigation loop feels coherent on a phone. Content expansion resumes after this shell can reliably carry it.
