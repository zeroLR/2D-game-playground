// Tile kinds and their movement/sight properties.
// Keep this table tiny — a roguelike rarely needs more than a handful.

export enum Tile {
  Wall = 0,
  Floor = 1,
  Stairs = 2,
}

export interface TileInfo {
  blocksMove: boolean;
  blocksSight: boolean;
  name: string;
}

export const TILE_INFO: Record<Tile, TileInfo> = {
  [Tile.Wall]:   { blocksMove: true,  blocksSight: true,  name: "wall" },
  [Tile.Floor]:  { blocksMove: false, blocksSight: false, name: "floor" },
  [Tile.Stairs]: { blocksMove: false, blocksSight: false, name: "stairs" },
};
