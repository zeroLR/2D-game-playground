export const LOGICAL_WIDTH = 390;
export const LOGICAL_HEIGHT = 844;
export const GAMEPLAY_HEIGHT = 560;
export const CONTROL_HEIGHT = LOGICAL_HEIGHT - GAMEPLAY_HEIGHT;

export function fitPortraitViewport(width: number, height: number) {
  const scale = Math.min(width / LOGICAL_WIDTH, height / LOGICAL_HEIGHT);
  return {
    scale,
    width: LOGICAL_WIDTH * scale,
    height: LOGICAL_HEIGHT * scale,
  };
}
