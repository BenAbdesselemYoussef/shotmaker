export type ShotType = "wide" | "medium" | "close-up" | "pov" | "drone" | "macro";
export type Movement = "static" | "pan" | "tilt" | "dolly" | "handheld" | "crane";

// What the crew tracks on set.
export type ShotStatus = "to_film" | "filmed" | "abandoned";

// Whether the session needs this shot. Optional shots can be skipped and the
// session still wraps successfully.
export type Priority = "essential" | "optional";

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
  priority: Priority;
  status: ShotStatus;
};

export type Session = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  hue: number;
  shots: Shot[]; // array order = shooting order (drag to reorder)
};
