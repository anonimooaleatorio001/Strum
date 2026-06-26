"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, PanelLeftClose, PanelLeft } from "lucide-react";
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
  const [collapsed, setCollapsed] = useState(false);

  // remember the user's choice across visits
  useEffect(() => {
    setCollapsed(localStorage.getItem("strum.sidebar") === "collapsed");
  }, []);
  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("strum.sidebar", next ? "collapsed" : "open");
      return next;
    });
  }

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);
  const primary = NAV.filter((n) => n.primary);

  return (
    <div className="min-h-screen bg-sand">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-forest/10 bg-sand py-4 transition-all duration-200 md:flex ${
          collapsed ? "w-[68px] px-2" : "w-60 px-4"
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between px-2"
          }`}
        >
          {collapsed ? (
            <Logo size={30} wordmark={false} />
          ) : (
            <Logo />
          )}
          {!collapsed && (
            <button
              onClick={toggle}
              aria-label="Recolher menu"
              title="Recolher menu"
              className="rounded-lg p-1.5 text-forest/40 transition-colors hover:bg-forest/5 hover:text-forest"
            >
              <PanelLeftClose size={18} />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={toggle}
            aria-label="Expandir menu"
            title="Expandir menu"
            className="mx-auto mt-3 rounded-lg p-1.5 text-forest/40 transition-colors hover:bg-forest/5 hover:text-forest"
          >
            <PanelLeft size={18} />
          </button>
        )}

        <nav className="mt-5 flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-none">
          {NAV_GROUPS.map((group) => (
            <div key={group}>
              {!collapsed && (
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-forest/35">
                  {group}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {NAV.filter((n) => n.group === group).map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center rounded-xl text-[14px] font-medium transition-colors ${
                        collapsed
                          ? "justify-center px-0 py-2.5"
                          : "gap-3 px-3 py-2"
                      } ${
                        active
                          ? "bg-forest text-cream"
                          : "text-forest/70 hover:bg-forest/5 hover:text-forest"
                      }`}
                    >
                      <Icon size={18} />
                      {!collapsed && item.label}
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
            title="Sair"
            className={`flex w-full items-center rounded-xl text-[14px] font-medium text-forest/60 transition-colors hover:bg-forest/5 hover:text-forest ${
              collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2.5"
            }`}
          >
            <LogOut size={18} />
            {!collapsed && "Sair"}
          </button>
        </form>
      </aside>

      {/* Main column */}
      <div
        className={`transition-all duration-200 ${
          collapsed ? "md:pl-[68px]" : "md:pl-60"
        }`}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-forest/10 bg-sand/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-5 py-3 sm:px-8">
            <div className="md:hidden">
              <Logo size={30} />
            </div>
            <p className="hidden text-sm text-forest/60 md:block">
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
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-forest/10 bg-sand/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {primary.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                  active ? "text-forest" : "text-forest/45"
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
