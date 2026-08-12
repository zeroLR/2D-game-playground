---
name: pixijs-v8-web-game
description: PixiJS v8 + Vite guardrails for browser game development in this repository. Use when creating, reviewing, or modifying PixiJS v8 game code, especially application bootstrap and production builds.
---

# PixiJS v8 Web Game Guardrails

## Application bootstrap

PixiJS v8 initializes `Application` asynchronously with `await app.init(...)`.

Do **not** use top-level `await` in browser entry modules such as `src/main.ts` unless the project explicitly requires and documents an ES target that supports it.

Bad:

```ts
const app = new Application();
await app.init(options);
```

Preferred:

```ts
async function bootstrap() {
  const app = new Application();
  await app.init(options);
  // initialize scenes, input, and game loop here
}

void bootstrap();
```

An extracted async factory such as `createApplication()` is also acceptable, as long as the entry module calls it from an async bootstrap function rather than with top-level await.

## Why this rule exists

On 2026-08-12, `vertex-parkour` passed TypeScript compilation but failed during `vite build` / esbuild transpilation because Vite's configured browser targets included environments without top-level-await support (`chrome87`, `edge88`, `es2020`, `firefox78`, `safari14`).

The observed error was:

```text
Top-level await is not available in the configured target environment
```

The fix was to move PixiJS async initialization into `async function bootstrap()` rather than broadening the Vite build target.

## Build-target policy

Do not set `build.target: 'esnext'` merely to make PixiJS initialization compile. Prefer restructuring async bootstrap so the existing browser compatibility target remains intact.

Only raise the build target when newer runtime semantics are an intentional product/browser-support decision, not as a workaround for initialization code.

## Verification checklist

Before considering a PixiJS feature complete:

1. Run the project's tests.
2. Run `npm run build`, not only `tsc --noEmit` or the dev server.
3. Treat an esbuild/Vite production-transform failure as distinct from a TypeScript type-check failure.
4. For PixiJS v8 bootstrap changes, explicitly check that no top-level `await app.init(...)` remains in browser entry modules.
