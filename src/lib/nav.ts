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
  Ear,
  BookOpen,
  Trophy,
  Library,
  PenLine,
  Camera,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Show in the compact mobile bottom-nav. */
  primary?: boolean;
  /** Group heading in the desktop sidebar. */
  group: "Praticar" | "Ferramentas" | "Você";
}

export const NAV: NavItem[] = [
  { label: "Início", href: "/app", icon: Home, primary: true, group: "Praticar" },
  { label: "Lições", href: "/app/lessons", icon: GraduationCap, primary: true, group: "Praticar" },
  { label: "Treino auditivo", href: "/app/ear", icon: Ear, group: "Praticar" },
  { label: "Músicas", href: "/app/songs", icon: Library, primary: true, group: "Praticar" },
  { label: "Compositor", href: "/app/composer", icon: PenLine, group: "Praticar" },

  { label: "Afinador", href: "/app/tuner", icon: Gauge, group: "Ferramentas" },
  { label: "Metrônomo", href: "/app/metronome", icon: Timer, group: "Ferramentas" },
  { label: "Acordes", href: "/app/chords", icon: Music, group: "Ferramentas" },
  { label: "Câmera", href: "/app/camera", icon: Camera, group: "Ferramentas" },
  { label: "Glossário", href: "/app/glossary", icon: BookOpen, group: "Ferramentas" },

  { label: "Progresso", href: "/app/progress", icon: BarChart3, group: "Você" },
  { label: "Conquistas", href: "/app/achievements", icon: Trophy, group: "Você" },
  { label: "Config", href: "/app/settings", icon: Settings, group: "Você" },
  { label: "Conta", href: "/app/account", icon: User, group: "Você" },
];

export const NAV_GROUPS: NavItem["group"][] = ["Praticar", "Ferramentas", "Você"];
