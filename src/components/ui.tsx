import type { ButtonHTMLAttributes } from "react";

import { movementMeta, priorityMeta, shotTypeMeta, statusMeta } from "@/lib/meta";
import type { Movement, Priority, ShotStatus, ShotType } from "@/lib/types";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
};

export function Button({ variant = "outline", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-colors outline-none focus-visible:ring-2 disabled:opacity-50",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
        variant === "primary" && "bg-accent-strong hover:bg-accent text-accent-foreground shadow-sm",
        variant === "outline" &&
          "border-border bg-surface-2 text-foreground hover:border-muted-2 hover:bg-surface-3 border",
        variant === "ghost" && "text-muted hover:text-foreground hover:bg-surface-2",
        className,
      )}
      {...props}
    />
  );
}

export function ShotTypeChip({ type, withName = false }: { type: ShotType; withName?: boolean }) {
  const meta = shotTypeMeta[type];
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[0.68rem]"
      style={{ background: `color-mix(in oklab, ${meta.color} 14%, transparent)`, color: meta.color }}
    >
      <Icon className="size-3" />
      {withName ? meta.name : meta.short}
    </span>
  );
}

export function MovementChip({ movement }: { movement: Movement }) {
  const meta = movementMeta[movement];
  const Icon = meta.icon;
  return (
    <span className="bg-surface-3 text-muted inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.68rem]">
      <Icon className="size-3" />
      {meta.name}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = priorityMeta[priority];
  const Icon = meta.icon;
  const essential = priority === "essential";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.68rem] font-medium",
        essential ? "" : "border-border text-muted-2 border border-dashed",
      )}
      style={essential ? { background: `color-mix(in oklab, ${meta.color} 16%, transparent)`, color: meta.color } : undefined}
    >
      <Icon className="size-3" />
      {meta.name}
    </span>
  );
}

// Clickable status pill — cycles to_film -> filmed -> abandoned on the crew's tap.
export function StatusToggle({
  status,
  onClick,
}: {
  status: ShotStatus;
  onClick?: () => void;
}) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  const content = (
    <>
      <Icon className="size-3.5" style={{ color: meta.color }} />
      <span style={{ color: meta.color }}>{meta.name}</span>
    </>
  );
  const cls =
    "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors";
  const bg = { background: `color-mix(in oklab, ${meta.color} 14%, transparent)` };
  if (!onClick)
    return (
      <span className={cls} style={bg}>
        {content}
      </span>
    );
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title="Click to update status"
      className={cn(cls, "hover:brightness-125 cursor-pointer")}
      style={bg}
    >
      {content}
    </button>
  );
}
