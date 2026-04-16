import { Application, Container, Graphics, Rectangle, Texture } from "pixi.js";
import type { SpriteKey } from "../game/world";
import { Tile } from "../game/map/tiles";

export const TILE_SIZE = 16;

export type TextureBank = {
  tiles: Record<Tile, Texture>;
  sprites: Record<SpriteKey, Texture>;
};

/**
 * Build every texture the game uses once at boot, from pure `PIXI.Graphics`.
 *
 * No external asset files — each glyph is a few colored rectangles drawn at
 * integer coordinates, so the result looks pixel-art without shipping a PNG.
 * Edit these to retheme the game.
 */
export function buildTextures(app: Application): TextureBank {
  return {
    tiles: {
      [Tile.Wall]: makeTexture(app, drawWall),
      [Tile.Floor]: makeTexture(app, drawFloor),
      [Tile.Stairs]: makeTexture(app, drawStairs),
    },
    sprites: {
      player: makeTexture(app, drawPlayer),
      goblin: makeTexture(app, drawGoblin),
      rat: makeTexture(app, drawRat),
      orc: makeTexture(app, drawOrc),
      troll: makeTexture(app, drawTroll),
    },
  };
}

function makeTexture(app: Application, draw: (g: Graphics) => void): Texture {
  const g = new Graphics();
  draw(g);
  // Wrap in a container so the renderer frames against a full 16x16 bound
  // regardless of what `g` drew. Without this, textures with empty edges get
  // trimmed and sprites no longer sit flush to the tile grid.
  const host = new Container();
  host.addChild(g);
  const texture = app.renderer.generateTexture({
    target: host,
    frame: new Rectangle(0, 0, TILE_SIZE, TILE_SIZE),
    resolution: 1,
    antialias: false,
  });
  host.destroy({ children: true });
  return texture;
}

// ---------- tile glyphs ----------

function drawFloor(g: Graphics): void {
  g.rect(0, 0, TILE_SIZE, TILE_SIZE).fill(0x1a1a24);
  // faint stone speckle so empty rooms aren't dead flat
  for (const [x, y] of [
    [3, 4],
    [10, 2],
    [6, 11],
    [12, 9],
    [2, 13],
  ]) {
    g.rect(x, y, 1, 1).fill(0x2a2a38);
  }
}

function drawWall(g: Graphics): void {
  // brick base
  g.rect(0, 0, TILE_SIZE, TILE_SIZE).fill(0x4a4458);
  // horizontal mortar
  g.rect(0, 5, TILE_SIZE, 1).fill(0x201d2a);
  g.rect(0, 11, TILE_SIZE, 1).fill(0x201d2a);
  // staggered vertical mortar
  g.rect(7, 0, 1, 5).fill(0x201d2a);
  g.rect(3, 6, 1, 5).fill(0x201d2a);
  g.rect(11, 6, 1, 5).fill(0x201d2a);
  g.rect(7, 12, 1, 4).fill(0x201d2a);
  // brick highlights
  g.rect(0, 0, TILE_SIZE, 1).fill(0x6a6278);
  g.rect(0, 6, TILE_SIZE, 1).fill(0x5a5468);
}

function drawStairs(g: Graphics): void {
  drawFloor(g);
  // descending stairs — lighter as they go down
  g.rect(2, 4, 12, 3).fill(0x7a6f42);
  g.rect(2, 7, 12, 3).fill(0x948864);
  g.rect(2, 10, 12, 3).fill(0xb0a382);
  g.rect(2, 4, 12, 1).fill(0x3a3420);
  g.rect(2, 7, 12, 1).fill(0x3a3420);
  g.rect(2, 10, 12, 1).fill(0x3a3420);
}

// ---------- entity sprites ----------

function drawPlayer(g: Graphics): void {
  // transparent background; small heroic figure
  // head
  g.rect(6, 2, 4, 4).fill(0xf3d6a7);
  g.rect(5, 3, 1, 2).fill(0xf3d6a7);
  g.rect(10, 3, 1, 2).fill(0xf3d6a7);
  // hair
  g.rect(6, 1, 4, 1).fill(0x5a3a1a);
  g.rect(5, 2, 1, 1).fill(0x5a3a1a);
  g.rect(10, 2, 1, 1).fill(0x5a3a1a);
  // eyes
  g.rect(7, 4, 1, 1).fill(0x000000);
  g.rect(9, 4, 1, 1).fill(0x000000);
  // body / tunic
  g.rect(5, 7, 6, 5).fill(0x3a6bd6);
  g.rect(4, 8, 1, 3).fill(0x3a6bd6); // left sleeve
  g.rect(11, 8, 1, 3).fill(0x3a6bd6); // right sleeve
  // belt
  g.rect(5, 11, 6, 1).fill(0x3a2a14);
  // legs
  g.rect(5, 12, 2, 3).fill(0x241a3a);
  g.rect(9, 12, 2, 3).fill(0x241a3a);
  // boots
  g.rect(4, 14, 3, 1).fill(0x1a1020);
  g.rect(9, 14, 3, 1).fill(0x1a1020);
  // sword (right hand)
  g.rect(12, 5, 1, 6).fill(0xdedede);
  g.rect(11, 11, 3, 1).fill(0x8a5a1a);
}

function drawGoblin(g: Graphics): void {
  // head
  g.rect(5, 2, 6, 5).fill(0x5aa84a);
  g.rect(4, 3, 1, 3).fill(0x5aa84a); // left ear
  g.rect(11, 3, 1, 3).fill(0x5aa84a); // right ear
  // darker brow
  g.rect(5, 2, 6, 1).fill(0x3a7a2a);
  // eyes (glowing red)
  g.rect(6, 4, 1, 1).fill(0xd62828);
  g.rect(9, 4, 1, 1).fill(0xd62828);
  // snout / teeth
  g.rect(7, 5, 2, 1).fill(0x3a5a2a);
  g.rect(7, 6, 1, 1).fill(0xf0f0d6);
  g.rect(8, 6, 1, 1).fill(0xf0f0d6);
  // body
  g.rect(5, 7, 6, 4).fill(0x4a8838);
  // loincloth
  g.rect(5, 11, 6, 1).fill(0x7a4a1a);
  // arms
  g.rect(4, 8, 1, 3).fill(0x5aa84a);
  g.rect(11, 8, 1, 3).fill(0x5aa84a);
  // legs
  g.rect(5, 12, 2, 3).fill(0x4a8838);
  g.rect(9, 12, 2, 3).fill(0x4a8838);
  // feet
  g.rect(4, 14, 3, 1).fill(0x241a08);
  g.rect(9, 14, 3, 1).fill(0x241a08);
  // club
  g.rect(3, 5, 1, 5).fill(0x8a5a1a);
  g.rect(2, 5, 3, 1).fill(0x5a3a14);
}

function drawRat(g: Graphics): void {
  // Small, low-slung rodent — sits in the bottom half of the tile.
  // body
  g.rect(4, 9, 7, 4).fill(0x7a6a58);
  g.rect(3, 10, 1, 2).fill(0x7a6a58);
  // back highlight
  g.rect(4, 9, 7, 1).fill(0x9a8a70);
  // head
  g.rect(10, 8, 4, 4).fill(0x8a7a68);
  // ears
  g.rect(11, 7, 1, 1).fill(0x5a4a38);
  g.rect(13, 7, 1, 1).fill(0x5a4a38);
  // eye
  g.rect(12, 9, 1, 1).fill(0xd62828);
  // nose
  g.rect(14, 10, 1, 1).fill(0xf0a0a0);
  // legs
  g.rect(5, 13, 1, 2).fill(0x5a4a38);
  g.rect(9, 13, 1, 2).fill(0x5a4a38);
  // tail — whip curving up-right
  g.rect(1, 11, 3, 1).fill(0xa08878);
  g.rect(0, 10, 1, 1).fill(0xa08878);
}

function drawOrc(g: Graphics): void {
  // Bigger, broader, darker than a goblin. Brown tones + iron helm.
  // helm
  g.rect(5, 1, 6, 2).fill(0x5a5a6a);
  g.rect(4, 2, 1, 1).fill(0x5a5a6a);
  g.rect(11, 2, 1, 1).fill(0x5a5a6a);
  // head
  g.rect(5, 3, 6, 4).fill(0x6a7a3a);
  g.rect(4, 4, 1, 2).fill(0x6a7a3a);
  g.rect(11, 4, 1, 2).fill(0x6a7a3a);
  // brow shadow
  g.rect(5, 3, 6, 1).fill(0x4a5a22);
  // eyes (yellow menace)
  g.rect(6, 5, 1, 1).fill(0xe8c038);
  g.rect(9, 5, 1, 1).fill(0xe8c038);
  // tusks
  g.rect(7, 6, 1, 1).fill(0xf0f0d6);
  g.rect(8, 6, 1, 1).fill(0xf0f0d6);
  // torso — bulkier than goblin
  g.rect(4, 7, 8, 5).fill(0x5a6a2a);
  // belt
  g.rect(4, 11, 8, 1).fill(0x3a2414);
  // arms
  g.rect(3, 8, 1, 4).fill(0x6a7a3a);
  g.rect(12, 8, 1, 4).fill(0x6a7a3a);
  // legs
  g.rect(5, 12, 2, 3).fill(0x3a4a1a);
  g.rect(9, 12, 2, 3).fill(0x3a4a1a);
  // feet
  g.rect(4, 14, 3, 1).fill(0x1a1408);
  g.rect(9, 14, 3, 1).fill(0x1a1408);
  // axe (left hand)
  g.rect(2, 4, 1, 6).fill(0x8a5a1a);
  g.rect(0, 4, 3, 2).fill(0x8a8a98);
  g.rect(0, 4, 1, 1).fill(0xc0c0d0);
}

function drawTroll(g: Graphics): void {
  // BOSS unit — fills almost the whole tile, mossy and hulking.
  // massive body
  g.rect(3, 4, 10, 10).fill(0x3a6a3a);
  // shoulder/back highlight
  g.rect(3, 4, 10, 1).fill(0x5a8a4a);
  // head / lumpy skull
  g.rect(5, 1, 6, 4).fill(0x4a7a4a);
  g.rect(4, 2, 1, 2).fill(0x4a7a4a);
  g.rect(11, 2, 1, 2).fill(0x4a7a4a);
  // single horn
  g.rect(7, 0, 2, 1).fill(0xe8d8a8);
  // glowing orange eyes
  g.rect(6, 3, 1, 1).fill(0xf06020);
  g.rect(9, 3, 1, 1).fill(0xf06020);
  // gnarled jaw
  g.rect(6, 4, 4, 1).fill(0x2a4a2a);
  g.rect(7, 4, 1, 1).fill(0xf0f0d6);
  g.rect(8, 4, 1, 1).fill(0xf0f0d6);
  // arms — thick and long
  g.rect(1, 6, 2, 6).fill(0x3a6a3a);
  g.rect(13, 6, 2, 6).fill(0x3a6a3a);
  // fists / claws
  g.rect(1, 12, 2, 1).fill(0x1a1a08);
  g.rect(13, 12, 2, 1).fill(0x1a1a08);
  // moss/scars speckles
  g.rect(5, 7, 1, 1).fill(0x7a9a4a);
  g.rect(10, 8, 1, 1).fill(0x7a9a4a);
  g.rect(7, 10, 1, 1).fill(0x2a4a1a);
  // legs / feet
  g.rect(4, 14, 3, 1).fill(0x1a2a08);
  g.rect(9, 14, 3, 1).fill(0x1a2a08);
}
