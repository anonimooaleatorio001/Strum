import { Flame, Zap } from "lucide-react";

export default function StatBadges({
  streak,
  xp,
  compact = false,
}: {
  streak: number;
  xp: number;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-carrot/10 px-3 py-1.5 text-[13px] font-semibold text-forest">
        <Flame size={16} className="text-carrot" fill="#f96015" />
        {streak}
        {!compact && <span className="font-normal text-forest/55">dias</span>}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sunshine/20 px-3 py-1.5 text-[13px] font-semibold text-forest">
        <Zap size={16} className="text-[#e0a500]" fill="#ffc926" />
        {xp}
        {!compact && <span className="font-normal text-forest/55">XP</span>}
      </span>
    </div>
  );
}
