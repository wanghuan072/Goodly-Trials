import type { ReactNode } from "react";
import Link from "next/link";
import {
  builds,
  factions,
  guides,
  items,
  leaders,
  traits,
  units,
  updates,
} from "@/lib/data/game-content";

type Entity = { label: string; href: string };

const entities: Entity[] = [
  ...units.map((unit) => ({
    label: unit.name,
    href: `/wiki/units/${unit.slug}`,
  })),
  ...items.map((item) => ({
    label: item.name,
    href: `/wiki/gear/${item.slug}`,
  })),
  ...traits.map((trait) => ({
    label: trait.name,
    href: `/wiki/traits#${trait.slug}`,
  })),
  ...leaders.map((leader) => ({
    label: leader.name,
    href: `/wiki/leaders/${leader.slug}`,
  })),
  ...factions.map((faction) => ({
    label: faction.name,
    href: `/wiki/factions/${faction.slug}`,
  })),
  ...guides.map((guide) => ({
    label: guide.title,
    href: `/guides/${guide.slug}`,
  })),
  ...builds.map((build) => ({
    label: build.title,
    href: `/builds#${build.slug}`,
  })),
  ...updates.map((update) => ({
    label: update.version,
    href: `/updates#${update.slug}`,
  })),
  { label: "Formation", href: "/guides/formation-guide" },
  { label: "Backline", href: "/guides/formation-guide" },
  { label: "Flanking", href: "/guides/formation-guide" },
  { label: "Stats", href: "/guides/beginners-guide" },
  { label: "Game Modes", href: "/guides/game-modes-progression-guide" },
  { label: "Single-player", href: "/guides/game-modes-progression-guide" },
  { label: "Multiplayer", href: "/guides/game-modes-progression-guide" },
  { label: "Ranked", href: "/guides/game-modes-progression-guide" },
  { label: "Beginner's Guide", href: "/guides/beginners-guide" },
  { label: "Units", href: "/wiki/units" },
  { label: "Unit", href: "/wiki/units" },
  { label: "Leaders", href: "/wiki/leaders" },
  { label: "Leader", href: "/wiki/leaders" },
  { label: "Traits", href: "/wiki/traits" },
  { label: "Trait", href: "/wiki/traits" },
  { label: "Factions", href: "/wiki/factions" },
  { label: "Company Builder", href: "/builder" },
  { label: "Builder", href: "/builder" },
  { label: "Builds", href: "/builds" },
  { label: "Gear", href: "/wiki/gear" },
  { label: "Trinkets", href: "/wiki/gear" },
];

const entityByLabel = new Map<string, Entity>();
for (const entity of entities) {
  if (!entityByLabel.has(entity.label.toLocaleLowerCase()))
    entityByLabel.set(entity.label.toLocaleLowerCase(), entity);
}
const labels = [...entityByLabel.values()]
  .map((entity) => entity.label)
  .toSorted((a, b) => b.length - a.length);
const entityPattern = new RegExp(
  `(${labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "gi",
);

export default function EntityLinks({
  children,
  currentHref,
}: {
  children: string;
  currentHref?: string;
}) {
  const parts = children.split(entityPattern);
  return (
    <>
      {parts.map((part, index): ReactNode => {
        const entity = entityByLabel.get(part.toLocaleLowerCase());
        return entity && entity.href !== currentHref ? (
          <Link
            className="entityLink"
            href={entity.href}
            key={`${entity.href}-${index}`}
          >
            {part}
          </Link>
        ) : (
          part
        );
      })}
    </>
  );
}
