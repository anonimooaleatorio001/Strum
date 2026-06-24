import type { LucideIcon } from "lucide-react";
import { GraduationCap, Gauge, Music, Timer } from "lucide-react";

export type ToolId = "learn" | "tuner" | "metronome" | "chords";

export interface ToolMeta {
  id: ToolId;
  label: string;
  blurb: string;
  icon: LucideIcon;
}

export const TOOLS: ToolMeta[] = [
  {
    id: "learn",
    label: "Learn",
    blurb: "Bite-sized lessons that build real skills, one streak at a time.",
    icon: GraduationCap,
  },
  {
    id: "tuner",
    label: "Tuner",
    blurb: "A precise chromatic tuner that listens through your mic.",
    icon: Gauge,
  },
  {
    id: "metronome",
    label: "Metronome",
    blurb: "Rock-steady timing with tap tempo and accents.",
    icon: Timer,
  },
  {
    id: "chords",
    label: "Chords",
    blurb: "An interactive chord library you can see and hear.",
    icon: Music,
  },
];
