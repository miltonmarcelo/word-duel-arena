import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  Flame,
  Lightbulb,
  Lock,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { achievements, monthlyStats, recentMatches, weeklyStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Stats — Word Clash" }] }),
  component: StatsPage,
});

type Range = "week" | "month" | "all";

const rangeData: Record<Range, { points: number; delta: number; chart: { label: string; value: number }[] }> = {
  week: {
    points: 3140,
    delta: 12,
    chart: weeklyStats.map((d) => ({ label: d.day, value: d.you })),
  },
  month: {
    points: 12480,
    delta: 8,
    chart: Array.from({ length: 4 }).map((_, i) => ({
      label: `W${i + 1}`,
      value: 2400 + Math.round(Math.sin(i + 1) * 800 + 900),
    })),
  },
  all: {
    points: 84210,
    delta: 24,
    chart: Array.from({ length: 12 }).map((_, i) => ({
      label: `M${i + 1}`,
      value: 3000 + i * 600 + Math.round(Math.sin(i) * 500),
    })),
  },
};

function StatsPage() {
  const [range, setRange] = useState<Range>("week");
  const data = rangeData[range];

  const totals = useMemo(() => {
    const wins = monthlyStats.reduce((a, b) => a + b.wins, 0);
    const losses = monthlyStats.reduce((a, b) => a + b.losses, 0);
    const draws = 14;
    const total = wins + losses + draws;
    return {
      wins,
      losses,
      draws,
      total,
      winRate: Math.round((wins / total) * 100),
    };
  }, []);

  const pieData = [
    { name: "Wins", value: totals.wins, color: "var(--correct)" },
    { name: "Draws", value: totals.draws, color: "var(--warning)" },
    { name: "Losses", value: totals.losses, color: "var(--absent)" },
  ];

  const hintsUsed = 47;
  const hintsAvailable = 120;
  const hintRate = Math.round((hintsUsed / hintsAvailable) * 100);

  return (
    <AppShell>
      <div className="space-y-6 pb-6 sm:space-y-8">
        {/* Header */}
        <header className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Performance</p>
          <h1 className="font-display text-3xl leading-tight sm:text-5xl">Your numbers, in motion.</h1>
          <p className="text-sm text-muted-foreground">Track your progress, celebrate streaks, sharpen your edge.</p>
        </header>

        {/* Hero KPI strip */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <HeroKpi
            label="This week"
            value="3,140"
            delta="+12%"
            tone="mint"
            icon={Flame}
            highlight
          />
          <HeroKpi
            label="This month"
            value="12,480"
            delta="+8%"
            tone="lilac"
            icon={Sparkles}
          />
          <HeroKpi
            label="All-time"
            value="84,210"
            delta="+24%"
            tone="mint"
            icon={Trophy}
          />
          <HeroKpi
            label="Win rate"
            value={`${totals.winRate}%`}
            delta="+4%"
            tone="lilac"
            icon={Target}
          />
        </section>

        {/* Evolution chart */}
        <section className="surface-elevated overflow-hidden p-5 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Evolution</p>
              <h2 className="font-display text-2xl sm:text-3xl">Points over time</h2>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl sm:text-4xl">{data.points.toLocaleString()}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                    data.delta >= 0
                      ? "bg-[color-mix(in_oklab,var(--correct)_18%,transparent)] text-[color:var(--correct)]"
                      : "bg-[color-mix(in_oklab,var(--absent)_18%,transparent)] text-[color:var(--absent)]",
                  )}
                >
                  {data.delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(data.delta)}%
                </span>
              </div>
            </div>

            <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="h-56 sm:h-72">
            <ResponsiveContainer>
              <AreaChart data={data.chart} margin={{ top: 10, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="pointsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "var(--surface-elevated, var(--card))",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "var(--muted-foreground)" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fill="url(#pointsFill)"
                  activeDot={{ r: 5, strokeWidth: 0, fill: "var(--primary)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Win/Loss breakdown + Hints */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* Pie */}
          <div className="surface-elevated p-5 sm:p-6 lg:col-span-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Outcomes</p>
            <h3 className="font-display text-2xl">Win rate</h3>

            <div className="relative mt-3 h-44">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {pieData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl">{totals.winRate}%</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Win rate</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Outcome label="Wins" value={totals.wins} color="var(--correct)" />
              <Outcome label="Draws" value={totals.draws} color="var(--warning)" />
              <Outcome label="Losses" value={totals.losses} color="var(--absent)" />
            </div>
          </div>

          {/* Bars wins vs losses */}
          <div className="surface-elevated p-5 sm:p-6 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">12-week trend</p>
                <h3 className="font-display text-2xl">Wins vs losses</h3>
              </div>
              <div className="hidden gap-3 text-xs sm:flex">
                <Legend dot="var(--correct)" label="Wins" />
                <Legend dot="var(--absent)" label="Losses" />
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer>
                <BarChart data={monthlyStats} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "color-mix(in oklab, var(--primary) 10%, transparent)" }}
                    contentStyle={{
                      background: "var(--surface-elevated, var(--card))",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="wins" fill="var(--correct)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="losses" fill="var(--absent)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Hints + accuracy */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="surface-elevated p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Accuracy</p>
                <h3 className="font-display text-2xl">Letter precision</h3>
              </div>
              <div className="rounded-xl bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] p-2 text-primary">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-4xl">72%</span>
              <span className="text-xs font-semibold text-[color:var(--correct)]">+3% vs last week</span>
            </div>
            <Progress value={72} className="mt-3 h-2" />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <MiniStat label="Correct" value="412" color="var(--correct)" />
              <MiniStat label="Present" value="186" color="var(--present)" />
              <MiniStat label="Absent" value="244" color="var(--absent)" />
            </div>
          </div>

          <div className="surface-elevated p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Hints used</p>
                <h3 className="font-display text-2xl">Reveal economy</h3>
              </div>
              <div className="rounded-xl bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] p-2 text-[color:var(--accent)]">
                <Lightbulb className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-4xl">{hintsUsed}</span>
              <span className="text-sm text-muted-foreground">/ {hintsAvailable} this season</span>
            </div>
            <Progress value={hintRate} className="mt-3 h-2" />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <MiniStat label="Reveals" value="32" color="var(--accent)" />
              <MiniStat label="Hints" value="15" color="var(--warning)" />
              <MiniStat label="Pts spent" value="1,160" color="var(--muted-foreground)" />
            </div>
          </div>
        </section>

        {/* Match history */}
        <section className="surface-elevated p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Recent</p>
              <h3 className="font-display text-2xl">Match history</h3>
            </div>
            <Link to="/dashboard" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recentMatches.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-background"
                  style={{ background: m.opponent.avatarColor }}
                >
                  {m.opponent.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{m.opponent.name}</p>
                    <ResultChip result={m.result} />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    Word <span className="font-mono font-semibold tracking-widest text-foreground">{m.word}</span> · {m.guesses} guesses · {m.date}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-display text-lg",
                      m.result === "win" && "text-[color:var(--correct)]",
                      m.result === "loss" && "text-[color:var(--absent)]",
                      m.result === "draw" && "text-[color:var(--warning)]",
                    )}
                  >
                    {m.result === "loss" ? "−" : "+"}
                    {m.xp}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">XP</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Achievements */}
        <section className="surface-elevated p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Collection</p>
              <h3 className="font-display text-2xl">Badges & achievements</h3>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {achievements.filter((a) => a.unlocked).length}/{achievements.length} unlocked
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-2xl border p-4 text-center transition-transform hover:-translate-y-0.5",
                  a.unlocked
                    ? "border-[color:var(--primary)]/40 bg-[color-mix(in_oklab,var(--primary)_8%,transparent)]"
                    : "border-border bg-[color-mix(in_oklab,var(--muted-foreground)_6%,transparent)] opacity-70",
                )}
              >
                <div
                  className={cn(
                    "text-3xl",
                    !a.unlocked && "grayscale",
                  )}
                >
                  {a.icon}
                </div>
                <p className="text-sm font-semibold">{a.name}</p>
                <p className="text-[11px] leading-tight text-muted-foreground">{a.desc}</p>
                {!a.unlocked && (
                  <div className="absolute right-2 top-2 rounded-full bg-background/80 p-1">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

/* ---------- subcomponents ---------- */

function HeroKpi({
  label,
  value,
  delta,
  tone,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "mint" | "lilac";
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  const color = tone === "mint" ? "var(--primary)" : "var(--accent)";
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
        {delta}
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

function Outcome({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-border p-2">
      <p className="font-display text-lg" style={{ color }}>
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="font-display text-lg" style={{ color }}>
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}

function ResultChip({ result }: { result: "win" | "loss" | "draw" }) {
  const map = {
    win:  { label: "WIN",  color: "var(--correct)" },
    loss: { label: "LOSS", color: "var(--absent)" },
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

// Keep Eye import used for tree-shake friendliness in case of future expansion.
void Eye;
