import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Clock,
  CornerDownLeft,
  Delete,
  Flag,
  Hourglass,
  Send,
  Trophy,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { WordBoard } from "@/components/WordBoard";
import { cn } from "@/lib/utils";
import { currentUser, type Guess, type TileState } from "@/lib/mock-data";

type MatchSearch = {
  word?: string;
  mode?: "direct" | "random" | "quick" | "themed" | "daily";
  theme?: string;
  opponent?: string;
  opponentRating?: number;
};

export const Route = createFileRoute("/match")({
  head: () => ({ meta: [{ title: "Live duel — WordClash" }] }),
  validateSearch: (search: Record<string, unknown>): MatchSearch => {
    const modeRaw = typeof search.mode === "string" ? search.mode : "quick";
    const mode = (["direct", "random", "quick", "themed", "daily"].includes(modeRaw)
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

function MatchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const SECRET = search.word ?? FALLBACK_SECRET;
  const opponentName = search.opponent ?? "Daily Challenge";

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [shake, setShake] = useState(false);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Elapsed timer (counts up)
  useEffect(() => {
    if (solved || failed) return;
    const id = window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [solved, failed]);

  const goToResult = useCallback(
    (outcome: "win" | "loss") => {
      navigate({
        to: "/match/result",
        search: {
          outcome,
          word: SECRET,
          attempts: guesses.length,
          pointsEarned: outcome === "win" ? 240 : -32,
          hintsUsed: 0,
          mode: search.mode ?? "quick",
          opponent: opponentName,
        },
      });
    },
    [navigate, SECRET, guesses.length, search.mode, opponentName],
  );

  const leaveMatch = useCallback(() => {
    navigate({ to: "/dashboard" });
  }, [navigate]);

  useEffect(() => {
    if (!solved && !failed && guesses.length >= MAX_ROWS) setFailed(true);
  }, [guesses.length, solved, failed]);

  const keyStates = useMemo(() => {
    const order: Record<string, number> = { absent: 1, present: 2, correct: 3 };
    const m: Record<string, TileState> = {};
    for (const g of guesses) {
      g.letters.forEach((l, i) => {
        const s = g.states[i];
        if (!m[l] || (order[s] ?? 0) > (order[m[l]] ?? 0)) m[l] = s;
      });
    }
    return m;
  }, [guesses]);

  const evaluate = useCallback(
    (word: string): TileState[] => {
      const result: TileState[] = Array(5).fill("absent");
      const secret = SECRET.split("");
      const used = Array(5).fill(false);
      for (let i = 0; i < 5; i++) {
        if (word[i] === secret[i]) {
          result[i] = "correct";
          used[i] = true;
        }
      }
      for (let i = 0; i < 5; i++) {
        if (result[i] === "correct") continue;
        const idx = secret.findIndex((c, j) => !used[j] && c === word[i]);
        if (idx !== -1) {
          result[i] = "present";
          used[idx] = true;
        }
      }
      return result;
    },
    [SECRET],
  );

  const submit = useCallback(() => {
    if (current.length !== 5 || solved || failed) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    const states = evaluate(current);
    const next: Guess = { letters: current.split(""), states };
    setGuesses((g) => [...g, next]);
    setCurrent("");
    if (states.every((s) => s === "correct")) setSolved(true);
  }, [current, evaluate, solved, failed]);

  const onKey = useCallback(
    (k: string) => {
      if (solved || failed) return;
      if (k === "ENTER") return submit();
      if (k === "BACK") return setCurrent((c) => c.slice(0, -1));
      if (/^[A-Z]$/.test(k) && current.length < 5) {
        setCurrent((c) => c + k);
      }
    },
    [current.length, solved, failed, submit],
  );

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

  const displayRows: Guess[] = (() => {
    const arr: Guess[] = [...guesses];
    if (!solved && !failed) {
      const letters = Array(5).fill("");
      const states: TileState[] = Array(5).fill("empty");
      for (let j = 0; j < 5; j++) {
        if (j < current.length) {
          letters[j] = current[j];
          states[j] = "filled";
        }
      }
      arr.push({ letters, states });
    }
    return arr;
  })();

  const canSubmit = current.length === 5 && !solved && !failed;

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-4 pb-64 sm:pb-48">
        <header className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface/70 px-4 py-3 shadow-sm backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-sm font-bold tabular-nums text-foreground">
            <Clock className="size-3.5 text-muted-foreground" />
            {formatTime(elapsedSeconds)}
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold">
              <Hourglass className="size-3 text-muted-foreground" />
              <span className="font-mono tabular-nums">
                {guesses.length}
                <span className="text-muted-foreground">/{MAX_ROWS}</span>
              </span>
              <span className="hidden sm:inline">attempts</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={leaveMatch}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
              Leave
            </Button>
          </div>
        </header>

        <div
          className={cn(
            "flex justify-center transition-transform",
            shake && "animate-[shake_0.4s_ease-in-out]",
          )}
        >
          <WordBoard guesses={displayRows} rows={MAX_ROWS} />
        </div>

        {solved && (
          <div className="surface-elevated mx-auto w-full max-w-md p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--correct)]">
              Solved!
            </p>
            <p className="font-display text-2xl">You cracked it.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Time spent: {formatTime(elapsedSeconds)}
            </p>
            <Button onClick={() => goToResult("win")} className="mt-3 gap-1.5">
              <Trophy className="size-4" /> See results
            </Button>
          </div>
        )}

        {failed && !solved && (
          <div className="surface-elevated mx-auto w-full max-w-md p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--destructive)]">
              Out of tries
            </p>
            <p className="font-display text-2xl">The word was {SECRET}.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Time spent: {formatTime(elapsedSeconds)}
            </p>
            <Button
              onClick={() => goToResult("loss")}
              variant="secondary"
              className="mt-3 gap-1.5"
            >
              <Flag className="size-4" /> See results
            </Button>
          </div>
        )}
      </div>

      <div
        className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/85 px-2 pb-2 pt-3 backdrop-blur-md sm:bottom-0"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
      >
        <div className="mx-auto mb-2 w-full max-w-[560px] px-1">
          <Button
            size="lg"
            onClick={submit}
            disabled={!canSubmit}
            className="h-12 w-full gap-2 text-base"
          >
            <Send className="size-4" />
            Submit guess
          </Button>
        </div>

        <InteractiveKeyboard onKey={onKey} keyStates={keyStates} />
      </div>

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

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
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
    <div className="glass mx-auto w-full max-w-[560px] rounded-2xl p-3">
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
                  aria-label={k === "BACK" ? "Backspace" : k === "ENTER" ? "Submit" : k}
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

void currentUser;
