import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Dice5,
  PlayCircle,
  Quote,
  Shapes,
  Sparkles,
  Star,
  Swords,
  Trophy,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";
import { WordRow } from "@/components/WordBoard";
import { Button } from "@/components/ui/button";
import { players } from "@/lib/mock-data";
import type { Guess } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WordClash — Premium Multiplayer Word Duels" },
      {
        name: "description",
        content:
          "A premium multiplayer word game. Challenge friends, draw random opponents, play themed rounds and climb the global leaderboard in elegant 5-letter duels.",
      },
      { property: "og:title", content: "WordClash — Premium Multiplayer Word Duels" },
      {
        property: "og:description",
        content: "Direct challenges, opponent draws, themed modes and a global ranking. Words, but as a sport.",
      },
    ],
  }),
  component: Landing,
});

const heroGuesses: Guess[] = [
  { letters: ["W", "O", "R", "D", "S"], states: ["absent", "present", "absent", "absent", "present"] },
  { letters: ["S", "H", "A", "R", "E"], states: ["correct", "absent", "correct", "absent", "present"] },
  { letters: ["C", "L", "A", "S", "H"], states: ["correct", "correct", "correct", "correct", "correct"] },
];

const previewSelf: Guess[] = [
  { letters: ["C", "R", "A", "N", "E"], states: ["absent", "absent", "correct", "absent", "present"] },
  { letters: ["S", "L", "A", "T", "E"], states: ["absent", "absent", "correct", "correct", "correct"] },
  { letters: ["P", "L", "A", "T", "E"], states: ["correct", "correct", "correct", "correct", "correct"] },
];

const previewOpponent: Guess[] = [
  { letters: ["A", "D", "I", "E", "U"], states: ["present", "absent", "absent", "present", "absent"] },
  { letters: ["S", "T", "O", "R", "E"], states: ["absent", "present", "absent", "absent", "correct"] },
  { letters: ["P", "L", "A", "C", "E"], states: ["correct", "correct", "correct", "absent", "correct"] },
];

const features = [
  {
    icon: Swords,
    eyebrow: "1v1",
    title: "Direct challenges",
    body: "Pick anyone in your friends list and send a duel invite. Best of 3, ranked or casual — your call.",
    accent: "mint" as const,
  },
  {
    icon: Dice5,
    eyebrow: "Random",
    title: "Opponent draw",
    body: "Spin the matchmaking roulette and lock in a player near your skill in seconds.",
    accent: "lilac" as const,
  },
  {
    icon: Shapes,
    eyebrow: "Themed",
    title: "Theme modes",
    body: "Cinema, science, sports, food. Curated dictionaries that turn every round into a fresh challenge.",
    accent: "mint" as const,
  },
  {
    icon: Trophy,
    eyebrow: "Compete",
    title: "Ranks & XP",
    body: "Weekly leaderboards, monthly seasons and a lifetime rating. Every guess earns you points.",
    accent: "lilac" as const,
  },
];

const steps = [
  { n: "01", title: "Pick a mode", body: "Daily puzzle, direct duel, random draw or a themed round." },
  { n: "02", title: "Solve in 5 letters", body: "Six tries, live tile feedback, opponent's board side-by-side." },
  { n: "03", title: "Earn rank & XP", body: "Win to climb the season ladder and unlock achievements." },
];

const testimonials = [
  {
    name: "Mira Chen",
    role: "Top 50 — Season 3",
    quote: "I came for the puzzles, stayed for the duels. The opponent board makes every round feel alive.",
    player: players[0],
  },
  {
    name: "Diego Alvarez",
    role: "Daily player",
    quote: "Finally a word game that respects design. The themed modes are addictive.",
    player: players[1],
  },
  {
    name: "Yuki Tanaka",
    role: "Office League host",
    quote: "Our team room turned coffee breaks into tournaments. We're hooked.",
    player: players[2],
  },
];

function Landing() {
  return (
    <div className="gradient-hero min-h-screen text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#preview" className="hover:text-foreground transition-colors">Preview</a>
            <a href="#players" className="hover:text-foreground transition-colors">Players</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Log in
            </Link>
            <Link to="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-14 md:grid-cols-2 md:py-24">
        <div>
          <span className="chip">
            <Sparkles className="size-3" /> New season live · Join 240k players
          </span>
          <h1 className="mt-5 font-display text-5xl leading-[1.04] sm:text-6xl md:text-7xl">
            Words are a <span className="text-gradient-mint">sport</span>.
            <br /> Play them <span className="text-gradient-lilac">together</span>.
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            A premium multiplayer word game built around live duels, opponent draws, themed rounds
            and a competitive global ranking.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup">
              <Button size="xl">
                Start playing free <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a href="#how">
              <Button size="xl" variant="secondary">
                <PlayCircle className="size-4" /> See how it works
              </Button>
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {players.slice(0, 4).map((p) => (
                <Avatar key={p.id} player={p} size={36} />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
                <span className="ml-1 font-semibold text-foreground">4.9</span>
              </div>
              <p className="text-xs text-muted-foreground">Loved by 240k+ daily players</p>
            </div>
          </div>
        </div>

        {/* Hero board */}
        <div className="relative">
          <div
            className="surface-elevated glow-mint relative mx-auto w-fit rounded-3xl p-6"
            style={{ boxShadow: "var(--shadow-lg)" }}
          >
            <div className="mb-4 flex items-center justify-between text-xs">
              <span className="chip">Daily · #482</span>
              <span className="font-mono text-muted-foreground">02:14</span>
            </div>
            <div className="flex flex-col gap-2">
              {heroGuesses.map((g, i) => (
                <div key={i} style={{ animation: `tile-reveal 0.6s ease ${i * 150}ms both` }}>
                  <WordRow guess={g} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="player-dot player-a" /> You · 3 guesses
              </span>
              <span className="text-primary font-semibold">+128 XP</span>
            </div>
          </div>

          {/* Floating chips */}
          <div className="animate-float absolute -left-4 top-6 hidden -rotate-6 sm:block">
            <div className="surface-elevated glow-lilac rounded-2xl p-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                Mira challenges you
              </p>
              <p className="font-display text-sm">Best of 3 · Live now</p>
            </div>
          </div>
          <div
            className="animate-float absolute -bottom-6 -right-4 hidden rotate-3 sm:block"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="surface-elevated glow-mint rounded-2xl p-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                You moved up
              </p>
              <p className="font-display text-sm">#142 → #128 global</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="surface-soft grid grid-cols-2 gap-6 rounded-2xl p-6 sm:grid-cols-4">
          {[
            { v: "240k+", l: "Daily duels" },
            { v: "96", l: "Countries" },
            { v: "4.9★", l: "App rating" },
            { v: "12M", l: "Words solved" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-3xl text-gradient-mint">{s.v}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Why WordClash</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Built for word lovers who like to win.</h2>
          <p className="mt-4 text-muted-foreground">
            Four ways to play. One beautifully crafted arena.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="surface-elevated group relative overflow-hidden p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 ${f.accent === "mint" ? "bg-primary" : "bg-accent"}`}
              />
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                  f.accent === "mint" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                }`}
              >
                <f.icon className="size-5" />
              </div>
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                  f.accent === "mint" ? "text-primary" : "text-accent"
                }`}
              >
                {f.eyebrow}
              </p>
              <h3 className="mt-1 font-display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">How it works</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">From login to legend in three steps.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              We kept it simple — so the only thing you need to think about is your next guess.
            </p>

            <div className="mt-8 space-y-4">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="surface-elevated flex items-start gap-4 p-5 transition-transform hover:-translate-y-0.5"
                >
                  <span className="font-display text-3xl text-gradient-lilac">{s.n}</span>
                  <div>
                    <h3 className="font-display text-lg">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link to="/signup">
                <Button size="lg">
                  Create free account <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Match preview */}
          <div id="preview" className="relative">
            <div
              className="surface-elevated rounded-3xl p-6"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="chip">
                  <span className="player-dot player-a" /> You
                </span>
                <span className="font-mono text-xs text-muted-foreground">01:42</span>
                <span className="chip chip-lilac">
                  <span className="player-dot player-b" /> Mira
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="player-card">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Your board
                  </p>
                  <div className="mx-auto w-fit">
                    {previewSelf.map((g, i) => (
                      <div key={i} className="mb-1.5 last:mb-0">
                        <WordRow guess={g} size="sm" />
                      </div>
                    ))}
                    <div className="mb-1.5">
                      <WordRow size="sm" empty />
                    </div>
                    <div className="mb-1.5">
                      <WordRow size="sm" empty />
                    </div>
                    <WordRow size="sm" empty />
                  </div>
                </div>
                <div className="player-card player-b">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Opponent
                  </p>
                  <div className="mx-auto w-fit">
                    {previewOpponent.map((g, i) => (
                      <div key={i} className="mb-1.5 last:mb-0">
                        <WordRow guess={g} size="sm" />
                      </div>
                    ))}
                    <div className="mb-1.5">
                      <WordRow size="sm" empty />
                    </div>
                    <div className="mb-1.5">
                      <WordRow size="sm" empty />
                    </div>
                    <WordRow size="sm" empty />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 left-1/2 hidden -translate-x-1/2 sm:block">
              <div className="surface-elevated glow-mint rounded-full px-4 py-2 text-xs font-semibold">
                Live match preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="players" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Loved by players</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">A community that keeps coming back.</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className={`surface-elevated relative p-6 ${i === 1 ? "md:-translate-y-3 glow-lilac" : ""}`}
            >
              <Quote className="size-6 text-primary/40" />
              <blockquote className="mt-3 font-display text-lg leading-snug">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <Avatar player={t.player} size={36} />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="ml-auto flex text-warning">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-3 fill-current" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div
          className="surface-elevated relative overflow-hidden p-10 text-center sm:p-14"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="relative">
            <span className="chip chip-lilac">
              <Sparkles className="size-3" /> Free forever · No card required
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Your next duel is <span className="text-gradient-mint">one word</span> away.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Sign up in seconds, draw an opponent and play your first round in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signup">
                <Button size="xl">
                  Play free now <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="xl" variant="secondary">
                  Explore the app
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <Logo />
          <nav className="flex items-center gap-5">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#players" className="hover:text-foreground">Players</a>
          </nav>
          <p>© {new Date().getFullYear()} WordClash. Crafted for word lovers.</p>
        </div>
      </footer>
    </div>
  );
}
