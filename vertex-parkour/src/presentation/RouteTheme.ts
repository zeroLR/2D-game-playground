import type { RouteKind } from '../world/WorldGenerator';
import { Palette } from './visuals';

export type RouteThemeStyle = {
  accent: number;
  platformTint: number;
};

const THEMES: Record<RouteKind, RouteThemeStyle> = {
  treasure: { accent: Palette.gold, platformTint: 0xf0c765 },
  elite: { accent: Palette.magenta, platformTint: 0xc95a86 },
  rest: { accent: Palette.tealSoft, platformTint: 0x9edfd8 },
  skill: { accent: 0x9abce8, platformTint: 0x7fa9e6 },
};

export function getRouteTheme(kind: RouteKind): RouteThemeStyle {
  return THEMES[kind];
}

export function getRouteAccent(kind: RouteKind) {
  return getRouteTheme(kind).accent;
}
