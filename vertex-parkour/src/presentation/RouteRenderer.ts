import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { ROUTE_ZONE_HALF_HEIGHT, ROUTE_ZONE_HALF_WIDTH } from '../world/RouteChoice';
import type { RouteKind } from '../world/WorldGenerator';
import { Palette } from './visuals';

const META: Record<RouteKind, { label: string; detail: string; accent: number; hint: string }> = {
  treasure: { label: 'TREASURE', detail: 'REWARD ROUTE', accent: Palette.gold, hint: 'ENTER FOR CRYSTALS' },
  elite: { label: 'ELITE', detail: 'HIGH PRESSURE', accent: Palette.magenta, hint: 'ENTER FOR RISK' },
  rest: { label: 'REST', detail: 'RECOVERY ROUTE', accent: Palette.tealSoft, hint: 'ENTER TO RECOVER' },
  skill: { label: 'SKILL', detail: 'BUILD CHOICE', accent: 0x9abce8, hint: 'ENTER TO BUILD' },
};

export function getRouteAccent(kind: RouteKind) { return META[kind].accent; }

export function createRouteVisual(kind: RouteKind): Container {
  const root = new Container();
  const meta = META[kind];
  const zone = new Graphics();
  zone.roundRect(-ROUTE_ZONE_HALF_WIDTH, -ROUTE_ZONE_HALF_HEIGHT, ROUTE_ZONE_HALF_WIDTH * 2, ROUTE_ZONE_HALF_HEIGHT * 2, 18)
    .fill({ color: meta.accent, alpha: 0.075 });
  zone.roundRect(-ROUTE_ZONE_HALF_WIDTH, -ROUTE_ZONE_HALF_HEIGHT, ROUTE_ZONE_HALF_WIDTH * 2, ROUTE_ZONE_HALF_HEIGHT * 2, 18)
    .stroke({ width: 1.2, color: meta.accent, alpha: 0.28 });
  zone.rect(-ROUTE_ZONE_HALF_WIDTH + 10, ROUTE_ZONE_HALF_HEIGHT - 8, ROUTE_ZONE_HALF_WIDTH * 2 - 20, 3)
    .fill({ color: meta.accent, alpha: 0.42 });

  const header = new Text({ text: meta.label, style: new TextStyle({ fill: '#f0eadf', fontSize: 12, fontWeight: '600', letterSpacing: 2.1 }) });
  header.anchor.set(0.5); header.position.set(0, -56);
  const detail = new Text({ text: meta.detail, style: new TextStyle({ fill: '#b7cbc8', fontSize: 7, letterSpacing: 0.8 }) });
  detail.anchor.set(0.5); detail.position.set(0, -38);
  const enter = new Text({ text: meta.hint, style: new TextStyle({ fill: '#f0eadf', fontSize: 6.5, fontWeight: '600', letterSpacing: 0.7 }) });
  enter.anchor.set(0.5); enter.position.set(0, 57); enter.alpha = 0.52;
  enter.label = 'route-hint';

  const marker = new Graphics();
  marker.moveTo(-13, 3).lineTo(0, 14).lineTo(13, 3).stroke({ width: 2, color: meta.accent, alpha: 0.72 });
  marker.moveTo(-8, -5).lineTo(0, 2).lineTo(8, -5).stroke({ width: 1.5, color: meta.accent, alpha: 0.42 });

  root.addChild(zone, header, detail, marker, enter);
  return root;
}

export function updateRouteVisual(view: Container, taken: boolean, locked: boolean, elapsed: number) {
  if (locked) {
    view.alpha = 0.12;
    view.scale.set(0.98);
    return;
  }
  if (taken) {
    view.alpha = 1;
    view.scale.set(1.025 + Math.sin(elapsed * 7) * 0.008);
    const hint = view.getChildByLabel('route-hint') as Text | null;
    if (hint) { hint.text = 'ROUTE SELECTED'; hint.alpha = 0.95; }
    return;
  }
  view.alpha = 0.78 + Math.sin(elapsed * 2.2) * 0.05;
  view.scale.set(1);
}
