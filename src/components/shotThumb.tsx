import { shotTypeMeta, formatDuration } from "@/lib/meta";
import type { ShotType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ShotThumb({
  index,
  hue,
  type,
  durationSec,
  className,
}: {
  index: number;
  hue: number;
  type: ShotType;
  durationSec: number;
  className?: string;
}) {
  const Icon = shotTypeMeta[type].icon;
  const h = hue + index * 14;
  const bg = `linear-gradient(135deg, oklch(0.42 0.09 ${h}) 0%, oklch(0.2 0.05 ${h + 40}) 100%)`;

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: bg }}>
      <div className="absolute inset-0 grid place-items-center">
        <Icon className="size-7 text-white/35" />
      </div>
      <span className="absolute start-2 top-2 grid h-5 min-w-5 place-items-center rounded-md bg-black/45 px-1 font-mono text-xs font-medium text-white/90 backdrop-blur">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute end-2 bottom-2 rounded bg-black/45 px-1.5 py-0.5 font-mono text-[0.65rem] text-white/90 backdrop-blur">
        {formatDuration(durationSec)}
      </span>
    </div>
  );
}
