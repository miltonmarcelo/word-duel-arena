import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Clock,
  CornerDownLeft,
  Delete,
  Flag,
  Hourglass,
  Lightbulb,
  Send,
  Sparkles,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WordBoard } from "@/components/WordBoard";
import { cn } from "@/lib/utils";
import {
  currentUser,
  players,
  type Guess,
  type TileState,
} from "@/lib/mock-data";

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
const STARTING_POINTS = 240;
const REVEAL_COST = 35;
const TOTAL_TIME = 180; // 3:00 starting clock

function MatchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const SECRET = search.word ?? FALLBACK_SECRET;
  const isDaily = search.mode === "daily";

  const isSolo = !search.opponent || search.mode === "quick" || isDaily;
  const opponent = isSolo
    ? null
    : players.find(
        (p) =>
          p.handle === `@${search.opponent}` ||
          p.name.toLowerCase().includes(search.opponent!.toLowerCase()),
      ) ?? players[0];
  const opponentName = isDaily
    ? "Daily Challenge"
    : search.opponent ?? opponent?.name ?? "Computer";

  // --- Game state ---
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [shake, setShake] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [points, setPoints] = useState(STARTING_POINTS);
  const [seconds, setSeconds] = useState(TOTAL_TIME);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  // Mocked opponent status — flips to "finished" mid-match. No progress shared.
  const [opponentStatus, setOpponentStatus] = useState<"playing" | "finished">(
    "playing",
  );
  useEffect(() => {
    if (isSolo) return;
    const t = setTimeout(() => setOpponentStatus("finished"), 95_000);
    return () => clearTimeout(t);
  }, [isSolo]);

  const goToResult = useCallback(
    (outcome: "win" | "loss") => {
      navigate({
        to: "/match/result",
        search: {
          outcome,
          word: SECRET,
          attempts: guesses.length,
          pointsEarned: outcome === "win" ? points : -32,
          hintsUsed: revealed.length,
          mode: search.mode ?? "quick",
          opponent: opponentName,
        },
      });
    },
    [navigate, SECRET, guesses.length, points, revealed.length, search.mode, opponentName],
  );

  useEffect(() => {
    if (!solved && !failed && guesses.length >= MAX_ROWS) setFailed(true);
  }, [guesses.length, solved, failed]);

  const remaining = MAX_ROWS - guesses.length;
  const pointsAtRisk = Math.max(0, Math.round(points * 0.35));

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

  // Timer
  useEffect(() => {
    if (solved || failed) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [solved, failed]);

  useEffect(() => {
    if (seconds === 0 && !solved && !failed) setFailed(true);
  }, [seconds, solved, failed]);

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
    if (current.length !== 5 || solved) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    const states = evaluate(current);
    const next: Guess = { letters: current.split(""), states };
    setGuesses((g) => [...g, next]);
    setCurrent("");
    if (states.every((s) => s === "correct")) setSolved(true);
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

  // Build display rows — show ONLY past guesses + the active editing row.
  // Future empty rows render as plain empties (no opponent visibility).
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
        if (revealed.includes(j) && !letters[j]) {
          letters[j] = SECRET[j];
          states[j] = "filled";
        }
      }
      arr.push({ letters, states });
    }
    return arr;
  })();

  const canSubmit = current.length === 5 && !solved && !failed;
  const canReveal = points >= REVEAL_COST && revealed.length < 5 && !solved && !failed;
  const lowTime = seconds <= 30;

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-4 pb-40 sm:pb-32">
        {/* === TOP BAR === */}
        <header
          className="surface-elevated relative overflow-hidden p-3 sm:p-4"
          style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
        >
          <div className="relative grid grid-cols-[1fr,auto,1fr] items-center gap-2">
            {/* Leave button (left) */}
            <div className="justify-self-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmLeave(true)}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
                <span className="hidden sm:inline">Leave</span>
              </Button>
            </div>

            {/* Center: theme + timer */}
            <div className="flex flex-col items-center gap-1">
              {search.theme && (
                <span className="chip chip-lilac">
                  <Sparkles className="size-3" />{" "}
                  {search.theme.charAt(0).toUpperCase() + search.theme.slice(1)}
                </span>
              )}
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 font-mono text-base font-bold tabular-nums shadow-sm sm:text-lg",
                  lowTime &&
                    "animate-pulse border-[var(--destructive)]/60 text-[var(--destructive)]",
                )}
              >
                <Clock className="size-3.5" />
                {formatTime(seconds)}
              </div>
            </div>

            {/* Opponent status badge (right) */}
            <div className="justify-self-end">
              <OpponentStatusBadge
                opponent={opponent ?? undefined}
                opponentName={opponentName}
                isSolo={isSolo}
                status={opponentStatus}
              />
            </div>
          </div>
        </header>

        {/* === STAT STRIP === */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <Pill icon={<Trophy className="size-3 text-primary" />}>
            <span className="font-mono tabular-nums">{points}</span> pts
          </Pill>
          <Pill icon={<Hourglass className="size-3 text-muted-foreground" />}>
            <span className="font-mono tabular-nums">
              {guesses.length}
              <span className="text-muted-foreground">/{MAX_ROWS}</span>
            </span>{" "}
            attempts
          </Pill>
          <Pill icon={<AlertTriangle className="size-3 text-[var(--warning)]" />} tone="warning">
            <span className="font-mono tabular-nums">{pointsAtRisk}</span> at risk
          </Pill>
          {revealed.length > 0 && (
            <Pill icon={<Lightbulb className="size-3 text-[var(--warning)]" />}>
              {revealed.length} hint{revealed.length === 1 ? "" : "s"} used
            </Pill>
          )}
        </div>

        {/* === BOARD === */}
        <div
          className={cn(
            "flex justify-center transition-transform",
            shake && "animate-[shake_0.4s_ease-in-out]",
          )}
        >
          <WordBoard guesses={displayRows} rows={MAX_ROWS} />
        </div>

        {/* === ACTION BUTTONS === */}
        <div className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setConfirmReveal(true)}
            disabled={!canReveal}
            className={cn(
              "flex-1 gap-2 border-[var(--warning)]/40 bg-[var(--warning)]/10 text-[var(--warning)]",
              "hover:bg-[var(--warning)]/15 hover:text-[var(--warning)]",
            )}
          >
            <Lightbulb className="size-4" />
            Reveal letter
            <span className="ml-auto rounded-full bg-background/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              −{REVEAL_COST}
            </span>
          </Button>
          <Button
            size="lg"
            onClick={submit}
            disabled={!canSubmit}
            className="flex-1 gap-2"
          >
            <Send className="size-4" />
            Submit guess
          </Button>
        </div>

        {/* Solved / Failed banners */}
        {solved && (
          <div className="surface-elevated mx-auto w-full max-w-md p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--correct)]">
              Solved!
            </p>
            <p className="font-display text-2xl">You cracked it.</p>
            <Button onClick={() => goToResult("win")} className="mt-3 gap-1.5">
              <Trophy className="size-4" /> See results
            </Button>
          </div>
        )}

        {failed && !solved && (
          <div className="surface-elevated mx-auto w-full max-w-md p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--destructive)]">
              Out of {seconds === 0 ? "time" : "tries"}
            </p>
            <p className="font-display text-2xl">The word was {SECRET}.</p>
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

      {/* === KEYBOARD (sticky bottom) === */}
      <div
        className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/85 px-2 py-2 backdrop-blur-md sm:bottom-0"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
      >
        <InteractiveKeyboard onKey={onKey} keyStates={keyStates} />
      </div>

      {/* Reveal confirm dialog */}
      <Dialog open={confirmReveal} onOpenChange={setConfirmReveal}>
        <DialogContent className="surface-elevated max-w-sm border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Reveal a letter?</DialogTitle>
            <DialogDescription>
              Spend{" "}
              <span className="font-semibold text-[var(--warning)]">
                {REVEAL_COST} pts
              </span>{" "}
              to uncover one random letter. You'll have{" "}
              <span className="font-semibold text-foreground">
                {points - REVEAL_COST} pts
              </span>{" "}
              left.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button
              variant="ghost"
              onClick={() => setConfirmReveal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button onClick={doReveal} className="w-full gap-1.5 sm:w-auto">
              <Zap className="size-3.5" /> Reveal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave match confirm dialog */}
      <Dialog open={confirmLeave} onOpenChange={setConfirmLeave}>
        <DialogContent className="surface-elevated max-w-sm border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Leave match?</DialogTitle>
            <DialogDescription>
              You'll forfeit this duel and lose{" "}
              <span className="font-semibold text-[var(--destructive)]">
                {pointsAtRisk} pts
              </span>
              . Your opponent keeps the win.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button
              variant="ghost"
              onClick={() => setConfirmLeave(false)}
              className="w-full sm:w-auto"
            >
              Keep playing
            </Button>
            <Button
              variant="destructive"
              onClick={() => goToResult("loss")}
              className="w-full gap-1.5 sm:w-auto"
            >
              <Flag className="size-3.5" /> Leave match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

// ── Subcomponents ────────────────────────────────────────────────────────────

function Pill({
  icon,
  children,
  tone,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  tone?: "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-semibold",
        tone === "warning"
          ? "border-[var(--warning)]/40 bg-[var(--warning)]/10 text-[var(--warning)]"
          : "border-border bg-background/60",
      )}
    >
      {icon}
      {children}
    </span>
  );
}

function OpponentStatusBadge({
  opponent,
  opponentName,
  isSolo,
  status,
}: {
  opponent: ReturnType<typeof players.find>;
  opponentName: string;
  isSolo: boolean;
  status: "playing" | "finished";
}) {
  if (isSolo) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-2.5 py-1.5">
        <div className="grid size-7 place-items-center rounded-full bg-muted text-muted-foreground">
          <Bot className="size-3.5" />
        </div>
        <div className="hidden text-right leading-tight sm:block">
          <p className="text-[11px] font-semibold">Solo run</p>
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Practice
          </p>
        </div>
      </div>
    );
  }

  const finished = status === "finished";
  const dotColor = finished ? "var(--correct)" : "var(--accent)";
  const label = finished ? "Finished" : "Still playing";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2 py-1 sm:pr-3",
        "border-border bg-background/60",
      )}
    >
      {opponent ? (
        <Avatar player={opponent} size={28} ring="lilac" />
      ) : (
        <div className="grid size-7 place-items-center rounded-full bg-muted text-muted-foreground">
          <Bot className="size-3.5" />
        </div>
      )}
      <div className="text-right leading-tight">
        <p className="text-[11px] font-semibold">
          {opponent?.name.split(" ")[0] ?? opponentName}
        </p>
        <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="relative flex size-1.5">
            {!finished && (
              <span
                className="absolute inset-0 animate-ping rounded-full opacity-70"
                style={{ background: dotColor }}
              />
            )}
            <span
              className="relative size-1.5 rounded-full"
              style={{ background: dotColor }}
            />
          </span>
          {label}
        </p>
      </div>
    </div>
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
    <div className="mx-auto w-full max-w-[560px]">
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

// Suppress unused import lint (kept for type clarity)
void currentUser;
