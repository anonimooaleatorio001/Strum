export default function Logo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="9" fill="#004741" />
        <path
          d="M16 6c4.4 0 8 2.7 8 7 0 3.4-2.2 8.1-5 11-1 1-2 1.6-3 1.6s-2-.6-3-1.6c-2.8-2.9-5-7.6-5-11 0-4.3 3.6-7 8-7Z"
          fill="#F0EDE4"
        />
        <circle cx="16" cy="13" r="2.2" fill="#004741" />
      </svg>
      <span className="text-[17px] font-semibold tracking-tight text-cyprus">
        Strum
      </span>
    </span>
  );
}
