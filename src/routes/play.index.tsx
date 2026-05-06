import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Dice5,
  Flame,
  Palette,
  Sparkles,
  Swords,
  Users2,
  
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/play/")({
  head: () => ({
    meta: [
      { title: "Choose your mode — WordClash" },
      {
        name: "description",
        content:
          "Pick how you want to duel: direct challenge, random match, group room, themed mode or quick play.",
      },
    ],
  }),
  component: PlayPage,
});

type Mode = {
  id: string;
  title: string;
  tag: string;
  desc: string;
  icon: typeof Swords;
  accent: "mint" | "lilac";
  competitiveness: 1 | 2 | 3 | 4 | 5;
  avgTime: string;
  cta: string;
  to: string;
  featured?: boolean;
  highlight?: string;
};

const modes: Mode[] = [
  {
    id: "direct",
    title: "Direct Challenge",
    tag: "1 vs 1",
    desc: "Pick a friend, send a duel and settle the score in five letters.",
    icon: Swords,
    accent: "mint",
    competitiveness: 5,
    avgTime: "3–5 min",
    cta: "Challenge a friend",
    to: "/play/match-select",
    featured: true,
    highlight: "Most played",
  },
  {
    id: "random",
    title: "Random Match",
    tag: "Auto-match",
    desc: "Get paired with a player at your skill level in seconds.",
    icon: Dice5,
    accent: "lilac",
    competitiveness: 4,
    avgTime: "4 min",
    cta: "Find opponent",
    to: "/play/random",
  },
  {
    id: "daily",
    title: "Word of the Day",
    tag: "Daily challenge",
    desc: "One system-defined word for everyone. Come back every day and compare your result.",
    icon: Sparkles,
    accent: "mint",
    competitiveness: 3,
    avgTime: "2–3 min",
    cta: "Play today's word",
    to: "/play/quick",
  },
  {
    id: "themed",
    title: "Themed Mode",
    tag: "Curated words",
    desc: "Movies, sports, science… choose a theme and challenge experts.",
    icon: Palette,
    accent: "lilac",
    competitiveness: 3,
    avgTime: "5 min",
    cta: "Pick a theme",
    to: "/play/themed",
  },
  {
    id: "group",
    title: "Group Room",
    tag: "Private league",
    desc: "Play with friends in a private room with its own leaderboard.",
    icon: Users2,
    accent: "mint",
    competitiveness: 4,
    avgTime: "6–10 min",
    cta: "Open rooms",
    to: "/rooms",
  },
];

function PlayPage() {
  return (
    <AppShell>
      <div className="space-y-10">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="size-3.5" /> Game modes
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
              Choose your <span className="text-gradient-mint">battle.</span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              Five ways to play. Same five letters. Pick your pace and your stakes.
            </p>
          </div>
          <div className="surface-soft flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
            <Flame className="size-4 text-primary" />
            <span className="text-muted-foreground">Streak bonus active —</span>
            <span className="font-semibold">+15% XP today</span>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modes.map((m, i) => (
            <ModeCard key={m.id} mode={m} index={i} />
          ))}
        </section>
      </div>
    </AppShell>
  );
}

function ModeCard({ mode, index }: { mode: Mode; index: number }) {
  const Icon = mode.icon;
  const isMint = mode.accent === "mint";
  return (
    <Link
      to={mode.to}
      className={`surface-elevated group relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        mode.featured ? "md:col-span-2 xl:col-span-2" : ""
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* accent bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1 ${isMint ? "bg-primary" : "bg-accent"}`}
      />
      {/* glow on hover */}
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60 ${
          isMint ? "bg-primary/30" : "bg-accent/30"
        }`}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
            isMint ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
          }`}
        >
          <Icon className="size-6" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`chip ${isMint ? "" : "chip-lilac"}`}>{mode.tag}</span>
          {mode.highlight ? (
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {mode.highlight}
            </span>
          ) : null}
        </div>
      </div>

      <h3 className="mt-5 font-display text-2xl sm:text-3xl">{mode.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{mode.desc}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat
          label="Competitiveness"
          value={
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-4 rounded-full ${
                    i < mode.competitiveness
                      ? isMint
                        ? "bg-primary"
                        : "bg-accent"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          }
        />
        <Stat
          label="Avg. match"
          value={
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <Clock className="size-3.5 text-muted-foreground" />
              {mode.avgTime}
            </span>
          }
        />
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Ready in seconds
        </span>
        <Button
          size="sm"
          variant={isMint ? "default" : "accent"}
          className="pointer-events-none"
        >
          {mode.cta}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="surface-soft rounded-xl p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5">{value}</div>
    </div>
  );
}
