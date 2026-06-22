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
import { PriorityBadge, ShotTypeChip, StatusToggle } from "@/components/ui";
import type { Session, Shot } from "@/lib/types";
import { cn } from "@/lib/utils";

function CardInner({
  shot,
  index,
  hue,
  onCycleStatus,
}: {
  shot: Shot;
  index: number;
  hue: number;
  onCycleStatus?: () => void;
}) {
  const dim = shot.status !== "to_film";
  return (
    <div
      className={cn(
        "border-border bg-surface-2 overflow-hidden rounded-xl border transition-opacity",
        dim && "opacity-65",
      )}
    >
      <ShotThumb
        index={index}
        hue={hue}
        type={shot.type}
        durationSec={shot.durationSec}
        status={shot.status}
        className="aspect-video w-full"
      />
      <div className="p-3">
        <p
          className={cn(
            "line-clamp-2 text-sm leading-snug",
            shot.status === "abandoned" ? "text-muted-2 line-through" : "text-foreground",
          )}
        >
          {shot.title}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <PriorityBadge priority={shot.priority} />
          <ShotTypeChip type={shot.type} />
        </div>
        <div className="mt-2">
          <StatusToggle status={shot.status} onClick={onCycleStatus} />
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
  onCycleStatus,
}: {
  shot: Shot;
  index: number;
  hue: number;
  onOpen: () => void;
  onCycleStatus: () => void;
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
      <CardInner shot={shot} index={index} hue={hue} onCycleStatus={onCycleStatus} />
    </div>
  );
}

export function Storyboard({
  session,
  shots,
  onReorder,
  onOpen,
  onCycleStatus,
}: {
  session: Session;
  shots: Shot[];
  onReorder: (shots: Shot[]) => void;
  onOpen: (id: string) => void;
  onCycleStatus: (id: string) => void;
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
            <SortableCard
              key={shot.id}
              shot={shot}
              index={i}
              hue={session.hue}
              onOpen={() => onOpen(shot.id)}
              onCycleStatus={() => onCycleStatus(shot.id)}
            />
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
