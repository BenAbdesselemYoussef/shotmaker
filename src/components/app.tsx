"use client";

import { CheckCircle2, Clock, Flag, LayoutGrid, MapPin, Plus, Rows3 } from "lucide-react";
import { useState } from "react";

import { ShotList } from "@/components/shotList";
import { ShotPanel } from "@/components/shotPanel";
import { Sidebar } from "@/components/sidebar";
import { Storyboard } from "@/components/storyboard";
import { Button } from "@/components/ui";
import { sessions as seed } from "@/lib/data";
import { formatDuration, statusCycle } from "@/lib/meta";
import type { Session, Shot, ViewMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function App() {
  const [sessions, setSessions] = useState<Session[]>(seed);
  const [activeId, setActiveId] = useState(seed[0].id);
  const [mode, setMode] = useState<ViewMode>("storyboard");
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);

  const session = sessions.find((s) => s.id === activeId) ?? sessions[0];
  const runtime = session.shots.reduce((a, s) => a + s.durationSec, 0);
  const selectedIndex = session.shots.findIndex((s) => s.id === selectedShotId);
  const selectedShot = selectedIndex >= 0 ? session.shots[selectedIndex] : null;

  // Session readiness — essential shots drive whether the session can wrap.
  const essentials = session.shots.filter((s) => s.priority === "essential" && s.status !== "abandoned");
  const essentialFilmed = essentials.filter((s) => s.status === "filmed").length;
  const ready = essentials.length > 0 && essentialFilmed === essentials.length;
  const optional = session.shots.filter((s) => s.priority === "optional");
  const optionalFilmed = optional.filter((s) => s.status === "filmed").length;
  const toFilm = session.shots.filter((s) => s.status === "to_film").length;

  const updateSession = (next: Session) =>
    setSessions((prev) => prev.map((s) => (s.id === next.id ? next : s)));
  const reorder = (shots: Shot[]) => updateSession({ ...session, shots });
  const updateShot = (next: Shot) =>
    updateSession({ ...session, shots: session.shots.map((s) => (s.id === next.id ? next : s)) });
  const cycleStatus = (id: string) =>
    updateSession({
      ...session,
      shots: session.shots.map((s) =>
        s.id === id
          ? { ...s, status: statusCycle[(statusCycle.indexOf(s.status) + 1) % statusCycle.length] }
          : s,
      ),
    });

  return (
    <div className="flex h-full">
      <Sidebar sessions={sessions} activeId={activeId} onSelect={setActiveId} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="border-border-soft border-b px-6 py-4 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-foreground text-xl font-semibold tracking-tight">{session.title}</h1>
              <p className="text-muted mt-1 max-w-2xl text-sm">{session.description}</p>
              <div className="text-muted-2 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {session.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {session.shots.length} shots · {formatDuration(runtime)} runtime
                </span>
                <span>{session.date}</span>
              </div>
            </div>
            <Button variant="primary" size="sm">
              <Plus className="size-4" />
              Add shot
            </Button>
          </div>

          {/* Readiness */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
              style={{
                background: `color-mix(in oklab, ${ready ? "var(--green)" : "var(--amber)"} 16%, transparent)`,
                color: ready ? "var(--green)" : "var(--amber)",
              }}
            >
              {ready ? <CheckCircle2 className="size-3.5" /> : <Flag className="size-3.5" />}
              {ready ? "Ready to wrap" : `${essentials.length - essentialFilmed} essential left`}
            </span>
            <div className="flex items-center gap-2">
              <div className="bg-surface-3 h-1.5 w-28 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${essentials.length ? (essentialFilmed / essentials.length) * 100 : 0}%`,
                    background: ready ? "var(--green)" : "var(--accent)",
                  }}
                />
              </div>
              <span className="text-muted-2 font-mono text-xs">
                essential {essentialFilmed}/{essentials.length}
              </span>
            </div>
            <span className="text-muted-2 text-xs">
              · optional {optionalFilmed}/{optional.length} · {toFilm} to film
            </span>
          </div>

          {/* View toggle */}
          <div className="border-border bg-surface-2 mt-4 inline-flex rounded-lg border p-0.5">
            {([
              { id: "storyboard", name: "Storyboard", icon: LayoutGrid },
              { id: "list", name: "List", icon: Rows3 },
            ] as const).map((v) => {
              const Icon = v.icon;
              const active = mode === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setMode(v.id)}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    active ? "bg-surface-3 text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  {v.name}
                </button>
              );
            })}
            <span className="text-muted-2 ml-2 hidden items-center pe-2 text-xs sm:inline-flex">
              drag to set shooting order
            </span>
          </div>
        </header>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {mode === "storyboard" ? (
            <Storyboard
              session={session}
              shots={session.shots}
              onReorder={reorder}
              onOpen={setSelectedShotId}
              onCycleStatus={cycleStatus}
            />
          ) : (
            <ShotList
              session={session}
              shots={session.shots}
              onOpen={setSelectedShotId}
              onCycleStatus={cycleStatus}
            />
          )}
        </div>
      </div>

      {selectedShot ? (
        <ShotPanel
          shot={selectedShot}
          index={selectedIndex}
          session={session}
          onChange={updateShot}
          onClose={() => setSelectedShotId(null)}
        />
      ) : null}
    </div>
  );
}
