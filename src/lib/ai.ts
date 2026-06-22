import { shotTypeMeta } from "@/lib/meta";
import type { Session, Shot, ShotType } from "@/lib/types";

// Stand-in for the Genkit flows in the original (generate-shot-description,
// generate-description-from-title, ai-fact-assistant). Deterministic, canned,
// but content-aware enough to feel real in the demo.

const movementPhrases = [
  "Let the camera breathe with a slow, deliberate move.",
  "Keep it locked off so the subject carries the frame.",
  "A gentle push adds momentum without drawing attention.",
  "Track with the action to keep the energy alive.",
];

const lightingPhrases = [
  "Backlit, with soft fill to hold detail in the shadows.",
  "Hard key for contrast and a crisp, modern edge.",
  "Warm practical light keeps it intimate and human.",
  "Cool ambient at blue hour for a calm, premium mood.",
];

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

export function describeFromTitle(title: string, type: ShotType): string {
  const seed = title.length;
  const t = shotTypeMeta[type].name.toLowerCase();
  return `A ${t} shot — ${title.replace(/\.$/, "").toLowerCase()}. ${pick(
    movementPhrases,
    seed,
  )} ${pick(lightingPhrases, seed + 1)}`;
}

const ideaTemplates: { title: string; type: ShotType; movement: Shot["movement"]; durationSec: number }[] = [
  { title: "Insert — reaction on a face", type: "close-up", movement: "static", durationSec: 3 },
  { title: "Cutaway — detail of the environment", type: "macro", movement: "tilt", durationSec: 4 },
  { title: "Transition — whip pan to the next beat", type: "medium", movement: "pan", durationSec: 2 },
  { title: "Establishing — reveal the location", type: "wide", movement: "crane", durationSec: 7 },
];

export function suggestShots(session: Session): Omit<Shot, "id">[] {
  return ideaTemplates.slice(0, 3).map((tpl) => ({
    title: tpl.title,
    description: describeFromTitle(tpl.title, tpl.type),
    type: tpl.type,
    movement: tpl.movement,
    durationSec: tpl.durationSec,
    location: session.location,
    lens: tpl.type === "macro" ? "100mm macro" : "50mm",
    status: "planned",
  }));
}

export const factSuggestions = [
  "Golden hour in Reykjavík in June lasts almost two hours — plan exteriors generously.",
  "For a 24fps cinematic look, set the shutter to 1/50s (180° rule).",
  "Rim light separates the subject from a dark background — add a hair light.",
  "A 50mm lens roughly matches human field of view — natural for hero shots.",
];
