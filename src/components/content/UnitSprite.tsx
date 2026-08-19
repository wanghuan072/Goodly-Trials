import type { CSSProperties } from "react";
import styles from "@/style/content/unit-sprite.module.css";

type UnitSpriteProps = {
  src: string;
  color?: string;
  large?: boolean;
};

export default function UnitSprite({ src, color = "#d8b46a", large = false }: UnitSpriteProps) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.sprite} ${large ? styles.large : ""}`}
      style={{ "--sprite-image": `url("${src}")`, "--sprite-color": color } as CSSProperties}
    />
  );
}
