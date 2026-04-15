import { Tile, TILE_INFO, type TileInfo } from "./tiles";

/**
 * A dense w×h grid of tiles. Row-major (`y * width + x`).
 * Cheap to clone, cheap to serialize, cheap to iterate.
 */
export class TileMap {
  readonly width: number;
  readonly height: number;
  private readonly data: Uint8Array;

  constructor(width: number, height: number, fill: Tile = Tile.Wall) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height);
    if (fill !== Tile.Wall) this.data.fill(fill);
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  at(x: number, y: number): Tile {
    return this.data[y * this.width + x] as Tile;
  }

  info(x: number, y: number): TileInfo {
    return TILE_INFO[this.at(x, y)];
  }

  set(x: number, y: number, t: Tile): void {
    this.data[y * this.width + x] = t;
  }

  /** Iterate every (x, y, tile). */
  *cells(): Generator<[number, number, Tile]> {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield [x, y, this.data[y * this.width + x] as Tile];
      }
    }
  }
}
