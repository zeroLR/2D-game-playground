import { describe, expect, it } from "vitest";
import { defaultEquipmentLoadout } from "../src/game/data/types";
import { canEquip, equipCard, unequipCard, MAX_SAME_CARD } from "../src/game/equipment";

describe("equipment system", () => {
  it("allows equipping owned cards up to slot limit", () => {
    const loadout = defaultEquipmentLoadout();
    loadout.ownedCards = ["eq-toughness", "eq-swiftness", "eq-sharpshot"];
    expect(canEquip(loadout, "eq-toughness")).toBe(true);
    equipCard(loadout, "eq-toughness");
    expect(loadout.equipped).toHaveLength(1);
    equipCard(loadout, "eq-swiftness");
    equipCard(loadout, "eq-sharpshot");
    expect(loadout.equipped).toHaveLength(3);
    // 4th card should fail (only 3 slots by default)
    expect(canEquip(loadout, "eq-toughness")).toBe(false);
  });

  it("rejects non-owned cards", () => {
    const loadout = defaultEquipmentLoadout();
    expect(canEquip(loadout, "eq-toughness")).toBe(false);
    equipCard(loadout, "eq-toughness");
    expect(loadout.equipped).toHaveLength(0);
  });

  it("limits same card to MAX_SAME_CARD copies", () => {
    const loadout = defaultEquipmentLoadout();
    loadout.maxSlots = 5;
    loadout.ownedCards = ["eq-toughness"];
    equipCard(loadout, "eq-toughness");
    equipCard(loadout, "eq-toughness");
    expect(loadout.equipped).toHaveLength(MAX_SAME_CARD);
    // Second copy is rejected when only one same card is allowed.
    expect(canEquip(loadout, "eq-toughness")).toBe(false);
  });

  it("unequip removes first occurrence", () => {
    const loadout = defaultEquipmentLoadout();
    loadout.ownedCards = ["eq-toughness", "eq-swiftness"];
    equipCard(loadout, "eq-toughness");
    equipCard(loadout, "eq-swiftness");
    expect(loadout.equipped).toHaveLength(2);
    unequipCard(loadout, "eq-toughness");
    expect(loadout.equipped).toEqual(["eq-swiftness"]);
  });
});
