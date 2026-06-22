export type ShotType = "wide" | "medium" | "close-up" | "pov" | "drone" | "macro";
export type Movement = "static" | "pan" | "tilt" | "dolly" | "handheld" | "crane";
export type ShotStatus = "planned" | "shot" | "edited";
export type ViewMode = "storyboard" | "list";

export type Shot = {
  id: string;
  title: string;
  description: string;
  type: ShotType;
  movement: Movement;
  durationSec: number;
  location: string;
  lens: string;
  status: ShotStatus;
};

export type Session = {
  id: string;
  title: string;
  description: string;
  date: string; // e.g. "Jun 24, 2026"
  location: string;
  hue: number; // base hue for the storyboard thumbnails
  shots: Shot[];
};
