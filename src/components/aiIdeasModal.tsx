"use client";

import { Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Modal } from "@/components/modal";
import { ShotThumb } from "@/components/shotThumb";
import { ShotTypeChip } from "@/components/ui";
import { suggestShots } from "@/lib/ai";
import { formatDuration } from "@/lib/meta";
import type { Session, Shot } from "@/lib/types";

export function AiIdeasModal({
  session,
  onAdd,
  onClose,
}: {
  session: Session;
  onAdd: (shot: Omit<Shot, "id">) => void;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<Omit<Shot, "id">[]>([]);
  const [added, setAdded] = useState<number[]>([]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setIdeas(suggestShots(session));
      setLoading(false);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [session]);

  return (
    <Modal
      title="AI shot ideas"
      subtitle={`Suggestions to round out "${session.title}"`}
      onClose={onClose}
      wide
    >
      {loading ? (
        <div className="text-muted flex items-center gap-3 py-10">
          <Sparkles className="text-accent size-5 animate-pulse" />
          <span className="text-sm">Reading the shot list and drafting ideas…</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {ideas.map((idea, i) => (
            <li
              key={i}
              className="border-border bg-surface-2 flex items-center gap-3 rounded-xl border p-2.5"
            >
              <ShotThumb index={i + 6} hue={session.hue} type={idea.type} durationSec={idea.durationSec} className="h-12 w-20 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm">{idea.title}</p>
                <p className="text-muted-2 line-clamp-1 text-xs">{idea.description}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <ShotTypeChip type={idea.type} />
                  <span className="text-muted-2 font-mono text-[0.65rem]">{formatDuration(idea.durationSec)}</span>
                </div>
              </div>
              <button
                type="button"
                disabled={added.includes(i)}
                onClick={() => {
                  onAdd(idea);
                  setAdded((a) => [...a, i]);
                }}
                className="border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
              >
                <Plus className="size-3.5" />
                {added.includes(i) ? "Added" : "Add"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
