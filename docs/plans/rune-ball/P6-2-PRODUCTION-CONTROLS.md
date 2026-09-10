# P6.2 — Production Controls + Deploy Gate

## Risk question

Can Rune Ball behave like a reliable mobile web product outside the ideal play path: player preferences persist, accessibility controls are explicit, opening secondary controls never consumes the run, background/foreground transitions remain correct, and the existing Pages pipeline can ship the same verified build without introducing a second deployment path?

## Product controls

A single low-emphasis settings launcher lives outside the persistent gameplay HUD. Opening it pauses gameplay input and the Session timer but keeps the current frame visible underneath.

The sheet contains only:

- **Sound** — controls BGM + SFX through the existing `AudioDirector`.
- **Reduced Motion** — controls the existing camera / impact reductions and reduces nonessential CSS motion.

Preferences persist in `localStorage` under a versioned Rune Ball key. On first visit, Sound defaults on and Reduced Motion follows `prefers-reduced-motion`. Once the player explicitly changes a value, the stored preference wins on later visits.

## UI / UX contract

The settings surface follows the Project Apple Design guidance and existing Rune Ball design system rather than inventing a new visual language:

- secondary settings stay one level below the gameplay path;
- launcher remains at least 44×44 CSS px and respects safe-area insets;
- the sheet is spatially anchored to the top-right launcher;
- modal depth uses one dimmed backdrop plus one material surface;
- controls use familiar switch affordances and direct labels;
- settings typography uses the platform system font while game telemetry keeps the established monospace character;
- `prefers-reduced-transparency` and `prefers-contrast: more` receive explicit fallbacks;
- focus returns to the launcher after dismissal and keyboard focus stays within the open dialog.

## Runtime lifecycle

Runtime pause becomes the union of independent reasons:

`page hidden OR settings open`

This prevents a foreground event from accidentally unpausing a run while Settings is still open. Closing Settings resumes only when the page is visible. Results remain input-locked.

Audio background handling stays independent: backgrounding pauses BGM and suspends the SFX context; opening Settings does not stop BGM so the Sound control has immediate feedback.

## Deployment

Rune Ball continues to use the existing `.github/workflows/rune-ball.yml` → reusable `game-pages.yml` path. P6.2 does not create another deployment architecture.

PR CI must pass:

- `npm ci`
- `npm test`
- strict TypeScript
- Vite production build
- production base verification
- shipped audio verification

After merge, the production smoke gate is the deployed Pages build on a real phone.

## Phone gate

1. Settings launcher is discoverable but does not compete with Score / Combo / timer.
2. Opening Settings freezes gameplay and the Session timer; closing resumes from the same state.
3. Sound OFF immediately silences BGM/SFX; ON restores audio; the choice survives reload.
4. Reduced Motion visibly reduces camera / large motion without removing gameplay information; the choice survives reload.
5. First visit with system Reduce Motion enabled inherits that preference.
6. Backgrounding while Settings is open does not accidentally resume the run on foreground; closing Settings is still required.
7. Settings remains readable in portrait safe areas and does not obscure or trap the user.
8. Production Pages smoke: loading → Tap to Enter → Rune start → full run → Results → Retry works on the deployed URL.

## Scope guard

No progression, account/backend, analytics service, new Rune, new target type, balance pass, audio production pass, or new deployment provider.
