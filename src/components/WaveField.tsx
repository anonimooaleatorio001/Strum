// Signature flowing-contour background — stacked wavy lines in the brand greens,
// echoing the "paper-cut topography" look. Pure SVG, deterministic, no client JS.

const W = 1200;
const H = 800;
const LINES = 26;

// vertical colour ramp: cream -> kiwi -> forest -> deep forest
const RAMP: [number, number, number][] = [
  [243, 232, 204], // cream
  [154, 188, 5], // kiwi
  [24, 84, 42], // forest
  [12, 48, 20], // forest-deep
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rampColor(t: number): string {
  const seg = Math.min(RAMP.length - 2, Math.floor(t * (RAMP.length - 1)));
  const local = t * (RAMP.length - 1) - seg;
  const [r1, g1, b1] = RAMP[seg];
  const [r2, g2, b2] = RAMP[seg + 1];
  return `rgb(${Math.round(lerp(r1, r2, local))},${Math.round(
    lerp(g1, g2, local)
  )},${Math.round(lerp(b1, b2, local))})`;
}

function buildLine(i: number): string {
  const baseY = (H / (LINES - 1)) * i;
  const a1 = 30 + (i % 5) * 4;
  const a2 = 14;
  const p1 = i * 0.55;
  const p2 = i * 0.92;
  let d = "";
  for (let x = -60; x <= W + 60; x += 24) {
    const y =
      baseY +
      a1 * Math.sin(x * 0.0062 + p1) +
      a2 * Math.sin(x * 0.0131 + p2);
    d += x === -60 ? `M ${x} ${y.toFixed(1)}` : ` L ${x} ${y.toFixed(1)}`;
  }
  return d;
}

export default function WaveField({
  className = "",
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) {
  const lines = Array.from({ length: LINES }, (_, i) => ({
    d: buildLine(i),
    color: rampColor(i / (LINES - 1)),
    width: 2 + (i / LINES) * 1.4,
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      style={{ opacity }}
    >
      <g
        className="animate-wave-drift"
        fill="none"
        strokeLinecap="round"
        style={{ transformOrigin: "center" }}
      >
        {lines.map((l, i) => (
          <path
            key={i}
            d={l.d}
            stroke={l.color}
            strokeWidth={l.width}
            strokeOpacity={0.85}
          />
        ))}
      </g>
    </svg>
  );
}
