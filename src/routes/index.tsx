import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Trophy, Users2, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WordRow } from "@/components/WordBoard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WordClash — Premium Multiplayer Word Duels" },
      { name: "description", content: "Challenge friends, climb the global leaderboard, and prove your vocabulary in beautiful 5-letter duels." },
    ],
  }),
  component: Landing,
});

const heroGuesses = [
  { letters: ["W","O","R","D","S"], states: ["absent","present","absent","absent","present"] },
  { letters: ["S","H","A","R","E"], states: ["correct","absent","correct","absent","present"] },
  { letters: ["C","L","A","S","H"], states: ["correct","correct","correct","correct","correct"] },
] as import("@/lib/mock-data").Guess[];

function Landing() {
  return (
    <div className="gradient-hero min-h-screen text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">Log in</Link>
          <Link to="/signup">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-20">
        <div>
          <span className="chip"><Sparkles className="size-3" /> New season live</span>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
            Words are a <span className="text-gradient-mint">sport</span>.
            <br /> Play them <span className="text-gradient-lilac">together</span>.
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            Daily puzzles, head-to-head duels, random matchmaking and private rooms — wrapped in a beautifully crafted competitive arena.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup"><Button size="xl">Play free <ArrowRight className="size-4" /></Button></Link>
            <Link to="/dashboard"><Button size="xl" variant="secondary">View demo</Button></Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 text-sm">
            <div><p className="font-display text-2xl">240k+</p><p className="text-muted-foreground">Daily duels</p></div>
            <div><p className="font-display text-2xl">96</p><p className="text-muted-foreground">Countries</p></div>
            <div><p className="font-display text-2xl">4.9★</p><p className="text-muted-foreground">App rating</p></div>
          </div>
        </div>

        <div className="relative">
          <div className="surface-elevated relative mx-auto w-fit rounded-3xl p-6 shadow-[var(--shadow-lg)] glow-mint">
            <div className="mb-4 flex items-center justify-between text-xs">
              <span className="chip">Daily · #482</span>
              <span className="text-muted-foreground">02:14</span>
            </div>
            <div className="flex flex-col gap-2">
              {heroGuesses.map((g, i) => (
                <div key={i} style={{ animation: `tile-reveal 0.6s ease ${i * 150}ms both` }}>
                  <WordRow guess={g} />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rotate-3 sm:block">
            <div className="surface-elevated rounded-2xl p-3 shadow-[var(--shadow-lg)] glow-lilac">
              <p className="text-[10px] uppercase tracking-widest text-accent font-semibold">Mira just won</p>
              <p className="font-display text-sm">+128 XP · 3 guesses</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Zap, title: "Lightning duels", body: "Race head-to-head with live opponent boards.", glow: "mint" as const },
            { icon: Users2, title: "Private rooms", body: "Build leagues with friends, family, or your team.", glow: "lilac" as const },
            { icon: Trophy, title: "Global ranks", body: "Weekly resets, season trophies, public profile.", glow: "mint" as const },
          ].map(({ icon: Icon, title, body, glow }) => (
            <div key={title} className="surface-elevated p-6">
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${glow === "mint" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
                <Icon className="size-5" />
              </div>
              <h3 className="font-display text-xl">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} WordClash. Crafted for word lovers.</p>
        </div>
      </footer>
    </div>
  );
}
