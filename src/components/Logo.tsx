export default function Logo({
  size = 36,
  className = "",
  wordmark = true,
  tone = "forest",
}: {
  size?: number;
  className?: string;
  wordmark?: boolean;
  /** "forest" for light backgrounds, "cream" for dark/photo backgrounds. */
  tone?: "forest" | "cream";
}) {
  const text = tone === "cream" ? "text-cream" : "text-forest";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="9" fill="#18542a" />
        {/* guitar-pick / leaf */}
        <path
          d="M16 6c4.4 0 8 2.7 8 7 0 3.4-2.2 8.1-5 11-1 1-2 1.6-3 1.6s-2-.6-3-1.6c-2.8-2.9-5-7.6-5-11 0-4.3 3.6-7 8-7Z"
          fill="#f3e8cc"
        />
        {/* sound-hole + sunshine string accent */}
        <circle cx="16" cy="13" r="2.2" fill="#18542a" />
        <rect x="15.1" y="14.4" width="1.8" height="8" rx="0.9" fill="#ffc926" />
      </svg>
      {wordmark && (
        <span
          className={`font-display text-[18px] font-extrabold tracking-tight ${text}`}
        >
          Strum
        </span>
      )}
    </span>
  );
}
