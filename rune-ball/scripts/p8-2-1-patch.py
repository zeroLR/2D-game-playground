from pathlib import Path
import re


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f"missing replacement target: {label}")
    return text.replace(old, new, 1)


def sub_once(text: str, pattern: str, repl: str, label: str) -> str:
    updated, count = re.subn(pattern, repl, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"expected one regex replacement for {label}, got {count}")
    return updated


# GameShell: direct node selection is the configuration gesture.
path = Path("rune-ball/src/presentation/GameShell.ts")
text = path.read_text()
text = replace_once(
    text,
    "    intro.textContent = 'Inspect evolution nodes, then equip one path. During a run, qualified Rune uses advance that path automatically.';",
    "    intro.textContent = 'Choose a Rune, then tap an evolution symbol to make that path active. Qualified uses evolve it automatically during a run.';",
    "Rune screen intro",
)
text = replace_once(
    text,
    "      onEquipVortexPath: (path) => {",
    "      onVortexPathChange: (path) => {",
    "RuneTree callback",
)
path.write_text(text)


# RuneTreePanel: keep Rune cards, make the graph glyph-first, and switch path on node tap.
path = Path("rune-ball/src/presentation/RuneTreePanel.ts")
text = path.read_text()
text = text.replace("onEquipVortexPath", "onVortexPathChange")
text = replace_once(text, "import '../rune-tree.css';", "import '../rune-tree.css';\nimport '../rune-tree-refinement.css';", "refinement CSS import")
text = replace_once(text, "    const activePath = getVortexPathDefinition(this.selectedPath);\n\n", "", "active path local")
text = sub_once(
    text,
    r"    const summary = document\.createElement\('div'\);\n    summary\.className = 'rune-tree-active-build';.*?    summary\.append\(summaryLabel, summaryValue, summaryIdentity\);\n\n",
    "",
    "Vortex active summary",
)
text = sub_once(
    text,
    r"    const identity = document\.createElement\('header'\);\n    identity\.className = 'rune-tree-identity';.*?    identity\.append\(glyph, identityCopy\);\n\n",
    "",
    "Vortex identity copy",
)
text = replace_once(
    text,
    "    baseNode.innerHTML = '<span>BASE</span><strong>VORTEX</strong><small>START OF RUN</small>';",
    "    baseNode.setAttribute('aria-label', 'Base Vortex');\n    const baseGlyph = document.createElement('span');\n    baseGlyph.className = 'rune-tree-node-base-glyph';\n    baseGlyph.textContent = base.glyph;\n    baseGlyph.setAttribute('aria-hidden', 'true');\n    baseNode.append(baseGlyph);",
    "Vortex base node",
)
text = sub_once(
    text,
    r"      const branchHeader = document\.createElement\('div'\);\n      branchHeader\.className = 'rune-tree-branch-header';.*?      branchHeader\.append\(pathTitle, pathIdentity\);\n",
    "      const pathMark = document.createElement('span');\n      pathMark.className = `rune-tree-path-mark rune-tree-path-mark--${path}`;\n      pathMark.setAttribute('aria-hidden', 'true');\n",
    "Vortex branch header",
)
text = text.replace("      branch.append(branchHeader, tierOne, rail, tierTwo);", "      branch.append(pathMark, tierOne, rail, tierTwo);")
text = replace_once(
    text,
    "    graph.append(identity, baseNode, branches);\n    this.treeMount.append(summary, graph);",
    "    graph.append(baseNode, branches);\n    this.treeMount.append(graph);",
    "Vortex graph composition",
)
text = sub_once(
    text,
    r"    const tierLabel = document\.createElement\('span'\);.*?    button\.append\(tierLabel, name, trigger\);",
    "    const sigil = document.createElement('span');\n    sigil.className = `rune-tree-node-sigil rune-tree-node-sigil--${path} rune-tree-node-sigil--tier-${tier}`;\n    sigil.setAttribute('aria-hidden', 'true');\n    const core = document.createElement('span');\n    core.className = 'rune-tree-node-sigil-core';\n    sigil.append(core);\n    button.append(sigil);",
    "evolution node copy",
)
text = replace_once(
    text,
    "    button.addEventListener('click', () => {\n      this.selectedNode = { kind: 'evolution', path, tier };\n      this.syncNodeSelection();\n      this.renderDetail();\n    });",
    "    button.addEventListener('click', () => {\n      if (path !== this.selectedPath) {\n        this.selectedPath = path;\n        this.callbacks.onVortexPathChange(path);\n      }\n      this.selectedNode = { kind: 'evolution', path, tier };\n      this.syncVortexState();\n      this.renderDetail();\n    });",
    "direct path selection",
)
text = sub_once(
    text,
    r"    const summary = document\.createElement\('div'\);\n    summary\.className = 'rune-tree-active-build rune-tree-active-build-future';.*?\n\n",
    "",
    "future summary",
)
text = sub_once(
    text,
    r"    const identity = document\.createElement\('header'\);\n    identity\.className = 'rune-tree-identity';.*?\n    \]\.join\(''\);\n\n",
    "",
    "future identity",
)
text = replace_once(
    text,
    "    baseNode.innerHTML = `<span>BASE</span><strong>${definition.name}</strong><small>AVAILABLE</small>`;",
    "    const baseGlyph = document.createElement('span');\n    baseGlyph.className = 'rune-tree-node-base-glyph';\n    baseGlyph.textContent = definition.glyph;\n    baseGlyph.setAttribute('aria-hidden', 'true');\n    baseNode.append(baseGlyph);",
    "future base glyph",
)
text = sub_once(
    text,
    r"      branch\.className = 'rune-tree-branch rune-tree-future-branch';\n      branch\.innerHTML = \[.*?      \]\.join\(''\);",
    "      branch.className = 'rune-tree-branch rune-tree-future-branch';\n      branch.innerHTML = [\n        '<span class=\"rune-tree-future-path-mark\" aria-hidden=\"true\"></span>',\n        '<div class=\"rune-tree-node rune-tree-future-node\"><span class=\"rune-tree-future-node-mark\" aria-hidden=\"true\"></span></div>',\n        '<span class=\"rune-tree-rail\" aria-hidden=\"true\"></span>',\n        '<div class=\"rune-tree-node rune-tree-future-node\"><span class=\"rune-tree-future-node-mark rune-tree-future-node-mark--final\" aria-hidden=\"true\"></span></div>',\n      ].join('');",
    "future branch glyphs",
)
text = replace_once(
    text,
    "    graph.append(identity, baseNode, branches);\n    this.treeMount.append(summary, graph);",
    "    graph.append(baseNode, branches);\n    this.treeMount.append(graph);",
    "future graph composition",
)
text = sub_once(
    text,
    r"    const action = document\.createElement\('button'\);.*?    card\.append\(action\);",
    "    const active = document.createElement('span');\n    active.className = 'rune-tree-detail-active';\n    active.textContent = `${path.title} PATH ACTIVE`;\n    card.append(active);",
    "detail Equip CTA",
)
text = sub_once(
    text,
    r"\n  private equipPath\(path: VortexEvolutionPath\): void \{.*?\n  \}\n\n  private syncVortexState",
    "\n  private syncVortexState",
    "equipPath method",
)
text = sub_once(
    text,
    r"\n    const active = this\.treeMount\.querySelector<HTMLElement>\('\.rune-tree-active-build'\);.*?\n    \}",
    "",
    "active summary synchronization",
)
path.write_text(text)


# Vortex gameplay tuning lives in one domain-adjacent module.
path = Path("rune-ball/src/game/DestructionSession.ts")
text = path.read_text()
text = replace_once(
    text,
    "import { RuneSystem, type RuneSnapshot } from '../rune/RuneSystem';",
    "import { RuneSystem, type RuneSnapshot } from '../rune/RuneSystem';\nimport {\n  BASE_VORTEX_PROFILE,\n  getVortexCastProfile,\n  type VortexCastProfile,\n} from '../progression/VortexEvolutionTuning';",
    "Vortex tuning import",
)
text = sub_once(
    text,
    r"\ninterface VortexCastProfile \{.*?\n\}\n\nconst BASE_TARGET_COUNT = 8;\nconst OVERDRIVE_TARGET_COUNT = 11;\nconst BASE_VORTEX_PROFILE: VortexCastProfile = \{.*?\n\};",
    "\nconst BASE_TARGET_COUNT = 8;\nconst OVERDRIVE_TARGET_COUNT = 11;",
    "inline Vortex tuning",
)
text = sub_once(
    text,
    r"  private vortexProfileForCurrentStage\(\): VortexCastProfile \{.*?\n  \}\n\n  private enterOverdrive",
    "  private vortexProfileForCurrentStage(): VortexCastProfile {\n    const evolution = this.vortexEvolution.snapshot;\n    return getVortexCastProfile(evolution.path, evolution.stage);\n  }\n\n  private enterOverdrive",
    "Vortex profile method",
)
path.write_text(text)


# DestructionScene: make the visual arena, collision arena and input arena the same bounds;
# telemetry and Rune meters sit in real gutters outside those bounds.
path = Path("rune-ball/src/presentation/DestructionScene.ts")
text = path.read_text()
text = replace_once(
    text,
    "import { ImpactPool } from './ImpactPool';",
    "import { ImpactPool } from './ImpactPool';\nimport { calculateArenaLayout, type ArenaLayout } from './ArenaLayout';",
    "ArenaLayout import",
)
text = replace_once(
    text,
    "  private arenaBounds: ArenaBounds;\n  private viewportWidth = 1;",
    "  private arenaBounds: ArenaBounds;\n  private arenaLayout: ArenaLayout;\n  private viewportWidth = 1;",
    "arenaLayout field",
)
text = replace_once(
    text,
    "    this.arenaBounds = this.calculateArenaBounds(width, height);",
    "    this.arenaLayout = calculateArenaLayout(width, height);\n    this.arenaBounds = this.arenaLayout.bounds;",
    "constructor arena layout",
)
text = replace_once(
    text,
    "    this.arenaBounds = this.calculateArenaBounds(safeWidth, safeHeight);",
    "    this.arenaLayout = calculateArenaLayout(safeWidth, safeHeight);\n    this.arenaBounds = this.arenaLayout.bounds;",
    "viewport arena layout",
)
text = replace_once(
    text,
    "    this.scoreText.position.set(left + 14, top + 16);\n    this.comboText.position.set(right - 14, top + 16);\n    this.runeGuide.position.set(safeWidth / 2, bottom - 20);",
    "    this.scoreText.position.set(left + 14, this.arenaLayout.scoreY);\n    this.comboText.position.set(right - 14, this.arenaLayout.scoreY);\n    this.runeGuide.position.set(safeWidth / 2, this.arenaLayout.runeGuideY);",
    "HUD anchor positions",
)
text = replace_once(
    text,
    "    const { left, right, bottom } = this.arenaBounds;\n    const width = Math.min(150, (right - left) * 0.42);\n    const x = (left + right) / 2 - width / 2;\n    const y = bottom - 14;",
    "    const { left, right } = this.arenaBounds;\n    const width = Math.min(150, (right - left) * 0.42);\n    const x = (left + right) / 2 - width / 2;\n    const y = this.arenaLayout.runeBarY;",
    "Rune bar gutter",
)
text = replace_once(
    text,
    "    const { left, right, top } = this.arenaBounds;\n    const width = Math.min(170, (right - left) * 0.46);\n    const x = (left + right) / 2 - width / 2;\n    const y = top + 17;",
    "    const { left, right } = this.arenaBounds;\n    const width = Math.min(170, (right - left) * 0.46);\n    const x = (left + right) / 2 - width / 2;\n    const y = this.arenaLayout.flowBarY;",
    "Flow bar gutter",
)
text = sub_once(
    text,
    r"\n  private calculateArenaBounds\(width: number, height: number\): ArenaBounds \{.*?\n  \}\n\}",
    "\n}",
    "old arena bounds calculator",
)
path.write_text(text)
