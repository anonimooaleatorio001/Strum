import type { Fret } from "@/lib/chords";

interface Props {
  frets: Fret[];
  fingers?: (number | null)[];
  size?: number;
  showFingers?: boolean;
}

/**
 * Six-string chord diagram. Auto-windows to barre chords above the nut and
 * draws open (○) / muted (×) markers above each string.
 */
export default function ChordDiagram({
  frets,
  fingers = [],
  size = 1,
  showFingers = true,
}: Props) {
  const stringGap = 16;
  const fretGap = 22;
  const padX = 16;
  const padTop = 26;
  const fretsShown = 4;

  const width = padX * 2 + stringGap * 5;
  const height = padTop + fretGap * fretsShown + 14;

  const played = frets.filter((f): f is number => f !== null && f > 0);
  const minFret = played.length ? Math.min(...played) : 1;
  const windowStart = minFret > 1 ? minFret : 1;
  const showNut = windowStart === 1;

  const x = (s: number) => padX + s * stringGap;
  const yFretLine = (f: number) => padTop + f * fretGap;

  return (
    <svg
      width={width * size}
      height={height * size}
      viewBox={`0 0 ${width} ${height}`}
      className="text-cyprus"
      role="img"
      aria-hidden="true"
    >
      {/* Nut or position label */}
      {showNut ? (
        <rect x={padX} y={padTop - 4} width={stringGap * 5} height={4} rx={1} fill="currentColor" />
      ) : (
        <text
          x={padX - 7}
          y={padTop + fretGap - 7}
          fontSize="9"
          fill="currentColor"
          textAnchor="end"
          opacity={0.7}
        >
          {windowStart}fr
        </text>
      )}

      {/* Fret lines */}
      {Array.from({ length: fretsShown + 1 }).map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={padX}
          y1={yFretLine(i)}
          x2={padX + stringGap * 5}
          y2={yFretLine(i)}
          stroke="currentColor"
          strokeWidth={i === 0 && showNut ? 0 : 1}
          opacity={0.35}
        />
      ))}

      {/* Strings */}
      {Array.from({ length: 6 }).map((_, s) => (
        <line
          key={`str-${s}`}
          x1={x(s)}
          y1={padTop}
          x2={x(s)}
          y2={yFretLine(fretsShown)}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.55}
        />
      ))}

      {/* Open / muted markers */}
      {frets.map((f, s) => {
        if (f === null) {
          return (
            <text
              key={`mark-${s}`}
              x={x(s)}
              y={padTop - 9}
              fontSize="11"
              fill="currentColor"
              textAnchor="middle"
              opacity={0.55}
            >
              ×
            </text>
          );
        }
        if (f === 0) {
          return (
            <circle
              key={`mark-${s}`}
              cx={x(s)}
              cy={padTop - 12}
              r={4}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
              opacity={0.65}
            />
          );
        }
        return null;
      })}

      {/* Finger dots */}
      {frets.map((f, s) => {
        if (f === null || f === 0) return null;
        const row = f - windowStart;
        if (row < 0 || row >= fretsShown) return null;
        const cy = padTop + row * fretGap + fretGap / 2;
        const finger = fingers[s];
        return (
          <g key={`dot-${s}`}>
            <circle cx={x(s)} cy={cy} r={6.5} fill="currentColor" />
            {showFingers && finger ? (
              <text
                x={x(s)}
                y={cy + 3}
                fontSize="8.5"
                fill="#F3E8CC"
                textAnchor="middle"
                fontWeight={700}
              >
                {finger}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
