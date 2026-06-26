// Small hand-drawn-feel forest doodles used as subtle finishing touches.
// Flat shapes in the brand palette. Decorative only (aria-hidden), so they
// never interfere with layout or screen readers.

type DoodleProps = { size?: number; className?: string };

const base = "select-none pointer-events-none";

export function Mushroom({ size = 28, className = "" }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      {/* stem */}
      <path d="M9.5 12h5v5q0 3-2.5 3T9.5 17z" fill="#f3e8cc" stroke="#0c3014" strokeWidth="0.6" />
      {/* cap */}
      <path d="M3 12.4C3 6.9 7 4 12 4s9 2.9 9 8.4z" fill="#d52518" />
      {/* spots */}
      <circle cx="8.4" cy="9.6" r="1.1" fill="#f3e8cc" />
      <circle cx="13.6" cy="8.3" r="1.4" fill="#f3e8cc" />
      <circle cx="16.4" cy="10.8" r="0.9" fill="#f3e8cc" />
    </svg>
  );
}

export function Sprout({ size = 26, className = "" }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <path d="M12 22V9" stroke="#18542a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 13c-1-3-4-3.6-5.5-3.2C6 12 8.5 14 12 13z" fill="#9abc05" />
      <path d="M12 11c.8-3 3.6-3.8 5.2-3.4C17 10.2 14.8 12 12 11z" fill="#18542a" />
    </svg>
  );
}

export function Fern({ size = 28, className = "" }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <g stroke="#18542a" strokeWidth="1.3" strokeLinecap="round" fill="none">
        <path d="M12 22C12 14 12 9 14 5" />
        <path d="M12.8 16c1-.6 2.2-1.2 3.4-1.2" />
        <path d="M12.4 12.5c.9-.8 2-1.6 3.2-1.8" />
        <path d="M12.4 9c.8-1 1.8-1.9 2.9-2.3" />
        <path d="M12.9 16c-1-.6-2.2-1.2-3.4-1.2" />
        <path d="M12.5 12.5c-.9-.8-2-1.6-3.2-1.8" />
      </g>
    </svg>
  );
}

export function Leaf({ size = 24, className = "" }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <path
        d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14z"
        fill="#9abc05"
      />
      <path d="M7 17C10 12 13 9 17 7" stroke="#18542a" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A faint "forest floor" trim — a soft ground line with a few tiny plants and a
 * mushroom. Drop it at the bottom of a page so short content never feels empty.
 */
export function ForestTrim({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex select-none items-end justify-center gap-5 opacity-60 ${className}`}
    >
      <Sprout size={22} />
      <Fern size={26} />
      <Mushroom size={24} />
      <Sprout size={18} className="-scale-x-100" />
      <Leaf size={20} />
    </div>
  );
}
