"use client";

import { formatDuration } from "@/lib/meta";
import type { Session, Shot } from "@/lib/types";
import { ShotThumb } from "@/components/shotThumb";
import { MovementChip, ShotTypeChip, StatusPill } from "@/components/ui";

function Row({ shot, index, hue, onOpen }: { shot: Shot; index: number; hue: number; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="border-border-soft hover:bg-surface-2 flex w-full items-center gap-3 border-b px-3 py-2.5 text-left transition-colors last:border-b-0"
    >
      <ShotThumb index={index} hue={hue} type={shot.type} durationSec={shot.durationSec} className="h-12 w-20 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm">{shot.title}</p>
        <p className="text-muted-2 truncate text-xs">
          {shot.location} · {shot.lens}
        </p>
      </div>
      <span className="hidden items-center gap-1.5 md:flex">
        <ShotTypeChip type={shot.type} />
        <MovementChip movement={shot.movement} />
      </span>
      <span className="text-muted hidden w-12 text-right font-mono text-xs sm:block">
        {formatDuration(shot.durationSec)}
      </span>
      <StatusPill status={shot.status} />
    </button>
  );
}

export function ShotList({
  session,
  shots,
  onOpen,
}: {
  session: Session;
  shots: Shot[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="border-border bg-surface/40 overflow-hidden rounded-xl border">
      {shots.map((shot, i) => (
        <Row key={shot.id} shot={shot} index={i} hue={session.hue} onOpen={() => onOpen(shot.id)} />
      ))}
    </div>
  );
}
