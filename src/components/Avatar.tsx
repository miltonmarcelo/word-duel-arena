import { cn } from "@/lib/utils";
import type { Player } from "@/lib/mock-data";

export function Avatar({
  player,
  size = 40,
  ring,
  className,
}: {
  player: Pick<Player, "initials" | "avatarColor">;
  size?: number;
  ring?: "mint" | "lilac" | "none";
  className?: string;
}) {
  const inner = (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-foreground select-none",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `color-mix(in oklch, ${player.avatarColor} 30%, var(--surface-elevated))`,
        border: `1px solid color-mix(in oklch, ${player.avatarColor} 50%, transparent)`,
        fontSize: size * 0.38,
      }}
    >
      {player.initials}
    </div>
  );
  if (!ring || ring === "none") return inner;
  return (
    <span className={cn("avatar-ring inline-block", ring === "lilac" && "lilac")}>{inner}</span>
  );
}
