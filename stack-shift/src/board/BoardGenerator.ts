export const PALETTE = [0xff3f43, 0x21b8ff, 0xffca28, 0x67dc32, 0xb84cff];

export function createColorBag(): number[] {
  const bag: number[] = [];
  for (const color of PALETTE) for (let i = 0; i < 6; i++) bag.push(color);
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}
