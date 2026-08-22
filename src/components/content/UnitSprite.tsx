import type { CSSProperties } from "react";

type UnitSpriteProps = {
  src: string;
  color?: string;
  large?: boolean;
};

export default function UnitSprite({ src, color = "#d8b46a", large = false }: UnitSpriteProps) {
  return (
    <span
      aria-hidden="true"
      className={`unit-sprite ${large ? "unit-sprite--large" : ""}`}
      style={{ "--sprite-image": `url("${src}")`, "--sprite-color": color } as CSSProperties}
    />
  );
}
