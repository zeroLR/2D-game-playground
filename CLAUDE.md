# Repo conventions

## Workflow
- When a task's changes are finished, pushed, and green, **always open a PR** (or update the existing one with a clear summary). Don't wait for the user to ask.
- All work on feature branches (e.g. `claude/<task>-xxxxx`), never commit directly to `main`.

## Subprojects
- `simple-roguelike/` — existing roguelike; do not modify unless asked.
- `shape-shift/` — reverse bullet-hell + card drafter; concept in `shape-shift/docs/concept.md`.
- CI (`.github/workflows/deploy.yml`) builds both subprojects and publishes to GitHub Pages.
