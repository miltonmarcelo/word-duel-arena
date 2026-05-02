import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Calendar,
  Check,
  Clock,
  Dice5,
  Flame,
  Play,
  Shapes,
  Sparkles,
  Swords,
  Trophy,
  UserPlus,
  Users,
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
  // Mock online friends (max 4 shown)
  const onlineFriends = players
    .filter((p) => p.id !== currentUser.id)
    .slice(0, 4);
  // Mock pending friend requests count
  const pendingFriendRequests: number = 2;
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

        {/* KPI strip — horizontal scroll on mobile, grid on desktop */}
        <section className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          <Kpi label="This week" value="2,480" delta="+820 XP" tone="mint" className="min-w-[160px] shrink-0 sm:min-w-0" />
          <Kpi label="All-time" value="64.8k" delta="412 matches" tone="muted" className="min-w-[160px] shrink-0 sm:min-w-0" />
          <Kpi label="Global rank" value={`#${myRank}`} delta="↑ 14 this week" tone="mint" highlight className="min-w-[160px] shrink-0 sm:min-w-0" />
        </section>

        {/* Mobile-only Streak (appears right after KPIs on mobile) */}
        <div className="md:hidden">
          <StreakCard />
        </div>

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

            {/* Your Rooms — desktop only (rooms reachable via bottom tab on mobile) */}
            <div className="hidden md:block">
              <RoomsWidget />
            </div>

            {/* Daily puzzle — desktop only (CTA exists in hero on mobile) */}
            <div className="hidden md:block">
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
            </div>

            {/* Pending friend requests banner — desktop only (badge in mobile top bar) */}
            {pendingFriendRequests > 0 && (
              <Link
                to="/friends"
                className="surface-elevated group hidden items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] md:flex"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklch, var(--accent) 14%, var(--surface-elevated)), var(--surface-elevated))",
                  borderColor:
                    "color-mix(in oklch, var(--accent) 35%, var(--border))",
                }}
              >
                <span className="grid size-10 place-items-center rounded-full bg-accent/20 text-accent">
                  <UserPlus className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    You have {pendingFriendRequests} pending friend request
                    {pendingFriendRequests === 1 ? "" : "s"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Accept or decline to grow your duel circle.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:underline">
                  See requests <ArrowRight className="size-3" />
                </span>
              </Link>
            )}

            {/* Friends online */}
            <Card>
              <CardHeader
                title="Friends Online"
                subtitle={
                  onlineFriends.length > 0
                    ? `${onlineFriends.length} ready to play right now`
                    : "Nobody online at the moment"
                }
                action={
                  <Link
                    to="/friends"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    See all friends
                  </Link>
                }
              />
              <div className="-mb-2 flex items-center gap-2 text-muted-foreground">
                <Users className="size-4 shrink-0 text-primary" />
                {onlineFriends.length === 0 ? (
                  <p className="text-sm">
                    No friends online.{" "}
                    <Link
                      to="/friends"
                      className="font-semibold text-primary hover:underline"
                    >
                      Find players
                    </Link>
                  </p>
                ) : null}
              </div>
              {onlineFriends.length > 0 && (
                <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto pb-2">
                  {onlineFriends.map((f) => (
                    <div
                      key={f.id}
                      className="surface-soft flex w-36 shrink-0 flex-col items-center gap-2 rounded-xl p-3 text-center"
                    >
                      <div className="relative">
                        <span className="avatar-ring inline-block">
                          <Avatar player={f} size={48} />
                        </span>
                        <span
                          className="absolute -bottom-0.5 -right-0.5 block size-3 rounded-full border-2 border-background"
                          style={{ background: "var(--correct)" }}
                          aria-label="Online"
                        />
                      </div>
                      <p className="w-full truncate text-sm font-semibold">
                        {f.name.split(" ")[0]}
                      </p>
                      <Link to="/play/match-select" className="w-full">
                        <Button size="sm" className="w-full gap-1.5">
                          <Swords className="size-3" /> Challenge
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
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
                    <Link to="/play/your-turn">
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
                  <Link
                    key={m.id}
                    to="/match/result"
                    search={{
                      outcome: m.result,
                      word: m.word,
                      attempts: m.guesses,
                      pointsEarned: m.xp,
                      opponent: m.opponent.name,
                      from: "history",
                    }}
                    className="group flex items-center gap-4 py-3 first:pt-0 transition-colors hover:bg-surface/50 -mx-2 px-2 rounded-lg"
                  >
                    <Avatar player={m.opponent} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold group-hover:text-primary transition-colors">
                        vs {m.opponent.name}
                      </p>
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
                  </Link>
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
            {/* Streak — hidden on mobile (rendered above KPIs section instead) */}
            <div className="hidden md:block">
              <StreakCard />
            </div>

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

function StreakCard() {
  return (
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
  );
}

function Kpi({
  label,
  value,
  delta,
  tone,
  highlight,
  className,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "mint" | "lilac" | "muted";
  highlight?: boolean;
  className?: string;
}) {
  const toneClass =
    tone === "mint" ? "text-primary" : tone === "lilac" ? "text-accent" : "text-muted-foreground";
  return (
    <div
      className={`surface-elevated p-4 ${highlight ? "ring-1 ring-primary/40 glow-mint" : ""} ${className ?? ""}`}
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

/* -------- Rooms widget -------- */

type DashRoom = {
  id: string;
  name: string;
  theme: { label: string; tone: "mint" | "lilac" };
  status: "play-now" | "played" | "waiting";
  timeLeft?: string;
  rank: number;
  total: number;
};

const dashRooms: DashRoom[] = [
  { id: "r-1", name: "Wordsmiths",    theme: { label: "General", tone: "mint"  }, status: "play-now", timeLeft: "5h left",  rank: 2, total: 6 },
  { id: "r-2", name: "Office League", theme: { label: "Cinema",  tone: "lilac" }, status: "played",   timeLeft: "11h left", rank: 1, total: 8 },
  { id: "r-3", name: "Family Clash",  theme: { label: "Music",   tone: "mint"  }, status: "waiting",                        rank: 4, total: 5 },
];

function RoomsWidget() {
  const myRooms = dashRooms.slice(0, 3);

  return (
    <Card>
      <CardHeader
        title="Your Rooms"
        subtitle={myRooms.length > 0 ? `${myRooms.length} active` : "No active rooms"}
        action={
          <Link to="/rooms" className="text-xs font-semibold text-primary hover:underline">
            See all
          </Link>
        }
      />
      {myRooms.length === 0 ? (
        <div className="surface-soft flex flex-col items-center gap-3 rounded-xl p-6 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-accent/15 text-accent">
            <Users2 className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">No rooms yet</p>
            <p className="text-xs text-muted-foreground">
              Join a friend's room or start your own private league.
            </p>
          </div>
          <Link to="/rooms">
            <Button size="sm">
              <Users2 className="size-3.5" /> Join or create a room
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {myRooms.map((r) => (
            <RoomRow key={r.id} room={r} />
          ))}
        </div>
      )}
    </Card>
  );
}

function RoomRow({ room }: { room: DashRoom }) {
  const statusMeta =
    room.status === "play-now"
      ? { label: "Play now 🟢", className: "chip" }
      : room.status === "played"
        ? { label: "Already played ✅", className: "chip chip-muted" }
        : { label: "Waiting ⚪", className: "chip chip-muted" };

  return (
    <Link
      to="/rooms/$roomId"
      params={{ roomId: room.id }}
      className="surface-soft group flex items-center gap-3 rounded-xl p-3 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold group-hover:text-primary">
            {room.name}
          </p>
          <span className={`chip ${room.theme.tone === "lilac" ? "chip-lilac" : ""}`}>
            {room.theme.label}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {room.status !== "waiting" && room.timeLeft && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" /> {room.timeLeft}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Trophy className="size-3" /> #{room.rank} of {room.total}
          </span>
          <span className={statusMeta.className}>{statusMeta.label}</span>
        </div>
      </div>
      {room.status === "play-now" && (
        <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-sm)]">
          <Play className="size-3" /> Play
        </span>
      )}
    </Link>
  );
}
