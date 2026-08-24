import fs from "node:fs/promises";
import vm from "node:vm";

const sourceUrl = "https://play.goodlytrials.com/assets/combat-fx-DMZBzH2v.js";
const dataPath = new URL("../src/data/game/units.json", import.meta.url);
const checkedOn = "2026-08-24";
const gameVersion = "v0.312";

const attributeLabels = { strength: "STR", agility: "AGI", intelligence: "INT" };
const statLabels = { armor: "AR", attack: "ATK", actionSpeed: "SPD" };
const reachLabels = {
  above: "above", below: "below", left: "to the left", right: "to the right",
  front: "in front", behind: "behind", column: "in the same column",
  adjacent: "adjacent", twoCells: "within two cells",
};

function signed(value) {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function listReach(reach) {
  const values = Array.isArray(reach) ? reach : reach ? [reach] : ["adjacent"];
  return values.map((value) => reachLabels[value] ?? String(value)).join(", ").replace(/, ([^,]+)$/, " and $1");
}

function formatModifiers(modifiers, labels) {
  return Object.entries(modifiers).map(([key, value]) => `${signed(value)} ${labels[key] ?? key}${key === "actionSpeed" ? "%" : ""}`).join(", ");
}

function innateEffects(innate) {
  if (!innate) return [];
  const effects = [];
  if (innate.auraAttributeMods) effects.push(`Aura: ${formatModifiers(innate.auraAttributeMods, attributeLabels)} to allies ${listReach(innate.auraAttributeReach)}.`);
  if (innate.auraStatModifiers) effects.push(`Aura: ${formatModifiers(innate.auraStatModifiers, statLabels)} to allies ${listReach(innate.auraStatReach)}.`);
  for (const aura of innate.auraAttributeAuras ?? []) effects.push(`Aura: ${formatModifiers(aura.mods, attributeLabels)} to allies ${listReach(aura.reach)}.`);
  if (innate.auraStatFromDonorAttribute) {
    const value = innate.auraStatFromDonorAttribute;
    effects.push(`Allies ${listReach(value.reach)} gain +${value.perPoint} ${statLabels[value.stat] ?? value.stat.toUpperCase()} per point of this unit's ${attributeLabels[value.attribute] ?? value.attribute.toUpperCase()}.`);
  }
  if (innate.elusiveEvasionPerHit) effects.push(`Gain +${innate.elusiveEvasionPerHit}% EVA per hit.`);
  if (innate.bonusAttackRange) effects.push(`${signed(innate.bonusAttackRange)} RNG.`);
  if (innate.minAttackRange) effects.push(`Minimum attack range: ${innate.minAttackRange}.`);
  if (innate.attackFromStartingHpPercent) effects.push(`Gain ATK equal to ${innate.attackFromStartingHpPercent * 100}% of starting HP.`);
  if (innate.actionSpeedModifier) effects.push(`${signed(innate.actionSpeedModifier)}% SPD.`);
  if (innate.doubleAuraBenefits) effects.push("Receives double benefits from auras.");
  if (innate.dualDefense) effects.push(`Uses ${innate.dualDefense.split("_").map((key) => attributeLabels[key] ?? key.toUpperCase()).join(" and ")} for defense.`);
  if (innate.noCritical) effects.push("Cannot critically strike.");
  if (innate.maxAgility !== undefined) effects.push(`Maximum AGI: ${innate.maxAgility}.`);
  if (innate.elsewhereTeleportOnAllyHit) effects.push("Teleports elsewhere when an ally is hit.");
  if (innate.combatHealAllies) effects.push(`Heals allies within ${innate.combatHealAllies.range} tile${innate.combatHealAllies.range === 1 ? "" : "s"}.`);
  if (innate.attackAdjacentSplashPercent) effects.push(`Attacks deal ${innate.attackAdjacentSplashPercent}% damage to adjacent targets.`);
  if (innate.energyShieldMultiplier) effects.push(`Energy Shield multiplier: ${innate.energyShieldMultiplier}×.`);
  if (innate.auraGrantEsOnAdjacentAllyBelowHalfHp) effects.push("Grants Energy Shield to adjacent allies below half HP.");
  if (innate.combatRespawnOnce) effects.push("Respawns once per battle.");
  if (innate.rattlefireOnAdjacentDeath) effects.push("Rattlefire triggers when an adjacent unit dies.");
  if (innate.manaOnAllyDeath) effects.push(`Gain ${innate.manaOnAllyDeath} MP when an ally dies.`);
  if (innate.combatStealIntelligenceOnHit) effects.push(`Steal ${innate.combatStealIntelligenceOnHit} INT on hit.`);
  if (innate.cannotAttack) effects.push("Cannot attack.");
  if (innate.combatSummon) {
    const summon = innate.combatSummon;
    effects.push(`Summons Skeleton Dog: ${summon.manaCost} MP, range ${summon.range}, ${summon.cooldownSeconds}s cooldown.`);
  }
  if (innate.dualWieldTwoHanded) effects.push("Can wield two-handed gear in both hand slots.");
  if (innate.handGearCannotGrantRange) effects.push("Hand gear cannot grant RNG.");
  if (innate.stackingCriticalChancePerHit) effects.push(`Gain +${innate.stackingCriticalChancePerHit}% CRT per hit.`);
  if (innate.combatHealOnHitAgiDivisor) effects.push(`Heals on hit using AGI ÷ ${innate.combatHealOnHitAgiDivisor}.`);
  if (innate.moonStepAtCombatSeconds) effects.push(`Moon Step after ${innate.moonStepAtCombatSeconds} seconds; stuns the row for ${innate.moonStepRowStunSeconds} seconds.`);
  if (innate.combatEnergyShieldOnHit) effects.push(`Gain ${innate.combatEnergyShieldOnHit} ES on hit.`);
  if (innate.attackBonusOnEvade) effects.push(`Gain +${innate.attackBonusOnEvade} ATK on evade.`);
  if (innate.skitterStartingEvasion) effects.push(`Starts combat with ${innate.skitterStartingEvasion}% EVA; loses ${innate.skitterEvasionDecayPerSecond}% per second.`);
  if (innate.criticalChanceBonusOnEvade) effects.push(`Gain +${innate.criticalChanceBonusOnEvade}% CRT on evade.`);
  if (innate.additionalSpellTargets) effects.push(`Spells gain ${innate.additionalSpellTargets} additional target.`);
  if (innate.attackBonusPerMoveCell) effects.push(`Gain +${innate.attackBonusPerMoveCell} ATK per cell moved.`);
  if (innate.allDefenseLayers) effects.push("Uses all defense layers.");
  if (innate.canEquipAnyGear) effects.push("Can equip any gear.");
  if (innate.spellCooldownReduction) effects.push(`Spell cooldown multiplier: ${innate.spellCooldownReduction}×.`);
  if (innate.attacksCannotMiss) effects.push("Attacks cannot miss.");
  if (innate.attackBonusFromTargetPrimaryAttr) effects.push(`Gain ATK from the target's primary attribute, up to ${innate.attackBonusFromTargetPrimaryAttrMax}.`);
  if (innate.combatStealStrengthOnHit) effects.push(`Steal ${innate.combatStealStrengthOnHit} STR on hit.`);
  return effects;
}

function extractArrayLiteral(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Could not find ${marker}.`);
  const openIndex = source.indexOf("[", markerIndex);
  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === "[") depth += 1;
    if (source[index] === "]") {
      depth -= 1;
      if (depth === 0) return source.slice(openIndex, index + 1);
    }
  }
  throw new Error("Could not read the unit record array.");
}

const source = await fetch(sourceUrl).then((response) => {
  if (!response.ok) throw new Error(`Official client returned ${response.status}.`);
  return response.text();
});
const context = { gA: [], xO: [] };
vm.runInNewContext(`records=${extractArrayLiteral(source, "T2=[")}`, context);
const officialRecords = context.records;
const recordsBySlug = new Map(officialRecords.map((record) => [record.id.replaceAll("_", "-"), record]));
const localRecords = JSON.parse(await fs.readFile(dataPath, "utf8"));

for (const unit of localRecords) {
  const record = recordsBySlug.get(unit.slug);
  if (!record) throw new Error(`No official base record found for ${unit.slug}.`);
  const baseStats = record.baseStats ?? {};
  unit.cost = record.cost;
  unit.summary = `${record.cost}G ${record.combatIdentity} unit with ${record.handSlots} Gear slot${record.handSlots === 1 ? "" : "s"} and ${record.trinketSlots} Trinket slot${record.trinketSlots === 1 ? "" : "s"}.`;
  unit.quote = record.flavorText;
  unit.gear = record.handSlots;
  unit.trinkets = record.trinketSlots;
  unit.recovery = baseStats.hpRegeneration ? `+${baseStats.hpRegeneration} HP / s` : "—";
  unit.manaRegen = "—";
  unit.stats = {
    es: 0,
    hp: baseStats.hp ?? 0,
    mp: baseStats.mana ?? 0,
    str: record.baseAttributes.strength ?? 0,
    agi: record.baseAttributes.agility ?? 0,
    int: record.baseAttributes.intelligence ?? 0,
    atk: baseStats.attack ?? 0,
    crt: baseStats.criticalChance ?? 0,
    rng: record.attackRange ?? 0,
    spd: baseStats.actionSpeed ?? 0,
    ar: baseStats.armor ?? 0,
    eva: baseStats.evasion ?? 0,
  };
  unit.trait = {
    name: "Base card",
    effect: "This record lists the unit before leader bonuses, equipped gear, and in-run effects change the Inspect panel.",
  };
  unit.baseEffects = innateEffects(record.innate);
  unit.skills = [];
  unit.tactic = {
    name: record.combatIdentity[0].toUpperCase() + record.combatIdentity.slice(1),
    effect: `${record.combatIdentity[0].toUpperCase() + record.combatIdentity.slice(1)} combat identity.`,
  };
  unit.gameVersion = gameVersion;
  unit.lastVerified = checkedOn;
  unit.source = sourceUrl;
}

await fs.writeFile(dataPath, `${JSON.stringify(localRecords, null, 2)}\n`);
console.log(`Synced ${localRecords.length} unit base records from the official client.`);
