import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  Cpu,
  Eye,
  Flame,
  Info,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuickSearch = { theme?: string };

export const Route = createFileRoute("/play/quick")({
  validateSearch: (s: Record<string, unknown>): QuickSearch => ({
    theme: typeof s.theme === "string" ? s.theme : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Quick Play — WordClash" },
      {
        name: "description",
        content:
          "Solo vs the machine. Pick a theme and difficulty, then start a fast WordClash round.",
      },
      { property: "og:title", content: "Quick Play — WordClash" },
      {
        property: "og:description",
        content: "You vs the machine — fast, solo, themed Wordle duels.",
      },
    ],
  }),
  component: QuickPlay,
});

const THEMES = [
  { id: "general", label: "General", emoji: "✨" },
  { id: "cinema", label: "Cinema", emoji: "🎬" },
  { id: "sports", label: "Sports", emoji: "🏅" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "geography", label: "Geography", emoji: "🌍" },
] as const;

type Difficulty = "easy" | "medium" | "hard";
const DIFFICULTIES: { id: Difficulty; label: string; desc: string }[] = [
  { id: "easy", label: "Easy", desc: "Common words · 6 tries" },
  { id: "medium", label: "Medium", desc: "Mixed words · 6 tries" },
  { id: "hard", label: "Hard", desc: "Rare words · 6 tries" },
];

function QuickPlay() {
  const [theme, setTheme] = useState<string>("general");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

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
            <Zap className="size-3" /> Quick Play
          </p>
          <h1 className="page-title">You vs the machine.</h1>
          <p className="page-subtitle">
            A solo round to warm up — pick a theme, set the difficulty, and start guessing.
          </p>
        </header>

        {/* Theme selector */}
        <section className="surface-elevated mb-6 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Choose a theme
            </p>
            <span className="chip chip-muted">
              <Sparkles className="size-3" /> {THEMES.find((t) => t.id === theme)?.label}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {THEMES.map((t) => {
              const active = t.id === theme;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "hover-lift flex flex-col items-start gap-2 rounded-xl border-2 p-3 text-left transition",
                    active
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-surface hover:border-primary/40",
                  )}
                >
                  <span className="text-2xl leading-none">{t.emoji}</span>
                  <span className="text-sm font-semibold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Difficulty */}
        <section className="surface-elevated mb-6 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Difficulty
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {DIFFICULTIES.map((d) => {
              const active = d.id === difficulty;
              return (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={cn(
                    "rounded-xl border-2 p-3 text-left transition hover-lift",
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <p className="font-display text-lg leading-tight">{d.label}</p>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Info card */}
        <section
          className="surface-elevated mb-6 overflow-hidden p-5"
          style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Info className="size-4 text-primary" />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              How Quick Play works
            </p>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Bot className="mt-0.5 size-4 shrink-0 text-primary" />
              The computer picks a 5-letter word from your chosen theme.
            </li>
            <li className="flex items-start gap-2">
              <Cpu className="mt-0.5 size-4 shrink-0 text-primary" />
              You get <span className="font-semibold text-foreground">6 attempts</span> to crack it.
            </li>
            <li className="flex items-start gap-2">
              <Flame className="mt-0.5 size-4 shrink-0 text-primary" />
              Points earned use a{" "}
              <span className="font-semibold text-foreground">reduced multiplier</span> vs PvP.
            </li>
            <li className="flex items-start gap-2">
              <Eye className="mt-0.5 size-4 shrink-0 text-primary" />
              Revealing a letter costs points — but no opponent benefits.
            </li>
          </ul>
        </section>

        {/* CTA */}
        <div className="sticky bottom-4 z-10">
          <div className="surface-elevated flex items-center justify-between gap-3 p-3">
            <div className="px-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Ready
              </p>
              <p className="font-mono text-sm font-bold tracking-wider text-foreground">
                {THEMES.find((t) => t.id === theme)?.label} ·{" "}
                {DIFFICULTIES.find((d) => d.id === difficulty)?.label}
              </p>
            </div>
            <Link to="/match" className="shrink-0">
              <Button size="lg" className="gap-2">
                <Play className="size-4" /> Start Game
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
