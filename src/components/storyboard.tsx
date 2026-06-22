"use client";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

import { ShotThumb } from "@/components/shotThumb";
import { MovementChip, ShotTypeChip, StatusPill } from "@/components/ui";
import type { Session, Shot } from "@/lib/types";
import { cn } from "@/lib/utils";

function CardInner({ shot, index, hue }: { shot: Shot; index: number; hue: number }) {
  return (
    <div className="border-border bg-surface-2 overflow-hidden rounded-xl border">
      <ShotThumb index={index} hue={hue} type={shot.type} durationSec={shot.durationSec} className="aspect-video w-full" />
      <div className="p-3">
        <p className="text-foreground line-clamp-2 text-sm leading-snug">{shot.title}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <ShotTypeChip type={shot.type} />
          <MovementChip movement={shot.movement} />
        </div>
        <div className="mt-2">
          <StatusPill status={shot.status} />
        </div>
      </div>
    </div>
  );
}

function SortableCard({
  shot,
  index,
  hue,
  onOpen,
}: {
  shot: Shot;
  index: number;
  hue: number;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: shot.id,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("cursor-grab touch-none active:cursor-grabbing", isDragging && "opacity-40")}
      onClick={onOpen}
      {...attributes}
      {...listeners}
    >
      <CardInner shot={shot} index={index} hue={hue} />
    </div>
  );
}

export function Storyboard({
  session,
  shots,
  onReorder,
  onOpen,
}: {
  session: Session;
  shots: Shot[];
  onReorder: (shots: Shot[]) => void;
  onOpen: (id: string) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const activeIndex = shots.findIndex((s) => s.id === activeId);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = shots.findIndex((s) => s.id === active.id);
    const newIndex = shots.findIndex((s) => s.id === over.id);
    onReorder(arrayMove(shots, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={shots.map((s) => s.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shots.map((shot, i) => (
            <SortableCard key={shot.id} shot={shot} index={i} hue={session.hue} onOpen={() => onOpen(shot.id)} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeIndex >= 0 ? (
          <div className="w-72 rotate-2">
            <CardInner shot={shots[activeIndex]} index={activeIndex} hue={session.hue} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
