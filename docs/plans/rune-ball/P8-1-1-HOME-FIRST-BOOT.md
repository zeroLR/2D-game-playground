# Rune Ball — P8.1.1 Home-first Boot Flow

## Decision

Now that Rune Ball has a product Home, the website must open directly into Home. Loading belongs to stage entry, not application entry.

## Interaction contract

```text
Open web
→ Home
→ Journey / Runes / Stage Detail
→ START RUN
→ Stage Loading
   ├─ level title
   └─ progress bar
→ Arena Ready
→ Run
→ Results
```

`Retry` remains the fast replay path and does not show stage loading again because the current stage runtime is already resident.

## Runtime ownership

- Product Shell is DOM-first and available immediately.
- Pixi renderer creation and required audio fetch/decode are deferred until the first stage entry.
- Stage Loading owns renderer/audio preparation progress.
- Loading presentation intentionally contains only the level title and progress bar.
- The first arena pointer input retries audio activation if a browser still requires a fresh gesture after asynchronous loading.
- Returning Home keeps the prepared runtime resident for later runs.

## Scope guard

No new stage content, Rune abilities, gameplay balance, progression rewards, account/backend work, or Production Pages Smoke.

## Phone gate

1. Reload opens directly on Home with no boot loading or Tap to Enter gate.
2. Home/Journey/Runes remain usable before gameplay runtime is initialized.
3. START RUN hides the product shell and shows only the selected level title plus loading bar.
4. First cold stage entry finishes in Arena Ready with decoded SFX and no first-effect hitch.
5. First arena gesture can recover browser-locked audio without another modal or button.
6. Results → Retry immediately starts the same stage without loading.
7. Results → Home returns to the product shell; a later stage entry reuses prepared runtime safely.
