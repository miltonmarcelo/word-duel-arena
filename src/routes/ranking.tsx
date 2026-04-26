import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Crown, Flame, Medal, Minus, Search, Sparkles, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { currentUser, players, type Player } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — Word Clash" }] }),
  component: RankingPage,
});

type Range = "week" | "month" | "all";
type Scope = "global" | "friends" | "region";

// Deterministic mock variation per range so the ranking shifts between tabs.
function buildBoard(range: Range): (Player & { points: number; delta: number; streak: number })[] {
  const seed = range === "week" ? 7 : range === "month" ? 31 : 365;
  return players
    .map((p, i) => {
      const drift = Math.round(Math.sin((i + 1) * seed * 0.13) * 180);
      const points = Math.round(p.rating * (range === "week" ? 1.6 : range === "month" ? 6.2 : 24)) + drift;
      const delta = Math.round(Math.sin((i + 1) * seed * 0.31) * 9);
      const streak = Math.max(0, Math.round(Math.cos((i + 1) * 0.7) * 6 + 4));
      return { ...p, points, delta, streak };
    })
    .sort((a, b) => b.points - a.points);
}

function RankingPage() {
  const [range, setRange] = useState<Range>("week");
  const [scope, setScope] = useState<Scope>("global");
  const [query, setQuery] = useState("");

  const board = useMemo(() => buildBoard(range), [range]);

  const filtered = useMemo(() => {
    let list = board;
    if (scope === "friends") list = list.filter((_, i) => i % 2 === 0);
    if (scope === "region") list = list.filter((p) => ["US", "MX", "FR", "SE"].includes(p.country));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q));
    }
    return list;
  }, [board, scope, query]);

  const myRank = board.findIndex((p) => p.id === currentUser.id) + 1 || board.length + 1;
  const meEntry = board.find((p) => p.id === currentUser.id) ?? { ...currentUser, points: 0, delta: 0, streak: 0 };

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3, 20);

  return (
    <AppShell>
      <div className="space-y-6 pb-28 sm:space-y-8 sm:pb-8">
        {/* Header */}
        <header className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Season 4 · Resets in 2 days</p>
          <h1 className="font-display text-3xl leading-tight sm:text-5xl">Global ranking.</h1>
          <p className="text-sm text-muted-foreground">
            Climb the ladder. Top 100 earn the season trophy.
          </p>
        </header>

        {/* Controls */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="all">All-time</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={scope} onValueChange={(v) => setScope(v as Scope)}>
            <TabsList>
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
              <TabsTrigger value="region">Region</TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players..."
            className="pl-9"
          />
        </div>

        {/* Podium */}
        {top3.length === 3 && (
          <section className="grid grid-cols-3 items-end gap-2 sm:gap-6">
            <PodiumCard entry={top3[1]} place={2} />
            <PodiumCard entry={top3[0]} place={1} highlight />
            <PodiumCard entry={top3[2]} place={3} />
          </section>
        )}

        {/* Rest of leaderboard */}
        <section className="surface-elevated overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <span>Rank</span>
            <span>Points</span>
          </div>
          <ul className="divide-y divide-border">
            {rest.map((p, idx) => {
              const place = idx + 4;
              const isMe = p.id === currentUser.id;
              return (
                <li
                  key={p.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--primary)_6%,transparent)]",
                    isMe && "bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
                  )}
                >
                  <span className="w-7 text-center font-display text-base tabular-nums text-muted-foreground">
                    {place}
                  </span>
                  <Avatar player={p} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">
                        {p.name}
                        {isMe && (
                          <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                            You
                          </span>
                        )}
                      </p>
                      {p.streak >= 6 && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--warning)]">
                          <Flame className="h-2.5 w-2.5" /> {p.streak}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.handle} · Lvl {p.level} · {p.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-base tabular-nums">{p.points.toLocaleString()}</p>
                    <DeltaPill delta={p.delta} />
                  </div>
                </li>
              );
            })}
            {rest.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">No players match your search.</li>
            )}
          </ul>
        </section>

        {/* Sticky personal rank card (mobile) */}
        <div className="fixed inset-x-3 bottom-20 z-30 sm:static sm:inset-auto sm:z-auto">
          <div className="surface-elevated flex items-center gap-3 rounded-2xl border border-primary/40 bg-[color-mix(in_oklab,var(--primary)_14%,var(--card))] p-3 shadow-lg shadow-primary/10 sm:p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              #{myRank}
            </span>
            <Avatar player={currentUser} size={40} ring="mint" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                Your position <span className="text-muted-foreground">· {scope}</span>
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {meEntry.points.toLocaleString()} pts · Lvl {currentUser.level}
              </p>
            </div>
            <DeltaPill delta={meEntry.delta} large />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ---------- subcomponents ---------- */

function PodiumCard({
  entry,
  place,
  highlight,
}: {
  entry: ReturnType<typeof buildBoard>[number];
  place: 1 | 2 | 3;
  highlight?: boolean;
}) {
  const meta = {
    1: { color: "var(--primary)", label: "Champion", icon: Crown, height: "h-32 sm:h-40" },
    2: { color: "var(--accent)", label: "Runner-up", icon: Medal, height: "h-24 sm:h-32" },
    3: { color: "var(--warning)", label: "Bronze", icon: Trophy, height: "h-20 sm:h-28" },
  }[place];
  const Icon = meta.icon;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <Avatar
          player={entry}
          size={highlight ? 76 : 60}
          ring={place === 1 ? "mint" : place === 2 ? "lilac" : "none"}
        />
        <span
          className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-bold text-background"
          style={{ background: meta.color }}
        >
          {place}
        </span>
        {highlight && (
          <Sparkles className="absolute -right-3 -top-3 h-5 w-5 text-primary animate-pulse" />
        )}
      </div>

      <p className="line-clamp-1 text-center text-xs font-semibold sm:text-sm">{entry.name}</p>
      <p className="font-display text-base sm:text-lg">{entry.points.toLocaleString()}</p>

      <div
        className={cn(
          "relative flex w-full items-end justify-center overflow-hidden rounded-t-2xl border border-b-0 border-border",
          meta.height,
          highlight && "animate-podium",
        )}
        style={{
          background: `linear-gradient(180deg, color-mix(in oklab, ${meta.color} 22%, transparent) 0%, color-mix(in oklab, ${meta.color} 6%, var(--card)) 100%)`,
        }}
      >
        <div className="flex flex-col items-center pb-3 pt-2">
          <Icon className="mb-1 h-5 w-5" style={{ color: meta.color }} />
          <span className="font-display text-3xl sm:text-4xl" style={{ color: meta.color }}>
            {place}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            {meta.label}
          </span>
        </div>
      </div>
    </div>
  );
}

function DeltaPill({ delta, large }: { delta: number; large?: boolean }) {
  const tone =
    delta > 0
      ? { color: "var(--correct)", icon: ArrowUp, label: `+${delta}` }
      : delta < 0
        ? { color: "var(--absent)", icon: ArrowDown, label: `${delta}` }
        : { color: "var(--muted-foreground)", icon: Minus, label: "0" };
  const Icon = tone.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full font-semibold tabular-nums",
        large ? "px-2 py-1 text-xs" : "px-1.5 py-0.5 text-[10px]",
      )}
      style={{
        color: tone.color,
        background: `color-mix(in oklab, ${tone.color} 14%, transparent)`,
      }}
    >
      <Icon className={large ? "h-3 w-3" : "h-2.5 w-2.5"} />
      {tone.label}
    </span>
  );
}
