import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  Check,
  Clock,
  Edit3,
  Flame,
  Globe2,
  Lock,
  Share2,
  Sparkles,
  Trophy,
  UserPlus,
  Zap,
} from "lucide-react";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { achievements, currentUser, players, recentMatches } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const profileSearchSchema = z.object({
  viewing: z.string().optional(),
  rel: z.enum(["none", "sent", "friend"]).optional(),
});

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Word Clash" }] }),
  validateSearch: profileSearchSchema,
  component: ProfilePage,
});

const BIO = "Word hunter from San Francisco. Five-letter purist. Always up for a duel before coffee.";

const FAVORITE_THEMES = [
  { name: "Nature",    emoji: "🌿", matches: 84, color: "var(--correct)" },
  { name: "Tech",      emoji: "💻", matches: 62, color: "var(--accent)" },
  { name: "Food",      emoji: "🍜", matches: 41, color: "var(--warning)" },
  { name: "Travel",    emoji: "✈️", matches: 33, color: "var(--present)" },
  { name: "Cinema",    emoji: "🎬", matches: 28, color: "var(--primary)" },
];

function ProfilePage() {
  const { viewing, rel } = Route.useSearch();
  const viewedPlayer =
    (viewing && players.find((p) => p.id === viewing || p.handle === viewing)) ||
    currentUser;
  const isOwnProfile = viewedPlayer.id === currentUser.id;
  const relationship: "none" | "sent" | "friend" = rel ?? "none";

  // Mock friends list (max 6 visible in row, 12 total)
  const friendsList = players.filter((p) => p.id !== viewedPlayer.id).slice(0, 12);
  const friendsCount = friendsList.length;

  const xpPct = Math.round((viewedPlayer.xp / viewedPlayer.xpToNext) * 100);
  const sortedByRating = [...players].sort((a, b) => b.rating - a.rating);
  const myRank = sortedByRating.findIndex((p) => p.id === viewedPlayer.id) + 1;
  const totalPoints = 84_210;

  const wins   = recentMatches.filter((m) => m.result === "win").length + 38;
  const losses = recentMatches.filter((m) => m.result === "loss").length + 14;
  const draws  = recentMatches.filter((m) => m.result === "draw").length + 5;
  const total  = wins + losses + draws;
  const winRate = Math.round((wins / total) * 100);

  const unlocked = achievements.filter((a) => a.unlocked);

  return (
    <AppShell>
      <div className="space-y-6 pb-6 sm:space-y-8">
        {/* Identity header */}
        <header
          className="surface-elevated relative overflow-hidden rounded-3xl p-5 sm:p-7"
        >
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(80% 60% at 0% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%), radial-gradient(70% 60% at 100% 0%, color-mix(in oklab, var(--accent) 20%, transparent), transparent 60%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--foreground) 0 1px, transparent 1px 14px)",
            }}
          />
          <Sparkles className="absolute right-5 top-5 h-4 w-4 text-primary/60" />

          {/* Mobile: stacked & centered. Desktop: row. */}
          <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:text-left">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-5">
              <div className="rounded-full ring-4 ring-card">
                <Avatar player={viewedPlayer} size={88} ring="mint" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="font-display text-3xl leading-none sm:text-4xl">{viewedPlayer.name}</h1>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Lvl {viewedPlayer.level}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {viewedPlayer.handle} · <Globe2 className="-mt-0.5 inline h-3 w-3" /> {viewedPlayer.country}
                </p>
                {isOwnProfile && (
                  <p className="mx-auto max-w-md text-sm text-foreground/80 sm:mx-0">{BIO}</p>
                )}
              </div>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              {isOwnProfile ? (
                <>
                  <Button variant="secondary" size="sm" className="flex-1 gap-1.5 sm:flex-none">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button asChild size="sm" className="flex-1 gap-1.5 sm:flex-none">
                    <Link to="/settings">
                      <Edit3 className="h-4 w-4" /> Edit
                    </Link>
                  </Button>
                </>
              ) : (
                <FriendActionButton relationship={relationship} />
              )}
            </div>
          </div>
        </header>

        {/* Stat strip */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="Total points"
            value={totalPoints.toLocaleString()}
            sub="All-time"
            color="var(--primary)"
            icon={Trophy}
            highlight
          />
          <StatTile
            label="Global rank"
            value={`#${myRank}`}
            sub="+4 this week"
            color="var(--accent)"
            icon={Award}
          />
          <StatTile
            label="Win rate"
            value={`${winRate}%`}
            sub={`${wins}W · ${losses}L · ${draws}D`}
            color="var(--correct)"
            icon={Zap}
          />
          <StatTile
            label="Streak"
            value="12d"
            sub="Personal best"
            color="var(--warning)"
            icon={Flame}
          />
        </section>

        {/* Two-column body */}
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {/* LEFT (2 cols) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Level + XP */}
            <Panel>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Progression
                  </p>
                  <h2 className="font-display text-2xl">Level {currentUser.level}</h2>
                </div>
                <span className="font-display text-2xl text-gradient-mint">{currentUser.rating}</span>
              </div>
              <Progress value={xpPct} className="mt-4 h-2.5" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>
                  {currentUser.xp.toLocaleString()} / {currentUser.xpToNext.toLocaleString()} XP
                </span>
                <span>
                  {(currentUser.xpToNext - currentUser.xp).toLocaleString()} XP to Lvl {currentUser.level + 1}
                </span>
              </div>
            </Panel>

            {/* Win breakdown */}
            <Panel>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Record
                  </p>
                  <h2 className="font-display text-2xl">Wins, losses & draws</h2>
                </div>
                <span className="text-xs text-muted-foreground">{total} matches</span>
              </div>
              <div className="flex gap-2">
                <RecordCell label="Wins"   value={wins}   color="var(--correct)" className="flex-1 min-w-0" />
                <RecordCell label="Draws"  value={draws}  color="var(--warning)" className="flex-1 min-w-0" />
                <RecordCell label="Losses" value={losses} color="var(--absent)"  className="flex-1 min-w-0" />
              </div>
              {/* Stacked bar */}
              <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted">
                <span className="h-full" style={{ width: `${(wins / total) * 100}%`,   background: "var(--correct)" }} />
                <span className="h-full" style={{ width: `${(draws / total) * 100}%`,  background: "var(--warning)" }} />
                <span className="h-full" style={{ width: `${(losses / total) * 100}%`, background: "var(--absent)"  }} />
              </div>
            </Panel>

            {/* Recent matches */}
            <Panel>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Recent
                  </p>
                  <h2 className="font-display text-2xl">Match history</h2>
                </div>
                <Link to="/stats" className="text-xs font-semibold text-primary hover:underline">
                  View all
                </Link>
              </div>
              <ul className="divide-y divide-border">
                {recentMatches.map((m) => (
                  <li key={m.id}>
                    <Link
                      to="/match/result"
                      search={{
                        outcome: m.result,
                        word: m.word,
                        attempts: m.guesses,
                        pointsEarned: m.xp,
                        opponent: m.opponent.name,
                        from: "history",
                      }}
                      className="group flex items-center gap-3 py-3 -mx-2 px-2 rounded-lg transition-colors hover:bg-surface/50"
                    >
                      <Avatar player={m.opponent} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold group-hover:text-primary transition-colors">vs {m.opponent.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          <Calendar className="-mt-0.5 mr-1 inline h-3 w-3" />
                          {m.date} · <span className="font-mono font-bold tracking-widest text-foreground">{m.word}</span> · {m.guesses}/6
                        </p>
                      </div>
                      <ResultChip result={m.result} />
                      <span
                        className={cn(
                          "w-12 text-right font-display text-sm tabular-nums",
                          m.result === "win"  && "text-[color:var(--correct)]",
                          m.result === "loss" && "text-[color:var(--absent)]",
                          m.result === "draw" && "text-[color:var(--warning)]",
                        )}
                      >
                        {m.result === "loss" ? "−" : "+"}
                        {m.xp}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* RIGHT (1 col) */}
          <div className="space-y-6">
            {/* Favorite themes */}
            <Panel>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Style
              </p>
              <h2 className="font-display text-2xl">Favorite themes</h2>
              <ul className="mt-4 space-y-3">
                {FAVORITE_THEMES.map((t) => {
                  const max = FAVORITE_THEMES[0].matches;
                  const pct = Math.round((t.matches / max) * 100);
                  return (
                    <li key={t.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-base leading-none">{t.emoji}</span>
                          <span className="font-semibold">{t.name}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">{t.matches}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: t.color }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            {/* Friends */}
            <Panel>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Network
                  </p>
                  <h2 className="font-display text-2xl">
                    Friends{" "}
                    <span className="text-base font-sans text-muted-foreground">
                      · {friendsCount}
                    </span>
                  </h2>
                </div>
                <Link
                  to="/friends"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View all
                </Link>
              </div>

              {/* Horizontal scrollable row of up to 6 friends */}
              <div className="-mx-1 flex gap-3 overflow-x-auto pb-2">
                {friendsList.slice(0, 6).map((f) => (
                  <Link
                    key={f.id}
                    to="/profile"
                    search={{ viewing: f.id, rel: "none" as const }}
                    className="surface-soft flex w-24 shrink-0 flex-col items-center gap-2 rounded-xl p-3 text-center transition-transform hover:-translate-y-0.5"
                  >
                    <Avatar player={f} size={44} />
                    <p className="w-full truncate text-xs font-semibold">
                      {f.name.split(" ")[0]}
                    </p>
                  </Link>
                ))}
              </div>

              {isOwnProfile && (
                <Link to="/friends" className="mt-4 block">
                  <Button variant="secondary" size="sm" className="w-full gap-2">
                    <UserPlus className="h-4 w-4" /> Find more players
                  </Button>
                </Link>
              )}
            </Panel>

            {/* Achievements */}
            <Panel>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Collection
                  </p>
                  <h2 className="font-display text-2xl">Badges</h2>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {unlocked.length}/{achievements.length}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    title={`${a.name} — ${a.desc}`}
                    className={cn(
                      "relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border p-2 text-center transition-transform hover:-translate-y-0.5",
                      a.unlocked
                        ? "border-[color:var(--primary)]/40 bg-[color-mix(in_oklab,var(--primary)_10%,transparent)]"
                        : "border-border bg-[color-mix(in_oklab,var(--muted-foreground)_5%,transparent)] opacity-60",
                    )}
                  >
                    <div className={cn("text-2xl", !a.unlocked && "grayscale")}>{a.icon}</div>
                    <p className="line-clamp-1 text-[10px] font-semibold">{a.name}</p>
                    {!a.unlocked && (
                      <Lock className="absolute right-1.5 top-1.5 h-2.5 w-2.5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ---------- subcomponents ---------- */

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="surface-elevated rounded-2xl p-5 sm:p-6">{children}</div>;
}

function FriendActionButton({
  relationship,
}: {
  relationship: "none" | "sent" | "friend";
}) {
  if (relationship === "friend") {
    return (
      <Button variant="secondary" size="sm" className="flex-1 gap-1.5 sm:flex-none" disabled>
        <Check className="h-4 w-4" /> Friends
      </Button>
    );
  }
  if (relationship === "sent") {
    return (
      <Button variant="secondary" size="sm" className="flex-1 gap-1.5 sm:flex-none" disabled>
        <Clock className="h-4 w-4" /> Request sent
      </Button>
    );
  }
  return (
    <Button size="sm" className="flex-1 gap-1.5 sm:flex-none">
      <UserPlus className="h-4 w-4" /> Add friend
    </Button>
  );
}

function StatTile({
  label,
  value,
  sub,
  color,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 transition-transform hover:-translate-y-0.5",
        highlight
          ? "border-[color:var(--primary)]/50 bg-[color-mix(in_oklab,var(--primary)_10%,transparent)]"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <div
          className="rounded-lg p-1.5"
          style={{ background: `color-mix(in oklab, ${color} 16%, transparent)`, color }}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="mt-2 font-display text-2xl sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold" style={{ color }}>
        {sub}
      </p>
      {highlight && (
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-50 blur-2xl"
          style={{ background: color }}
        />
      )}
    </div>
  );
}

function RecordCell({ label, value, color, className }: { label: string; value: number; color: string; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border p-3 text-center", className)}>
      <p className="font-display text-2xl" style={{ color }}>
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function ResultChip({ result }: { result: "win" | "loss" | "draw" }) {
  const map = {
    win:  { label: "WIN",  color: "var(--correct)" },
    loss: { label: "LOSS", color: "var(--absent)"  },
    draw: { label: "DRAW", color: "var(--warning)" },
  } as const;
  const v = map[result];
  return (
    <span
      className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
      style={{
        background: `color-mix(in oklab, ${v.color} 16%, transparent)`,
        color: v.color,
      }}
    >
      {v.label}
    </span>
  );
}
