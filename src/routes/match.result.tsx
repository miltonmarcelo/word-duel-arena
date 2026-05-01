import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  RotateCcw,
  Trophy,
  Home,
  Lightbulb,
  Clock,
  Target,
  Sparkles,
  TrendingUp,
  TrendingDown,
  History,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { WordBoard } from "@/components/WordBoard";
import { cn } from "@/lib/utils";
import {
  currentUser,
  opponentGuesses,
  players,
  sampleGuesses,
} from "@/lib/mock-data";

type Outcome = "win" | "loss" | "draw";

type ResultSearch = {
  outcome?: Outcome;
  word?: string;
  attempts?: number;
  pointsEarned?: number;
  hintsUsed?: number;
  mode?: string;
  opponent?: string;
};

export const Route = createFileRoute("/match/result")({
  head: () => ({ meta: [{ title: "Match result — WordClash" }] }),
  validateSearch: (search: Record<string, unknown>): ResultSearch => {
    const outcomeRaw = typeof search.outcome === "string" ? search.outcome : undefined;
    const outcome = (["win", "loss", "draw"].includes(outcomeRaw ?? "")
      ? outcomeRaw
      : undefined) as Outcome | undefined;
    const num = (v: unknown) =>
      typeof v === "number" ? v : typeof v === "string" ? Number(v) : undefined;
    const wordRaw = typeof search.word === "string" ? search.word.toUpperCase() : undefined;
    const a = num(search.attempts);
    const p = num(search.pointsEarned);
    const h = num(search.hintsUsed);
    return {
      outcome,
      word: wordRaw && /^[A-Z]{5}$/.test(wordRaw) ? wordRaw : undefined,
      attempts: Number.isFinite(a) ? a : undefined,
      pointsEarned: Number.isFinite(p) ? p : undefined,
      hintsUsed: Number.isFinite(h) ? h : undefined,
      mode: typeof search.mode === "string" ? search.mode : undefined,
      opponent: typeof search.opponent === "string" ? search.opponent : undefined,
    };
  },
  component: ResultPage,
});

function ResultPage() {
  const search = Route.useSearch();
  const OUTCOME: Outcome = search.outcome ?? "win";
  const opponent = players[0];
  const youGuesses = search.attempts ?? sampleGuesses.length;
  const oppGuesses = opponentGuesses.length;
  const word = search.word ?? "PLATE";
  // In a duel, each player guesses the word their opponent picked.
  const yourWord = word; // word you had to guess (chosen by opponent)
  const opponentWord = "BRAVE"; // word opponent had to guess (chosen by you)
  const revealedHints = search.hintsUsed ?? 1;
  const matchTime = "01:42";
  const yourTime = matchTime;
  const opponentTime = "02:18";

  const meta = outcomeMeta(OUTCOME);

  // Animated points counter — use param if provided, else fallback per outcome
  const targetPoints =
    search.pointsEarned ?? (OUTCOME === "win" ? 128 : OUTCOME === "draw" ? 40 : -32);
  const points = useCountUp(targetPoints, 900);
  const ratingDelta = OUTCOME === "win" ? 18 : OUTCOME === "draw" ? 0 : -12;
  const opponentPoints = OUTCOME === "win" ? -22 : OUTCOME === "draw" ? 40 : 96;

  return (
    <AppShell>
      <div className="space-y-5 pb-6 md:space-y-6">
        {/* === HERO BANNER === */}
        <div
          className={cn(
            "surface-elevated relative overflow-hidden p-6 text-center md:p-10",
            OUTCOME === "win" && "glow-mint",
            OUTCOME === "loss" && "border-[var(--destructive)]/30",
          )}
        >
          {/* Background gradient */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{ background: meta.bg }}
          />

          {/* Confetti only for win */}
          {OUTCOME === "win" && <Confetti />}

          <div className="relative">
            <div
              className={cn(
                "mx-auto grid size-14 place-items-center rounded-full md:size-16",
                "bg-background/60 backdrop-blur",
              )}
              style={{ color: meta.color }}
            >
              <meta.Icon className="size-7 md:size-8" strokeWidth={2.4} />
            </div>
            <p
              className="mt-3 text-xs font-bold uppercase tracking-[0.25em]"
              style={{ color: meta.color }}
            >
              {meta.kicker}
            </p>
            <h1 className="mt-1 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              {meta.title}
            </h1>

            {/* Word reveal */}
            <div className="mt-5 inline-flex flex-col items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                The word was
              </span>
              <div className="flex gap-1.5">
                {word.split("").map((l, i) => (
                  <div
                    key={i}
                    className="tile tile-correct tile-flip !w-11 !h-11 !text-lg sm:!w-14 sm:!h-14 sm:!text-2xl"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats row */}
            <div className="mt-6 grid grid-cols-3 gap-3 sm:mx-auto sm:max-w-md">
              <Stat
                icon={<Target className="size-3.5" />}
                label="Tries"
                value={`${youGuesses}/6`}
              />
              <Stat
                icon={<Clock className="size-3.5" />}
                label="Time"
                value={matchTime}
              />
              <Stat
                icon={<Lightbulb className="size-3.5" />}
                label="Hints"
                value={`${revealedHints}`}
              />
            </div>
          </div>
        </div>

        {/* === REWARDS === */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <RewardCard
            label="Points"
            value={points}
            delta={targetPoints}
            highlight={OUTCOME === "win"}
            big
          />
          <RewardCard label="Rating" value={ratingDelta} delta={ratingDelta} />
          <RewardCard
            label="XP gained"
            value={OUTCOME === "loss" ? 22 : OUTCOME === "draw" ? 40 : 84}
            delta={OUTCOME === "loss" ? 22 : OUTCOME === "draw" ? 40 : 84}
            subtle
          />
        </div>

        {/* === HEAD TO HEAD === */}
        <div className="surface-elevated p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="chip">
              <Sparkles className="size-3" /> Head to head
            </span>
            <span className="text-xs text-muted-foreground">Theme · Nature</span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr,auto,1fr] md:items-start">
            {/* You */}
            <PlayerSummary
              player={currentUser}
              ring="mint"
              guesses={sampleGuesses}
              tries={youGuesses}
              accent="var(--player-a, var(--primary))"
              points={targetPoints}
              isWinner={OUTCOME === "win"}
              hints={revealedHints}
              word={yourWord}
              time={yourTime}
            />

            {/* VS divider */}
            <div className="flex items-center justify-center md:flex-col md:gap-2">
              <div className="hidden h-12 w-px bg-border md:block" />
              <span className="font-display text-xl text-muted-foreground md:text-2xl">
                VS
              </span>
              <div className="hidden h-12 w-px bg-border md:block" />
            </div>

            {/* Opponent */}
            <PlayerSummary
              player={opponent}
              ring="lilac"
              guesses={opponentGuesses}
              tries={oppGuesses}
              accent="var(--player-b, var(--accent))"
              points={opponentPoints}
              isWinner={OUTCOME === "loss"}
              hints={0}
              word={opponentWord}
              time={opponentTime}
            />
          </div>
        </div>

        {/* === CTAs === */}
        <div className="sticky bottom-20 z-10 lg:static lg:bottom-auto">
          <div className="surface-elevated flex flex-col gap-2 p-3 md:flex-row md:items-center md:justify-center md:gap-3 md:bg-transparent md:p-0 md:shadow-none md:border-0">
            <Link to="/match" className="md:order-2">
              <Button size="lg" className="w-full gap-2 md:w-auto">
                <RotateCcw className="size-4" /> Play again
              </Button>
            </Link>
            <Link to="/dashboard" className="md:order-1">
              <Button size="lg" variant="secondary" className="w-full gap-2 md:w-auto">
                <Home className="size-4" /> Back to dashboard
              </Button>
            </Link>
            <Link to="/play/matches" className="md:order-3">
              <Button
                size="lg"
                variant="ghost"
                className="w-full gap-2 md:w-auto"
              >
                <History className="size-4" /> View in history
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// === Helpers & subcomponents ===

function outcomeMeta(o: Outcome) {
  if (o === "win") {
    return {
      kicker: "Victory",
      title: "You won the duel.",
      Icon: Trophy,
      color: "var(--correct)",
      bg: "var(--gradient-hero)",
    };
  }
  if (o === "loss") {
    return {
      kicker: "Defeat",
      title: "Tough one. Rematch?",
      Icon: TrendingDown,
      color: "var(--destructive)",
      bg: "linear-gradient(135deg, color-mix(in oklch, var(--destructive) 18%, transparent), transparent)",
    };
  }
  return {
    kicker: "Draw",
    title: "An even match.",
    Icon: Sparkles,
    color: "var(--accent)",
    bg: "linear-gradient(135deg, color-mix(in oklch, var(--accent) 18%, transparent), transparent)",
  };
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 px-3 py-2 backdrop-blur">
      <div className="flex items-center justify-center gap-1 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-0.5 font-display text-lg leading-tight">{value}</p>
    </div>
  );
}

function RewardCard({
  label,
  value,
  delta,
  highlight,
  subtle,
  big,
}: {
  label: string;
  value: number;
  delta: number;
  highlight?: boolean;
  subtle?: boolean;
  big?: boolean;
}) {
  const positive = delta > 0;
  const neutral = delta === 0;
  return (
    <div
      className={cn(
        "surface-elevated relative overflow-hidden p-4",
        highlight && "glow-mint",
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {!neutral && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
              positive
                ? "bg-[var(--correct)]/15 text-[var(--correct)]"
                : "bg-[var(--destructive)]/15 text-[var(--destructive)]",
            )}
          >
            {positive ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {positive ? "+" : ""}
            {delta}
          </span>
        )}
      </div>
      <p
        className={cn(
          "mt-1 font-display tabular-nums",
          big ? "text-4xl md:text-5xl" : "text-3xl",
          subtle && "text-foreground/90",
          highlight && "text-gradient-mint",
        )}
      >
        {value > 0 && delta > 0 ? "+" : ""}
        {value}
      </p>
    </div>
  );
}

function PlayerSummary({
  player,
  ring,
  guesses,
  tries,
  accent,
  points,
  isWinner,
  hints,
}: {
  player: typeof currentUser;
  ring: "mint" | "lilac";
  guesses: typeof sampleGuesses;
  tries: number;
  accent: string;
  points: number;
  isWinner: boolean;
  hints: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-4">
      <div className="mb-3 flex items-center gap-3">
        <Avatar player={player} size={40} ring={ring} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold">{player.name}</p>
            {isWinner && (
              <Trophy
                className="size-3.5"
                style={{ color: "var(--correct)" }}
                aria-label="Winner"
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {tries} guesses · {hints} {hints === 1 ? "hint" : "hints"}
          </p>
        </div>
        <div className="text-right">
          <p
            className="font-display text-xl tabular-nums"
            style={{ color: points >= 0 ? accent : "var(--destructive)" }}
          >
            {points > 0 ? "+" : ""}
            {points}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            pts
          </p>
        </div>
      </div>
      <div className="mx-auto w-fit">
        <WordBoard guesses={guesses} rows={6} size="sm" />
      </div>
    </div>
  );
}

function Confetti() {
  // Pure-CSS confetti pieces using design tokens
  const pieces = Array.from({ length: 24 });
  const colors = [
    "var(--primary)",
    "var(--accent)",
    "var(--correct)",
    "var(--warning)",
    "var(--present)",
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = (i * 4.3) % 100;
        const delay = (i * 137) % 1500;
        const duration = 2400 + ((i * 173) % 1800);
        const size = 6 + (i % 4) * 2;
        return (
          <span
            key={i}
            className="absolute -top-4 rounded-sm"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 1.6,
              background: colors[i % colors.length],
              animation: `confetti-fall ${duration}ms cubic-bezier(.2,.7,.4,1) ${delay}ms forwards`,
              opacity: 0,
              transform: "translateY(-20px) rotate(0deg)",
            }}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: translateY(420px) rotate(540deg); }
        }
      `}</style>
    </div>
  );
}

function useCountUp(target: number, durationMs = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return val;
}
