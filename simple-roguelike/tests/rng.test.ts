import { describe, expect, it } from "vitest";
import { createRng, pickSeed, randInt, roll } from "../src/game/rng";

describe("createRng", () => {
  it("produces the same sequence for the same seed", () => {
    const a = createRng(12345);
    const b = createRng(12345);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("produces different sequences for different seeds", () => {
    const a = createRng(1);
    const b = createRng(2);
    expect(a()).not.toEqual(b());
  });

  it("returns values in [0, 1)", () => {
    const r = createRng(42);
    for (let i = 0; i < 1000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("randInt", () => {
  it("stays within the inclusive bounds", () => {
    const r = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = randInt(r, 3, 9);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(9);
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});

describe("roll", () => {
  it("1d6 is always in [1, 6]", () => {
    const r = createRng(99);
    for (let i = 0; i < 1000; i++) {
      const v = roll(r, 1, 6);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
    }
  });

  it("2d4 is always in [2, 8]", () => {
    const r = createRng(1);
    for (let i = 0; i < 1000; i++) {
      const v = roll(r, 2, 4);
      expect(v).toBeGreaterThanOrEqual(2);
      expect(v).toBeLessThanOrEqual(8);
    }
  });
});

describe("pickSeed", () => {
  it("parses ?seed=123", () => {
    expect(pickSeed("?seed=123")).toBe(123);
  });

  it("falls back when missing", () => {
    const a = pickSeed("");
    expect(Number.isFinite(a)).toBe(true);
    expect(a).toBeGreaterThanOrEqual(0);
  });

  it("falls back when not a number", () => {
    const a = pickSeed("?seed=hello");
    expect(Number.isFinite(a)).toBe(true);
  });
});
