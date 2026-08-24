type UnitSpriteProps = {
  src: string;
  color?: string;
  large?: boolean;
};

export default function UnitSprite({ src, color = "#d8b46a", large = false }: UnitSpriteProps) {
  return (
    <span aria-hidden="true" className={`unit-sprite ${large ? "unit-sprite--large" : ""}`} style={{ color }}>
      <img src={src} alt="" />
    </span>
  );
}
