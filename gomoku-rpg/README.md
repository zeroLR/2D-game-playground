# Gomoku RPG — M0

Portrait-first mobile Web prototype combining Gomoku with a minimal RPG resource/skill loop.

## M0 hypothesis

Does earning a tactical resource from board patterns, then spending it to reposition a stone, create interesting decisions beyond ordinary Gomoku?

## Rules

- 9×9 board; five in a row wins.
- Player vs CPU.
- Placing a stone that forms a line of 3+ grants 1 Mana (max 5).
- **Blink** costs 2 Mana and consumes the whole turn: move one of your stones to any empty intersection.
- CPU first takes a winning move, then blocks an immediate player win, otherwise prefers the center.

## UX / art direction

- Portrait mobile first (390×844 logical canvas).
- Abstract geometric player/opponent identities.
- Warm paper board, restrained gold/violet accents, minimal premium HUD.
- No modal interaction during play.

## Run

```bash
npm install
npm run dev
npm test
npm run build
```

## Renderer bootstrap / black-screen regression

The game must mount a Pixi canvas into `#app` on both mobile and desktop browsers. A production incident was observed where all HTML/JS/CSS and Pixi chunks returned HTTP 200, but the page stayed blank and `document.querySelector('canvas')` returned `null` while `#app` existed and was empty. This means the failure happened during renderer bootstrap before the canvas was mounted; it is not an asset-path or ordinary layout failure.

Bootstrap requirements:

- Resolve `#app` explicitly and fail with a useful error if the mount element is missing.
- Initialize WebGL first for broad mobile/desktop compatibility and retry with WebGPU if WebGL initialization fails.
- Mount `app.canvas` only after renderer initialization succeeds.
- If both renderer paths fail, log `[Gomoku RPG] Renderer bootstrap failed.` and render a visible fallback message in `#app`; never leave a silent empty page.
- When investigating a production blank screen, check Network first, then Console, then `document.querySelector('canvas')` and `document.querySelector('#app')?.innerHTML`. HTTP 200 assets plus an empty `#app` specifically points to bootstrap failure.
- Any renderer/bootstrap change must be smoke-tested on at least one desktop browser and one mobile browser before merge.

## M0 acceptance

The prototype is successful if playtesting can answer whether Blink changes placement strategy enough to justify continuing the RPG layer. PvP, progression, equipment, multiple classes, matchmaking and backend are intentionally out of scope.