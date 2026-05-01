import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Hourglass,
  Inbox,
  Palette,
  Play,
  Swords,
  Trophy,
  XCircle,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { players, type Player } from "@/lib/mock-data";

export const Route = createFileRoute("/play/matches")({
  head: () => ({
    meta: [
      { title: "Matches in progress — WordClash" },
      {
        name: "description",
        content:
          "Your central hub for ongoing duels. Jump into your turn, track waiting games, and review recent results.",
      },
    ],
  }),
  component: MatchesInProgress,
});

type Tab = "active" | "waiting" | "completed";

type MatchStatus =
  | "your-turn"
  | "their-turn"
  | "waiting-accept"
  | "won"
  | "lost"
  | "draw";

type Match = {
  id: string;
  opponent: Player;
  status: MatchStatus;
  category?: string;
  yourGuesses: number;
  theirGuesses: number;
  maxGuesses: number;
  updatedAt: string;
  pointsAtStake?: number;
  finalPoints?: number;
  word?: string;
};

const matches: Match[] = [
  {
    id: "m-1",
    opponent: players[0],
    status: "your-turn",
    category: "Cinema",
    yourGuesses: 2,
    theirGuesses: 4,
    maxGuesses: 6,
    updatedAt: "2m ago",
    pointsAtStake: 120,
  },
  {
    id: "m-2",
    opponent: players[1],
    status: "their-turn",
    category: "Sports",
    yourGuesses: 3,
    theirGuesses: 1,
    maxGuesses: 6,
    updatedAt: "14m ago",
    pointsAtStake: 80,
  },
  {
    id: "m-3",
    opponent: players[3],
    status: "waiting-accept",
    category: "General",
    yourGuesses: 0,
    theirGuesses: 0,
    maxGuesses: 6,
    updatedAt: "1h ago",
    pointsAtStake: 60,
  },
  {
    id: "m-4",
    opponent: players[4],
    status: "your-turn",
    category: "Music",
    yourGuesses: 1,
    theirGuesses: 2,
    maxGuesses: 6,
    updatedAt: "3h ago",
    pointsAtStake: 100,
  },
  {
    id: "m-5",
    opponent: players[2],
    status: "won",
    category: "General",
    yourGuesses: 4,
    theirGuesses: 6,
    maxGuesses: 6,
    updatedAt: "Yesterday",
    finalPoints: 98,
    word: "BREAD",
  },
  {
    id: "m-6",
    opponent: players[5],
    status: "lost",
    category: "Science",
    yourGuesses: 6,
    theirGuesses: 4,
    maxGuesses: 6,
    updatedAt: "2d ago",
    finalPoints: 22,
    word: "ATOMS",
  },
  {
    id: "m-7",
    opponent: players[6],
    status: "draw",
    category: "Food",
    yourGuesses: 5,
    theirGuesses: 5,
    maxGuesses: 6,
    updatedAt: "3d ago",
    finalPoints: 40,
    word: "PASTA",
  },
];

function isActive(s: MatchStatus) {
  return s === "your-turn" || s === "their-turn";
}
function isWaiting(s: MatchStatus) {
  return s === "waiting-accept";
}
function isCompleted(s: MatchStatus) {
  return s === "won" || s === "lost" || s === "draw";
}

function MatchesInProgress() {
  const [tab, setTab] = useState<Tab>("active");

  const counts = useMemo(
    () => ({
      active: matches.filter((m) => isActive(m.status)).length,
      waiting: matches.filter((m) => isWaiting(m.status)).length,
      completed: matches.filter((m) => isCompleted(m.status)).length,
    }),
    [],
  );

  const visible = useMemo(() => {
    if (tab === "active") return matches.filter((m) => isActive(m.status));
    if (tab === "waiting") return matches.filter((m) => isWaiting(m.status));
    return matches.filter((m) => isCompleted(m.status));
  }, [tab]);

  const yourTurnCount = matches.filter((m) => m.status === "your-turn").length;

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Swords className="mr-1 inline size-3" /> Your duels
          </p>
          <h1 className="mt-1 font-display text-4xl leading-tight md:text-5xl">
            Matches in progress.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your central hub for active duels. Pick up where you left off, see who's
            waiting on you, and revisit recent results.
          </p>
        </div>

        {yourTurnCount > 0 && (
          <div className="surface-elevated flex items-center gap-3 px-4 py-3">
            <span className="relative flex size-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--primary)] opacity-60" />
              <span className="relative size-2.5 rounded-full bg-[var(--primary)]" />
            </span>
            <div className="text-sm">
              <span className="font-semibold">{yourTurnCount} waiting on you</span>
              <span className="text-muted-foreground"> · play now</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="surface-elevated mb-5 inline-flex w-full gap-1 p-1.5 sm:w-auto">
        {(
          [
            { id: "active", label: "Active", icon: Play },
            { id: "waiting", label: "Waiting", icon: Hourglass },
            { id: "completed", label: "Completed", icon: CheckCircle2 },
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition sm:flex-none",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50",
              )}
            >
              <Icon className="size-3.5" />
              {t.label}
              <span className={cn("ml-0.5", active ? "opacity-80" : "opacity-60")}>
                · {counts[t.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {visible.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function MatchCard({ match }: { match: Match }) {
  const meta = statusMeta(match.status);
  const isDone = isCompleted(match.status);
  const yourTurn = match.status === "your-turn";

  return (
    <article
      className={cn(
        "surface-elevated group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      {/* Status accent bar */}
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: meta.barColor }}
        aria-hidden
      />

      <div className="flex items-start gap-4">
        <Avatar
          player={match.opponent}
          size={56}
          ring={yourTurn ? "mint" : "lilac"}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate font-display text-xl leading-tight">
              vs {match.opponent.name}
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              )}
              style={{
                background: meta.chipBg,
                color: meta.chipFg,
              }}
            >
              <meta.icon className="size-3" />
              {meta.label}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span>{match.opponent.handle}</span>
            <span className="inline-flex items-center gap-1">
              <Trophy className="size-3" /> {match.opponent.rating}
            </span>
            {match.category && (
              <span className="chip">
                <Palette className="size-3" /> {match.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Score / status comparison */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <PlayerProgress
          label="You"
          accent="mint"
          guesses={match.yourGuesses}
          max={match.maxGuesses}
          done={isDone}
        />
        <PlayerProgress
          label={match.opponent.name.split(" ")[0]}
          accent="lilac"
          guesses={match.theirGuesses}
          max={match.maxGuesses}
          done={isDone}
        />
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" /> {match.updatedAt}
          </span>
          {match.pointsAtStake && (
            <span className="inline-flex items-center gap-1">
              <Trophy className="size-3" /> {match.pointsAtStake} pts
            </span>
          )}
          {match.finalPoints !== undefined && (
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Trophy className="size-3" /> +{match.finalPoints} pts
            </span>
          )}
        </div>
        <CardCta match={match} />
      </div>
    </article>
  );
}

function CardCta({ match }: { match: Match }) {
  if (match.status === "your-turn") {
    return (
      <Link to="/play/your-turn">
        <Button size="sm" className="gap-1.5">
          <Play className="size-3.5" /> Play turn
        </Button>
      </Link>
    );
  }
  if (match.status === "their-turn") {
    return (
      <Link to="/play/waiting">
        <Button size="sm" variant="outline" className="gap-1.5">
          View status <ArrowRight className="size-3.5" />
        </Button>
      </Link>
    );
  }
  if (match.status === "waiting-accept") {
    return (
      <Link to="/play/waiting">
        <Button size="sm" variant="outline" className="gap-1.5">
          View status <ArrowRight className="size-3.5" />
        </Button>
      </Link>
    );
  }
  // Completed
  return (
    <Link to="/match/result">
      <Button size="sm" variant="ghost" className="gap-1.5">
        Recap <ArrowRight className="size-3.5" />
      </Button>
    </Link>
  );
}

function PlayerProgress({
  label,
  accent,
  guesses,
  max,
  done,
}: {
  label: string;
  accent: "mint" | "lilac";
  guesses: number;
  max: number;
  done: boolean;
}) {
  const colorVar = accent === "mint" ? "var(--player-a)" : "var(--player-b)";
  const pct = Math.min(100, (guesses / max) * 100);
  return (
    <div className="surface-soft rounded-xl p-3">
      <div className="flex items-baseline justify-between">
        <p
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: colorVar }}
        >
          {label}
        </p>
        <p className="text-xs font-semibold tabular-nums">
          {guesses}
          <span className="text-muted-foreground">/{max}</span>
        </p>
      </div>
      <div className="mt-2 flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{
              background:
                i < guesses
                  ? colorVar
                  : "color-mix(in oklch, var(--muted) 60%, transparent)",
              opacity: i < guesses ? 1 : 0.6,
            }}
          />
        ))}
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        {done ? "Final" : pct > 75 ? "Final stretch" : pct > 40 ? "In play" : "Just started"}
      </p>
    </div>
  );
}

function statusMeta(status: MatchStatus) {
  switch (status) {
    case "your-turn":
      return {
        label: "Your turn",
        icon: Play,
        chipBg: "color-mix(in oklch, var(--primary) 22%, transparent)",
        chipFg: "var(--primary)",
        barColor: "var(--primary)",
      };
    case "their-turn":
      return {
        label: "Their turn",
        icon: Hourglass,
        chipBg: "color-mix(in oklch, var(--accent) 22%, transparent)",
        chipFg: "var(--accent)",
        barColor: "var(--accent)",
      };
    case "waiting-accept":
      return {
        label: "Waiting to accept",
        icon: Clock,
        chipBg: "color-mix(in oklch, var(--muted-foreground) 18%, transparent)",
        chipFg: "var(--muted-foreground)",
        barColor: "var(--muted-foreground)",
      };
    case "won":
      return {
        label: "Won",
        icon: Trophy,
        chipBg: "color-mix(in oklch, var(--correct) 22%, transparent)",
        chipFg: "var(--correct)",
        barColor: "var(--correct)",
      };
    case "lost":
      return {
        label: "Lost",
        icon: XCircle,
        chipBg: "color-mix(in oklch, var(--absent) 35%, transparent)",
        chipFg: "var(--muted-foreground)",
        barColor: "var(--absent)",
      };
    case "draw":
      return {
        label: "Draw",
        icon: CheckCircle2,
        chipBg: "color-mix(in oklch, var(--present) 22%, transparent)",
        chipFg: "var(--present)",
        barColor: "var(--present)",
      };
  }
}

function EmptyState({ tab }: { tab: Tab }) {
  const copy = {
    active: {
      title: "No active duels yet",
      desc: "Start a new match and your live games will show up here.",
    },
    waiting: {
      title: "Nobody's keeping you waiting",
      desc: "Challenges that haven't been accepted yet will appear here.",
    },
    completed: {
      title: "No completed matches",
      desc: "Finish your first duel to see your match history here.",
    },
  }[tab];

  return (
    <div className="surface-elevated mx-auto max-w-md p-10 text-center">
      <div
        className="mx-auto grid size-16 place-items-center rounded-full"
        style={{
          background: "color-mix(in oklch, var(--primary) 14%, transparent)",
        }}
      >
        <Inbox className="size-7 text-primary" />
      </div>
      <h3 className="mt-4 font-display text-2xl">{copy.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{copy.desc}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link to="/play">
          <Button className="gap-2">
            <Swords className="size-4" /> Start a match
          </Button>
        </Link>
        <Link to="/play/match-select">
          <Button variant="outline" className="gap-2">
            Challenge a friend
          </Button>
        </Link>
      </div>
    </div>
  );
}
