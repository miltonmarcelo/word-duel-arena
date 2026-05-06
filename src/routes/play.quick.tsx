import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Clock,
  Flame,
  Play,
  Sparkles,
  Trophy,
  Users2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/play/quick")({
  head: () => ({
    meta: [
      { title: "Word of the Day — WordClash" },
      {
        name: "description",
        content:
          "One shared daily word for all players. Guess today's word and compare your performance.",
      },
      { property: "og:title", content: "Word of the Day — WordClash" },
      {
        property: "og:description",
        content:
          "Everyone gets the same word today. Solve it in as few attempts as possible.",
      },
    ],
  }),
  component: WordOfTheDay,
});

function WordOfTheDay() {
  return (
    <AppShell>
      <div className="animate-fade-up mx-auto max-w-3xl">
        <Link
          to="/play"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to modes
        </Link>

        <header className="page-header">
          <p className="page-eyebrow">
            <Sparkles className="size-3" /> Daily challenge
          </p>
          <h1 className="page-title">Word of the Day</h1>
          <p className="page-subtitle">
            Everyone gets the same system-defined word today. Solve it in as few
            attempts as possible.
          </p>
        </header>

        {/* Hero card */}
        <section
          className="surface-elevated relative mb-5 overflow-hidden p-6 sm:p-8"
          style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip">
                  <CalendarDays className="size-3" /> Daily #482
                </span>
                <span className="chip chip-lilac">
                  <Sparkles className="size-3" /> General
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--correct)]/40 bg-[var(--correct)]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--correct)]">
                  <span className="relative flex size-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[var(--correct)] opacity-70" />
                    <span className="relative size-1.5 rounded-full bg-[var(--correct)]" />
                  </span>
                  Live now
                </span>
              </div>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                Today's <span className="text-gradient-mint">five letters</span>{" "}
                are waiting.
              </h2>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--warning)]">
                <Flame className="size-4" /> +15% XP bonus
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Resets at midnight
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              {["?", "?", "?", "?", "?"].map((l, i) => (
                <div
                  key={i}
                  className="tile tile-empty !w-10 !h-10 !text-base sm:!w-12 sm:!h-12"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {l}
                </div>
              )).slice(0, 1)}
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="tile tile-empty !w-10 !h-10 !text-base sm:!w-12 sm:!h-12"
                  >
                    ?
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stat blocks */}
        <section className="mb-5 grid grid-cols-3 gap-3">
          <StatBlock
            icon={<Users2 className="size-4 text-primary" />}
            label="Players today"
            value="12,431"
          />
          <StatBlock
            icon={<BarChart3 className="size-4 text-accent" />}
            label="Avg. attempts"
            value="4.2"
          />
          <StatBlock
            icon={<Trophy className="size-4 text-[var(--warning)]" />}
            label="Your streak"
            value="12 days"
          />
        </section>

        {/* CTA bar */}
        <div className="sticky bottom-4 z-10">
          <div className="surface-elevated flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="px-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Ready when you are
              </p>
              <p className="font-mono text-sm font-bold tracking-wider text-foreground">
                <Clock className="mr-1 inline size-3.5" /> ~2–3 min
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/ranking">
                <Button size="lg" variant="secondary" className="w-full gap-2 sm:w-auto">
                  <Trophy className="size-4" /> View leaderboard
                </Button>
              </Link>
              <Link
                to="/match"
                search={{
                  word: "PLATE",
                  mode: "daily",
                  theme: "general",
                  opponent: "Daily Challenge",
                }}
              >
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  <Play className="size-4" /> Play now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="surface-soft rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>
      <p className="mt-1 font-display text-lg leading-tight sm:text-xl">{value}</p>
    </div>
  );
}
