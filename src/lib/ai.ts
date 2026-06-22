import { shotTypeMeta } from "@/lib/meta";
import type { ShotType } from "@/lib/types";

// Light stand-in for the original's Genkit flows (generate-shot-description,
// ai-fact-assistant). Deterministic, canned, content-aware. Secondary to the
// core production-tracking workflow.

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

export const factSuggestions = [
  "Golden hour in Reykjavík in June lasts almost two hours — plan exteriors generously.",
  "For a 24fps cinematic look, set the shutter to 1/50s (180° rule).",
  "Rim light separates the subject from a dark background — add a hair light.",
  "A 50mm lens roughly matches human field of view — natural for hero shots.",
];
