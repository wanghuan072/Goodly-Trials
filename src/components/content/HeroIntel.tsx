import type { ReactNode } from "react";

type HeroIntelItem = {
  label: string;
  value: ReactNode;
};

export default function HeroIntel({
  eyebrow,
  title,
  items,
  className = "",
}: {
  eyebrow: string;
  title: string;
  items: HeroIntelItem[];
  className?: string;
}) {
  return (
    <aside className={`hero-intel ${className}`.trim()} aria-label={title}>
      <header>
        <span>{eyebrow}</span>
        <strong>{title}</strong>
      </header>
      <dl>
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`}>
            <dt>{item.value}</dt>
            <dd>{item.label}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
