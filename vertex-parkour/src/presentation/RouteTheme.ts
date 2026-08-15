import type { RouteKind } from '../world/WorldGenerator';
import { Palette } from './visuals';

export type RouteThemeStyle = {
  accent: number;
  platformTint: number;
  ambient: number;
  ambientAlpha: number;
  mote: number;
};

const THEMES: Record<RouteKind, RouteThemeStyle> = {
  treasure: { accent: Palette.gold, platformTint: 0xf0c765, ambient: 0xc88b2f, ambientAlpha: 0.075, mote: 0xf2d28b },
  elite: { accent: Palette.magenta, platformTint: 0xc95a86, ambient: 0x8b315d, ambientAlpha: 0.085, mote: 0xd86598 },
  rest: { accent: Palette.tealSoft, platformTint: 0x9edfd8, ambient: 0x2f8f91, ambientAlpha: 0.06, mote: 0xa7ebe2 },
  skill: { accent: 0x9abce8, platformTint: 0x7fa9e6, ambient: 0x365c9b, ambientAlpha: 0.075, mote: 0x91baff },
};

export function getRouteTheme(kind: RouteKind): RouteThemeStyle {
  return THEMES[kind];
}

export function getRouteAccent(kind: RouteKind) {
  return getRouteTheme(kind).accent;
}
