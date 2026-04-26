import { cn } from "@/lib/utils";
import type { Guess, TileState } from "@/lib/mock-data";

const stateClass: Record<TileState, string> = {
  empty: "tile-empty",
  filled: "tile-filled",
  correct: "tile-correct tile-flip",
  present: "tile-present tile-flip",
  absent: "tile-absent tile-flip",
};

export function WordTile({
  letter,
  state,
  size = "md",
  delay = 0,
}: {
  letter?: string;
  state: TileState;
  size?: "sm" | "md" | "lg";
  delay?: number;
}) {
  const sizeClass = size === "sm" ? "!w-7 !h-7 !text-xs" : size === "lg" ? "!w-16 !h-16 !text-2xl" : "";
  return (
    <div
      className={cn("tile", stateClass[state], sizeClass)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {letter}
    </div>
  );
}

export function WordRow({
  guess,
  size = "md",
  empty = false,
}: {
  guess?: Guess;
  size?: "sm" | "md" | "lg";
  empty?: boolean;
}) {
  const len = 5;
  const cells = Array.from({ length: len });
  return (
    <div className={cn("flex gap-1.5", size === "sm" && "gap-1")}>
      {cells.map((_, i) => (
        <WordTile
          key={i}
          letter={guess?.letters[i]}
          state={empty ? "empty" : (guess?.states[i] ?? "empty")}
          size={size}
          delay={i * 90}
        />
      ))}
    </div>
  );
}

export function WordBoard({
  guesses,
  rows = 6,
  size = "md",
}: {
  guesses: Guess[];
  rows?: number;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", size === "sm" && "gap-1")}>
      {Array.from({ length: rows }).map((_, i) => (
        <WordRow key={i} guess={guesses[i]} empty={!guesses[i]} size={size} />
      ))}
    </div>
  );
}
