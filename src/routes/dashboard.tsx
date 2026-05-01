import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Calendar,
  Check,
  Dice5,
  Flame,
  Shapes,
  Sparkles,
  Swords,
  Trophy,
  Users2,
  X,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WordRow } from "@/components/WordBoard";
import {
  achievements,
  currentUser,
  notifications,
  players,
  recentMatches,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Home — WordClash" }] }),
  component: Dashboard,
});

function Dashboard() {
  const xpPct = Math.round((currentUser.xp / currentUser.xpToNext) * 100);
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
  const myRank = sortedPlayers.findIndex((p) => p.id === currentUser.id) + 1;
  const friendsBoard = sortedPlayers.slice(0, 5);
  const pendingChallenges = notifications.filter((n) => n.type === "challenge");
  const recentNotifs = notifications.filter((n) => n.type !== "challenge").slice(0, 3);
  const unlocked = achievements.filter((a) => a.unlocked);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome card */}
        <section
          className="surface-elevated relative overflow-hidden p-6 sm:p-8"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar player={currentUser} size={64} ring="mint" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Welcome back
                </p>
                <h1 className="font-display text-3xl sm:text-4xl">
                  Good evening, {currentUser.name.split(" ")[0]}.
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pendingChallenges.length} pending challenges · 1 daily puzzle remaining
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/play">
                <Button size="lg">
                  <Zap className="size-4" /> Start new duel
                </Button>
              </Link>
              <Link to="/play">
                <Button size="lg" variant="secondary">
                  <Sparkles className="size-4" /> Daily puzzle
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* KPI strip */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi label="This week" value="2,480" delta="+820 XP" tone="mint" />
          <Kpi label="This month" value="9,140" delta="+18%" tone="lilac" />
          <Kpi label="All-time" value="64.8k" delta="412 matches" tone="muted" />
          <Kpi label="Global rank" value={`#${myRank}`} delta="↑ 14 this week" tone="mint" highlight />
        </section>

        {/* Two-column main */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT (2/3) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Quick play modes */}
            <Card>
              <CardHeader title="Quick play" subtitle="Pick your battle, jump in." />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <ModeShortcut to="/play/match-select" icon={Swords}  label="Direct"  desc="Challenge a friend" tone="mint" />
                <ModeShortcut to="/play/random"       icon={Dice5}   label="Random"  desc="Auto-match"        tone="lilac" />
                <ModeShortcut to="/play/themed"       icon={Shapes}  label="Themed"  desc="Pick a topic"     tone="mint" />
                <ModeShortcut to="/rooms"             icon={Users2}  label="Rooms"   desc="Private league"   tone="lilac" />
              </div>
            </Card>

            {/* Daily puzzle */}
            <Card>
              <div className="grid items-center gap-6 sm:grid-cols-[1fr,auto]">
                <div>
                  <span className="chip">
                    <Sparkles className="size-3" /> Daily #482
                  </span>
                  <h3 className="mt-3 font-display text-2xl">Today's puzzle is live.</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Solve before midnight to keep your{" "}
                    <span className="font-semibold text-foreground">12-day streak</span> alive.
                  </p>
                  <Link to="/play/your-turn" className="mt-4 inline-block">
                    <Button>
                      Play daily <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-col gap-1.5">
                  <WordRow
                    guess={{
                      letters: ["P", "L", "A", "T", "E"],
                      states: ["correct", "correct", "correct", "correct", "correct"],
                    }}
                    size="sm"
                  />
                  <WordRow size="sm" empty />
                  <WordRow size="sm" empty />
                </div>
              </div>
            </Card>

            {/* Pending challenges */}
            <Card>
              <CardHeader
                title="Pending challenges"
                subtitle={`${pendingChallenges.length} waiting for your move`}
                action={
                  <Link to="/notifications" className="text-xs font-semibold text-primary hover:underline">
                    View all
                  </Link>
                }
              />
              <div className="divide-y divide-border">
                {pendingChallenges.map((n) => (
                  <div key={n.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    {n.actor && <Avatar player={n.actor} size={40} ring="lilac" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{n.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {n.body} · {n.time}
                      </p>
                    </div>
                    <Link to="/match">
                      <Button size="sm">
                        <Check className="size-3" /> Accept
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" aria-label="Decline">
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent activity */}
            <Card>
              <CardHeader
                title="Recent activity"
                subtitle="Latest matches and notifications"
                action={
                  <Link to="/stats" className="text-xs font-semibold text-primary hover:underline">
                    Full history
                  </Link>
                }
              />
              <div className="divide-y divide-border">
                {recentMatches.slice(0, 3).map((m) => (
                  <div key={m.id} className="flex items-center gap-4 py-3 first:pt-0">
                    <Avatar player={m.opponent} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">vs {m.opponent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.word} · {m.guesses} guesses · {m.date}
                      </p>
                    </div>
                    <span
                      className={`chip ${
                        m.result === "win" ? "" : m.result === "loss" ? "chip-muted" : "chip-lilac"
                      }`}
                    >
                      {m.result}
                    </span>
                    <span className="hidden text-sm font-semibold tabular-nums sm:inline">
                      +{m.xp} XP
                    </span>
                  </div>
                ))}
                {recentNotifs.map((n) => (
                  <div key={n.id} className="flex items-center gap-4 py-3 last:pb-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Bell className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{n.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {n.body} · {n.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT (1/3) */}
          <div className="space-y-6">
            {/* Streak */}
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <span className="chip chip-lilac">
                  <Flame className="size-3" /> Streak
                </span>
                <span className="text-xs text-muted-foreground">Best: 27</span>
              </div>
              <p className="font-display text-6xl text-gradient-mint leading-none">12</p>
              <p className="mt-1 text-sm text-muted-foreground">days in a row</p>
              <div className="mt-4 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 rounded-md ${
                      i < 5
                        ? "bg-primary"
                        : i === 5
                          ? "bg-primary/40 ring-2 ring-primary"
                          : "bg-surface"
                    }`}
                    title={["M", "T", "W", "T", "F", "S", "S"][i]}
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
            </Card>

            {/* Progress + badges */}
            <Card>
              <CardHeader
                title="Progress"
                subtitle={`Level ${currentUser.level} · ${currentUser.xpToNext - currentUser.xp} XP to next`}
              />
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl text-primary">{currentUser.level}</span>
                <Progress value={xpPct} className="h-3 flex-1" />
                <span className="font-display text-2xl text-muted-foreground">
                  {currentUser.level + 1}
                </span>
              </div>
              <p className="mt-2 text-right text-xs text-muted-foreground tabular-nums">
                {currentUser.xp.toLocaleString()} / {currentUser.xpToNext.toLocaleString()} XP
              </p>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Recent badges
                  </p>
                  <Link to="/profile" className="text-xs font-semibold text-primary hover:underline">
                    All
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {unlocked.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="surface-soft flex flex-col items-center gap-1 rounded-xl p-2 text-center"
                      title={`${a.name} — ${a.desc}`}
                    >
                      <span className="text-2xl">{a.icon}</span>
                      <span className="truncate text-[10px] font-semibold">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Mini leaderboard */}
            <Card>
              <CardHeader
                title="Friends leaderboard"
                subtitle="This week"
                action={
                  <Link to="/ranking" className="text-xs font-semibold text-primary hover:underline">
                    Global
                  </Link>
                }
              />
              <ol className="space-y-2">
                {friendsBoard.map((p, i) => {
                  const isMe = p.id === currentUser.id;
                  const place = i + 1;
                  return (
                    <li
                      key={p.id}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                        isMe ? "bg-primary/10 ring-1 ring-primary/40" : "hover:bg-surface"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                          place === 1
                            ? "bg-primary text-primary-foreground"
                            : place === 2
                              ? "bg-accent text-accent-foreground"
                              : place === 3
                                ? "bg-warning text-background"
                                : "bg-surface-elevated text-muted-foreground"
                        }`}
                      >
                        {place}
                      </span>
                      <Avatar player={p} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {p.name} {isMe && <span className="text-xs font-normal text-primary">· you</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">Lvl {p.level}</p>
                      </div>
                      <span className="font-display text-sm tabular-nums">{p.rating}</span>
                    </li>
                  );
                })}
              </ol>
              <Link
                to="/ranking"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                View full ranking <ArrowUpRight className="size-3" />
              </Link>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

/* -------- helpers -------- */

function Card({ children }: { children: React.ReactNode }) {
  return <div className="surface-elevated p-5 sm:p-6">{children}</div>;
}

function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-xl">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Kpi({
  label,
  value,
  delta,
  tone,
  highlight,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "mint" | "lilac" | "muted";
  highlight?: boolean;
}) {
  const toneClass =
    tone === "mint" ? "text-primary" : tone === "lilac" ? "text-accent" : "text-muted-foreground";
  return (
    <div
      className={`surface-elevated p-4 ${highlight ? "ring-1 ring-primary/40 glow-mint" : ""}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl tabular-nums">{value}</p>
      <p className={`mt-1 text-xs font-semibold ${toneClass}`}>{delta}</p>
    </div>
  );
}

function ModeShortcut({
  to,
  icon: Icon,
  label,
  desc,
  tone,
}: {
  to: string;
  icon: typeof Swords;
  label: string;
  desc: string;
  tone: "mint" | "lilac";
}) {
  return (
    <Link
      to={to as "/play" | "/play/match-select" | "/rooms"}
      className="surface-soft group flex flex-col items-start gap-3 rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
    >
      <div
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
          tone === "mint" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
        }`}
      >
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}
