export type HubPage = 'home' | 'profile' | 'talent' | 'gate' | 'relic' | 'settings';

export type HubNavItem = { id: HubPage; label: string; glyph: string };

export const HUB_NAV: readonly HubNavItem[] = [
  { id: 'home', label: 'HOME', glyph: '◇' },
  { id: 'profile', label: 'RUNNER', glyph: '△' },
  { id: 'talent', label: 'TALENT', glyph: '✦' },
  { id: 'gate', label: 'GATE', glyph: '⬡' },
  { id: 'relic', label: 'RELIC', glyph: '◈' },
  { id: 'settings', label: 'SYSTEM', glyph: '⌁' },
] as const;

export const CHAPTER_ONE_BIOMES = [
  { id: 'teal', label: 'TEAL RUINS', note: 'FOUNDATION', accent: '#70d8cc' },
  { id: 'amber', label: 'AMBER DISTRICT', note: 'MACHINERY', accent: '#f1b45b' },
  { id: 'violet', label: 'VIOLET ZONE', note: 'PURSUIT', accent: '#ad8be8' },
  { id: 'pale', label: 'PALE HEIGHTS', note: 'EXPOSURE', accent: '#d7f2f3' },
  { id: 'crown', label: 'STORM CROWN', note: 'ENDGAME', accent: '#e6cf83' },
] as const;

export const TALENT_NODES = [
  { id: 'origin', label: 'ORIGIN', tier: 0, x: 50, y: 10, state: 'active' },
  { id: 'flow', label: 'FLOW CORE', tier: 1, x: 28, y: 32, state: 'preview' },
  { id: 'dash', label: 'DASH LINK', tier: 1, x: 72, y: 32, state: 'preview' },
  { id: 'abyss', label: 'ABYSS SENSE', tier: 2, x: 18, y: 58, state: 'locked' },
  { id: 'momentum', label: 'MOMENTUM', tier: 2, x: 50, y: 58, state: 'locked' },
  { id: 'rebound', label: 'REBOUND', tier: 2, x: 82, y: 58, state: 'locked' },
  { id: 'apex', label: 'APEX', tier: 3, x: 50, y: 86, state: 'locked' },
] as const;

export const RELIC_PREVIEWS = [
  { name: 'ECHO SHARD', mark: '◈', note: 'A future run-defining relic slot.' },
  { name: 'CROWN FILAMENT', mark: '⌁', note: 'Storm-linked rule modifier concept.' },
  { name: 'ABYSS GLASS', mark: '◇', note: 'Risk / reward relic concept.' },
] as const;
