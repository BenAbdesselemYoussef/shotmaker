import type { ButtonHTMLAttributes } from "react";

import { movementMeta, shotTypeMeta, statusMeta } from "@/lib/meta";
import type { Movement, ShotStatus, ShotType } from "@/lib/types";
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

export function StatusPill({ status }: { status: ShotStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium"
      style={{ background: `color-mix(in oklab, ${meta.color} 15%, transparent)`, color: meta.color }}
    >
      <span className="size-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.name}
    </span>
  );
}
