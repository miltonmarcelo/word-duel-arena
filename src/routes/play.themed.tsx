import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Palette, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/play/themed")({
  head: () => ({
    meta: [
      { title: "Themed Mode — WordClash" },
      {
        name: "description",
        content:
          "Pick a category — cinema, sports, science, music, food and more — then choose how to play.",
      },
      { property: "og:title", content: "Themed Mode — WordClash" },
      {
        property: "og:description",
        content: "Curated word categories for sharper, more focused duels.",
      },
    ],
  }),
  component: ThemedHub,
});

type ThemeCard = {
  id: string;
  name: string;
  emoji: string;
  count: number;
  difficulty: "Easy" | "Medium" | "Hard";
  badge?: "hot" | "new";
};

const THEMES: ThemeCard[] = [
  { id: "cinema", name: "Cinema", emoji: "🎬", count: 243, difficulty: "Medium", badge: "hot" },
  { id: "sports", name: "Sports", emoji: "🏅", count: 187, difficulty: "Easy" },
  { id: "science", name: "Science", emoji: "🔬", count: 156, difficulty: "Hard", badge: "new" },
  { id: "music", name: "Music", emoji: "🎵", count: 211, difficulty: "Medium" },
  { id: "food", name: "Food", emoji: "🍜", count: 198, difficulty: "Easy", badge: "hot" },
  { id: "geography", name: "Geography", emoji: "🌍", count: 174, difficulty: "Medium" },
  { id: "tv", name: "TV Shows", emoji: "📺", count: 132, difficulty: "Medium", badge: "new" },
  { id: "news", name: "News", emoji: "📰", count: 98, difficulty: "Hard" },
];

function ThemedHub() {
  return (
    <AppShell>
      <div className="animate-fade-up">
        <Link
          to="/play"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to modes
        </Link>

        <header className="page-header">
          <p className="page-eyebrow">
            <Palette className="size-3" /> Themed Mode
          </p>
          <h1 className="page-title">Pick your category.</h1>
          <p className="page-subtitle">
            Curated 5-letter words from your favorite worlds. Choose a theme — then pick how to play.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {THEMES.map((t, i) => (
            <Link
              key={t.id}
              to="/play/themed/$theme"
              params={{ theme: t.id }}
              className="surface-elevated card-premium-interactive hover-lift group relative flex flex-col gap-3 overflow-hidden p-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {t.badge && (
                <span
                  className={cn(
                    "absolute right-3 top-3 chip text-[10px]",
                    t.badge === "new" && "chip-lilac",
                  )}
                >
                  {t.badge === "hot" ? <>🔥 Hot</> : <>✨ New</>}
                </span>
              )}

              <div
                className="grid size-14 place-items-center rounded-2xl text-3xl transition-transform group-hover:scale-110"
                style={{
                  background: "color-mix(in oklch, var(--primary) 12%, var(--surface-soft))",
                  border: "1px solid var(--border)",
                }}
              >
                <span aria-hidden>{t.emoji}</span>
              </div>

              <div>
                <h3 className="font-display text-xl leading-tight">{t.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  <Sparkles className="mr-1 inline size-3" />
                  {t.count} words
                </p>
              </div>

              <div className="mt-auto">
                <span
                  className={cn(
                    "chip chip-muted text-[10px]",
                    t.difficulty === "Hard" && "chip-lilac",
                    t.difficulty === "Easy" && "chip",
                  )}
                >
                  {t.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
