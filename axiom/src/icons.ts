// ── Inline SVG icon library ──────────────────────────────────────────────────
// Every visible icon in Axiom is a pure-geometric SVG. No emoji, no bitmap.
// Each function returns an SVG string sized to 1em so it scales with font-size.
// Use `innerHTML` (or the helper `iconEl`) to inject them into the DOM.

/** Shared SVG wrapper: 1em × 1em viewBox 0 0 24 24, inline style for vertical alignment. */
function wrap(inner: string, vb = "0 0 24 24"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-0.125em">${inner}</svg>`;
}

/** Filled variant (no stroke, uses fill=currentColor). */
function wrapFill(inner: string, vb = "0 0 24 24"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="1em" height="1em" fill="currentColor" stroke="none" style="vertical-align:-0.125em">${inner}</svg>`;
}

// ── GUI / navigation icons ──────────────────────────────────────────────────

/** ☰  Three horizontal lines (hamburger menu). */
export const iconMenu = wrap(
  `<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>`,
);

/** ▶  Right-pointing triangle (play / normal mode). */
export const iconPlay = wrapFill(
  `<polygon points="6,3 20,12 6,21"/>`,
);

/** ∞  Infinity / figure-eight (survival mode). */
export const iconInfinity = wrap(
  `<path d="M6 12c0-2.5 2-4.5 4.5-4.5S15 9.5 15 12s-2 4.5-4.5 4.5S6 14.5 6 12zm12 0c0-2.5-2-4.5-4.5-4.5S9 9.5 9 12s2 4.5 4.5 4.5S18 14.5 18 12z"/>`,
);

/** ← Left-pointing arrow (back). */
export const iconBack = wrap(
  `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,5 5,12 12,19"/>`,
);

/** Shop: diamond shape (gem). */
export const iconShop = wrap(
  `<polygon points="12,2 22,10 12,22 2,10"/>`,
);

/** Equipment: hexagonal nut outline. */
export const iconEquipment = wrap(
  `<polygon points="12,2 20,7 20,17 12,22 4,17 4,7"/>`,
);

/** Skills: concentric circles (target / aura). */
export const iconSkills = wrap(
  `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/>`,
);

/** Achievements: pentagon (badge). */
export const iconAchievements = wrap(
  `<polygon points="12,2 22.5,9.5 18.5,22 5.5,22 1.5,9.5"/>`,
);

/** Export: upward arrow through a line. */
export const iconExport = wrap(
  `<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5,12 12,5 19,12"/><line x1="4" y1="22" x2="20" y2="22"/>`,
);

/** Import: downward arrow through a line. */
export const iconImport = wrap(
  `<line x1="12" y1="5" x2="12" y2="19"/><polyline points="5,12 12,19 19,12"/><line x1="4" y1="2" x2="20" y2="2"/>`,
);

/** Skins tab: overlapping shapes (circle + square). */
export const iconSkins = wrap(
  `<circle cx="10" cy="10" r="6"/><rect x="11" y="11" width="10" height="10" rx="1"/>`,
);

/** Enhance tab: upward chevron stack. */
export const iconEnhance = wrap(
  `<polyline points="6,18 12,12 18,18"/><polyline points="6,13 12,7 18,13"/>`,
);

// ── Skill button icons ──────────────────────────────────────────────────────

/** Time Stop: octagon (stop-sign shape). */
export const iconTimeStop = wrap(
  `<polygon points="8,2 16,2 22,8 22,16 16,22 8,22 2,16 2,8"/>`,
);

/** Shadow Clone: overlapping squares. */
export const iconClone = wrap(
  `<rect x="2" y="6" width="12" height="12" rx="1"/><rect x="10" y="2" width="12" height="12" rx="1"/>`,
);

// ── Card / item glyph icons (larger, 36×36 display) ─────────────────────────
// These map to the `glyph` field in data structures. Rendered in `.card-glyph`.

/** Large SVG glyph wrapper: meant for the card-glyph container. */
function glyphWrap(inner: string, vb = "0 0 24 24"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="1.4em" height="1.4em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

function glyphFill(inner: string, vb = "0 0 24 24"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="1.4em" height="1.4em" fill="currentColor" stroke="none">${inner}</svg>`;
}

// ── Card glyphs ─────────────────────────────────────────────────────────────

/** △  Sharp Edge: upward triangle outline. */
export const glyphSharp = glyphWrap(
  `<polygon points="12,3 22,21 2,21"/>`,
);

/** ⟫  Rapid Fire: double chevrons right. */
export const glyphRapid = glyphWrap(
  `<polyline points="5,6 12,12 5,18"/><polyline points="13,6 20,12 13,18"/>`,
);

/** →  Velocity: right arrow. */
export const glyphVelocity = glyphWrap(
  `<line x1="4" y1="12" x2="20" y2="12"/><polyline points="14,6 20,12 14,18"/>`,
);

/** ⋔  Fork: branching lines. */
export const glyphFork = glyphWrap(
  `<line x1="12" y1="20" x2="12" y2="10"/><line x1="12" y1="10" x2="6" y2="4"/><line x1="12" y1="10" x2="18" y2="4"/>`,
);

/** ◇  Pierce: diamond outline. */
export const glyphPierce = glyphWrap(
  `<polygon points="12,2 22,12 12,22 2,12"/>`,
);

/** ✦  Crit: four-pointed star. */
export const glyphCrit = glyphFill(
  `<polygon points="12,1 14,9 22,9 15.5,14 18,22 12,17 6,22 8.5,14 2,9 10,9"/>`,
);

/** ▢  Plating: square outline. */
export const glyphPlating = glyphWrap(
  `<rect x="3" y="3" width="18" height="18" rx="2"/>`,
);

/** ≫  Dash: double right arrows. */
export const glyphDash = glyphWrap(
  `<polyline points="4,6 10,12 4,18"/><polyline points="14,6 20,12 14,18"/>`,
);

/** ◎  Overclock: concentric circles. */
export const glyphOverclock = glyphWrap(
  `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>`,
);

/** ■  Heavy Rounds: filled square. */
export const glyphHeavy = glyphFill(
  `<rect x="3" y="3" width="18" height="18" rx="2"/>`,
);

/** ⇌  Rebound: double-headed arrow. */
export const glyphRebound = glyphWrap(
  `<line x1="4" y1="12" x2="20" y2="12"/><polyline points="8,6 4,12 8,18"/><polyline points="16,6 20,12 16,18"/>`,
);

/** ※  Ignite: radiating lines (burst). */
export const glyphIgnite = glyphWrap(
  `<line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/><line x1="19.1" y1="4.9" x2="4.9" y2="19.1"/>`,
);

/** Freeze: hexagonal snowflake (6 lines from center). */
export const glyphFreeze = glyphWrap(
  `<line x1="12" y1="2" x2="12" y2="22"/><line x1="3.3" y1="7" x2="20.7" y2="17"/><line x1="3.3" y1="17" x2="20.7" y2="7"/><line x1="9" y1="3.5" x2="12" y2="6"/><line x1="15" y1="3.5" x2="12" y2="6"/><line x1="9" y1="20.5" x2="12" y2="18"/><line x1="15" y1="20.5" x2="12" y2="18"/>`,
);

/** ⌇  Arc: curved line with endpoints. */
export const glyphArc = glyphWrap(
  `<path d="M4 18 Q12 2 20 18"/>`,
);

// ── Skin glyphs ─────────────────────────────────────────────────────────────

/** □  Square form. */
export const glyphSquareForm = glyphWrap(
  `<rect x="4" y="4" width="16" height="16"/>`,
);

/** ◇  Diamond form. */
export const glyphDiamondForm = glyphWrap(
  `<polygon points="12,2 22,12 12,22 2,12"/>`,
);

/** Hexagon form. */
export const glyphHexagonForm = glyphWrap(
  `<polygon points="12,2 21,7 21,17 12,22 3,17 3,7"/>`,
);

/** ★  Star form. */
export const glyphStarForm = glyphFill(
  `<polygon points="12,1 15,9 23,9 17,14.5 19,22 12,17.5 5,22 7,14.5 1,9 9,9"/>`,
);

/** Boss form (filled hexagon). */
export const glyphBossForm = glyphFill(
  `<polygon points="12,2 21,7 21,17 12,22 3,17 3,7"/>`,
);

// ── Equipment card glyphs ───────────────────────────────────────────────────

/** ▣  Toughness: square with inner cross. */
export const glyphToughness = glyphWrap(
  `<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>`,
);

/** »  Swiftness: angle-double-right. */
export const glyphSwiftness = glyphWrap(
  `<polyline points="5,6 11,12 5,18"/><polyline points="13,6 19,12 13,18"/>`,
);

/** ▲  Sharp Shot: filled triangle. */
export const glyphSharpShot = glyphFill(
  `<polygon points="12,3 22,21 2,21"/>`,
);

/** Quick Draw: nested chevrons (fast forward). */
export const glyphQuickDraw = glyphWrap(
  `<polyline points="4,6 10,12 4,18"/><polyline points="14,6 20,12 14,18"/><line x1="20" y1="6" x2="20" y2="18"/>`,
);

/** ↗  Long Range: diagonal arrow. */
export const glyphLongRange = glyphWrap(
  `<line x1="5" y1="19" x2="19" y2="5"/><polyline points="10,5 19,5 19,14"/>`,
);

/** ♦  Lucky Strike: diamond. */
export const glyphLucky = glyphFill(
  `<polygon points="12,2 20,12 12,22 4,12"/>`,
);

// ── Slot expansion glyphs ───────────────────────────────────────────────────

/** ④  4th Slot: number 4 inside a circle. */
export const glyphSlot4 = glyphWrap(
  `<circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="12" font-family="monospace" fill="currentColor" stroke="none">4</text>`,
);

/** ⑤  5th Slot: number 5 inside a circle. */
export const glyphSlot5 = glyphWrap(
  `<circle cx="12" cy="12" r="10"/><text x="12" y="16" text-anchor="middle" font-size="12" font-family="monospace" fill="currentColor" stroke="none">5</text>`,
);

// ── Achievement glyphs ──────────────────────────────────────────────────────

/** ⚔  Shape Slayer: crossed lines. */
export const glyphCrossedSwords = glyphWrap(
  `<line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/><line x1="4" y1="4" x2="8" y2="4"/><line x1="4" y1="4" x2="4" y2="8"/><line x1="20" y1="4" x2="16" y2="4"/><line x1="20" y1="4" x2="20" y2="8"/>`,
);

/** ✧  Four-pointed star outline (Awakened / draw skill). */
export const glyphStar4 = glyphWrap(
  `<polygon points="12,2 14,10 22,12 14,14 12,22 10,14 2,12 10,10"/>`,
);

/** ○  Circle outline (Minimalist). */
export const glyphCircleOutline = glyphWrap(
  `<circle cx="12" cy="12" r="10"/>`,
);

/** ◉  Circle with dot (Purist). */
export const glyphCircleDot = glyphWrap(
  `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/>`,
);

// ── Misc glyphs ─────────────────────────────────────────────────────────────

/** △  Default triangle skin glyph. */
export const glyphTriangle = glyphWrap(
  `<polygon points="12,3 22,21 2,21"/>`,
);

/** Primal core label glyph (✧). */
export const glyphCore = glyphWrap(
  `<polygon points="12,2 14,10 22,12 14,14 12,22 10,14 2,12 10,10"/>`,
);

// ── Glyph lookup maps ───────────────────────────────────────────────────────
// Maps card / shop-item / achievement IDs to their SVG glyph string.

export const CARD_GLYPHS: Record<string, string> = {
  sharp: glyphSharp,
  rapid: glyphRapid,
  velocity: glyphVelocity,
  fork: glyphFork,
  pierce: glyphPierce,
  crit: glyphCrit,
  plating: glyphPlating,
  dash: glyphDash,
  overclock: glyphOverclock,
  heavy: glyphHeavy,
  rebound: glyphRebound,
  ignite: glyphIgnite,
  freeze: glyphFreeze,
  arc: glyphArc,
};

export const SHOP_GLYPHS: Record<string, string> = {
  "skin-square": glyphSquareForm,
  "skin-diamond": glyphDiamondForm,
  "skin-hexagon": glyphHexagonForm,
  "skin-star": glyphStarForm,
  "skin-boss": glyphBossForm,
  "eq-toughness": glyphToughness,
  "eq-swiftness": glyphSwiftness,
  "eq-sharpshot": glyphSharpShot,
  "eq-quickdraw": glyphQuickDraw,
  "eq-longrange": glyphLongRange,
  "eq-lucky": glyphLucky,
  "slot-4": glyphSlot4,
  "slot-5": glyphSlot5,
};

export const ACHIEVEMENT_GLYPHS: Record<string, string> = {
  firstBossKill: glyphCrossedSwords,
  firstPrimalSkill: glyphStar4,
  noPowerNormalClear: glyphCircleOutline,
  noPowerSurvival16: glyphCircleDot,
};

export const SKILL_GLYPHS: Record<string, string> = {
  timeStop: iconTimeStop,
  shadowClone: iconClone,
};

// ── Helper to create a DOM element from SVG string ──────────────────────────

/**
 * Sets `el.innerHTML` to the SVG string. Use for elements that previously
 * held a single emoji glyph (e.g. `.card-glyph`, `.skill-btn`).
 */
export function setIconHtml(el: HTMLElement, svgHtml: string): void {
  el.innerHTML = svgHtml;
}

/**
 * Create a `<span>` element containing an inline SVG icon.
 * Useful when building buttons: `btn.prepend(iconSpan(iconPlay))`.
 */
export function iconSpan(svgHtml: string): HTMLSpanElement {
  const s = document.createElement("span");
  s.className = "svg-icon";
  s.innerHTML = svgHtml;
  s.setAttribute("aria-hidden", "true");
  return s;
}
