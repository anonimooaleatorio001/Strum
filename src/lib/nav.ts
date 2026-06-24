import type { LucideIcon } from "lucide-react";
import {
  Home,
  GraduationCap,
  Gauge,
  Timer,
  Music,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Show in the compact mobile bottom-nav. */
  primary?: boolean;
}

export const NAV: NavItem[] = [
  { label: "Início", href: "/app", icon: Home, primary: true },
  { label: "Lições", href: "/app/lessons", icon: GraduationCap, primary: true },
  { label: "Afinador", href: "/app/tuner", icon: Gauge, primary: true },
  { label: "Metrônomo", href: "/app/metronome", icon: Timer },
  { label: "Acordes", href: "/app/chords", icon: Music, primary: true },
  { label: "Progresso", href: "/app/progress", icon: BarChart3 },
  { label: "Config", href: "/app/settings", icon: Settings },
  { label: "Conta", href: "/app/account", icon: User },
];
