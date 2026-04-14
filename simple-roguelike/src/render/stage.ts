import { Container, Sprite } from "pixi.js";

import type { World } from "../game/world";
import type { TileMap } from "../game/map/tilemap";
import { type Visibility } from "../game/systems/fov";
import { TILE_SIZE, type TextureBank } from "./textures";

const TINT_VISIBLE = 0xffffff;
const TINT_SEEN = 0x555566;

/**
 * Keeps the PIXI display in sync with the authoritative game state.
 *
 * Tile sprites are created once per level in `rebuild()`. Per turn, `redraw()`
 * only updates tints and entity positions — cheap and constant-time.
 */
export class Stage {
  readonly root: Container;
  private readonly tileLayer: Container;
  private readonly entityLayer: Container;
  private readonly textures: TextureBank;
  private tileSprites: Sprite[] = [];
  private map: TileMap | null = null;

  constructor(textures: TextureBank) {
    this.textures = textures;
    this.root = new Container();
    this.tileLayer = new Container();
    this.entityLayer = new Container();
    this.root.addChild(this.tileLayer);
    this.root.addChild(this.entityLayer);
  }

  /** Rebuild all tile sprites for a freshly generated map. */
  rebuild(map: TileMap): void {
    this.map = map;
    this.tileLayer.removeChildren().forEach((c) => c.destroy());
    this.tileSprites = new Array(map.width * map.height);
    for (const [x, y, t] of map.cells()) {
      const spr = new Sprite(this.textures.tiles[t]);
      spr.x = x * TILE_SIZE;
      spr.y = y * TILE_SIZE;
      spr.visible = false; // hidden until FOV reveals it
      this.tileLayer.addChild(spr);
      this.tileSprites[y * map.width + x] = spr;
    }
  }

  /**
   * Paint one frame of the current world state. Cheap enough to call on every
   * player turn — no pooling required at this scale.
   */
  redraw(world: World, vis: Visibility): void {
    const map = this.map;
    if (!map) return;

    // 1. Tile visibility: visible = bright, seen = dim, unseen = hidden.
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const i = y * map.width + x;
        const spr = this.tileSprites[i];
        if (vis.visible.has(i)) {
          spr.visible = true;
          spr.tint = TINT_VISIBLE;
        } else if (vis.seen.has(i)) {
          spr.visible = true;
          spr.tint = TINT_SEEN;
        } else {
          spr.visible = false;
        }
      }
    }

    // 2. Entity layer: clear and re-add only the ones currently visible.
    this.entityLayer.removeChildren();
    for (const [, c] of world.with("position", "renderable")) {
      const i = c.position.y * map.width + c.position.x;
      if (!vis.visible.has(i)) continue;
      const spr = new Sprite(this.textures.sprites[c.renderable.sprite]);
      spr.x = c.position.x * TILE_SIZE;
      spr.y = c.position.y * TILE_SIZE;
      this.entityLayer.addChild(spr);
    }
  }
}
