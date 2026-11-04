/* The ANAMYST wordmark — original lettering drawn as vector strokes, so no
   font file (or font licence) is involved. Letters run past the top and
   bottom of the viewBox on purpose: the SVG clips them to clean flat ends.

   Size it with height classes, e.g. className="h-8 w-auto".
   The hidden text keeps the brand name readable to search engines and
   screen readers. */

const LETTERS = [
  { x: 4, d: "M0 100 L45 0 L90 100" }, // A
  { x: 106, d: "M0 100 V0 L72 100 V0" }, // N
  { x: 190, d: "M0 100 L45 0 L90 100" }, // A
  { x: 292, d: "M0 100 V0 L50 100 L100 0 V100" }, // M
  { x: 402, d: "M0 0 L40 54 L80 0 M40 54 V100" }, // Y
  {
    x: 492,
    d: "M68 20 C62 9 50 3.5 36 3.5 C19 3.5 7 12 7 26 C7 41 19 47 36 51 C54 55 68 61 68 76 C68 90 54 96.5 36 96.5 C20 96.5 8 90 3 78",
  }, // S
  { x: 572, d: "M0 3.5 H78 M39 3.5 V100" }, // T
];

export default function BrandWordmark({
  className = "",
  strokeWidth = 7,
}) {
  return (
    <>
      <span className="sr-only">ANAMYST</span>

      <svg
        viewBox="0 0 654 100"
        aria-hidden="true"
        focusable="false"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
        className={className}
      >
        {LETTERS.map((letter, i) => (
          <path
            key={i}
            d={letter.d}
            transform={`translate(${letter.x} 0)`}
          />
        ))}
      </svg>
    </>
  );
}
