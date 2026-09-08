import { Assets, Rectangle, Sprite, Texture } from 'pixi.js';
import {
  PAGE_ART_FAMILIES,
  PAGE_ART_MANIFEST,
  TRAVELER_ANIMATIONS,
  TRAVELER_FRAME_COUNT,
  TRAVELER_FRAME_HEIGHT,
  TRAVELER_FRAME_WIDTH,
  TRAVELER_SHEET_SOURCE,
  isPageArtFamily,
  type TravelerFacing,
} from '../art/pixel-art-manifest';
import type { Rotation } from '../domain/model';

let travelerFrames: readonly Texture[] | null = null;

function publicAssetUrl(relativePath: string): string {
  return new URL(relativePath, document.baseURI).toString();
}

export function pageArtUrl(definitionId: string): string {
  if (!isPageArtFamily(definitionId)) throw new Error(`Missing Page pixel art family: ${definitionId}`);
  return publicAssetUrl(PAGE_ART_MANIFEST[definitionId].source);
}

export async function preloadPixelArt(): Promise<void> {
  const urls = PAGE_ART_FAMILIES.map((id) => pageArtUrl(id));
  urls.push(publicAssetUrl(TRAVELER_SHEET_SOURCE));
  await Assets.load(urls);
  travelerFrames = null;
}

export function createPageArtSprite(
  definitionId: string,
  rotation: Rotation,
  displaySize: number,
  alpha = 1,
): Sprite {
  const sprite = new Sprite(Texture.from(pageArtUrl(definitionId)));
  sprite.anchor.set(0.5);
  sprite.position.set(displaySize / 2, displaySize / 2);
  sprite.width = displaySize;
  sprite.height = displaySize;
  sprite.rotation = (rotation * Math.PI) / 180;
  sprite.alpha = alpha;
  sprite.roundPixels = true;
  return sprite;
}

export function createTravelerSprite(
  facing: TravelerFacing,
  moving: boolean,
  frameTick: number,
  pageSize: number,
  arriving = false,
): Sprite {
  const frames = getTravelerFrames();
  const indices = animationIndices(facing, moving, arriving);
  const frameIndex = indices[Math.abs(frameTick) % indices.length] ?? indices[0] ?? 0;
  const sprite = new Sprite(frames[frameIndex]);
  sprite.anchor.set(0.5, 1);
  const targetWidth = Math.max(22, Math.round(pageSize * 0.29));
  const scale = targetWidth / TRAVELER_FRAME_WIDTH;
  sprite.scale.set(scale);
  if (facing === 'west') sprite.scale.x *= -1;
  sprite.roundPixels = true;
  return sprite;
}

function getTravelerFrames(): readonly Texture[] {
  if (travelerFrames) return travelerFrames;
  const sheet = Texture.from(publicAssetUrl(TRAVELER_SHEET_SOURCE));
  travelerFrames = Array.from({ length: TRAVELER_FRAME_COUNT }, (_, index) =>
    new Texture({
      source: sheet.source,
      frame: new Rectangle(index * TRAVELER_FRAME_WIDTH, 0, TRAVELER_FRAME_WIDTH, TRAVELER_FRAME_HEIGHT),
    }),
  );
  return travelerFrames;
}

function animationIndices(facing: TravelerFacing, moving: boolean, arriving: boolean): readonly number[] {
  if (arriving) return TRAVELER_ANIMATIONS.arrival;
  if (!moving) return TRAVELER_ANIMATIONS.idle;
  if (facing === 'north') return TRAVELER_ANIMATIONS.walkNorth;
  if (facing === 'east' || facing === 'west') return TRAVELER_ANIMATIONS.walkEast;
  return TRAVELER_ANIMATIONS.walkSouth;
}
