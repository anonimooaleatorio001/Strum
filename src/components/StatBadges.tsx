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
      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyprus/5 px-3 py-1.5 text-[13px] font-semibold text-cyprus">
        <Flame size={16} className="text-ochre" fill="#C8893B" />
        {streak}
        {!compact && <span className="font-normal text-cyprus/55">dias</span>}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyprus/5 px-3 py-1.5 text-[13px] font-semibold text-cyprus">
        <Zap size={16} className="text-ochre" fill="#C8893B" />
        {xp}
        {!compact && <span className="font-normal text-cyprus/55">XP</span>}
      </span>
    </div>
  );
}
