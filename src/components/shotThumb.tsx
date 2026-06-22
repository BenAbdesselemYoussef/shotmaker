import { Ban, Check } from "lucide-react";

import { shotTypeMeta, formatDuration } from "@/lib/meta";
import type { ShotStatus, ShotType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ShotThumb({
  index,
  hue,
  type,
  durationSec,
  status = "to_film",
  className,
}: {
  index: number;
  hue: number;
  type: ShotType;
  durationSec: number;
  status?: ShotStatus;
  className?: string;
}) {
  const Icon = shotTypeMeta[type].icon;
  const h = hue + index * 14;
  const bg = `linear-gradient(135deg, oklch(0.42 0.09 ${h}) 0%, oklch(0.2 0.05 ${h + 40}) 100%)`;
  const done = status !== "to_film";

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: bg }}>
      <div className={cn("absolute inset-0 grid place-items-center", done && "opacity-50")}>
        <Icon className="size-7 text-white/35" />
      </div>

      {/* shooting-order number */}
      <span className="absolute start-2 top-2 grid h-5 min-w-5 place-items-center rounded-md bg-black/45 px-1 font-mono text-xs font-medium text-white/90 backdrop-blur">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* status overlay */}
      {status === "filmed" ? (
        <span className="absolute end-2 top-2 grid size-5 place-items-center rounded-full" style={{ background: "var(--green)" }}>
          <Check className="size-3.5 text-black/80" />
        </span>
      ) : null}
      {status === "abandoned" ? (
        <span className="absolute inset-0 grid place-items-center bg-black/45">
          <Ban className="size-6" style={{ color: "var(--red)" }} />
        </span>
      ) : null}

      <span className="absolute end-2 bottom-2 rounded bg-black/45 px-1.5 py-0.5 font-mono text-[0.65rem] text-white/90 backdrop-blur">
        {formatDuration(durationSec)}
      </span>
    </div>
  );
}
