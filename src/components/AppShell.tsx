"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import StatBadges from "@/components/StatBadges";
import { NAV, NAV_GROUPS } from "@/lib/nav";
import { logout } from "@/app/actions/auth";

export default function AppShell({
  name,
  streak,
  xp,
  children,
}: {
  name: string;
  streak: number;
  xp: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  const primary = NAV.filter((n) => n.primary);

  return (
    <div className="min-h-screen bg-sand">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-cyprus/10 bg-sand px-4 py-5 md:flex">
        <div className="px-2">
          <Logo />
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-none">
          {NAV_GROUPS.map((group) => (
            <div key={group}>
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-cyprus/35">
                {group}
              </p>
              <div className="flex flex-col gap-0.5">
                {NAV.filter((n) => n.group === group).map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-medium transition-colors ${
                        active
                          ? "bg-cyprus text-sand"
                          : "text-cyprus/70 hover:bg-cyprus/5 hover:text-cyprus"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-cyprus/60 transition-colors hover:bg-cyprus/5 hover:text-cyprus"
          >
            <LogOut size={18} />
            Sair
          </button>
        </form>
      </aside>

      {/* Main column */}
      <div className="md:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-cyprus/10 bg-sand/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-5 py-3 sm:px-8">
            <div className="md:hidden">
              <Logo size={30} />
            </div>
            <p className="hidden text-sm text-cyprus/60 md:block">
              Olá{name ? `, ${name.split(" ")[0]}` : ""} 👋
            </p>
            <StatBadges streak={streak} xp={xp} />
          </div>
        </header>

        <main className="mx-auto max-w-[1100px] px-5 pb-28 pt-6 sm:px-8 md:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile bottom-nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-cyprus/10 bg-sand/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {primary.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                  active ? "text-cyprus" : "text-cyprus/45"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
