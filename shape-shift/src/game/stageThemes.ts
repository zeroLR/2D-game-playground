// ── Stage theme configuration ───────────────────────────────────────────────
// Each normal-mode stage has a distinct background colour palette. The theme is
// injected into the Pixi `Application.background` and the grid renderer so the
// visual vibe changes per stage while the gameplay code stays untouched.

export interface StageTheme {
  /** Human-readable label shown in stage select. */
  name: string;
  /** Pixi background colour (hex int). */
  background: number;
  /** Grid-line colour. */
  gridColor: number;
  /** CSS hex string for overlay backdrop (keeps DOM overlay readable). */
  overlayBg: string;
  /** Whether this is a dark theme (affects entity contrast rendering). */
  dark?: boolean;
  /** Player body colour override for contrast on dark backgrounds. */
  playerColor?: number;
  /** Enemy stroke colour override for contrast on dark backgrounds. */
  enemyStroke?: number;
}

export const STAGE_THEMES: readonly StageTheme[] = [
  {
    name: "White Grid",
    background: 0xffffff,
    gridColor: 0xf0f0f0,
    overlayBg: "rgba(255,255,255,0.82)",
  },
  {
    name: "Deep Blue",
    background: 0x0a0e2a,
    gridColor: 0x1a2555,
    overlayBg: "rgba(10,14,42,0.62)",
    dark: true,
    playerColor: 0x00e5ff,
    enemyStroke: 0xaaccff,
  },
  {
    name: "Dark Core",
    background: 0x1a0808,
    gridColor: 0x3a1a0a,
    overlayBg: "rgba(26,8,8,0.62)",
    dark: true,
    playerColor: 0xff6e40,
    enemyStroke: 0xffccaa,
  },
];

/** The default theme (stage 0 / survival fallback). */
export const DEFAULT_THEME: StageTheme = STAGE_THEMES[0]!;
