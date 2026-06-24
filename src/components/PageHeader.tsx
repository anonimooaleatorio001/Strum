import type { LucideIcon } from "lucide-react";

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="mb-8 flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyprus text-sand">
        <Icon size={20} />
      </span>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-cyprus sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-xl text-[14px] text-cyprus/60">{subtitle}</p>
      </div>
    </header>
  );
}
