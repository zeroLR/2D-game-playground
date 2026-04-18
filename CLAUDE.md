# Repo conventions

## Workflow
- When a task's changes are finished, pushed, and green, **always open a PR** (or update the existing one with a clear summary). Don't wait for the user to ask.
- After opening or updating a PR, **always subscribe to its activity** via `mcp__github__subscribe_pr_activity` so CI failures and review comments surface automatically.
- All work on feature branches (e.g. `claude/<task>-xxxxx`), never commit directly to `main`.

## Subprojects
- `simple-roguelike/` — existing roguelike; do not modify unless asked.
- `axiom/` — reverse bullet-hell + card drafter; concept in `axiom/docs/concept.md`.
- CI (`.github/workflows/deploy.yml`) builds both subprojects and publishes to GitHub Pages.

## Axiom adjustment log
- For Axiom, record every game-related change under this section in `CLAUDE.md` as one adjustment entry per change (new features, new enemies, balance/value tuning, UI changes, bug fixes, etc.).
- Added documentation for current Axiom enemy roster/behavior (`axiom/docs/ENEMY.md`), card pool (`axiom/docs/CARDS.md`), and primal skills (`axiom/docs/SKILLS.md`).
- Softened Stage 2 and Stage 3 theme palettes and added configurable matte fog overlay rendering for darker stage atmospheres.
- Added normal-mode stage strength multipliers (Stage 2 = 1.5×, Stage 3 = 2.5×) applied to enemy HP, movement speed, contact damage, and enemy weapon damage at spawn-time.
