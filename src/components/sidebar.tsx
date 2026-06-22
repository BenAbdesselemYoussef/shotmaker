"use client";

import { Clapperboard, Film, Plus } from "lucide-react";

import type { Session } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Sidebar({
  sessions,
  activeId,
  onSelect,
}: {
  sessions: Session[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="border-border bg-surface flex w-[270px] shrink-0 flex-col border-r">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <span className="bg-accent-strong grid size-8 place-items-center rounded-lg shadow-sm">
          <Clapperboard className="text-accent-foreground size-4" />
        </span>
        <span className="text-foreground font-semibold tracking-tight">Shotmaker</span>
      </div>

      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <p className="text-muted-2 text-xs font-medium tracking-wide uppercase">Shoots</p>
        <button
          type="button"
          aria-label="New shoot"
          className="text-muted hover:text-foreground hover:bg-surface-2 grid size-6 place-items-center rounded-md transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        <ul className="flex flex-col gap-1">
          {sessions.map((s) => {
            const active = s.id === activeId;
            const runtime = s.shots.reduce((a, x) => a + x.durationSec, 0);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors",
                    active ? "bg-surface-3" : "hover:bg-surface-2",
                  )}
                >
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.45 0.09 ${s.hue}), oklch(0.22 0.05 ${s.hue + 40}))`,
                    }}
                  >
                    <Film className="size-4 text-white/70" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-sm", active ? "text-foreground" : "text-muted")}>
                      {s.title}
                    </span>
                    <span className="text-muted-2 block text-xs">
                      {s.shots.length} shots · {Math.round(runtime)}s · {s.date}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
