import {
  Ban,
  Camera,
  CheckCircle2,
  Circle,
  CircleDashed,
  Flag,
  Hand,
  Maximize,
  Move,
  MoveHorizontal,
  MoveVertical,
  Plane,
  ScanEye,
  Sparkle,
  User,
  Video,
  type LucideIcon,
} from "lucide-react";

import type { Movement, Priority, ShotStatus, ShotType } from "@/lib/types";

export const shotTypeMeta: Record<ShotType, { name: string; short: string; icon: LucideIcon; color: string }> = {
  wide: { name: "Wide", short: "WS", icon: Maximize, color: "var(--cyan)" },
  medium: { name: "Medium", short: "MS", icon: User, color: "var(--accent)" },
  "close-up": { name: "Close-up", short: "CU", icon: ScanEye, color: "var(--pink)" },
  pov: { name: "POV", short: "POV", icon: Video, color: "var(--violet)" },
  drone: { name: "Drone", short: "AER", icon: Plane, color: "var(--green)" },
  macro: { name: "Macro", short: "MAC", icon: Sparkle, color: "var(--amber)" },
};

export const movementMeta: Record<Movement, { name: string; icon: LucideIcon }> = {
  static: { name: "Static", icon: Camera },
  pan: { name: "Pan", icon: MoveHorizontal },
  tilt: { name: "Tilt", icon: MoveVertical },
  dolly: { name: "Dolly", icon: Move },
  handheld: { name: "Handheld", icon: Hand },
  crane: { name: "Crane", icon: MoveVertical },
};

export const statusMeta: Record<ShotStatus, { name: string; color: string; icon: LucideIcon }> = {
  to_film: { name: "To film", color: "var(--muted)", icon: Circle },
  filmed: { name: "Filmed", color: "var(--green)", icon: CheckCircle2 },
  abandoned: { name: "Abandoned", color: "var(--red)", icon: Ban },
};

// Cycle order for the quick on-set toggle.
export const statusCycle: ShotStatus[] = ["to_film", "filmed", "abandoned"];

export const priorityMeta: Record<Priority, { name: string; color: string; icon: LucideIcon }> = {
  essential: { name: "Essential", color: "var(--amber)", icon: Flag },
  optional: { name: "Optional", color: "var(--muted-2)", icon: CircleDashed },
};

export function formatDuration(sec: number) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}
