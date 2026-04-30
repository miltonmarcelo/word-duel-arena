import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bot, ArrowLeft, Eye, Sparkles, Coins, Clock, Home, RotateCcw,
  Trophy, Frown, Check, AlertTriangle, CornerDownLeft, Delete,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Guess, TileState } from "@/lib/mock-data";

export const Route = createFileRoute("/play/solo")({
  head: () => ({
    meta: [
      { title: "Solo Mode — WordClash" },
      { name: "description", content: "Play WordClash against the computer. Pick a theme, solve the word in 6 tries and earn points for your dashboard." },
      { property: "og:title", content: "Solo Mode — WordClash" },
      { property: "og:description", content: "Practice mode against the computer. Same Wordle rules, reduced rating multiplier." },
    ],
  }),
  component: SoloPage,
});

/* --------------------------- Word bank by theme --------------------------- */

type Theme = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  accent: "mint" | "lilac";
  words: string[];
};

const THEMES: Theme[] = [
  { id: "any",     name: "Any theme", emoji: "🎲", desc: "Surprise me — random pick from all categories.", accent: "mint",
    words: ["PLATE","BRAVE","CRANE","SPACE","STORM","HEART","LIGHT","TIGER","HOUSE"] },
  { id: "cinema",  name: "Cinema",    emoji: "🎬", desc: "Movies, genres and on-screen icons.", accent: "lilac",
    words: ["DRAMA","SCENE","ACTOR","FILMS","ROBOT"] },
  { id: "sports",  name: "Sports",    emoji: "⚽", desc: "Games, athletes and stadiums.", accent: "mint",
    words: ["GOALS","COACH","ARENA","MEDAL","TRACK"] },
  { id: "science", name: "Science",   emoji: "🔬", desc: "Physics, chemistry and biology.", accent: "lilac",
    words: ["ATOMS","CELLS","LASER","ORBIT","PROBE"] },
  { id: "music",   name: "Music",     emoji: "🎵", desc: "Genres, instruments and rhythms.", accent: "mint",
    words: ["DRUMS","CHORD","TEMPO","PIANO","NOTES"] },
  { id: "travel",  name: "Travel",    emoji: "✈️", desc: "Places, transport and adventures.", accent: "lilac",
    words: ["BEACH","TRAIN","COAST","HOTEL","SPAIN"] },
  { id: "tech",    name: "Tech",      emoji: "💻", desc: "Devices, code and the digital world.", accent: "mint",
    words: ["CLOUD","CACHE","CODER","BYTES","PIXEL"] },
  { id: "nature",  name: "Nature",    emoji: "🌿", desc: "Animals, plants and landscapes.", accent: "lilac",
    words: ["RIVER","FOREST","STONE","CLOUD","BLOOM"].filter(w => w.length === 5) },
];

const MAX_TRIES = 6;
const REVEAL_COST = 20;
const SOLO_MULTIPLIER = 0.5; // half rating vs PvP
const POINT_TABLE = [200, 150, 100, 70, 50, 30];

/* ------------------------------- Game logic ------------------------------- */

function scoreGuess(guess: string, target: string): TileState[] {
  const states: TileState[] = Array(5).fill("absent");
  const remaining: (string | null)[] = target.split("");
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      states[i] = "correct";
      remaining[i] = null;
    }
  }
  for (let i = 0; i < 5; i++) {
    if (states[i] === "correct") continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) {
      states[i] = "present";
      remaining[idx] = null;
    }
  }
  return states;
}

function computeKeyStates(guesses: Guess[]): Record<string, TileState> {
  const map: Record<string, TileState> = {};
  const rank: Record<TileState, number> = { empty: 0, filled: 0, absent: 1, present: 2, correct: 3 };
  for (const g of guesses) {
    g.letters.forEach((l, i) => {
      const next = g.states[i];
      if (!map[l] || rank[next] > rank[map[l]]) map[l] = next;
    });
  }
  return map;
}

/* ----------------------------- Page component ----------------------------- */

type Stage = "select" | "playing" | "result";

function SoloPage() {
  const navigate = useNavigate();
  const [stage, setStage] = React.useState<Stage>("select");
  const [theme, setTheme] = React.useState<Theme>(THEMES[0]);
  const [target, setTarget] = React.useState<string>("");
  const [guesses, setGuesses] = React.useState<Guess[]>([]);
  const [current, setCurrent] = React.useState<string>("");
  const [revealedLetters, setRevealedLetters] = React.useState<{ index: number; letter: string }[]>([]);
  const [revealsUsed, setRevealsUsed] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [startTime, setStartTime] = React.useState<number>(0);
  const [endTime, setEndTime] = React.useState<number>(0);

  const startMatch = (t: Theme) => {
    const word = t.words[Math.floor(Math.random() * t.words.length)];
    setTheme(t);
    setTarget(word);
    setGuesses([]);
    setCurrent("");
    setRevealedLetters([]);
    setRevealsUsed(0);
    setError(null);
    setStartTime(Date.now());
    setEndTime(0);
    setStage("playing");
  };

  const triesLeft = MAX_TRIES - guesses.length;
  const lastGuess = guesses[guesses.length - 1];
  const won = lastGuess && lastGuess.states.every((s) => s === "correct");
  const lost = !won && triesLeft === 0;
  const finished = won || lost;

  const potentialPoints = React.useMemo(() => {
    const base = POINT_TABLE[guesses.length] ?? 0;
    const penalty = revealsUsed * REVEAL_COST;
    return Math.max(0, Math.round((base - penalty) * SOLO_MULTIPLIER));
  }, [guesses.length, revealsUsed]);

  // Finish handler
  React.useEffect(() => {
    if (finished && stage === "playing") {
      setEndTime(Date.now());
      const t = setTimeout(() => setStage("result"), 1400);
      return () => clearTimeout(t);
    }
  }, [finished, stage]);

  const submitGuess = React.useCallback(() => {
    if (current.length !== 5) {
      setError("Word must be 5 letters");
      return;
    }
    // Validate revealed letters are kept
    for (const r of revealedLetters) {
      if (current[r.index] !== r.letter) {
        setError(`Position ${r.index + 1} must be "${r.letter}"`);
        return;
      }
    }
    const states = scoreGuess(current, target);
    setGuesses((g) => [...g, { letters: current.split(""), states }]);
    setCurrent("");
    setError(null);
  }, [current, target, revealedLetters]);

  const handleKey = React.useCallback((key: string) => {
    if (finished) return;
    setError(null);
    if (key === "ENTER") return submitGuess();
    if (key === "BACK") {
      setCurrent((c) => {
        // Don't backspace over a revealed letter slot
        const nextLen = c.length - 1;
        const reserved = revealedLetters.find((r) => r.index === nextLen);
        if (reserved) return c.slice(0, nextLen) + reserved.letter;
        return c.slice(0, -1);
      });
      return;
    }
    setCurrent((c) => {
      if (c.length >= 5) return c;
      let next = c + key;
      // Auto-fill any revealed slots that come right after
      while (next.length < 5) {
        const r = revealedLetters.find((rv) => rv.index === next.length);
        if (!r) break;
        next += r.letter;
      }
      return next;
    });
  }, [finished, submitGuess, revealedLetters]);

  // Pre-fill revealed letters at the start of a new attempt
  React.useEffect(() => {
    if (stage !== "playing" || finished) return;
    if (current.length > 0) return;
    if (revealedLetters.length === 0) return;
    let next = "";
    while (next.length < 5) {
      const r = revealedLetters.find((rv) => rv.index === next.length);
      if (!r) break;
      next += r.letter;
    }
    if (next) setCurrent(next);
  }, [revealedLetters, stage, finished, current.length]);

  // Physical keyboard support
  React.useEffect(() => {
    if (stage !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleKey("ENTER");
      else if (e.key === "Backspace") handleKey("BACK");
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, handleKey]);

  const useReveal = () => {
    if (finished) return;
    if (revealsUsed >= 2) {
      setError("Reveal limit reached (2 per match)");
      return;
    }
    const candidates = target.split("").map((l, i) => ({ l, i }))
      .filter(({ i, l }) => !revealedLetters.find((r) => r.index === i) && !(current[i] === l));
    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    setRevealedLetters((r) => [...r, { index: pick.i, letter: pick.l }]);
    setRevealsUsed((n) => n + 1);
    // Splice into current input
    setCurrent((c) => {
      const arr = c.padEnd(5, " ").split("");
      arr[pick.i] = pick.l;
      // Rebuild contiguous prefix (since input is left-to-right)
      let out = "";
      for (let i = 0; i < 5; i++) {
        if (arr[i] !== " ") out += arr[i];
        else break;
      }
      return out;
    });
  };

  if (stage === "select") {
    return <ThemeSelector onStart={startMatch} />;
  }

  if (stage === "result") {
    return (
      <ResultScreen
        won={!!won}
        target={target}
        guesses={guesses}
        revealsUsed={revealsUsed}
        durationMs={endTime - startTime}
        points={won ? potentialPoints : -Math.round(40 * SOLO_MULTIPLIER)}
        theme={theme}
        onPlayAgain={() => setStage("select")}
        onHome={() => navigate({ to: "/dashboard" })}
      />
    );
  }

  return (
    <GameScreen
      theme={theme}
      guesses={guesses}
      current={current}
      revealedLetters={revealedLetters}
      revealsUsed={revealsUsed}
      triesLeft={triesLeft}
      potentialPoints={potentialPoints}
      error={error}
      finished={finished}
      won={!!won}
      onKey={handleKey}
      onReveal={useReveal}
      onAbandon={() => setStage("select")}
    />
  );
}

/* ============================== Theme selector ============================ */

function ThemeSelector({ onStart }: { onStart: (t: Theme) => void }) {
  const [selected, setSelected] = React.useState<Theme>(THEMES[0]);
  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Link to="/play" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-3.5" /> Back to modes
            </Link>
            <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Bot className="size-3.5" /> Solo Mode
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
              You vs <span className="text-primary">the computer.</span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              Pick a theme. The computer seals a word. You have <strong className="text-foreground">6 tries</strong> to crack it.
              Points still count toward your dashboard — at <strong className="text-foreground">×0.5 multiplier</strong> versus PvP.
            </p>
          </div>
          <div className="surface-soft flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
            <Sparkles className="size-4 text-accent" />
            <span className="text-muted-foreground">Practice mode</span>
            <span className="font-semibold">No rivals, no pressure</span>
          </div>
        </header>

        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pick a category</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {THEMES.map((t) => {
              const isActive = selected.id === t.id;
              const isMint = t.accent === "mint";
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={cn(
                    "surface-elevated relative flex h-full flex-col gap-2 p-5 text-left transition-all",
                    isActive
                      ? cn("border-2", isMint ? "border-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_15%,transparent)]" : "border-accent shadow-[0_0_0_4px_color-mix(in_oklch,var(--accent)_15%,transparent)]")
                      : "hover:-translate-y-0.5",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{t.emoji}</span>
                    {isActive && (
                      <span className={cn(
                        "flex size-6 items-center justify-center rounded-full",
                        isMint ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
                      )}>
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="font-display text-lg leading-tight">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                  <p className="mt-auto pt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t.words.length} words
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="surface-elevated p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <RuleChip icon={Trophy} label="6 attempts" desc="Standard Wordle rules" />
            <RuleChip icon={Coins} label="Up to +100 pts" desc="Multiplier ×0.5 vs PvP" />
            <RuleChip icon={Eye} label="Reveal: −20" desc="Max 2 per match" />
          </div>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Selected: <strong className="text-foreground">{selected.emoji} {selected.name}</strong>
            </p>
            <Button size="lg" onClick={() => onStart(selected)} className="w-full sm:w-auto">
              <Bot className="size-4" /> Start match
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function RuleChip({ icon: Icon, label, desc }: { icon: React.ComponentType<{ className?: string }>; label: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

/* ================================ Game screen ============================= */

function GameScreen({
  theme, guesses, current, revealedLetters, revealsUsed, triesLeft,
  potentialPoints, error, finished, won, onKey, onReveal, onAbandon,
}: {
  theme: Theme;
  guesses: Guess[];
  current: string;
  revealedLetters: { index: number; letter: string }[];
  revealsUsed: number;
  triesLeft: number;
  potentialPoints: number;
  error: string | null;
  finished: boolean;
  won: boolean;
  onKey: (k: string) => void;
  onReveal: () => void;
  onAbandon: () => void;
}) {
  const keyStates = computeKeyStates(guesses);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* HUD */}
        <header className="surface-elevated flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_oklch,var(--primary)_15%,transparent)] text-2xl">
              <Bot className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Solo · vs Computer</p>
              <p className="font-display text-lg leading-tight">{theme.emoji} {theme.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-3">
            <Stat icon={Clock} label="Tries left" value={`${triesLeft}/${MAX_TRIES}`} />
            <Stat icon={Coins} label="At stake" value={`+${potentialPoints}`} tone="primary" />
            <Stat icon={Eye} label="Reveals" value={`${revealsUsed}/2`} tone="accent" />
          </div>

          <button
            onClick={onAbandon}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-destructive"
          >
            Abandon
          </button>
        </header>

        {/* Board */}
        <section className="flex flex-col items-center gap-4">
          <Board
            guesses={guesses}
            current={current}
            revealedLetters={revealedLetters}
          />
          <div className="h-6">
            {error && (
              <p className="flex items-center gap-1.5 rounded-full border border-destructive/40 bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)] px-3 py-1 text-xs font-medium text-destructive">
                <AlertTriangle className="size-3.5" /> {error}
              </p>
            )}
            {finished && won && (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-correct">
                <Trophy className="size-4" /> Solved!
              </p>
            )}
            {finished && !won && (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
                <Frown className="size-4" /> Out of tries
              </p>
            )}
          </div>
        </section>

        {/* Reveal action */}
        <div className="flex justify-center">
          <Button
            variant="accent"
            onClick={onReveal}
            disabled={finished || revealsUsed >= 2}
            className="gap-2"
          >
            <Eye className="size-4" />
            Reveal a letter
            <span className="ml-1 rounded-full bg-foreground/15 px-2 py-0.5 text-[10px] font-bold tabular-nums">
              −{REVEAL_COST} pts
            </span>
          </Button>
        </div>

        {/* Keyboard */}
        <Keyboard onKey={onKey} states={keyStates} disabled={finished} />
      </div>
    </AppShell>
  );
}

function Stat({
  icon: Icon, label, value, tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "default" | "primary" | "accent";
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
      <Icon className={cn(
        "size-4",
        tone === "primary" && "text-primary",
        tone === "accent" && "text-accent",
        tone === "default" && "text-muted-foreground",
      )} />
      <div className="leading-tight">
        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={cn(
          "text-sm font-bold tabular-nums",
          tone === "primary" && "text-primary",
          tone === "accent" && "text-accent",
        )}>{value}</p>
      </div>
    </div>
  );
}

/* ---------------------------------- Board --------------------------------- */

function Board({
  guesses, current, revealedLetters,
}: {
  guesses: Guess[];
  current: string;
  revealedLetters: { index: number; letter: string }[];
}) {
  const rows: React.ReactNode[] = [];
  for (let r = 0; r < MAX_TRIES; r++) {
    if (r < guesses.length) {
      const g = guesses[r];
      rows.push(
        <div key={r} className="flex gap-1.5">
          {g.letters.map((l, i) => (
            <Tile key={i} letter={l} state={g.states[i]} delay={i * 90} />
          ))}
        </div>,
      );
    } else if (r === guesses.length) {
      rows.push(
        <div key={r} className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const reserved = revealedLetters.find((rv) => rv.index === i);
            const letter = current[i] ?? (reserved?.letter ?? "");
            const state: TileState = letter ? "filled" : "empty";
            return (
              <Tile
                key={i}
                letter={letter}
                state={state}
                isActive={i === current.length && !reserved}
                isRevealed={!!reserved}
              />
            );
          })}
        </div>,
      );
    } else {
      rows.push(
        <div key={r} className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const reserved = revealedLetters.find((rv) => rv.index === i);
            return (
              <Tile
                key={i}
                letter={reserved?.letter}
                state={reserved ? "filled" : "empty"}
                isRevealed={!!reserved}
              />
            );
          })}
        </div>,
      );
    }
  }
  return <div className="flex flex-col gap-1.5">{rows}</div>;
}

function Tile({
  letter, state, delay = 0, isActive, isRevealed,
}: {
  letter?: string;
  state: TileState;
  delay?: number;
  isActive?: boolean;
  isRevealed?: boolean;
}) {
  const stateClass: Record<TileState, string> = {
    empty: "tile-empty",
    filled: "tile-filled",
    correct: "tile-correct tile-flip",
    present: "tile-present tile-flip",
    absent: "tile-absent tile-flip",
  };
  return (
    <div
      className={cn(
        "tile relative",
        stateClass[state],
        isActive && "tile-active",
      )}
      style={delay && state !== "empty" && state !== "filled" ? { animationDelay: `${delay}ms` } : undefined}
    >
      {letter}
      {isRevealed && (
        <span
          className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md"
          aria-label="Revealed letter"
        >
          <Eye className="size-3" />
        </span>
      )}
    </div>
  );
}

/* -------------------------------- Keyboard -------------------------------- */

const KEY_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BACK"],
];

function Keyboard({
  onKey, states, disabled,
}: {
  onKey: (k: string) => void;
  states: Record<string, TileState>;
  disabled?: boolean;
}) {
  return (
    <div className="surface-soft mx-auto w-full max-w-[600px] p-3 sm:p-4">
      <div className="flex flex-col gap-1.5">
        {KEY_ROWS.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((k) => {
              const s = states[k];
              const wide = k === "ENTER" || k === "BACK";
              return (
                <button
                  key={k}
                  type="button"
                  disabled={disabled}
                  onClick={() => onKey(k)}
                  className={cn(
                    "kbd-key",
                    wide && "kbd-key-wide",
                    s === "correct" && "kbd-key-correct",
                    s === "present" && "kbd-key-present",
                    s === "absent" && "kbd-key-absent",
                    disabled && "opacity-40",
                  )}
                >
                  {k === "BACK" ? <Delete className="size-4" /> : k === "ENTER" ? <CornerDownLeft className="size-4" /> : k}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =============================== Result screen ============================ */

function ResultScreen({
  won, target, guesses, revealsUsed, durationMs, points, theme, onPlayAgain, onHome,
}: {
  won: boolean;
  target: string;
  guesses: Guess[];
  revealsUsed: number;
  durationMs: number;
  points: number;
  theme: Theme;
  onPlayAgain: () => void;
  onHome: () => void;
}) {
  const seconds = Math.max(1, Math.round(durationMs / 1000));
  const triesUsed = guesses.length;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Hero */}
        <section
          className="relative overflow-hidden rounded-3xl border border-border p-8 text-center sm:p-12"
          style={{
            background: won
              ? "var(--gradient-mint)"
              : "linear-gradient(135deg, color-mix(in oklch, var(--destructive) 20%, var(--surface-elevated)), var(--surface-elevated))",
          }}
        >
          {won && <ConfettiDots />}
          <div className="relative">
            <span className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]",
              won ? "bg-black/15 text-primary-foreground" : "bg-destructive/20 text-destructive",
            )}>
              {won ? <Trophy className="size-3" /> : <Frown className="size-3" />}
              {won ? "Victory" : "Defeat"}
            </span>
            <h1 className={cn(
              "mt-4 font-display text-5xl leading-[1.05] sm:text-6xl",
              won ? "text-primary-foreground" : "text-foreground",
            )}>
              {won ? "Nice solve!" : "So close."}
            </h1>
            <p className={cn(
              "mt-2 text-sm sm:text-base",
              won ? "text-primary-foreground/80" : "text-muted-foreground",
            )}>
              {won
                ? `Cracked it in ${triesUsed} ${triesUsed === 1 ? "try" : "tries"} · ${seconds}s`
                : `You used all ${MAX_TRIES} tries.`}
            </p>

            {/* Word reveal */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-[0.2em]",
                won ? "text-primary-foreground/70" : "text-muted-foreground",
              )}>
                The word was
              </p>
              <div className="flex gap-1.5">
                {target.split("").map((l, i) => (
                  <div key={i} className="tile tile-correct" style={{ animationDelay: `${i * 80}ms` }}>{l}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Score breakdown */}
        <section className="surface-elevated p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Score breakdown</p>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Points earned</p>
              <p className={cn(
                "font-display text-6xl tabular-nums leading-none",
                points >= 0 ? "text-primary" : "text-destructive",
              )}>
                {points >= 0 ? "+" : ""}{points}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">×0.5 Solo Mode multiplier applied</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Theme</p>
              <p className="text-sm font-semibold">{theme.emoji} {theme.name}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <BreakdownRow label="Attempts" value={`${triesUsed}/${MAX_TRIES}`} />
            <BreakdownRow label="Time" value={`${seconds}s`} />
            <BreakdownRow label="Reveals used" value={`${revealsUsed} (−${revealsUsed * REVEAL_COST})`} />
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Your attempts</p>
            <div className="flex flex-wrap items-center gap-2">
              {guesses.map((g, i) => (
                <div key={i} className="flex gap-1">
                  {g.letters.map((l, j) => (
                    <div
                      key={j}
                      className={cn(
                        "flex size-7 items-center justify-center rounded text-[11px] font-bold uppercase",
                        g.states[j] === "correct" && "bg-correct text-white",
                        g.states[j] === "present" && "bg-present text-white",
                        g.states[j] === "absent"  && "bg-absent  text-white",
                      )}
                    >
                      {l}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={onPlayAgain} className="flex-1">
            <RotateCcw className="size-4" /> Play again
          </Button>
          <Button size="lg" variant="outline" onClick={onHome} className="flex-1">
            <Home className="size-4" /> Back to dashboard
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function ConfettiDots() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i % 6) * 120;
        const size = 6 + (i % 4) * 3;
        const colors = ["var(--primary)", "var(--accent)", "var(--present)", "var(--correct)"];
        return (
          <span
            key={i}
            className="absolute top-0 block rounded-sm opacity-80"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              background: colors[i % colors.length],
              animation: `tile-pop 0.6s ease-out ${delay}ms both, tile-flip 1.6s ease-in-out ${delay}ms infinite`,
              transform: `translateY(${(i % 5) * 20}px) rotate(${i * 23}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}
