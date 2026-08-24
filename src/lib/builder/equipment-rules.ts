import type { Item } from "../../types/content.ts";

export type EquipmentKind = "gear" | "trinkets" | "consumable";

export function itemSlotUse(item: Pick<Item, "type">) {
  if (item.type.startsWith("Potion")) return { gear: 0, trinkets: 0 };
  if (item.type.startsWith("Trinket") || item.type.startsWith("Spell")) return { gear: 0, trinkets: 1 };
  return { gear: item.type.startsWith("Two-handed") ? 2 : 1, trinkets: 0 };
}

export function itemKind(item: Pick<Item, "type">): EquipmentKind {
  if (item.type.startsWith("Potion")) return "consumable";
  return item.type.startsWith("Trinket") || item.type.startsWith("Spell") ? "trinkets" : "gear";
}
