import { Flame, Zap } from "lucide-react";
import { useProgress } from "../state/progress";

export default function StatBadges({ compact = false }: { compact?: boolean }) {
  const { streak, xp } = useProgress();
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyprus/5 px-3 py-1.5 text-[13px] font-semibold text-cyprus">
        <Flame size={16} className="text-[#C8893B]" fill="#C8893B" />
        {streak}
        {!compact && <span className="font-normal text-cyprus/55">day</span>}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyprus/5 px-3 py-1.5 text-[13px] font-semibold text-cyprus">
        <Zap size={16} className="text-[#C8893B]" fill="#C8893B" />
        {xp}
        {!compact && <span className="font-normal text-cyprus/55">XP</span>}
      </span>
    </div>
  );
}
