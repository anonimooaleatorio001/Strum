import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "cyprus" | "sand" | "ghost";

const EASE = "ease-[cubic-bezier(0.25,0.1,0.25,1)]";

const variants: Record<Variant, { btn: string; circle: string }> = {
  cyprus: {
    btn: "bg-cyprus text-sand hover:bg-[#11421f]",
    circle: "bg-sand text-cyprus",
  },
  sand: {
    btn: "bg-sand text-cyprus hover:bg-[#e6e1d2] border border-cyprus/10",
    circle: "bg-cyprus text-sand",
  },
  ghost: {
    btn: "bg-transparent text-cyprus border border-cyprus/20 hover:bg-cyprus/5",
    circle: "bg-cyprus text-sand",
  },
};

interface Props {
  label: string;
  href?: string;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
}

/**
 * Pill link with a vertical "text roll" on hover and an arrow that rotates
 * -45° — the signature interaction from the brief, restyled for Strum.
 */
export default function TextRollButton({
  label,
  href = "#",
  variant = "cyprus",
  icon,
  className = "",
}: Props) {
  const v = variants[variant];
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full py-2 pl-5 pr-2 text-[13px] font-medium transition-colors duration-500 sm:pl-6 sm:text-[14px] ${EASE} ${v.btn} ${className}`}
    >
      <span className="flex h-[20px] flex-col overflow-hidden">
        <span
          className={`flex flex-col transition-transform duration-500 ${EASE} group-hover:-translate-y-1/2`}
        >
          <span className="leading-[20px]">{label}</span>
          <span className="leading-[20px]" aria-hidden="true">
            {label}
          </span>
        </span>
      </span>
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-500 sm:h-8 sm:w-8 ${EASE} group-hover:-rotate-45 ${v.circle}`}
      >
        {icon ?? <ArrowRight size={16} strokeWidth={2.2} />}
      </span>
    </Link>
  );
}
