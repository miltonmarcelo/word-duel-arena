import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, Dice5, Swords, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/play/themed/$theme")({
  head: () => ({
    meta: [
      { title: "Choose your mode — Themed · WordClash" },
      {
        name: "description",
        content: "Pick how to play your themed WordClash duel.",
      },
    ],
  }),
  component: ThemedSubmode,
});

const THEME_META: Record<string, { name: string; emoji: string }> = {
  cinema: { name: "Cinema", emoji: "🎬" },
  sports: { name: "Sports", emoji: "🏅" },
  science: { name: "Science", emoji: "🔬" },
  music: { name: "Music", emoji: "🎵" },
  food: { name: "Food", emoji: "🍜" },
  geography: { name: "Geography", emoji: "🌍" },
  tv: { name: "TV Shows", emoji: "📺" },
  news: { name: "News", emoji: "📰" },
};

type SubMode = {
  id: string;
  title: string;
  desc: string;
  icon: typeof Zap;
  to: "/play/quick" | "/play/match-select" | "/play/random";
  avg: string;
  competitiveness: number;
  accent: "mint" | "lilac";
};

const SUBMODES: SubMode[] = [
  {
    id: "quick",
    title: "Quick Play",
    desc: "Solo vs computer, themed words only.",
    icon: Zap,
    to: "/play/quick",
    avg: "1–2 min",
    competitiveness: 2,
    accent: "mint",
  },
  {
    id: "direct",
    title: "Direct Challenge",
    desc: "Pick an opponent and choose a themed word.",
    icon: Swords,
    to: "/play/match-select",
    avg: "3–5 min",
    competitiveness: 5,
    accent: "lilac",
  },
  {
    id: "random",
    title: "Random Match",
    desc: "Auto-match with a player on a themed word.",
    icon: Dice5,
    to: "/play/random",
    avg: "4 min",
    competitiveness: 4,
    accent: "mint",
  },
];

function ThemedSubmode() {
  const { theme } = Route.useParams();
  const meta = THEME_META[theme] ?? { name: theme, emoji: "✨" };

  return (
    <AppShell>
      <div className="animate-fade-up mx-auto max-w-3xl">
        <Link
          to="/play/themed"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> All themes
        </Link>

        {/* Highlighted theme banner */}
        <section
          className="surface-elevated glow-mint mb-6 flex items-center gap-4 overflow-hidden p-5"
          style={{ background: "var(--gradient-hero), var(--surface-elevated)" }}
        >
          <div
            className="grid size-16 place-items-center rounded-2xl text-4xl"
            style={{
              background: "color-mix(in oklch, var(--primary) 15%, var(--surface))",
              border: "1px solid var(--border)",
            }}
          >
            <span aria-hidden>{meta.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Theme selected
            </p>
            <h1 className="font-display text-3xl leading-tight">{meta.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Pick how you'd like to play with {meta.name.toLowerCase()} words.
            </p>
          </div>
        </section>

        <section className="grid gap-3">
          {SUBMODES.map((m) => {
            const Icon = m.icon;
            const isMint = m.accent === "mint";
            return (
              <Link
                key={m.id}
                to={m.to}
                className="surface-elevated card-premium-interactive group relative flex items-center gap-4 overflow-hidden p-5"
              >
                <div
                  className={cn(
                    "grid size-14 place-items-center rounded-2xl transition-transform group-hover:scale-110",
                    isMint ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent",
                  )}
                >
                  <Icon className="size-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl leading-tight">{m.title}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" /> {m.avg}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-1.5 w-3 rounded-full",
                            i < m.competitiveness
                              ? isMint
                                ? "bg-primary"
                                : "bg-accent"
                              : "bg-muted",
                          )}
                        />
                      ))}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={isMint ? "default" : "accent"}
                  className="pointer-events-none shrink-0 gap-1"
                >
                  Play <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
