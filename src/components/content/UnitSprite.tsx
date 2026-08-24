type UnitSpriteProps = {
  src: string;
  color?: string;
  large?: boolean;
};

/**
 * The game's art files are luminance masks, not finished card portraits. The
 * official client colours their bright pixels at render time while retaining
 * the dark pixel work, so rendering these files as ordinary images is wrong.
 */
export default function UnitSprite({ src, color = "#c9c9c9", large = false }: UnitSpriteProps) {
  return (
    <span aria-hidden="true" className={`unit-sprite ${large ? "unit-sprite--large" : ""}`}>
      <span
        className="unit-sprite__art"
        style={{
          backgroundColor: color,
          WebkitMaskImage: `url("${src}")`,
          maskImage: `url("${src}")`,
        }}
      />
    </span>
  );
}
