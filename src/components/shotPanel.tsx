"use client";

import { Lightbulb, Plus, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ShotThumb } from "@/components/shotThumb";
import { MovementChip, ShotTypeChip, StatusPill } from "@/components/ui";
import { describeFromTitle, factSuggestions } from "@/lib/ai";
import { formatDuration, shotTypeMeta } from "@/lib/meta";
import type { Session, Shot, ShotStatus } from "@/lib/types";

const statusOrder: ShotStatus[] = ["planned", "shot", "edited"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-muted w-20 shrink-0 text-xs">{label}</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function ShotPanel({
  shot,
  index,
  session,
  onChange,
  onClose,
}: {
  shot: Shot;
  index: number;
  session: Session;
  onChange: (next: Shot) => void;
  onClose: () => void;
}) {
  const [description, setDescription] = useState(shot.description);
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showFacts, setShowFacts] = useState(false);

  useEffect(() => {
    setDescription(shot.description);
    setNotes("");
    setShowFacts(false);
  }, [shot.id, shot.description]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function generate() {
    setGenerating(true);
    window.setTimeout(() => {
      const next = describeFromTitle(shot.title, shot.type);
      setDescription(next);
      onChange({ ...shot, description: next });
      setGenerating(false);
    }, 1100);
  }

  function cycleStatus() {
    const next = statusOrder[(statusOrder.indexOf(shot.status) + 1) % statusOrder.length];
    onChange({ ...shot, status: next });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div
        className="border-border bg-surface flex h-full w-full max-w-[480px] flex-col border-l shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-border-soft flex items-center justify-between border-b px-5 py-3">
          <span className="text-muted font-mono text-xs">
            Shot {String(index + 1).padStart(2, "0")} · {session.title}
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-muted hover:text-foreground hover:bg-surface-3 grid size-8 cursor-pointer place-items-center rounded-lg transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <ShotThumb index={index} hue={session.hue} type={shot.type} durationSec={shot.durationSec} className="aspect-video w-full rounded-xl" />

          <h2 className="text-foreground mt-4 text-lg font-semibold">{shot.title}</h2>

          {/* Description + AI */}
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-muted text-xs">Description</span>
              <button
                type="button"
                onClick={generate}
                disabled={generating}
                className="text-accent hover:bg-accent/10 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors disabled:opacity-60"
              >
                <Sparkles className={`size-3.5 ${generating ? "animate-pulse" : ""}`} />
                {generating ? "Generating…" : "Generate with AI"}
              </button>
            </div>
            <p className="text-foreground/90 border-border bg-surface-2 rounded-lg border p-3 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Fields */}
          <div className="border-border-soft mt-4 border-y py-1">
            <Field label="Type">
              <ShotTypeChip type={shot.type} withName />
            </Field>
            <Field label="Movement">
              <MovementChip movement={shot.movement} />
            </Field>
            <Field label="Duration">
              <span className="text-foreground text-sm">{formatDuration(shot.durationSec)}</span>
            </Field>
            <Field label="Lens">
              <span className="text-foreground text-sm">{shot.lens}</span>
            </Field>
            <Field label="Location">
              <span className="text-foreground text-sm">{shot.location}</span>
            </Field>
            <Field label="Status">
              <button type="button" onClick={cycleStatus} className="cursor-pointer" title="Click to advance">
                <StatusPill status={shot.status} />
              </button>
            </Field>
          </div>

          {/* Notes + fact assistant */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-muted text-xs">Notes</span>
              <button
                type="button"
                onClick={() => setShowFacts((s) => !s)}
                className="text-accent hover:bg-accent/10 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors"
              >
                <Lightbulb className="size-3.5" />
                AI fact assistant
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Lighting, blocking, gear, reminders…"
              rows={3}
              className="border-border bg-surface-2 placeholder:text-muted-2 focus:border-accent/50 w-full resize-none rounded-lg border p-3 text-sm outline-none"
            />
            {showFacts ? (
              <ul className="mt-2 flex flex-col gap-1.5">
                {factSuggestions.map((fact) => (
                  <li key={fact}>
                    <button
                      type="button"
                      onClick={() => setNotes((n) => (n ? `${n}\n• ${fact}` : `• ${fact}`))}
                      className="border-border bg-surface-2 hover:border-accent/40 hover:bg-surface-3 flex w-full items-start gap-2 rounded-lg border p-2.5 text-left text-xs transition-colors"
                    >
                      <Plus className="text-accent mt-0.5 size-3.5 shrink-0" />
                      <span className="text-muted">{fact}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
