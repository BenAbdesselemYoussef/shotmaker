"use client";

import { formatDuration } from "@/lib/meta";
import type { Session, Shot } from "@/lib/types";
import { ShotThumb } from "@/components/shotThumb";
import { PriorityBadge, ShotTypeChip, StatusToggle } from "@/components/ui";
import { cn } from "@/lib/utils";

function Row({
  shot,
  index,
  hue,
  onOpen,
  onCycleStatus,
}: {
  shot: Shot;
  index: number;
  hue: number;
  onOpen: () => void;
  onCycleStatus: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className={cn(
        "border-border-soft hover:bg-surface-2 flex w-full cursor-pointer items-center gap-3 border-b px-3 py-2.5 transition-colors last:border-b-0",
        shot.status !== "to_film" && "opacity-65",
      )}
    >
      <span className="text-muted-2 w-6 shrink-0 text-center font-mono text-xs">
        {String(index + 1).padStart(2, "0")}
      </span>
      <ShotThumb
        index={index}
        hue={hue}
        type={shot.type}
        durationSec={shot.durationSec}
        status={shot.status}
        className="h-12 w-20 shrink-0 rounded-md"
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm",
            shot.status === "abandoned" ? "text-muted-2 line-through" : "text-foreground",
          )}
        >
          {shot.title}
        </p>
        <p className="text-muted-2 truncate text-xs">
          {shot.location} · {shot.lens}
        </p>
      </div>
      <span className="hidden items-center gap-1.5 md:flex">
        <PriorityBadge priority={shot.priority} />
        <ShotTypeChip type={shot.type} />
      </span>
      <span className="text-muted hidden w-12 text-right font-mono text-xs sm:block">
        {formatDuration(shot.durationSec)}
      </span>
      <StatusToggle status={shot.status} onClick={onCycleStatus} />
    </div>
  );
}

export function ShotList({
  session,
  shots,
  onOpen,
  onCycleStatus,
}: {
  session: Session;
  shots: Shot[];
  onOpen: (id: string) => void;
  onCycleStatus: (id: string) => void;
}) {
  return (
    <div className="border-border bg-surface/40 overflow-hidden rounded-xl border">
      {shots.map((shot, i) => (
        <Row
          key={shot.id}
          shot={shot}
          index={i}
          hue={session.hue}
          onOpen={() => onOpen(shot.id)}
          onCycleStatus={() => onCycleStatus(shot.id)}
        />
      ))}
    </div>
  );
}
