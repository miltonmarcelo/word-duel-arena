import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Clock, Flag, Sparkles, Lightbulb, Trophy, Zap, AlertTriangle, Bot } from "lucide-react";
import { Delete, CornerDownLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { WordBoard } from "@/components/WordBoard";
import { cn } from "@/lib/utils";
import { currentUser, opponentGuesses, players, type TileState, type Guess } from "@/lib/mock-data";

type MatchSearch = {
  word?: string;
  mode: "direct" | "random" | "quick" | "themed";
  theme?: string;
  opponent?: string;
  opponentRating?: number;
};

export const Route = createFileRoute("/match")({
  head: () => ({ meta: [{ title: "Live duel — WordClash" }] }),
  validateSearch: (search: Record<string, unknown>): MatchSearch => {
    const modeRaw = typeof search.mode === "string" ? search.mode : "quick";
    const mode = (["direct", "random", "quick", "themed"].includes(modeRaw)
      ? modeRaw
      : "quick") as MatchSearch["mode"];
    const wordRaw = typeof search.word === "string" ? search.word.toUpperCase() : undefined;
    const word = wordRaw && /^[A-Z]{5}$/.test(wordRaw) ? wordRaw : undefined;
    const ratingNum =
      typeof search.opponentRating === "number"
        ? search.opponentRating
        : typeof search.opponentRating === "string"
          ? Number(search.opponentRating)
          : undefined;
    return {
      word,
      mode,
      theme: typeof search.theme === "string" ? search.theme : undefined,
      opponent: typeof search.opponent === "string" ? search.opponent : undefined,
      opponentRating: Number.isFinite(ratingNum) ? ratingNum : undefined,
    };
  },
  component: MatchPage,
});

const FALLBACK_SECRET = "PLATE";
const MAX_ROWS = 6;
const STARTING_POINTS = 240;
const REVEAL_COST = 35;

function MatchPage() {
  const search = Route.useSearch();
  const SECRET = search.word ?? FALLBACK_SECRET;
  const isSolo = !search.opponent || search.mode === "quick";
  const opponent = isSolo
    ? null
    : players.find((p) => p.handle === `@${search.opponent}` || p.name.toLowerCase().includes(search.opponent!.toLowerCase())) ?? players[0];

  // --- Game state ---
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [shake, setShake] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]); // indices forced visible
  const [points, setPoints] = useState(STARTING_POINTS);
  const [seconds, setSeconds] = useState(102); // 01:42
  const [solved, setSolved] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);

  const remaining = MAX_ROWS - guesses.length;
  const pointsAtRisk = Math.max(0, Math.round(points * 0.35));

  // Letter-state map for keyboard (best known per letter)
  const keyStates = useMemo(() => {
    const order: Record<TileState, number> = {
      empty: 0, filled: 0, absent: 1, present: 2, correct: 3, filled_dup: 0,
    } as never;
    const m: Record<string, TileState> = {};
    for (const g of guesses) {
      g.letters.forEach((l, i) => {
        const s = g.states[i];
        if (!m[l] || (order as never as Record<TileState, number>)[s] > (order as never as Record<TileState, number>)[m[l]]) {
          m[l] = s;
        }
      });
    }
    return m;
  }, [guesses]);

  // Timer
  useEffect(() => {
    if (solved) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [solved]);

  const evaluate = useCallback((word: string): TileState[] => {
    const result: TileState[] = Array(5).fill("absent");
    const secret = SECRET.split("");
    const used = Array(5).fill(false);
    // first pass: correct
    for (let i = 0; i < 5; i++) {
      if (word[i] === secret[i]) {
        result[i] = "correct";
        used[i] = true;
      }
    }
    // second pass: present
    for (let i = 0; i < 5; i++) {
      if (result[i] === "correct") continue;
      const idx = secret.findIndex((c, j) => !used[j] && c === word[i]);
      if (idx !== -1) {
        result[i] = "present";
        used[idx] = true;
      }
    }
    return result;
  }, []);

  const submit = useCallback(() => {
    if (current.length !== 5 || solved) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    const states = evaluate(current);
    const next: Guess = { letters: current.split(""), states };
    setGuesses((g) => [...g, next]);
    setCurrent("");
    if (states.every((s) => s === "correct")) {
      setSolved(true);
    }
  }, [current, evaluate, solved]);

  const onKey = useCallback(
    (k: string) => {
      if (solved) return;
      if (k === "ENTER") return submit();
      if (k === "BACK") return setCurrent((c) => c.slice(0, -1));
      if (/^[A-Z]$/.test(k) && current.length < 5) {
        setCurrent((c) => c + k);
      }
    },
    [current.length, solved, submit],
  );

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") return onKey("ENTER");
      if (e.key === "Backspace") return onKey("BACK");
      const k = e.key.toUpperCase();
      if (/^[A-Z]$/.test(k)) onKey(k);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  function doReveal() {
    if (points < REVEAL_COST) return;
    const candidates = [0, 1, 2, 3, 4].filter((i) => !revealed.includes(i));
    if (!candidates.length) return;
    const idx = candidates[Math.floor(Math.random() * candidates.length)];
    setRevealed((r) => [...r, idx]);
    setPoints((p) => p - REVEAL_COST);
    setConfirmReveal(false);
  }

  // Build display rows
  const displayRows: (Guess | undefined)[] = Array.from({ length: MAX_ROWS }).map((_, i) => {
    if (i < guesses.length) return guesses[i];
    if (i === guesses.length && !solved) {
      // active row with current input + revealed letters as hints
      const letters = Array(5).fill("");
      const states: TileState[] = Array(5).fill("empty");
      for (let j = 0; j < 5; j++) {
        if (j < current.length) {
          letters[j] = current[j];
          states[j] = "filled";
        }
        if (revealed.includes(j) && !letters[j]) {
          letters[j] = SECRET[j];
          states[j] = "filled";
        }
      }
      return { letters, states };
    }
    return undefined;
  });

  return (
    <AppShell>
      <div className="space-y-4 md:space-y-5">
        {/* === TOP BAR === */}
        <div className="surface-elevated relative overflow-hidden p-3 md:p-4">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="relative flex items-center gap-3">
            {/* You */}
            <div className="flex min-w-0 items-center gap-2">
              <Avatar player={currentUser} size={36} ring="mint" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">{currentUser.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {guesses.length}/{MAX_ROWS} · {points} pts
                </p>
              </div>
            </div>

            {/* Center: theme + timer */}
            <div className="flex flex-1 flex-col items-center gap-1">
              <span className="chip chip-lilac">
                <Sparkles className="size-3" /> Nature
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-mono text-base font-bold tabular-nums md:text-lg",
                  seconds < 30 && "text-[var(--danger,var(--destructive))] animate-pulse",
                )}
              >
                <Clock className="size-3.5" />
                {formatTime(seconds)}
              </span>
            </div>

            {/* Opponent */}
            <div className="flex min-w-0 items-center gap-2 justify-end">
              <div className="min-w-0 text-right">
                <p className="truncate text-xs font-semibold">{opponent.name.split(" ")[0]}</p>
                <p className="text-[10px] text-muted-foreground">
                  {opponentGuesses.length}/{MAX_ROWS} · typing…
                </p>
              </div>
              <Avatar player={opponent} size={36} ring="lilac" />
            </div>
          </div>

          {/* VS progress bar */}
          <div className="relative mt-3 flex h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full"
              style={{
                width: `${(guesses.length / MAX_ROWS) * 50}%`,
                background: "var(--player-a, var(--primary))",
              }}
            />
            <div className="flex-1" />
            <div
              className="h-full"
              style={{
                width: `${(opponentGuesses.length / MAX_ROWS) * 50}%`,
                background: "var(--player-b, var(--accent))",
              }}
            />
          </div>
        </div>

        {/* === MAIN GAME === */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr,260px]">
          <div className="flex flex-col items-center gap-4">
            {/* Status strip */}
            <div className="flex w-full max-w-md flex-wrap items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 font-semibold">
                <Trophy className="size-3 text-primary" /> {points} pts
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 font-semibold">
                {remaining} {remaining === 1 ? "try" : "tries"} left
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--warning)]/40 bg-[var(--warning)]/10 px-2.5 py-1 font-semibold text-[var(--warning)]">
                <AlertTriangle className="size-3" /> {pointsAtRisk} at risk
              </span>
            </div>

            {/* Board */}
            <div
              className={cn(
                "transition-transform",
                shake && "animate-[shake_0.4s_ease-in-out]",
              )}
            >
              <WordBoard
                guesses={displayRows.filter(Boolean) as Guess[]}
                rows={MAX_ROWS}
              />
            </div>

            {/* Reveal button */}
            <button
              onClick={() => setConfirmReveal(true)}
              disabled={points < REVEAL_COST || revealed.length >= 5 || solved}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full border border-[var(--warning)]/40 bg-[var(--warning)]/10 px-4 py-2 text-sm font-semibold text-[var(--warning)] transition",
                "hover:-translate-y-0.5 hover:bg-[var(--warning)]/15 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0",
              )}
            >
              <Lightbulb className="size-4" />
              Reveal a letter
              <span className="rounded-full bg-background/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                −{REVEAL_COST} pts
              </span>
            </button>

            {/* Confirm reveal */}
            {confirmReveal && (
              <div className="surface-elevated max-w-md p-4 text-center text-sm">
                <p className="font-semibold">
                  Spend <span className="text-[var(--warning)]">{REVEAL_COST} pts</span> to reveal one
                  random letter?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  You'll have {points - REVEAL_COST} pts left after this hint.
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setConfirmReveal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={doReveal} className="gap-1.5">
                    <Zap className="size-3.5" /> Reveal
                  </Button>
                </div>
              </div>
            )}

            {/* Solved banner */}
            {solved && (
              <div className="surface-elevated max-w-md p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--correct)]">
                  Solved!
                </p>
                <p className="font-display text-2xl">You cracked it.</p>
                <Link to="/match/result">
                  <Button className="mt-3 gap-1.5">
                    <Trophy className="size-4" /> See results
                  </Button>
                </Link>
              </div>
            )}

            {/* Keyboard */}
            <InteractiveKeyboard onKey={onKey} keyStates={keyStates} />
          </div>

          {/* Opponent mini board */}
          <aside className="player-card player-b order-first lg:order-none">
            <div className="mb-3 flex items-center gap-3">
              <Avatar player={opponent} size={36} ring="lilac" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold">{opponent.name}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="player-dot player-b mr-1 inline-block" /> typing…
                </p>
              </div>
              <p className="font-display text-lg">
                {opponentGuesses.length}<span className="text-muted-foreground">/{MAX_ROWS}</span>
              </p>
            </div>
            <div className="mx-auto w-fit">
              <WordBoard guesses={opponentGuesses} rows={MAX_ROWS} size="sm" />
            </div>
            <Link to="/match/result" className="mt-3 block">
              <Button size="sm" variant="ghost" className="w-full gap-1.5">
                <Flag className="size-3.5" /> Forfeit duel
              </Button>
            </Link>
          </aside>
        </div>
      </div>

      {/* Local keyframes for shake (uses Tailwind arbitrary animate above) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </AppShell>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

const KEY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
];

function InteractiveKeyboard({
  onKey,
  keyStates,
}: {
  onKey: (k: string) => void;
  keyStates: Record<string, TileState>;
}) {
  return (
    <div className="surface-soft mx-auto w-full max-w-[560px] p-2 sm:p-3">
      <div className="flex flex-col gap-1.5">
        {KEY_ROWS.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((k) => {
              const s = keyStates[k];
              const wide = k === "ENTER" || k === "BACK";
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => onKey(k)}
                  className={cn(
                    "kbd-key transition active:scale-95",
                    wide && "kbd-key-wide",
                    s === "correct" && "kbd-key-correct",
                    s === "present" && "kbd-key-present",
                    s === "absent" && "kbd-key-absent",
                  )}
                >
                  {k === "BACK" ? (
                    <Delete className="size-4" />
                  ) : k === "ENTER" ? (
                    <CornerDownLeft className="size-4" />
                  ) : (
                    k
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
