from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'missing replacement target: {label}')
    return text.replace(old, new, 1)


# Rune Tree: base nodes depict gameplay effect semantics, not gesture input glyphs.
path = Path('rune-ball/src/presentation/RuneTreePanel.ts')
text = path.read_text()
text = replace_once(
    text,
    "    const baseGlyph = document.createElement('span');\n    baseGlyph.className = 'rune-tree-node-base-glyph';\n    baseGlyph.textContent = base.glyph;\n    baseGlyph.setAttribute('aria-hidden', 'true');\n    baseNode.append(baseGlyph);",
    "    baseNode.append(this.makeBaseEffect('vortex'));",
    'Vortex base effect',
)
text = replace_once(
    text,
    "    const baseGlyph = document.createElement('span');\n    baseGlyph.className = 'rune-tree-node-base-glyph';\n    baseGlyph.textContent = definition.glyph;\n    baseGlyph.setAttribute('aria-hidden', 'true');\n    baseNode.append(baseGlyph);",
    "    baseNode.append(this.makeBaseEffect(this.selectedRune));",
    'future base effect',
)
helper = """
  private makeBaseEffect(runeId: RuneTreeId): HTMLElement {
    const effect = document.createElement('span');
    effect.className = `rune-tree-base-effect rune-tree-base-effect--${runeId}`;
    effect.setAttribute('aria-hidden', 'true');

    for (const part of ['core', 'accent-a', 'accent-b']) {
      const element = document.createElement('span');
      element.className = `rune-tree-base-effect-${part}`;
      effect.append(element);
    }
    return effect;
  }

"""
text = replace_once(text, "  private renderDetail(): void {", helper + "  private renderDetail(): void {", 'base effect helper')
path.write_text(text)

# Rune Tree effect icon language.
path = Path('rune-ball/src/rune-tree-refinement.css')
text = path.read_text()
text += r'''

/* P8.2.2 — Tree base nodes describe gameplay effects; gesture glyphs stay in Rune cards. */
.rune-tree-base-effect {
  position: relative;
  display: block;
  width: 56px;
  height: 56px;
}

.rune-tree-base-effect > span {
  position: absolute;
  display: block;
  pointer-events: none;
}

.rune-tree-base-effect--vortex {
  border: 1px solid rgb(143 77 255 / 56%);
  border-radius: 50%;
  box-shadow: inset 0 0 18px rgb(143 77 255 / 8%);
}

.rune-tree-base-effect--vortex::before,
.rune-tree-base-effect--vortex::after {
  position: absolute;
  border-radius: 50%;
  content: '';
}

.rune-tree-base-effect--vortex::before {
  inset: 8px;
  border: 1.5px solid rgb(111 233 255 / 68%);
  border-left-color: transparent;
  transform: rotate(-28deg);
}

.rune-tree-base-effect--vortex::after {
  inset: 16px;
  border: 1px solid rgb(215 86 255 / 62%);
}

.rune-tree-base-effect--vortex .rune-tree-base-effect-core {
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--rb-cyan);
  box-shadow: 0 0 12px rgb(111 233 255 / 58%);
  transform: translate(-50%, -50%);
}

.rune-tree-base-effect--vortex .rune-tree-base-effect-accent-a,
.rune-tree-base-effect--vortex .rune-tree-base-effect-accent-b {
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--rb-magenta);
  box-shadow: 0 0 7px rgb(215 86 255 / 42%);
}

.rune-tree-base-effect--vortex .rune-tree-base-effect-accent-a {
  transform: translate(17px, -15px);
}

.rune-tree-base-effect--vortex .rune-tree-base-effect-accent-b {
  transform: translate(-21px, 11px);
}

.rune-tree-base-effect--split .rune-tree-base-effect-core {
  top: 50%;
  left: 50%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--rb-cyan);
  box-shadow: 0 0 12px rgb(111 233 255 / 56%);
  transform: translate(-50%, -50%);
}

.rune-tree-base-effect--split::before,
.rune-tree-base-effect--split::after {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 34px;
  height: 1.5px;
  background: rgb(143 77 255 / 72%);
  content: '';
  transform-origin: left center;
}

.rune-tree-base-effect--split::before {
  transform: translate(2px, -1px) rotate(-30deg);
}

.rune-tree-base-effect--split::after {
  transform: translate(2px, -1px) rotate(30deg);
}

.rune-tree-base-effect--split .rune-tree-base-effect-accent-a,
.rune-tree-base-effect--split .rune-tree-base-effect-accent-b {
  right: 0;
  width: 12px;
  height: 12px;
  border: 1.5px solid rgb(215 86 255 / 76%);
  border-radius: 50%;
  background: rgb(215 86 255 / 8%);
}

.rune-tree-base-effect--split .rune-tree-base-effect-accent-a { top: 5px; }
.rune-tree-base-effect--split .rune-tree-base-effect-accent-b { bottom: 5px; }

.rune-tree-base-effect--chain .rune-tree-base-effect-core,
.rune-tree-base-effect--chain .rune-tree-base-effect-accent-a,
.rune-tree-base-effect--chain .rune-tree-base-effect-accent-b {
  width: 11px;
  height: 11px;
  border: 1.5px solid rgb(111 233 255 / 78%);
  border-radius: 50%;
  background: rgb(111 233 255 / 10%);
  box-shadow: 0 0 8px rgb(111 233 255 / 22%);
}

.rune-tree-base-effect--chain .rune-tree-base-effect-core {
  top: 4px;
  right: 4px;
}

.rune-tree-base-effect--chain .rune-tree-base-effect-accent-a {
  top: 23px;
  left: 22px;
  border-color: rgb(215 86 255 / 82%);
}

.rune-tree-base-effect--chain .rune-tree-base-effect-accent-b {
  bottom: 4px;
  left: 4px;
}

.rune-tree-base-effect--chain::before,
.rune-tree-base-effect--chain::after {
  position: absolute;
  width: 26px;
  height: 1.5px;
  background: rgb(143 77 255 / 70%);
  content: '';
  transform-origin: left center;
}

.rune-tree-base-effect--chain::before {
  top: 13px;
  left: 14px;
  transform: rotate(38deg);
}

.rune-tree-base-effect--chain::after {
  top: 36px;
  left: 16px;
  transform: rotate(142deg);
}
'''
path.write_text(text)

# Orbit should read as sustained control, not a short cosmetic variant.
path = Path('rune-ball/src/progression/VortexEvolutionTuning.ts')
text = path.read_text()
text = replace_once(text, 'durationSeconds: 1.35,', 'durationSeconds: 1.70,', 'Orbit T1 duration')
text = replace_once(text, 'durationSeconds: 1.85,', 'durationSeconds: 2.40,', 'Orbit T2 duration')
path.write_text(text)

# Shared top telemetry row for time / score / combo.
path = Path('rune-ball/src/presentation/ArenaLayout.ts')
text = path.read_text()
text = replace_once(text, '  scoreY: number;\n', '  telemetryY: number;\n  scoreY: number;\n', 'telemetry layout field')
text = replace_once(
    text,
    '  return {\n    bounds,\n    scoreY: Math.max(58, bounds.top - 32),',
    '  const telemetryY = Math.max(64, bounds.top - 32);\n\n  return {\n    bounds,\n    telemetryY,\n    scoreY: telemetryY,',
    'telemetry layout return',
)
path.write_text(text)

path = Path('rune-ball/src/presentation/DestructionScene.ts')
text = path.read_text()
text = replace_once(text, '    this.scoreText.anchor.set(0, 0);\n    this.comboText.anchor.set(1, 0);', '    this.scoreText.anchor.set(0, 0.5);\n    this.comboText.anchor.set(1, 0.5);', 'telemetry vertical anchors')
text = replace_once(text, '    this.scoreText.position.set(left + 14, this.arenaLayout.scoreY);\n    this.comboText.position.set(right - 14, this.arenaLayout.scoreY);', '    this.scoreText.position.set(left + 14, this.arenaLayout.telemetryY);\n    this.comboText.position.set(right - 14, this.arenaLayout.telemetryY);', 'telemetry positions')
path.write_text(text)

path = Path('rune-ball/src/presentation/SessionChrome.ts')
text = path.read_text()
text = replace_once(text, "import type { SessionSnapshot, SessionStats } from '../game/SessionDirector';", "import type { SessionSnapshot, SessionStats } from '../game/SessionDirector';\nimport { calculateArenaLayout } from './ArenaLayout';", 'SessionChrome layout import')
text = replace_once(
    text,
    '  setVisible(visible: boolean): void {\n    this.root.hidden = !visible;\n  }',
    "  setViewport(width: number, height: number): void {\n    const layout = calculateArenaLayout(width, height);\n    this.root.style.setProperty('--session-telemetry-y', `${layout.telemetryY}px`);\n  }\n\n  setVisible(visible: boolean): void {\n    this.root.hidden = !visible;\n  }",
    'SessionChrome viewport contract',
)
path.write_text(text)

path = Path('rune-ball/src/main.ts')
text = path.read_text()
text = replace_once(
    text,
    '    chrome.render(session.snapshot);\n    chrome.setVisible(false);',
    '    chrome.setViewport(nextApp.screen.width, nextApp.screen.height);\n    chrome.render(session.snapshot);\n    chrome.setVisible(false);',
    'initial chrome viewport',
)
text = replace_once(
    text,
    '      nextApp.renderer.resize(width, height);\n      scene?.setViewport(width, height);',
    '      nextApp.renderer.resize(width, height);\n      scene?.setViewport(width, height);\n      chrome?.setViewport(width, height);',
    'resized chrome viewport',
)
path.write_text(text)

path = Path('rune-ball/src/session.css')
text = path.read_text()
text += r'''

/* P8.2.2 — one calm telemetry row above the collision frame. */
.session-hud {
  top: var(--session-telemetry-y, 64px);
  gap: 1px;
  min-width: 88px;
  transform: translate(-50%, -50%);
}

.session-phase {
  font-size: 8px;
  letter-spacing: 0.16em;
}

.session-timer {
  font-size: 21px;
  letter-spacing: 0.07em;
}

.session-hint {
  position: absolute;
  top: 34px;
  left: 50%;
  margin-top: 0;
  transform: translateX(-50%);
}
'''
path.write_text(text)

# Tests lock layout semantics and the longer Orbit identity.
path = Path('rune-ball/tests/arena-layout.test.ts')
text = path.read_text()
text = replace_once(
    text,
    '    expect(layout.scoreY).toBeLessThan(layout.bounds.top);',
    '    expect(layout.telemetryY).toBe(layout.scoreY);\n    expect(layout.telemetryY).toBeLessThan(layout.bounds.top);',
    'telemetry row assertion',
)
path.write_text(text)

path = Path('rune-ball/tests/vortex-evolution-tuning.test.ts')
text = path.read_text()
text = replace_once(text, 'expect(orbitT1.durationSeconds).toBeGreaterThan(gravityT1.durationSeconds * 1.5);', 'expect(orbitT1.durationSeconds).toBeGreaterThan(gravityT1.durationSeconds * 2);', 'Orbit T1 ratio')
text = replace_once(text, 'expect(orbitT2.durationSeconds).toBeGreaterThan(gravityT2.durationSeconds * 1.75);', 'expect(orbitT2.durationSeconds).toBeGreaterThan(gravityT2.durationSeconds * 2.25);', 'Orbit T2 ratio')
path.write_text(text)

# Milestone note.
path = Path('rune-ball/README.md')
text = path.read_text()
text = replace_once(text, '**P8.2.1 — Rune Tree + Arena Clarity Refinement**', '**P8.2.2 — Runtime Readability Refinement**', 'README milestone')
marker = 'P8.2.2 closes the follow-up readability pass from phone playtesting:'
if marker not in text:
    insertion = """

P8.2.2 closes the follow-up readability pass from phone playtesting:

- Rune Tree Base nodes now depict each Rune's **gameplay effect** rather than repeating its input gesture glyph; Rune cards remain the gesture/identity surface.
- Orbit control windows are extended again so `Orbit` / `Event Horizon` read as sustained capture/control.
- Time, Score, and Combo share one top telemetry row derived from `ArenaLayout`, with the Flow/Overdrive meter acting as the divider before the collision frame.
"""
    text = text.replace('\n### Product shell contract\n', insertion + '\n### Product shell contract\n', 1)
path.write_text(text)

Path('docs/plans/rune-ball/P8-2-2-RUNTIME-READABILITY.md').write_text('''# Rune Ball — P8.2.2 Runtime Readability Refinement

## Risk question

**Can the Rune Tree communicate gameplay effects rather than input notation, while the run HUD reads as one deliberate telemetry system instead of several independently positioned labels?**

## Decisions

- Rune cards remain the gesture / identity surface.
- Tree Base nodes use effect semantics: Vortex field, Split echoes, Chain propagation.
- Tapping evolution nodes continues to switch the active path immediately.
- Orbit T1 lasts 1.70s; Event Horizon T2 lasts 2.40s. Gravity tuning is unchanged.
- Time, Score, and Combo share one top telemetry row. Flow/Overdrive remains immediately above the collision frame.
- Arena and Rune gutters remain unchanged so the cleaner HUD does not reduce gesture room.

## Phone gate

1. Base Rune nodes read as skill effects rather than drawing instructions.
2. Time is visually primary; Score and Combo flank it without competing for attention.
3. Flow/Overdrive reads as the transition from telemetry into the Arena rather than another floating HUD element.
4. Orbit feels clearly sustained without becoming a long passive lock state.
5. Short-phone gesture space remains unchanged.
''')
