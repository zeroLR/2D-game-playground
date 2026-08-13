export const isTouchLayout = () => matchMedia('(pointer: coarse), (max-width: 1024px)').matches;

export const groundY = (height: number) => height - (isTouchLayout() ? 42 : 78);

export const coreX = (width: number) => width - Math.max(96, width * 0.09);

export const buildSpots = (width: number) => {
  const core = coreX(width);
  const start = Math.max(170, width * 0.22);
  const end = Math.max(start + 220, core - Math.max(180, width * 0.16));
  return Array.from({ length: 4 }, (_, index) => start + ((end - start) * index) / 3);
};
